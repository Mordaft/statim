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
  commentId: string;
  ts: number;
}

export interface OwnComment {
  commentId: string;
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
  processedSignals!: EntityTable<ProcessedSignal, 'commentId'>;
  ownComments!: EntityTable<OwnComment, 'commentId'>;
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
  }
}

export const db = new StatimDB();

export async function getSetting(key: string): Promise<string | undefined> {
  return (await db.settings.get(key))?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}
