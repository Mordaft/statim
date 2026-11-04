import { compressText } from './compression.ts';

/**
 * Payload carried inside every DataChannel frame (before LZ4 + AES-GCM):
 * { "hist": ["<ts> <text>", …], "current": "<ts> <text>" }
 * `hist` holds the sender's own messages of the last hours so late joiners catch up.
 */
export interface Payload {
  hist: string[];
  current?: string;
}

export interface Entry {
  ts: number;
  text: string;
}

const ENTRY_RE = /^(\d{1,15}) ([\s\S]+)$/;

export function formatEntry(ts: number, text: string): string {
  return `${ts} ${text}`;
}

export function parseEntry(raw: unknown, maxText: number): Entry | null {
  if (typeof raw !== 'string') return null;
  const m = ENTRY_RE.exec(raw);
  if (!m || m[2].length > maxText) return null;
  return { ts: Number(m[1]), text: m[2] };
}

/** Compresses the payload, dropping the oldest history entries until it fits in `maxBytes`. */
export function buildPayload(hist: Entry[], current: Entry | undefined, maxBytes: number): Uint8Array<ArrayBuffer> {
  let entries = hist.map((e) => formatEntry(e.ts, e.text));
  const cur = current && formatEntry(current.ts, current.text);
  for (;;) {
    const payload: Payload = cur ? { hist: entries, current: cur } : { hist: entries };
    const compressed = compressText(JSON.stringify(payload));
    if (compressed.length <= maxBytes || !entries.length) return compressed;
    entries = entries.slice(Math.max(1, Math.ceil(entries.length * 0.1)));
  }
}

/** Valid history entries plus the optional current one, or null if the payload is malformed. */
export function parsePayload(json: string, maxEntries: number, maxText: number): { hist: Entry[]; current?: Entry } | null {
  let o: unknown;
  try {
    o = JSON.parse(json);
  } catch {
    return null;
  }
  if (!o || typeof o !== 'object') return null;
  const { hist, current } = o as Record<string, unknown>;
  if (!Array.isArray(hist) || hist.length > maxEntries) return null;

  const out: Entry[] = [];
  for (const raw of hist) {
    const e = parseEntry(raw, maxText);
    if (e) out.push(e);
  }
  const cur = current === undefined ? null : parseEntry(current, maxText);
  return cur ? { hist: out, current: cur } : { hist: out };
}
