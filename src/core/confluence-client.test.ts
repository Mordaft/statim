import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceClient, ConfluenceError } from './confluence-client.ts';
import type { Announce } from './protocol.ts';

const creds = { baseUrl: 'http://proxy.local/', pageId: '42', email: 'Ana@x.com', token: 'tok' };

const announce: Announce = {
  t: 'announce',
  v: 1,
  email: 'ana@x.com',
  session: 's1',
  ip: '1.2.3.4',
  seedId: crypto.randomUUID(),
  seed: 'c2VlZA==',
  ts: 1,
};

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

const comment = (id: number, createdAt: string, value: string) => ({
  id,
  type: 'comment',
  container: { id: '42', type: 'page' },
  version: { createdAt, when: createdAt },
  body: { storage: { value, representation: 'storage' } },
});

describe('ConfluenceClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-11-04T10:00:00Z') });
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  async function encodedValue(env: Announce): Promise<string> {
    fetchMock.mockResolvedValueOnce(json({ id: 1 }));
    const client = new ConfluenceClient(creds);
    await client.post(env);
    client.close();
    return JSON.parse(fetchMock.mock.calls.at(-1)![1].body).body.storage.value;
  }

  it('posts an LZ4+base64 comment with Bearer auth', async () => {
    fetchMock.mockResolvedValueOnce(json({ id: 777 }));
    const id = await new ConfluenceClient(creds).post(announce);

    expect(id).toBe('777');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://proxy.local/rest/api/content');
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('omit');
    expect(init.headers.Authorization).toBe('Bearer tok');
    const body = JSON.parse(init.body);
    expect(body.type).toBe('comment');
    expect(body.container).toEqual({ id: '42', type: 'page' });
    expect(body.body.storage.representation).toBe('storage');
    expect(body.body.storage.value).toMatch(/^<p>stz1:[A-Za-z0-9+/=]+<\/p>$/);
    expect(body.body.storage.value).not.toContain('ana@x.com');
  });

  it('lists entries newer than `since`, skipping foreign or corrupt comments', async () => {
    const value = await encodedValue(announce);
    fetchMock.mockResolvedValueOnce(
      json({
        results: [
          comment(5, '2026-11-04T10:00:05Z', value),
          comment(4, '2026-11-04T10:00:04Z', '<p>Comentario humano</p>'),
          comment(3, '2026-11-04T10:00:03Z', '<p>stz1:@@corrupto@@</p>'),
          comment(2, '2026-11-04T09:00:00Z', value),
        ],
      }),
    );

    const client = new ConfluenceClient({ ...creds, email: 'bob@x.com' });
    const entries = await client.listSince(Date.parse('2026-11-04T10:00:00Z'));

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ commentId: '5', envelope: { t: 'announce', email: 'ana@x.com' } });
    expect(fetchMock.mock.calls.at(-1)![0]).toContain('/rest/api/content/42/child/comment?expand=body.storage,version&limit=100');
  });

  it('follows pagination links', async () => {
    const value = await encodedValue(announce);
    fetchMock
      .mockResolvedValueOnce(json({ results: [comment(2, '2026-11-04T10:00:02Z', value)], _links: { next: '/api/content/42/child/comment?start=100' } }))
      .mockResolvedValueOnce(json({ results: [comment(1, '2026-11-04T10:00:01Z', value)] }));

    const client = new ConfluenceClient({ ...creds, email: 'bob@x.com' });
    const pending = client.listSince(0);
    await vi.advanceTimersByTimeAsync(60_000);
    const entries = await pending;

    expect(entries.map((e) => e.commentId)).toEqual(['2', '1']);
    expect(fetchMock.mock.calls.at(-1)![0]).toBe('http://proxy.local/rest/api/content/42/child/comment?start=100');
  });

  it('throws ConfluenceError and honours Retry-After', async () => {
    fetchMock.mockResolvedValueOnce(json({}, { status: 429, headers: { 'Retry-After': '120' } }));
    const client = new ConfluenceClient({ ...creds, email: 'bob@x.com' });

    const error = await client.listSince(0).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ConfluenceError);
    expect(error).toMatchObject({ status: 429, retryAfterMs: 120_000 });

    fetchMock.mockResolvedValueOnce(json({ results: [] }));
    const next = client.listSince(0, true);
    await vi.advanceTimersByTimeAsync(119_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1_000);
    await next;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('deletes comments and accepts 204', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await new ConfluenceClient(creds).remove('99');
    expect(fetchMock.mock.calls[0][0]).toBe('http://proxy.local/rest/api/content/99');
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
  });

  it('keeps one fast-request budget per email', async () => {
    fetchMock.mockImplementation(async () => json({ results: [] }));
    const client = new ConfluenceClient(creds);
    await client.listSince(0, true);
    const second = client.listSince(0, true);
    await vi.advanceTimersByTimeAsync(10_000);
    await second;
    expect(client.remainingFastBudget).toBe(99);
    expect(localStorage.getItem('statim.fastBudget.ana@x.com')).toContain('"used":1');
  });
});
