import { config } from '../config.ts';
import { ConfluenceError, encodePropertyValue, PropertySizeError, type ConfluenceClient } from './confluence-client.ts';
import { forgetKey, generateSeed } from './crypto.ts';
import { db, type OwnProperty, type OwnSeed, type Peer } from './db.ts';
import { identiconSvg } from './identicon.ts';
import { MAX_SIGNAL_ITEMS, type Announce, type Signal, type SignalBatch, type SignalItem } from './protocol.ts';
import { detectPublicIp } from './public-ip.ts';

export type OutgoingSignal = SignalItem;

interface OutboxEntry {
  item: SignalItem;
  resolve: () => void;
  reject: (reason: unknown) => void;
}

// Re-read a small window to tolerate properties that become visible late.
const POLL_OVERLAP_MS = 30_000;
const MAX_PEER_SEEDS = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Events: `peer` (CustomEvent<Peer>), `signal` (CustomEvent<Signal>), `seed` (Event), `error` (CustomEvent<unknown>).
 * Every Confluence request goes through the client's rate limiter; this class only says when speed is justified.
 */
export class Registry extends EventTarget {
  readonly session = crypto.randomUUID();
  readonly email: string;
  readonly #client: ConfluenceClient;
  readonly #iceServers: RTCIceServer[];
  #ip = '';
  #since = 0;
  #running = false;
  #purging = false;
  #rotateTimer?: number;
  #flushTimer?: number;
  #backoffMs = 0;
  #fastUntil = 0;
  #fastHolds = 0;
  readonly #outbox: OutboxEntry[] = [];

  constructor(client: ConfluenceClient, email: string, iceServers?: RTCIceServer[]) {
    super();
    this.#client = client;
    this.email = email.trim().toLowerCase();
    this.#iceServers = iceServers ?? config.iceServers;
  }

