import { describe, expect, it } from 'vitest';
import { decodeFrame, encodeFrame, isUuid } from './wire.ts';

const frame = () => ({
  packetId: crypto.randomUUID(),
  seedId: crypto.randomUUID(),
  iv: crypto.getRandomValues(new Uint8Array(12)),
  ct: crypto.getRandomValues(new Uint8Array(40)),
});

describe('wire frame', () => {
  it('round-trips a frame', () => {
    const f = frame();
    const decoded = decodeFrame(encodeFrame(f).buffer, 1000);
    expect(decoded).toEqual(f);
  });

  it('has a fixed 45-byte header', () => {
    expect(encodeFrame(frame()).length).toBe(45 + 40);
  });

  it('rejects non-ArrayBuffer data', () => {
    expect(decodeFrame('{"type":"msg"}', 1000)).toBeNull();
  });

  it('rejects frames without ciphertext', () => {
    expect(decodeFrame(new ArrayBuffer(45), 1000)).toBeNull();
  });

  it('rejects oversized frames', () => {
    expect(decodeFrame(encodeFrame(frame()).buffer, 50)).toBeNull();
  });

  it('rejects unknown versions (v1 included)', () => {
    const data = encodeFrame(frame());
    expect(data[0]).toBe(2);
    data[0] = 1;
    expect(decodeFrame(data.buffer, 1000)).toBeNull();
  });

  it('validates UUIDs', () => {
    expect(isUuid(crypto.randomUUID())).toBe(true);
    expect(isUuid('not-a-uuid')).toBe(false);
  });
});
