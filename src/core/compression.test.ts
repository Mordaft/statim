import { describe, expect, it } from 'vitest';
import { compress, compressText, decompress, decompressText } from './compression.ts';

describe('compression (LZ4)', () => {
  it('round-trips UTF-8 text', () => {
    const text = 'Hola equipo, ¿qué tal? 🚀 '.repeat(20);
    expect(decompressText(compressText(text), 10_000)).toBe(text);
  });

  it('shrinks repetitive payloads such as SDP', () => {
    const sdp = 'a=candidate:1 1 udp 2122260223 192.168.1.10 54321 typ host\r\n'.repeat(30);
    expect(compressText(sdp).length).toBeLessThan(sdp.length / 3);
  });

  it('round-trips empty input', () => {
    expect(decompress(compress(new Uint8Array(0)), 100)).toHaveLength(0);
  });

  it('rejects frames that expand beyond the limit (decompression bomb)', () => {
    const bomb = compress(new Uint8Array(100_000).fill(97));
    expect(() => decompress(bomb, 16_000)).toThrow(/excesivo/);
  });

  it('rejects data that is not an LZ4 frame', () => {
    expect(() => decompress(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]), 100)).toThrow();
  });
});
