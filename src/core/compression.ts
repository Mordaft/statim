import * as lz4 from 'lz4js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function compress(data: Uint8Array): Uint8Array<ArrayBuffer> {
  return new Uint8Array(lz4.compress(data));
}

/** Rejects frames that would expand beyond `maxBytes` (decompression bombs). */
export function decompress(data: Uint8Array, maxBytes: number): Uint8Array<ArrayBuffer> {
  const dst = new Uint8Array(maxBytes);
  // Writes past the end of a typed array are dropped, so an oversized result shows up as size > maxBytes.
  const size = lz4.decompressFrame(data, dst);
  if (!(size >= 0 && size <= maxBytes)) throw new Error('LZ4: tamaño descomprimido excesivo');
  return dst.slice(0, size);
}

export function compressText(text: string): Uint8Array<ArrayBuffer> {
  return compress(encoder.encode(text));
}

export function decompressText(data: Uint8Array, maxBytes: number): string {
  return decoder.decode(decompress(data, maxBytes));
}
