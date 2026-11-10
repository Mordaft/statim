import Dexie, { type EntityTable } from 'dexie';

export interface PeerSeed {
  seedId: string;
  seed: string;
  receivedAt: number;
}

export interface Peer {
  email: string;
  session: string;
  ip: string;
  seeds: PeerSeed[];
  avatarSvg: string;
  lastSeen: number;
}

export interface Message {
  id?: number;
  msgId: string;
  from: string;
  text: string;
  ts: number;
}

export interface OwnSeed {
  seedId: string;
  seed: string;
  createdAt: number;
}

export interface ProcessedSignal {
  propertyKey: string;
  ts: number;
}

export interface OwnProperty {
  propertyKey: string;
  kind: 'announce' | 'signal';
  ts: number;
}

export interface Setting {
  key: string;
  value: string;
}

export class StatimDB extends Dexie {
  peers!: EntityTable<Peer, 'email'>;
  messages!: EntityTable<Message, 'id'>;
  ownSeeds!: EntityTable<OwnSeed, 'seedId'>;
  processedProperties!: EntityTable<ProcessedSignal, 'propertyKey'>;
  ownProperties!: EntityTable<OwnProperty, 'propertyKey'>;
  settings!: EntityTable<Setting, 'key'>;

  constructor() {
    super('statim');
    this.version(1).stores({
      peers: 'email, lastSeen',
      messages: '++id, &msgId, ts, from',
      ownSeeds: 'seedId, createdAt',
      processedSignals: 'commentId, ts',
      ownComments: 'commentId, kind, ts',
      settings: 'key',
    });
    this.version(2).stores({
      processedSignals: null,
      ownComments: null,
      processedProperties: 'propertyKey, ts',
      ownProperties: 'propertyKey, kind, ts',
    });
  }
}

export const db = new StatimDB();

export async function getSetting(key: string): Promise<string | undefined> {
  return (await db.settings.get(key))?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}
