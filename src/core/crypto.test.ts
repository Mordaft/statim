import { describe, expect, it } from 'vitest';
import { decrypt, encrypt, fromBase64, generateSeed, sha256, toBase64 } from './crypto.ts';
import { isUuid } from './wire.ts';

const bytes = (s: string) => new TextEncoder().encode(s) as Uint8Array<ArrayBuffer>;

describe('crypto', () => {
  it('base64 round-trips arbitrary bytes', () => {
    const data = new Uint8Array(256).map((_, i) => i);
    expect(fromBase64(toBase64(data))).toEqual(data);
  });

  it('generates 32-byte seeds with UUID ids', () => {
    const { seedId, seed } = generateSeed();
    expect(isUuid(seedId)).toBe(true);
    expect(fromBase64(seed)).toHaveLength(32);
    expect(generateSeed().seed).not.toBe(seed);
  });

  it('encrypts and decrypts with the same seed', async () => {
    const { seed } = generateSeed();
    const { iv, ct } = await encrypt(seed, bytes('secreto'));
    expect(iv).toHaveLength(12);
    expect(new TextDecoder().decode(await decrypt(seed, iv, ct))).toBe('secreto');
  });

  it('uses a fresh IV per message', async () => {
    const { seed } = generateSeed();
    const a = await encrypt(seed, bytes('x'));
    const b = await encrypt(seed, bytes('x'));
    expect(a.iv).not.toEqual(b.iv);
  });

  it('fails to decrypt with another seed', async () => {
    const { iv, ct } = await encrypt(generateSeed().seed, bytes('secreto'));
    await expect(decrypt(generateSeed().seed, iv, ct)).rejects.toThrow();
  });

  it('detects tampered ciphertext (AES-GCM tag)', async () => {
    const { seed } = generateSeed();
    const { iv, ct } = await encrypt(seed, bytes('secreto'));
    ct[0] ^= 0xff;
    await expect(decrypt(seed, iv, ct)).rejects.toThrow();
  });

  it('sha256 is deterministic', async () => {
    expect(await sha256('a')).toEqual(await sha256('a'));
    expect(await sha256('a')).not.toEqual(await sha256('b'));
  });
});
