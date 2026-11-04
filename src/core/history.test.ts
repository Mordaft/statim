import { describe, expect, it } from 'vitest';
import { decompressText } from './compression.ts';
import { buildPayload, formatEntry, parseEntry, parsePayload } from './history.ts';

const MAX_TEXT = 4000;

describe('history payload', () => {
  it('formats entries as "<ts> <text>"', () => {
    expect(formatEntry(123456, 'Hola a todos')).toBe('123456 Hola a todos');
    expect(parseEntry('123477 Quiero comentar la tarea A', MAX_TEXT)).toEqual({ ts: 123477, text: 'Quiero comentar la tarea A' });
  });

  it('keeps multi-line text and spaces', () => {
    expect(parseEntry('1 línea 1\n  línea 2', MAX_TEXT)).toEqual({ ts: 1, text: 'línea 1\n  línea 2' });
  });

  it.each([42, '', 'sin-ts', '12a texto', '1 ', `1 ${'x'.repeat(MAX_TEXT + 1)}`])('rejects entry %j', (raw) => {
    expect(parseEntry(raw, MAX_TEXT)).toBeNull();
  });

  it('builds the JSON shape {hist, current}', () => {
    const json = decompressText(
      buildPayload([{ ts: 123456, text: 'Hola a todos' }, { ts: 123477, text: 'Quiero comentar la tarea A' }], { ts: 123566, text: 'tengo que añadir X' }, 128 * 1024),
      1_000_000,
    );
    expect(JSON.parse(json)).toEqual({
      hist: ['123456 Hola a todos', '123477 Quiero comentar la tarea A'],
      current: '123566 tengo que añadir X',
    });
  });

  it('omits current for history-only frames', () => {
    const json = decompressText(buildPayload([{ ts: 1, text: 'a' }], undefined, 1024), 1024);
    expect(JSON.parse(json)).toEqual({ hist: ['1 a'] });
  });

  it('drops the oldest entries to stay under the compressed limit, never the current one', () => {
    // Random text barely compresses, forcing truncation.
    const noise = () => Array.from(crypto.getRandomValues(new Uint8Array(1500)), (b) => String.fromCharCode(33 + (b % 90))).join('');
    const hist = Array.from({ length: 200 }, (_, i) => ({ ts: i + 1, text: noise() }));
    const limit = 32 * 1024;
    const compressed = buildPayload(hist, { ts: 9999, text: 'actual' }, limit);

    expect(compressed.length).toBeLessThanOrEqual(limit);
    const parsed = parsePayload(decompressText(compressed, 10_000_000), 5000, MAX_TEXT)!;
    expect(parsed.current).toEqual({ ts: 9999, text: 'actual' });
    expect(parsed.hist.length).toBeLessThan(200);
    expect(parsed.hist.at(-1)!.ts).toBe(200);
  });

  it('parses history and current separately, skipping invalid entries', () => {
    const json = JSON.stringify({ hist: ['1 uno', 'basura', 2, '3 tres'], current: '4 cuatro' });
    expect(parsePayload(json, 10, MAX_TEXT)).toEqual({
      hist: [
        { ts: 1, text: 'uno' },
        { ts: 3, text: 'tres' },
      ],
      current: { ts: 4, text: 'cuatro' },
    });
  });

  it('omits current when absent or invalid', () => {
    expect(parsePayload('{"hist":[]}', 10, MAX_TEXT)).toEqual({ hist: [] });
    expect(parsePayload('{"hist":[],"current":"x"}', 10, MAX_TEXT)).toEqual({ hist: [] });
  });

  it.each(['no json', '[]', '{"hist":"x"}', JSON.stringify({ hist: Array(11).fill('1 a') })])('rejects payload %s', (json) => {
    expect(parsePayload(json, 10, MAX_TEXT)).toBeNull();
  });
});
