import { config } from '../config.ts';
import { ConfluenceClient, type ConfluenceCredentials } from './confluence-client.ts';
import { db, getSetting, setSetting } from './db.ts';
import { Mesh } from './mesh.ts';
import { Registry } from './registry.ts';

const KEYS = ['baseUrl', 'pageId', 'email', 'token'] as const;

export async function loadCredentials(): Promise<Partial<ConfluenceCredentials>> {
  const [baseUrl, pageId, email, token] = await Promise.all(KEYS.map(getSetting));
  return {
    baseUrl: baseUrl ?? config.confluenceBaseUrl,
    pageId: pageId ?? config.pageId,
    email,
    token,
  };
}

export function isComplete(c: Partial<ConfluenceCredentials>): c is ConfluenceCredentials {
  return Boolean(c.pageId && c.email && c.token);
}

export async function saveCredentials(c: ConfluenceCredentials): Promise<void> {
  await Promise.all(KEYS.map((k) => setSetting(k, c[k])));
}

export async function clearToken(): Promise<void> {
  await db.settings.delete('token');
}

export class Session {
  readonly registry: Registry;
  readonly mesh: Mesh;

  constructor(credentials: ConfluenceCredentials, iceServers?: RTCIceServer[]) {
    this.registry = new Registry(new ConfluenceClient(credentials), credentials.email, iceServers);
    this.mesh = new Mesh(this.registry, iceServers);
  }

  async start(): Promise<void> {
    try {
      await this.registry.start();
      await this.mesh.start();
    } catch (e) {
      this.stop();
      throw e;
    }
  }

  stop(): void {
    this.mesh.stop();
    this.registry.stop();
  }
}
