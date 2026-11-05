import { config } from '../config.ts';
import { decompressText } from './compression.ts';
import { decrypt, encrypt } from './crypto.ts';
import { db, type Message, type Peer } from './db.ts';
import { buildPayload, parsePayload, type Entry } from './history.ts';
import type { Signal } from './protocol.ts';
import type { Registry } from './registry.ts';
import { decodeFrame, encodeFrame, type Frame } from './wire.ts';

interface Link {
  email: string;
  session: string;
  pc: RTCPeerConnection;
  channel?: RTCDataChannel;
  initiator: boolean;
  attempts: number;
  timer?: number;
  releaseFastPolling?: () => void;
}

const MAX_TEXT = 4000;
// LZ4 rarely beats 10:1 on chat text; anything larger is treated as hostile.
const MAX_PLAIN_BYTES = config.historyMaxBytes * 10;
const MAX_FRAME_BYTES = config.historyMaxBytes + 1024;
const MAX_ENTRIES = 5000;
const MAX_SDP = 20_000;
const ICE_GATHER_TIMEOUT_MS = 7000;
const DISCONNECT_GRACE_MS = 15_000;
const RETRY_DELAY_MS = 10_000;
// Each retry costs Confluence requests: retry once, and only if the peer did answer.
const MAX_ATTEMPTS = 2;
const MAX_PENDING_PER_PEER = 50;

// Non-trickle ICE: a single comment per offer/answer keeps Confluence traffic low.
function waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      pc.removeEventListener('icegatheringstatechange', onChange);
      resolve();
    };
    const onChange = () => pc.iceGatheringState === 'complete' && done();
    const timer = setTimeout(done, ICE_GATHER_TIMEOUT_MS);
    pc.addEventListener('icegatheringstatechange', onChange);
  });
}

export const messageId = (from: string, ts: number) => `${from}|${ts}`;

/** Newly stored messages from one received frame, ascending by `ts`. `current` is the live one, if any. */
export interface MessageBatch {
  from: string;
  messages: Message[];
  current?: Message;
}

/**
 * Events: `messages` (CustomEvent<MessageBatch>) once per received frame with new messages, `links` (Event) when
 * the set of open channels changes, `error` (CustomEvent<unknown>).
 */
export class Mesh extends EventTarget {
  readonly #registry: Registry;
  readonly #iceServers: RTCIceServer[];
  readonly #links = new Map<string, Link>();
  readonly #pending = new Map<string, Frame[]>();
  // Serializes processing per sender so overlapping histories don't race on the unique msgId index.
  readonly #receiving = new Map<string, Promise<void>>();
  #lastOwnTs = 0;

  constructor(registry: Registry, iceServers?: RTCIceServer[]) {
    super();
    this.#registry = registry;
    this.#iceServers = iceServers ?? config.iceServers;
  }

