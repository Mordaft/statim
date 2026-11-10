import { isUuid } from './wire.ts';

export const PREFIX = 'stz1:';

export interface Announce {
  t: 'announce';
  v: 1;
  email: string;
  session: string;
  ip: string;
  seedId: string;
  seed: string;
  ts: number;
}

export type SignalKind = 'offer' | 'answer';

export interface SignalItem {
  to: string;
  toSession: string;
  kind: SignalKind;
  data: unknown;
}

/** Several signals from one sender packed in a single property to save requests. */
export interface SignalBatch {
  t: 'signals';
  v: 1;
  from: string;
  fromSession: string;
  items: SignalItem[];
  ts: number;
}

/** A single signal as delivered to the mesh. */
export interface Signal extends SignalItem {
  from: string;
  fromSession: string;
}

export type Envelope = Announce | SignalBatch;

export const MAX_SIGNAL_ITEMS = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;

function str(v: unknown, max = 256): string | null {
  return typeof v === 'string' && v.length > 0 && v.length <= max ? v : null;
}

function email(v: unknown): string | null {
  const s = str(v);
  return s && EMAIL_RE.test(s) ? s.toLowerCase() : null;
}

// Properties are writable by page editors: rebuild objects from validated fields only.
export function parseEnvelope(raw: unknown): Envelope | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1 || typeof o.ts !== 'number') return null;

  if (o.t === 'announce') {
    const e = email(o.email);
    const session = str(o.session, 64);
    const seedId = str(o.seedId, 64);
    const seed = str(o.seed, 64);
    const ip = typeof o.ip === 'string' && o.ip.length <= 64 ? o.ip : null;
    if (!e || !session || !seedId || !isUuid(seedId) || !seed || ip === null) return null;
    return { t: 'announce', v: 1, email: e, session, ip, seedId, seed, ts: o.ts };
  }

  if (o.t === 'signals') {
    const from = email(o.from);
    const fromSession = str(o.fromSession, 64);
    if (!from || !fromSession || !Array.isArray(o.items) || o.items.length > MAX_SIGNAL_ITEMS) return null;
    const items: SignalItem[] = [];
    for (const raw of o.items as unknown[]) {
      if (!raw || typeof raw !== 'object') return null;
      const i = raw as Record<string, unknown>;
      const to = email(i.to);
      const toSession = str(i.toSession, 64);
      const kind = i.kind === 'offer' || i.kind === 'answer' ? i.kind : null;
      if (!to || !toSession || !kind) return null;
      items.push({ to, toSession, kind, data: i.data });
    }
    return { t: 'signals', v: 1, from, fromSession, items, ts: o.ts };
  }

  return null;
}
