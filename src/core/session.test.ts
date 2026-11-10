import { describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import { db, getSetting } from './db.ts';
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

  it('upgrades the comment database without losing history, seeds or credentials', async () => {
    db.close();
    await db.delete();
    const legacy = new Dexie('statim');
    legacy.version(1).stores({
      peers: 'email, lastSeen', messages: '++id, &msgId, ts, from',
      ownSeeds: 'seedId, createdAt', processedSignals: 'commentId, ts',
      ownComments: 'commentId, kind, ts', settings: 'key',
    });
    try {
      await legacy.table('messages').add({ msgId: 'ana|1', from: 'ana@x.com', text: 'Hola', ts: 1 });
      await legacy.table('settings').add({ key: 'token', value: 'preserved' });
      await legacy.table('ownSeeds').add({ seedId: 'seed-1', seed: 'value', createdAt: 1 });
      await legacy.table('ownComments').add({ commentId: 'old', kind: 'announce', ts: 1 });
      await legacy.table('processedSignals').add({ commentId: 'old', ts: 1 });
    } finally {
      legacy.close();
      await db.open();
    }
    expect(db.verno).toBe(2);
    expect((await db.messages.toArray())[0].text).toBe('Hola');
    expect(await getSetting('token')).toBe('preserved');
    expect(await db.ownSeeds.get('seed-1')).toBeDefined();
    expect(await db.ownProperties.count()).toBe(0);
    expect(await db.processedProperties.count()).toBe(0);
    expect(db.tables.map((table) => table.name)).not.toContain('ownComments');
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