  async start(): Promise<void> {
    this.#registry.addEventListener('peer', this.#onPeer);
    this.#registry.addEventListener('signal', this.#onSignal);
    for (const peer of await this.#registry.activePeers()) this.#maybeConnect(peer);
  }

  stop(): void {
    this.#registry.removeEventListener('peer', this.#onPeer);
    this.#registry.removeEventListener('signal', this.#onSignal);
    for (const link of [...this.#links.values()]) this.#close(link);
  }

  connectedPeers(): string[] {
    return [...this.#links.values()].filter((l) => l.channel?.readyState === 'open').map((l) => l.email);
  }

  async send(text: string): Promise<Message> {
    const clean = text.trim().slice(0, MAX_TEXT);
    if (!clean) throw new Error('Mensaje vacío');
    const from = this.#registry.email;
    // Timestamps double as message identity, so keep them unique per sender.
    const ts = Math.max(Date.now(), this.#lastOwnTs + 1);
    this.#lastOwnTs = ts;
    const message: Message = { msgId: messageId(from, ts), from, text: clean, ts };
    message.id = await db.messages.add(message);

    const open = [...this.#links.values()].filter((l) => l.channel?.readyState === 'open');
    if (open.length) {
      const data = await this.#buildFrame({ ts, text: clean });
      for (const link of open) link.channel!.send(data);
    }
    return message;
  }

  /** Own messages of the history window (excluding `current`), compressed and encrypted with the current seed. */
  async #buildFrame(current?: Entry): Promise<Uint8Array<ArrayBuffer>> {
    const since = Date.now() - config.historyWindowMs;
    const own = await db.messages
      .where('ts')
      .aboveOrEqual(since)
      .filter((m) => m.from === this.#registry.email && m.ts !== current?.ts)
      .sortBy('ts');
    const payload = buildPayload(
      own.map((m) => ({ ts: m.ts, text: m.text })),
      current,
      config.historyMaxBytes,
    );
    const seed = await this.#registry.currentSeed();
    const { iv, ct } = await encrypt(seed.seed, payload);
    return encodeFrame({ packetId: crypto.randomUUID(), seedId: seed.seedId, iv, ct });
  }

  async #sendHistory(link: Link): Promise<void> {
    const hasHistory = await db.messages
      .where('ts')
      .aboveOrEqual(Date.now() - config.historyWindowMs)
      .filter((m) => m.from === this.#registry.email)
      .count();
    if (!hasHistory) return;
    const data = await this.#buildFrame();
    if (link.channel?.readyState === 'open') link.channel.send(data);
  }

  #onPeer = (e: Event) => {
    const peer = (e as CustomEvent<Peer>).detail;
    this.#maybeConnect(peer);
    void this.#flushPending(peer.email);
  };

  #onSignal = (e: Event) => {
    this.#handleSignal((e as CustomEvent<Signal>).detail).catch((err) => this.#emitError(err));
  };

  #maybeConnect(peer: Peer, attempts = 0): void {
    const existing = this.#links.get(peer.email);
    if (existing && existing.session === peer.session) return;
    if (existing) this.#close(existing);
    if (this.#registry.email >= peer.email) return;
    if (this.#links.size >= config.maxPeers - 1) return;
    this.#offer(peer, attempts).catch((err) => this.#emitError(err));
  }

  async #offer(peer: Peer, attempts: number): Promise<void> {
    const link = this.#createLink(peer.email, peer.session, true, attempts);
    this.#bindChannel(link, link.pc.createDataChannel('chat', { ordered: true }));
    await link.pc.setLocalDescription(await link.pc.createOffer());
    await waitForIceGathering(link.pc);
    if (this.#links.get(peer.email) !== link) return;

    await this.#registry.sendSignal({
      to: peer.email,
      toSession: peer.session,
      kind: 'offer',
      data: link.pc.localDescription?.sdp,
    });
    link.releaseFastPolling = this.#registry.holdFastPolling();
    link.timer = setTimeout(() => this.#fail(link), config.answerTimeoutMs);
  }

  async #handleSignal(signal: Signal): Promise<void> {
    if (typeof signal.data !== 'string' || signal.data.length > MAX_SDP) return;

    if (signal.kind === 'offer') {
      const existing = this.#links.get(signal.from);
      if (existing) this.#close(existing);
      const link = this.#createLink(signal.from, signal.fromSession, false, 0);
      link.pc.ondatachannel = ({ channel }) => this.#bindChannel(link, channel);
      await link.pc.setRemoteDescription({ type: 'offer', sdp: signal.data });
      await link.pc.setLocalDescription(await link.pc.createAnswer());
      await waitForIceGathering(link.pc);
      if (this.#links.get(signal.from) !== link) return;

      await this.#registry.sendSignal({
        to: signal.from,
        toSession: signal.fromSession,
        kind: 'answer',
        data: link.pc.localDescription?.sdp,
      });
    } else if (signal.kind === 'answer') {
      const link = this.#links.get(signal.from);
      if (!link || link.session !== signal.fromSession || link.pc.signalingState !== 'have-local-offer') return;
      clearTimeout(link.timer);
      link.releaseFastPolling?.();
      await link.pc.setRemoteDescription({ type: 'answer', sdp: signal.data });
    }
  }

  #createLink(email: string, session: string, initiator: boolean, attempts: number): Link {
    const pc = new RTCPeerConnection({ iceServers: this.#iceServers });
    const link: Link = { email, session, pc, initiator, attempts };
    this.#links.set(email, link);

    pc.onconnectionstatechange = () => {
      clearTimeout(link.timer);
      if (pc.connectionState === 'failed') this.#fail(link);
      else if (pc.connectionState === 'disconnected') {
        link.timer = setTimeout(() => this.#fail(link), DISCONNECT_GRACE_MS);
      }
    };
    return link;
  }

  #bindChannel(link: Link, channel: RTCDataChannel): void {
    link.channel = channel;
    channel.binaryType = 'arraybuffer';
    channel.onopen = () => {
      this.dispatchEvent(new Event('links'));
      this.#sendHistory(link).catch((err) => this.#emitError(err));
    };
    channel.onclose = () => {
      if (this.#links.get(link.email) === link) this.#fail(link);
    };
    channel.onmessage = ({ data }) => {
      const frame = decodeFrame(data, MAX_FRAME_BYTES);
      if (frame) this.#enqueueReceive(link.email, frame);
    };
  }

  #enqueueReceive(from: string, frame: Frame): void {
    const previous = this.#receiving.get(from) ?? Promise.resolve();
    const next = previous.then(() => this.#receive(from, frame)).catch((err) => this.#emitError(err));
    this.#receiving.set(from, next);
  }

  async #receive(from: string, frame: Frame): Promise<void> {
    const seed = (await db.peers.get(from))?.seeds.find((s) => s.seedId === frame.seedId);
    if (!seed) {
      // Seed announce not polled yet: retry when the peer record updates.
      const queue = this.#pending.get(from) ?? [];
      if (queue.length < MAX_PENDING_PER_PEER) queue.push(frame);
      this.#pending.set(from, queue);
      return;
    }

    let payload: ReturnType<typeof parsePayload>;
    try {
      const json = decompressText(await decrypt(seed.seed, frame.iv, frame.ct), MAX_PLAIN_BYTES);
      payload = parsePayload(json, MAX_ENTRIES, MAX_TEXT);
    } catch {
      return;
    }
    if (!payload) return;

    const store = async ({ ts, text }: Entry): Promise<Message | undefined> => {
      const msgId = messageId(from, ts);
      if (await db.messages.where('msgId').equals(msgId).count()) return undefined;
      const message: Message = { msgId, from, text, ts };
      message.id = await db.messages.add(message);
      return message;
    };

    const messages: Message[] = [];
    for (const entry of payload.hist) {
      const m = await store(entry);
      if (m) messages.push(m);
    }
    const current = payload.current && (await store(payload.current));
    if (current) messages.push(current);
    if (!messages.length) return;

    messages.sort((a, b) => a.ts - b.ts);
    this.dispatchEvent(new CustomEvent<MessageBatch>('messages', { detail: { from, messages, current } }));
  }

  async #flushPending(email: string): Promise<void> {
    const queue = this.#pending.get(email);
    if (!queue) return;
    this.#pending.delete(email);
    for (const frame of queue) this.#enqueueReceive(email, frame);
  }

  #fail(link: Link): void {
    const wasOpen = link.channel?.readyState === 'open';
    const answered = link.pc.remoteDescription !== null;
    this.#close(link);
    if (wasOpen) this.dispatchEvent(new Event('links'));
    if (!link.initiator || !answered || link.attempts + 1 >= MAX_ATTEMPTS) return;

    setTimeout(async () => {
      const peer = await db.peers.get(link.email);
      if (peer && peer.session === link.session && !this.#links.has(peer.email)) {
        this.#maybeConnect(peer, link.attempts + 1);
      }
    }, RETRY_DELAY_MS);
  }

  #close(link: Link): void {
    clearTimeout(link.timer);
    link.releaseFastPolling?.();
    link.pc.onconnectionstatechange = null;
    if (link.channel) link.channel.onclose = null;
    link.channel?.close();
    link.pc.close();
    if (this.#links.get(link.email) === link) this.#links.delete(link.email);
  }

  #emitError(error: unknown): void {
    this.dispatchEvent(new CustomEvent('error', { detail: error }));
  }
}
