const encoder = new TextEncoder();
const HKDF_INFO = encoder.encode('statim-msg-v1');

export function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function generateSeed(): { seedId: string; seed: string } {
  return { seedId: crypto.randomUUID(), seed: toBase64(crypto.getRandomValues(new Uint8Array(32))) };
}

const keyCache = new Map<string, Promise<CryptoKey>>();

function deriveKey(seed: string): Promise<CryptoKey> {
  let key = keyCache.get(seed);
  if (!key) {
    key = crypto.subtle
      .importKey('raw', fromBase64(seed), 'HKDF', false, ['deriveKey'])
      .then((base) =>
        crypto.subtle.deriveKey(
          { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: HKDF_INFO },
          base,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt'],
        ),
      );
    keyCache.set(seed, key);
  }
  return key;
}

export function forgetKey(seed: string): void {
  keyCache.delete(seed);
}

export async function encrypt(seed: string, plaintext: Uint8Array<ArrayBuffer>): Promise<{ iv: Uint8Array<ArrayBuffer>; ct: Uint8Array<ArrayBuffer> }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(seed), plaintext);
  return { iv, ct: new Uint8Array(ct) };
}

export async function decrypt(seed: string, iv: Uint8Array<ArrayBuffer>, ct: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, await deriveKey(seed), ct));
}

export async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
}
