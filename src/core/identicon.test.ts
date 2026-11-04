import { describe, expect, it } from 'vitest';
import { avatarUrl, identiconSvg, svgToDataUrl } from './identicon.ts';

describe('identicon', () => {
  it('is deterministic and case-insensitive', async () => {
    expect(await identiconSvg('Ana@X.com')).toBe(await identiconSvg('ana@x.com'));
  });

  it('differs between emails', async () => {
    expect(await identiconSvg('ana@x.com')).not.toBe(await identiconSvg('bob@x.com'));
  });

  it('produces a horizontally symmetric 5x5 SVG', async () => {
    const svg = await identiconSvg('ana@x.com');
    expect(svg).toMatch(/^<svg[^>]+viewBox="0 0 60 60"/);
    const xs = [...svg.matchAll(/<rect x="(\d+)" y="(\d+)"/g)].map((m) => `${m[1]},${m[2]}`);
    for (const key of xs) {
      const [x, y] = key.split(',').map(Number);
      expect(xs).toContain(`${60 - 10 - x},${y}`);
    }
  });

  it('builds cached data URLs', async () => {
    const url = await avatarUrl('ana@x.com');
    expect(url).toBe(svgToDataUrl(await identiconSvg('ana@x.com')));
    expect(url.startsWith('data:image/svg+xml')).toBe(true);
    expect(avatarUrl('ANA@x.com')).toBe(avatarUrl('ana@x.com'));
  });
});
