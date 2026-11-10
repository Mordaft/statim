import { beforeEach, describe, expect, it } from 'vitest';
import { formatDateDivider, formatTime, getLocale, setLocale, t, toggleLocale, translations } from './i18n.ts';

describe('i18n module', () => {
  beforeEach(() => {
    localStorage.clear();
    setLocale('es');
  });

  it('translates keys in the active language', () => {
    expect(t('app.title')).toBe('Statim');
    expect(t('app.offline')).toBe('Sin conexión');

    setLocale('en');
    expect(t('app.offline')).toBe('Offline');
    expect(t('chat.send_btn')).toBe('Send');
  });

  it('interpolates parameters correctly', () => {
    expect(t('app.connected_many', { count: 5 })).toBe('5 conectados');
    setLocale('en');
    expect(t('app.connected_many', { count: 5 })).toBe('5 connected');
    expect(t('notify.recovered', { count: 12 })).toBe('12 recovered message(s)');
  });

  it('toggles locale between es and en', () => {
    expect(getLocale()).toBe('es');
    expect(toggleLocale()).toBe('en');
    expect(getLocale()).toBe('en');
    expect(toggleLocale()).toBe('es');
    expect(getLocale()).toBe('es');
  });

  it('has identical keys for both Spanish and English', () => {
    const esKeys = Object.keys(translations.es).sort();
    const enKeys = Object.keys(translations.en).sort();
    expect(enKeys).toEqual(esKeys);
  });

  it('formats time in 24h/local format', () => {
    const date = new Date(2026, 10, 10, 14, 35);
    const formatted = formatTime(date, 'es');
    expect(formatted).toMatch(/14:35/);
  });

  it('formats date divider for today, yesterday, and older dates', () => {
    const now = new Date();
    expect(formatDateDivider(now, 'es')).toBe('Hoy');
    expect(formatDateDivider(now, 'en')).toBe('Today');

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    expect(formatDateDivider(yesterday, 'es')).toBe('Ayer');
    expect(formatDateDivider(yesterday, 'en')).toBe('Yesterday');

    const older = new Date(now.getFullYear(), 0, 15);
    const formattedOlder = formatDateDivider(older, 'es');
    expect(formattedOlder).toContain('15');
  });
});

