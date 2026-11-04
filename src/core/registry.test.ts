import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfluenceClient, FeedEntry, Urgency } from './confluence-client.ts';
import { db, type Peer } from './db.ts';
import type { Announce, Envelope, Signal, SignalBatch } from './protocol.ts';
import { Registry } from './registry.ts';

vi.mock('./public-ip.ts', () => ({ detectPublicIp: vi.fn(async () => '203.0.113.7') }));

class FakeClient {
  posts: { envelope: Envelope; urgent: Urgency }[] = [];
  feed: FeedEntry[][] = [];
  urgencies: Urgency[] = [];
  #id = 0;
  remainingFastBudget = 100;
  post = vi.fn(async (envelope: Envelope, urgent: Urgency = false) => {
    this.posts.push({ envelope, urgent });
    return String(++this.#id);
  });
  listSince = vi.fn((_since: number, urgent: Urgency = false) => {
    this.urgencies.push(urgent);
    const next = this.feed.shift();
    return next ? Promise.resolve(next) : new Promise<FeedEntry[]>(() => {});
  });
  remove = vi.fn(async () => {});
  reschedule = vi.fn();
  close = vi.fn();
}

const announceFrom = (email: string, session = 'peer-session'): Announce => ({
  t: 'announce',
  v: 1,
  email,
  session,
  ip: '198.51.100.1',
  seedId: crypto.randomUUID(),
  seed: 'c2VlZA==',
  ts: Date.now(),
});

function setup() {
  const client = new FakeClient();
  const registry = new Registry(client as unknown as ConfluenceClient, 'Ana@X.com');
  return { client, registry };
}

describe('Registry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('announces urgently on start with a persisted seed and public IP', async () => {
    const { client, registry } = setup();
    await registry.start();

    const first = client.posts[0];
    expect(first.urgent).toBe(true);
    expect(first.envelope).toMatchObject({ t: 'announce', email: 'ana@x.com', session: registry.session, ip: '203.0.113.7' });
    const seed = await registry.currentSeed();
    expect(first.envelope).toMatchObject({ seedId: seed.seedId, seed: seed.seed });
    expect(await db.ownComments.count()).toBe(1);
    registry.stop();
  });

  it('asks for fast polling only while joining', async () => {
    const { client, registry } = setup();
    await registry.start();
    await vi.waitFor(() => expect(client.urgencies).toHaveLength(1));
    const urgency = client.urgencies[0] as () => boolean;
    expect(urgency()).toBe(true);
    registry.stop();
    expect(urgency()).toBe(false);
    expect(client.close).toHaveBeenCalled();
  });

  it('stores peers from announces and ignores its own', async () => {
    const { client, registry } = setup();
    const peers: Peer[] = [];
    registry.addEventListener('peer', (e) => peers.push((e as CustomEvent<Peer>).detail));
    client.feed.push([
      { commentId: '10', createdAt: Date.now(), envelope: announceFrom('bob@x.com') },
      { commentId: '11', createdAt: Date.now(), envelope: announceFrom('ana@x.com') },
    ]);

    await registry.start();
    await vi.waitFor(() => expect(peers).toHaveLength(1));

    expect(peers[0]).toMatchObject({ email: 'bob@x.com', session: 'peer-session' });
    expect(peers[0].avatarSvg).toMatch(/^<svg/);
    expect((await registry.activePeers()).map((p) => p.email)).toEqual(['bob@x.com']);
    registry.stop();
  });

  it('delivers signals addressed to this session exactly once', async () => {
    const { client, registry } = setup();
    const signals: Signal[] = [];
    registry.addEventListener('signal', (e) => signals.push((e as CustomEvent<Signal>).detail));
    const batch: SignalBatch = {
      t: 'signals',
      v: 1,
      from: 'bob@x.com',
      fromSession: 'bob-s',
      ts: Date.now(),
      items: [
        { to: 'ana@x.com', toSession: registry.session, kind: 'offer', data: 'sdp-1' },
        { to: 'ana@x.com', toSession: 'old-session', kind: 'offer', data: 'stale' },
        { to: 'cid@x.com', toSession: 'cid-s', kind: 'offer', data: 'other' },
      ],
    };
    client.feed.push([{ commentId: '20', createdAt: Date.now(), envelope: batch }]);
    client.feed.push([{ commentId: '20', createdAt: Date.now(), envelope: batch }]);

    await registry.start();
    await vi.waitFor(() => expect(client.listSince).toHaveBeenCalledTimes(3));

    expect(signals).toEqual([{ to: 'ana@x.com', toSession: registry.session, kind: 'offer', data: 'sdp-1', from: 'bob@x.com', fromSession: 'bob-s' }]);
    registry.stop();
  });

  it('packs signals queued together into one urgent comment', async () => {
    const { client, registry } = setup();
    await registry.start();
    client.posts.length = 0;

    await Promise.all([
      registry.sendSignal({ to: 'bob@x.com', toSession: 'b', kind: 'offer', data: 'x' }),
      registry.sendSignal({ to: 'cid@x.com', toSession: 'c', kind: 'offer', data: 'y' }),
    ]);

    expect(client.posts).toHaveLength(1);
    expect(client.posts[0].urgent).toBe(true);
    expect((client.posts[0].envelope as SignalBatch).items.map((i) => i.to)).toEqual(['bob@x.com', 'cid@x.com']);
    registry.stop();
  });

  it('holdFastPolling() asks the client to reschedule', async () => {
    const { client, registry } = setup();
    const release = registry.holdFastPolling();
    expect(client.reschedule).toHaveBeenCalledOnce();
    release();
    release();
  });
});