  async start(): Promise<void> {
    if (this.#running) return;
    this.#running = true;
    this.#since = Date.now() - config.announceTtlMs;
    this.#fastUntil = Date.now() + config.startupFastPollMs;
    this.#ip = await detectPublicIp(this.#iceServers);
    await this.#rotateIfDue(true);
    this.#rotateTimer = setInterval(() => {
      this.#rotateIfDue(false).catch((e) => this.#emitError(e));
    }, 60_000);
    void this.#pollLoop();
  }

  stop(): void {
    this.#running = false;
    clearInterval(this.#rotateTimer);
    clearTimeout(this.#flushTimer);
    this.#client.close();
  }

  get remainingFastBudget(): number {
    return this.#client.remainingFastBudget;
  }

  async currentSeed(): Promise<OwnSeed> {
    const seed = await db.ownSeeds.orderBy('createdAt').last();
    if (!seed) throw new Error('Registro no iniciado');
    return seed;
  }

  /** Justifies fast polling (e.g. waiting for an answer) until released or `fastHoldMs` elapses. */
  holdFastPolling(): () => void {
    this.#fastHolds++;
    this.#client.reschedule();
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      clearTimeout(timer);
      this.#fastHolds--;
    };
    const timer = setTimeout(release, config.fastHoldMs);
    return release;
  }

  activePeers(): Promise<Peer[]> {
    return db.peers.where('lastSeen').above(Date.now() - config.announceTtlMs).toArray();
  }

  /** Queues signals into size-limited properties. */
  sendSignal(item: OutgoingSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#outbox.push({ item, resolve, reject });
      this.#flushTimer ??= setTimeout(() => void this.#flush(), config.signalBatchDelayMs);
    });
  }

  #wantsFast = (): boolean => this.#running && (this.#fastHolds > 0 || Date.now() < this.#fastUntil);

  async #flush(): Promise<void> {
    this.#flushTimer = undefined;
    const batch = this.#outbox.splice(0, MAX_SIGNAL_ITEMS);
    if (this.#outbox.length) this.#flushTimer = setTimeout(() => void this.#flush(), 0);
    if (!batch.length) return;
    await this.#publishSignals(batch);
  }

  async #publishSignals(batch: OutboxEntry[]): Promise<void> {
    const envelope: SignalBatch = {
      t: 'signals',
      v: 1,
      from: this.email,
      fromSession: this.session,
      items: batch.map((b) => b.item),
      ts: Date.now(),
    };
    try {
      encodePropertyValue(envelope);
      const propertyKey = await this.#client.post(envelope, true);
      await db.ownProperties.add({ propertyKey, kind: 'signal', ts: Date.now() });
      batch.forEach((b) => b.resolve());
    } catch (e) {
      if (e instanceof PropertySizeError && batch.length > 1) {
        const middle = Math.ceil(batch.length / 2);
        await this.#publishSignals(batch.slice(0, middle));
        await this.#publishSignals(batch.slice(middle));
        return;
      }
      batch.forEach((b) => b.reject(e));
    }
  }

  async #rotateIfDue(startup: boolean): Promise<void> {
    const now = Date.now();
    let current = await db.ownSeeds.orderBy('createdAt').last();
    const rotate = !current || now - current.createdAt >= config.seedRotationMs;

    if (rotate || !current) {
      current = { ...generateSeed(), createdAt: now };
      await db.ownSeeds.add(current);
      const stale = await db.ownSeeds.where('createdAt').below(now - config.seedGraceMs).toArray();
      stale.forEach((s) => forgetKey(s.seed));
      await db.ownSeeds.bulkDelete(stale.map((s) => s.seedId));
      this.dispatchEvent(new Event('seed'));
    }

    // Joining is the only case where announcing fast is justified.
    if (rotate || startup) await this.#announce(current, startup);
    await db.processedProperties.where('ts').below(now - config.announceTtlMs).delete();
    this.#purgeOwnProperties().catch((e) => this.#emitError(e));
  }

  async #announce(seed: OwnSeed, urgent: boolean): Promise<void> {
    const envelope: Announce = {
      t: 'announce',
      v: 1,
      email: this.email,
      session: this.session,
      ip: this.#ip,
      seedId: seed.seedId,
      seed: seed.seed,
      ts: Date.now(),
    };
    const propertyKey = await this.#client.post(envelope, urgent);
    await db.ownProperties.add({ propertyKey, kind: 'announce', ts: Date.now() });
  }

  async #purgeOwnProperties(): Promise<void> {
    if (this.#purging) return;
    this.#purging = true;
    try {
      const now = Date.now();
      const announces = await db.ownProperties.where('kind').equals('announce').sortBy('ts');
      const signals = await db.ownProperties.where('kind').equals('signal').toArray();
      const stale: OwnProperty[] = [
        ...announces.slice(0, -1),
        ...signals.filter((s) => now - s.ts > config.signalTtlMs),
      ];

      for (const c of stale) {
        if (!this.#running) return;
        try {
          await this.#client.remove(c.propertyKey);
        } catch (e) {
          if (!(e instanceof ConfluenceError && e.status === 404)) throw e;
        }
        await db.ownProperties.delete(c.propertyKey);
      }
    } finally {
      this.#purging = false;
    }
  }

  async #pollLoop(): Promise<void> {
    while (this.#running) {
      try {
        await this.#pollOnce();
        this.#backoffMs = 0;
      } catch (e) {
        if (!this.#running) return;
        this.#emitError(e);
        this.#backoffMs = Math.min(config.maxPollBackoffMs, Math.max(config.idlePollMs, this.#backoffMs * 2));
        await sleep(this.#backoffMs);
      }
    }
  }

  async #pollOnce(): Promise<void> {
    const entries = (await this.#client.listSince(this.#since, this.#wantsFast)).reverse();
    for (const { propertyKey, createdAt, envelope } of entries) {
      this.#since = Math.max(this.#since, createdAt - POLL_OVERLAP_MS);
      if (envelope.t === 'announce') {
        if (envelope.email !== this.email) await this.#upsertPeer(envelope, createdAt);
        continue;
      }

      const mine = envelope.items.filter((i) => i.to === this.email && i.toSession === this.session);
      if (!mine.length || (await db.processedProperties.get(propertyKey))) continue;
      await db.processedProperties.add({ propertyKey, ts: Date.now() });
      for (const item of mine) {
        const detail: Signal = { ...item, from: envelope.from, fromSession: envelope.fromSession };
        this.dispatchEvent(new CustomEvent<Signal>('signal', { detail }));
      }
    }
  }

  async #upsertPeer(a: Announce, createdAt: number): Promise<void> {
    const existing = await db.peers.get(a.email);
    if (existing && existing.lastSeen >= createdAt) return;

    const peer: Peer = {
      email: a.email,
      session: a.session,
      ip: a.ip,
      seeds: [
        { seedId: a.seedId, seed: a.seed, receivedAt: createdAt },
        ...(existing?.seeds.filter((s) => s.seedId !== a.seedId) ?? []),
      ].slice(0, MAX_PEER_SEEDS),
      avatarSvg: existing?.avatarSvg ?? (await identiconSvg(a.email)),
      lastSeen: createdAt,
    };
    await db.peers.put(peer);
    this.dispatchEvent(new CustomEvent<Peer>('peer', { detail: peer }));
  }

  #emitError(error: unknown): void {
    this.dispatchEvent(new CustomEvent('error', { detail: error }));
  }
}
