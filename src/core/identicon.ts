import { sha256 } from './crypto.ts';

const GRID = 5;
const CELL = 10;
const PAD = 5;
const SIZE = GRID * CELL + PAD * 2;

// GitHub-style 5x5 identicon, mirrored horizontally.
export async function identiconSvg(email: string): Promise<string> {
  const hash = await sha256(email.trim().toLowerCase());
  const hue = ((hash[0] << 8) | hash[1]) % 360;
  const fg = `hsl(${hue} 60% 50%)`;
  const bg = `hsl(${hue} 30% 92%)`;

  const rects: string[] = [];
  const half = Math.ceil(GRID / 2);
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < half; x++) {
      const bit = (hash[2 + Math.floor((y * half + x) / 8)] >> ((y * half + x) % 8)) & 1;
      if (!bit) continue;
      for (const cx of new Set([x, GRID - 1 - x])) {
        rects.push(`<rect x="${PAD + cx * CELL}" y="${PAD + y * CELL}" width="${CELL}" height="${CELL}"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="${bg}"/><g fill="${fg}">${rects.join('')}</g></svg>`;
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const urlCache = new Map<string, Promise<string>>();

export function avatarUrl(email: string): Promise<string> {
  const key = email.trim().toLowerCase();
  let url = urlCache.get(key);
  if (!url) {
    url = identiconSvg(key).then(svgToDataUrl);
    urlCache.set(key, url);
  }
  return url;
}
