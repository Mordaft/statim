import { config } from '../config.ts';
import { compressText, decompressText } from './compression.ts';
import { fromBase64, toBase64 } from './crypto.ts';
import { trace } from './diagnostics.ts';
import { PREFIX, parseEnvelope, type Envelope } from './protocol.ts';
import { RateLimiter } from './rate-limiter.ts';

export interface ConfluenceCredentials {
  baseUrl: string;
  pageId: string;
  email: string;
  token: string;
}

export interface FeedEntry {
  commentId: string;
  createdAt: number;
  envelope: Envelope;
}

export class ConfluenceError extends Error {
  readonly status: number;
  readonly retryAfterMs?: number;

  constructor(status: number, retryAfterMs?: number) {
    super(`Confluence respondió ${status}`);
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

interface CommentPage {
  results: {
    id: string | number;
    body?: { storage?: { value?: string } };
    version?: { createdAt?: string; when?: string };
  }[];
  _links?: { next?: string };
}

const MAX_BODY = 512_000;
const MAX_JSON_BYTES = 1_000_000;

// Comment body: PREFIX + base64(LZ4(JSON)). Base64 has no HTML-special characters.
function encodeBody(envelope: Envelope): string {
  return `<p>${PREFIX}${toBase64(compressText(JSON.stringify(envelope)))}</p>`;
}

function decodeBody(value: string | undefined): Envelope | null {
  if (!value || value.length > MAX_BODY) return null;
  const text = new DOMParser().parseFromString(value, 'text/html').body.textContent?.trim() ?? '';
  if (!text.startsWith(PREFIX)) return null;
  try {
    return parseEnvelope(JSON.parse(decompressText(fromBase64(text.slice(PREFIX.length)), MAX_JSON_BYTES)));
  } catch {
    return null;
  }
}

export type Urgency = boolean | (() => boolean);

export class ConfluenceClient {
  readonly #base: string;
  readonly #pageId: string;
  readonly #auth: string;
  readonly #limiter: RateLimiter;

  constructor(c: ConfluenceCredentials) {
    this.#base = c.baseUrl.replace(/\/+$/, '');
    this.#pageId = c.pageId;
    this.#auth = `Bearer ${c.token}`;
    this.#limiter = new RateLimiter({
      minGapMs: config.fastPollMs,
      normalGapMs: config.idlePollMs,
      dailyFastBudget: config.dailyFastRequestBudget,
      storageKey: `statim.fastBudget.${c.email.toLowerCase()}`,
    });
  }

  get remainingFastBudget(): number {
    return this.#limiter.remainingFastBudget;
  }

  /** Call when the urgency of queued requests may have changed. */
  reschedule(): void {
    this.#limiter.pump();
  }

  close(): void {
    this.#limiter.close();
  }

  #request<T>(path: string, init: RequestInit, urgent: Urgency): Promise<T> {
    return this.#limiter.schedule(async () => {
      trace('confluence.request', { path, method: init.method ?? 'GET' });
      const headers: Record<string, string> = { Authorization: this.#auth, Accept: 'application/json' };
      if (init.body) headers['Content-Type'] = 'application/json';
      try {
        const res = await fetch(this.#base + path, { ...init, headers, credentials: 'omit' });
        if (!res.ok) {
          const retryAfter = Number(res.headers.get('Retry-After'));
          const retryAfterMs = retryAfter > 0 ? retryAfter * 1000 : undefined;
          if (retryAfterMs) this.#limiter.penalize(retryAfterMs);
          trace('confluence.response_error', { path, status: res.status });
          throw new ConfluenceError(res.status, retryAfterMs);
        }
        trace('confluence.response_ok', { path, status: res.status });
        return (res.status === 204 ? undefined : await res.json()) as T;
      } catch (err) {
        if (!(err instanceof ConfluenceError)) {
          trace('confluence.network_error', { path, error: err });
        }
        throw err;
      }
    }, urgent);
  }

  async post(envelope: Envelope, urgent: Urgency = false): Promise<string> {
    const value = encodeBody(envelope);
    const res = await this.#request<{ id: string | number }>(
      '/rest/api/content',
      {
        method: 'POST',
        body: JSON.stringify({
          type: 'comment',
          container: {
            id: this.#pageId,
            type: 'page',
          },
          body: {
            storage: {
              value,
              representation: 'storage',
            },
          },
        }),
      },
      urgent,
    );
    return String(res.id);
  }

  async remove(commentId: string): Promise<void> {
    await this.#request(`/rest/api/content/${encodeURIComponent(commentId)}`, { method: 'DELETE' }, false);
  }

  /** Newest first, stops at the first comment created before `sinceMs`. */
  async listSince(sinceMs: number, urgent: Urgency = false): Promise<FeedEntry[]> {
    const out: FeedEntry[] = [];
    let path = `/rest/api/content/${encodeURIComponent(this.#pageId)}/child/comment?expand=body.storage,version&limit=100`;

    while (path) {
      const page = await this.#request<CommentPage>(path, {}, urgent);
      for (const c of page.results) {
        const createdAt = Date.parse(c.version?.when ?? c.version?.createdAt ?? '');
        if (!(createdAt >= sinceMs)) return out;
        const envelope = decodeBody(c.body?.storage?.value);
        if (envelope) out.push({ commentId: String(c.id), createdAt, envelope });
      }
      const next = page._links?.next ?? '';
      if (!next) {
        path = '';
      } else if (next.startsWith('http://') || next.startsWith('https://')) {
        const u = new URL(next);
        path = u.pathname + u.search;
      } else if (next.startsWith('/api/')) {
        path = `/rest${next}`;
      } else {
        path = next;
      }
      if (this.#base.endsWith('/wiki') && path.startsWith('/wiki/')) {
        path = path.slice(5);
      }
    }
    return out;
  }
}
