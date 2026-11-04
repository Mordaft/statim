import { describe, expect, it } from 'vitest';
import { getSetting } from './db.ts';
import { clearToken, isComplete, loadCredentials, saveCredentials } from './session.ts';

const creds = { baseUrl: 'http://localhost:8787', pageId: '42', email: 'ana@x.com', token: 'tok' };

describe('session credentials', () => {
  it('is incomplete when nothing is stored', async () => {
    expect(isComplete(await loadCredentials())).toBe(false);
  });

  it('saves and loads credentials', async () => {
    await saveCredentials(creds);
    const loaded = await loadCredentials();
    expect(loaded).toEqual(creds);
    expect(isComplete(loaded)).toBe(true);
  });

  it('logout removes only the token', async () => {
    await saveCredentials(creds);
    await clearToken();
    const loaded = await loadCredentials();
    expect(loaded.token).toBeUndefined();
    expect(loaded.email).toBe('ana@x.com');
    expect(await getSetting('pageId')).toBe('42');
  });
});
