// Binary DataChannel frame: [version:1][packetId:16][seedId:16][iv:12][AES-GCM(LZ4(JSON payload, see history.ts))]
const VERSION = 2;
const HEADER = 1 + 16 + 16 + 12;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface Frame {
  packetId: string;
  seedId: string;
  iv: Uint8Array<ArrayBuffer>;
  ct: Uint8Array<ArrayBuffer>;
}

export function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

function uuidToBytes(uuid: string, out: Uint8Array, offset: number): void {
  const hex = uuid.replace(/-/g, '');
  for (let i = 0; i < 16; i++) out[offset + i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
}

function bytesToUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function encodeFrame(f: Frame): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(HEADER + f.ct.length);
  out[0] = VERSION;
  uuidToBytes(f.packetId, out, 1);
  uuidToBytes(f.seedId, out, 17);
  out.set(f.iv, 33);
  out.set(f.ct, HEADER);
  return out;
}

export function decodeFrame(data: unknown, maxBytes: number): Frame | null {
  if (!(data instanceof ArrayBuffer) || data.byteLength <= HEADER || data.byteLength > maxBytes) return null;
  const bytes = new Uint8Array(data);
  if (bytes[0] !== VERSION) return null;
  return {
    packetId: bytesToUuid(bytes.subarray(1, 17)),
    seedId: bytesToUuid(bytes.subarray(17, 33)),
    iv: bytes.slice(33, HEADER),
    ct: bytes.slice(HEADER),
  };
}
