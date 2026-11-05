import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchMeteredIceServers, normalizeMeteredDomain } from './metered.ts';

describe('normalizeMeteredDomain', () => {
  it('defaults to subdomain.metered.live on empty or whitespace', () => {
    expect(normalizeMeteredDomain()).toBe('subdomain.metered.live');
    expect(normalizeMeteredDomain('')).toBe('subdomain.metered.live');
    expect(normalizeMeteredDomain('   ')).toBe('subdomain.metered.live');
  });

  it('appends .metered.live if input has no dots', () => {
    expect(normalizeMeteredDomain('myteam')).toBe('myteam.metered.live');
    expect(normalizeMeteredDomain('  empresa-turn ')).toBe('empresa-turn.metered.live');
  });

  it('keeps full domain if dots are present', () => {
    expect(normalizeMeteredDomain('custom.metered.live')).toBe('custom.metered.live');
    expect(normalizeMeteredDomain('relay.example.com')).toBe('relay.example.com');
  });
});

describe('fetchMeteredIceServers', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns empty array when key is empty', async () => {
    const servers = await fetchMeteredIceServers('   ');
    expect(servers).toEqual([]);
  });

  it('fetches iceServers with credential apiKey and filters only TURNS', async () => {
    const mockServers = [
      { urls: 'stun:stun.relay.metered.ca:80' },
      { urls: 'turn:eu-west.relay.metered.ca:80', username: 'user1', credential: 'pwd1' },
      { urls: 'turn:eu-west.relay.metered.ca:443?transport=tcp', username: 'user1', credential: 'pwd1' },
      { urls: 'turns:eu-west.relay.metered.ca:443?transport=tcp', username: 'user1', credential: 'pwd1' },
    ];

    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/api/v1/turn/credentials?apiKey=valid-api-key')) {
        return {
          ok: true,
          status: 200,
          json: async () => mockServers,
        };
      }
      return { ok: false, status: 401 };
    });

    const result = await fetchMeteredIceServers('valid-api-key', 'subdomain.metered.live');
    expect(result).toEqual([
      {
        urls: 'turns:eu-west.relay.metered.ca:443?transport=tcp',
        username: 'user1',
        credential: 'pwd1',
      },
    ]);
  });

  it('resolves secretKey by querying v2 credentials endpoint', async () => {
    const mockV2Response = {
      data: [{ apiKey: 'resolved-api-key', username: 'user2', password: 'pwd2' }],
    };
    const mockV1Response = [
      { urls: 'turns:relay.metered.ca:443?transport=tcp', username: 'user2', credential: 'pwd2' },
      { urls: 'stun:stun.metered.ca:80' },
    ];

    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/api/v1/turn/credentials?apiKey=my-secret-key')) {
        return { ok: false, status: 401 };
      }
      if (url.includes('/api/v2/turn/credentials?secretKey=my-secret-key')) {
        return {
          ok: true,
          status: 200,
          json: async () => mockV2Response,
        };
      }
      if (url.includes('/api/v1/turn/credentials?apiKey=resolved-api-key')) {
        return {
          ok: true,
          status: 200,
          json: async () => mockV1Response,
        };
      }
      return { ok: false, status: 404 };
    });

    const result = await fetchMeteredIceServers('my-secret-key', 'subdomain.metered.live');
    expect(result).toEqual([
      {
        urls: 'turns:relay.metered.ca:443?transport=tcp',
        username: 'user2',
        credential: 'pwd2',
      },
    ]);
  });

  it('throws an error if both apiKey and secretKey fail', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid API Key' }),
    });

    await expect(fetchMeteredIceServers('invalid-key', 'subdomain.metered.live')).rejects.toThrow(
      'Clave de Metered no válida',
    );
  });
});
