import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceClient, ConfluenceError, encodePropertyValue, PropertySizeError } from './confluence-client.ts';
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

const property = (id: number, createdAt: string, value: unknown) => ({
  key: `statim.v1.${id}`,
  version: { createdAt, when: createdAt },
  value,
});

describe('ConfluenceClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-11-04T10:00:00Z') });
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  function encodedValue(env: Announce): { data: string } {
    return encodePropertyValue(env);
  }

  it('posts an LZ4+base64 property with Bearer auth', async () => {
    fetchMock.mockResolvedValueOnce(json({ id: 777 }));
    const id = await new ConfluenceClient(creds).post(announce);

    expect(id).toMatch(/^statim\.v1\./);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://proxy.local/rest/api/content/42/property');
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('omit');
    expect(init.headers.Authorization).toBe('Bearer tok');
    const body = JSON.parse(init.body);
    expect(body.key).toBe(id);
    expect(body.value.data).toMatch(/^stz1:[A-Za-z0-9+/=]+$/);
    expect(body.value.data).not.toContain('ana@x.com');
  });

  it('lists unordered entries newer than since, skipping foreign or corrupt properties', async () => {
    const value = await encodedValue(announce);
    fetchMock.mockResolvedValueOnce(
      json({
        results: [
          property(2, '2026-11-04T09:00:00Z', value),
          { ...property(4, '2026-11-04T10:00:04Z', value), key: 'other.app' },
          property(3, '2026-11-04T10:00:03Z', { data: 'stz1:@@corrupto@@' }),
          property(5, '2026-11-04T10:00:05Z', value),
        ],
      }),
    );

    const client = new ConfluenceClient({ ...creds, email: 'bob@x.com' });
    const entries = await client.listSince(Date.parse('2026-11-04T10:00:00Z'));

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ propertyKey: 'statim.v1.5', envelope: { t: 'announce', email: 'ana@x.com' } });
    expect(fetchMock.mock.calls.at(-1)![0]).toContain('/rest/api/content/42/property?expand=version&limit=100');
  });

  it('follows pagination links', async () => {
    const value = await encodedValue(announce);
    fetchMock
      .mockResolvedValueOnce(json({ results: [property(2, '2026-11-04T09:00:02Z', value)], _links: { next: '/api/content/42/property?start=100' } }))
      .mockResolvedValueOnce(json({ results: [property(1, '2026-11-04T10:00:01Z', value)] }));

    const client = new ConfluenceClient({ ...creds, email: 'bob@x.com' });
    const pending = client.listSince(Date.parse('2026-11-04T10:00:00Z'));
    await vi.advanceTimersByTimeAsync(60_000);
    const entries = await pending;

    expect(entries.map((e) => e.propertyKey)).toEqual(['statim.v1.1']);
    expect(fetchMock.mock.calls.at(-1)![0]).toBe('http://proxy.local/rest/api/content/42/property?start=100');
  });

  it('uses the envelope timestamp when property dates are not expanded', async () => {
    fetchMock.mockResolvedValueOnce(json({ results: [{ key: 'statim.v1.1', value: encodedValue(announce) }] }));
    const entries = await new ConfluenceClient(creds).listSince(0);
    expect(entries[0]).toMatchObject({ propertyKey: 'statim.v1.1', createdAt: announce.ts });
  });

  it('sorts entries newest first and rejects oversized or missing values', async () => {
    const value = encodedValue(announce);
    fetchMock.mockResolvedValueOnce(json({ results: [
      property(1, '2026-11-04T10:00:01Z', value),
      property(2, '2026-11-04T10:00:02Z', value),
      property(3, '2026-11-04T10:00:03Z', { data: 'stz1:' + 'A'.repeat(32768) }),
      { key: 'statim.v1.4' },
    ] }));
    const entries = await new ConfluenceClient(creds).listSince(0);
    expect(entries.map((entry) => entry.propertyKey)).toEqual(['statim.v1.2', 'statim.v1.1']);
  });

  it.each(['/wiki', '/confluence'])('preserves the %s context path in absolute pagination links', async (contextPath) => {
    fetchMock
      .mockResolvedValueOnce(json({ results: [], _links: { next: `https://remote.test${contextPath}/rest/api/content/42/property?start=100` } }))
      .mockResolvedValueOnce(json({ results: [] }));
    const client = new ConfluenceClient({ ...creds, baseUrl: 'http://proxy.local' + contextPath });
    const pending = client.listSince(0);
    await vi.advanceTimersByTimeAsync(60_000);
    await pending;
    expect(fetchMock.mock.calls.at(-1)![0]).toBe(`http://proxy.local${contextPath}/rest/api/content/42/property?start=100`);
    client.close();
  });

  it('refuses to delete foreign properties', async () => {
    await expect(new ConfluenceClient(creds).remove('other.app')).rejects.toThrow('ajena');
    expect(fetchMock).not.toHaveBeenCalled();
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

  it('deletes properties by key and accepts 204', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await new ConfluenceClient(creds).remove('statim.v1.99');
    expect(fetchMock.mock.calls[0][0]).toBe('http://proxy.local/rest/api/content/42/property/statim.v1.99');
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
  });

  it('rejects oversized values before making a request', async () => {
    const data = Array.from({ length: 3000 }, () => crypto.randomUUID()).join('');
    await expect(new ConfluenceClient(creds).post({
      t: 'signals', v: 1, from: 'ana@x.com', fromSession: 's1', ts: 1,
      items: [{ to: 'bob@x.com', toSession: 's2', kind: 'offer', data }],
    })).rejects.toBeInstanceOf(PropertySizeError);
    expect(fetchMock).not.toHaveBeenCalled();
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
