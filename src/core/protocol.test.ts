import { describe, expect, it } from 'vitest';
import { MAX_SIGNAL_ITEMS, parseEnvelope } from './protocol.ts';

const announce = (over: Record<string, unknown> = {}) => ({
  t: 'announce',
  v: 1,
  email: 'Ana@Example.com',
  session: 's1',
  ip: '1.2.3.4',
  seedId: crypto.randomUUID(),
  seed: 'c2VlZA==',
  ts: 1,
  ...over,
});

const signals = (items: unknown[]) => ({ t: 'signals', v: 1, from: 'ana@x.com', fromSession: 's1', items, ts: 1 });
const item = { to: 'bob@x.com', toSession: 's2', kind: 'offer', data: 'v=0' };

describe('parseEnvelope', () => {
  it('accepts a valid announce and lowercases the email', () => {
    expect(parseEnvelope(announce())).toMatchObject({ t: 'announce', email: 'ana@example.com' });
  });

  it('drops unknown fields', () => {
    expect(parseEnvelope(announce({ evil: '<script>' }))).not.toHaveProperty('evil');
  });

  it.each([
    ['invalid email', { email: 'nope' }],
    ['non-UUID seedId', { seedId: 'abc' }],
    ['missing seed', { seed: undefined }],
    ['wrong version', { v: 2 }],
    ['oversized ip', { ip: 'x'.repeat(65) }],
  ])('rejects announce with %s', (_, over) => {
    expect(parseEnvelope(announce(over))).toBeNull();
  });

  it('accepts a signal batch', () => {
    const env = parseEnvelope(signals([item, { ...item, to: 'cid@x.com', kind: 'answer' }]));
    expect(env).toMatchObject({ t: 'signals', from: 'ana@x.com' });
    expect(env?.t === 'signals' && env.items).toHaveLength(2);
  });

  it('rejects batches with too many items', () => {
    expect(parseEnvelope(signals(Array(MAX_SIGNAL_ITEMS + 1).fill(item)))).toBeNull();
  });

  it('rejects batches with an invalid item', () => {
    expect(parseEnvelope(signals([item, { ...item, kind: 'ice' }]))).toBeNull();
  });

  it.each([null, 'text', 42, {}, { t: 'other', v: 1, ts: 1 }])('rejects %j', (raw) => {
    expect(parseEnvelope(raw)).toBeNull();
  });
});
