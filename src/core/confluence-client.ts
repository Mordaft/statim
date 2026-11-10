import { config } from '../config.ts';
import { compressText, decompressText } from './compression.ts';
import { fromBase64, toBase64 } from './crypto.ts';
import { trace } from './diagnostics.ts';
import { PREFIX, parseEnvelope, type Envelope } from './protocol.ts';
import { RateLimiter } from './rate-limiter.ts';

export interface ConfluenceCredentials {
  baseUrl: string;
  pageId: string;
  email: string;
  token: string;
}

export interface FeedEntry {
  propertyKey: string;
  createdAt: number;
  envelope: Envelope;
}

export class ConfluenceError extends Error {
  readonly status: number;
  readonly retryAfterMs?: number;

  constructor(status: number, retryAfterMs?: number) {
    super(`Confluence respondió ${status}`);
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

interface PropertyPage {
  results: {
    key: string;
    value?: unknown;
    version?: { createdAt?: string; when?: string };
  }[];
  _links?: { next?: string };
}

export const PROPERTY_PREFIX = 'statim.v1.';
export const MAX_PROPERTY_BYTES = 32_768;
const MAX_JSON_BYTES = 1_000_000;

export class PropertySizeError extends Error {
  constructor() {
    super('La señal supera el límite de 32 KB de una propiedad de Confluence');
  }
}

export function encodePropertyValue(envelope: Envelope): { data: string } {
  const value = { data: PREFIX + toBase64(compressText(JSON.stringify(envelope))) };
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > MAX_PROPERTY_BYTES) throw new PropertySizeError();
  return value;
}

function decodeValue(value: unknown): Envelope | null {
  if (!value || typeof value !== 'object') return null;
  try {
    if (new TextEncoder().encode(JSON.stringify(value)).byteLength > MAX_PROPERTY_BYTES) return null;
    const data = (value as Record<string, unknown>).data;
    if (typeof data !== 'string' || !data.startsWith(PREFIX)) return null;
    return parseEnvelope(JSON.parse(decompressText(fromBase64(data.slice(PREFIX.length)), MAX_JSON_BYTES)));
  } catch {
    return null;
  }
}

export type Urgency = boolean | (() => boolean);

export class ConfluenceClient {
  readonly #base: string;
  readonly #pageId: string;
  readonly #auth: string;
  readonly #limiter: RateLimiter;

  constructor(c: ConfluenceCredentials) {
    this.#base = c.baseUrl.replace(/\/+$/, '');
    this.#pageId = c.pageId;
    this.#auth = `Bearer ${c.token}`;
    this.#limiter = new RateLimiter({
      minGapMs: config.fastPollMs,
      normalGapMs: config.idlePollMs,
      dailyFastBudget: config.dailyFastRequestBudget,
      storageKey: `statim.fastBudget.${c.email.toLowerCase()}`,
    });
  }

  get remainingFastBudget(): number {
    return this.#limiter.remainingFastBudget;
  }

  /** Call when the urgency of queued requests may have changed. */
  reschedule(): void {
    this.#limiter.pump();
  }

  close(): void {
    this.#limiter.close();
  }

  #request<T>(path: string, init: RequestInit, urgent: Urgency): Promise<T> {
    return this.#limiter.schedule(async () => {
      trace('confluence.request', { path, method: init.method ?? 'GET' });
      const headers: Record<string, string> = { Authorization: this.#auth, Accept: 'application/json' };
      headers['X-Atlassian-Token'] = 'no-check';
      if (init.body) headers['Content-Type'] = 'application/json';
      try {
        const res = await fetch(this.#base + path, { ...init, headers, credentials: 'omit' });
        if (!res.ok) {
          const retryAfter = Number(res.headers.get('Retry-After'));
          const retryAfterMs = retryAfter > 0 ? retryAfter * 1000 : undefined;
          if (retryAfterMs) this.#limiter.penalize(retryAfterMs);
          trace('confluence.response_error', { path, status: res.status });
          throw new ConfluenceError(res.status, retryAfterMs);
        }
        trace('confluence.response_ok', { path, status: res.status });
        return (res.status === 204 ? undefined : await res.json()) as T;
      } catch (err) {
        if (!(err instanceof ConfluenceError)) {
          trace('confluence.network_error', { path, error: err });
        }
        throw err;
      }
    }, urgent);
  }

  async post(envelope: Envelope, urgent: Urgency = false): Promise<string> {
    const value = encodePropertyValue(envelope);
    const key = PROPERTY_PREFIX + crypto.randomUUID();
    await this.#request(
      `/rest/api/content/${encodeURIComponent(this.#pageId)}/property`,
      {
        method: 'POST',
        body: JSON.stringify({
          key,
          value,
        }),
      },
      urgent,
    );
    return key;
  }

  async remove(propertyKey: string): Promise<void> {
    if (!propertyKey.startsWith(PROPERTY_PREFIX)) throw new Error('Clave de propiedad ajena a Statim');
    await this.#request(`/rest/api/content/${encodeURIComponent(this.#pageId)}/property/${encodeURIComponent(propertyKey)}`, { method: 'DELETE' }, false);
  }

  /** Newest first; property listings have no guaranteed chronological order. */
  async listSince(sinceMs: number, urgent: Urgency = false): Promise<FeedEntry[]> {
    const out: FeedEntry[] = [];
    let path = `/rest/api/content/${encodeURIComponent(this.#pageId)}/property?expand=version&limit=100`;

    while (path) {
      const page = await this.#request<PropertyPage>(path, {}, urgent);
      for (const c of page.results) {
        if (typeof c.key !== 'string' || !c.key.startsWith(PROPERTY_PREFIX)) continue;
        const envelope = decodeValue(c.value);
        if (!envelope || !Number.isFinite(envelope.ts)) continue;
        const serverTime = Date.parse(c.version?.when ?? c.version?.createdAt ?? '');
        const createdAt = Number.isFinite(serverTime) ? serverTime : envelope.ts;
        if (createdAt >= sinceMs) out.push({ propertyKey: c.key, createdAt, envelope });
      }
      const next = page._links?.next ?? '';
      if (!next) {
        path = '';
      } else if (next.startsWith('http://') || next.startsWith('https://')) {
        const u = new URL(next);
        path = u.pathname + u.search;
      } else if (next.startsWith('/api/')) {
        path = `/rest${next}`;
      } else {
        path = next;
      }
      const basePath = new URL(this.#base || '/', location.href).pathname.replace(/\/+$/, '');
      if (basePath && path.startsWith(basePath + '/')) {
        path = path.slice(basePath.length);
      }
    }
    return out.sort((first, second) => second.createdAt - first.createdAt);
  }
}
