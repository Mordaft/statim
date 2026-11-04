interface Job {
  run: () => Promise<unknown>;
  urgent: () => boolean;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

interface BudgetState {
  day: string;
  used: number;
}

export interface RateLimiterOptions {
  /** Absolute minimum gap between requests, allowed only for urgent jobs while budget remains. */
  minGapMs: number;
  /** Gap at or above which a request does not consume budget. */
  normalGapMs: number;
  /** Max requests per day issued faster than `normalGapMs`. */
  dailyFastBudget: number;
  storageKey: string;
}

/** Serializes all requests and enforces the minimum spacing and the daily fast-request budget. */
export class RateLimiter {
  readonly #opts: RateLimiterOptions;
  readonly #queue: Job[] = [];
  #last = 0;
  #blockedUntil = 0;
  #busy = false;
  #closed = false;
  #timer?: number;

  constructor(opts: RateLimiterOptions) {
    this.#opts = opts;
  }

  schedule<T>(run: () => Promise<T>, urgent: boolean | (() => boolean) = false): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.#closed) {
        reject(new Error('RateLimiter cerrado'));
        return;
      }
      const job: Job = {
        run,
        urgent: typeof urgent === 'function' ? urgent : () => urgent,
        resolve: resolve as (v: unknown) => void,
        reject,
      };
      const firstNormal = this.#queue.findIndex((j) => !j.urgent());
      if (job.urgent() && firstNormal >= 0) this.#queue.splice(firstNormal, 0, job);
      else this.#queue.push(job);
      this.pump();
    });
  }

  /** Delays every request until `ms` from now (e.g. Retry-After). */
  penalize(ms: number): void {
    this.#blockedUntil = Math.max(this.#blockedUntil, Date.now() + ms);
  }

  close(): void {
    this.#closed = true;
    clearTimeout(this.#timer);
    for (const job of this.#queue.splice(0)) job.reject(new Error('RateLimiter cerrado'));
  }

  get remainingFastBudget(): number {
    return Math.max(0, this.#opts.dailyFastBudget - this.#readBudget().used);
  }

  /** Re-evaluates timing, e.g. after a job became urgent. */
  pump(): void {
    if (this.#closed || this.#busy || !this.#queue.length) return;
    clearTimeout(this.#timer);

    // Urgent jobs may have been queued behind normal ones whose urgency changed.
    const urgentIdx = this.#queue.findIndex((j) => j.urgent());
    if (urgentIdx > 0) this.#queue.unshift(...this.#queue.splice(urgentIdx, 1));

    const job = this.#queue[0];
    const fast = job.urgent() && this.remainingFastBudget > 0;
    const gap = fast ? this.#opts.minGapMs : this.#opts.normalGapMs;
    const now = Date.now();
    const wait = Math.max(this.#last + gap, this.#blockedUntil) - now;
    if (wait > 0) {
      this.#timer = setTimeout(() => this.pump(), wait);
      return;
    }

    this.#queue.shift();
    if (this.#last && now - this.#last < this.#opts.normalGapMs) this.#consumeBudget();
    this.#last = now;
    this.#busy = true;
    job
      .run()
      .then(job.resolve, job.reject)
      .finally(() => {
        this.#busy = false;
        this.pump();
      });
  }

  #today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  #readBudget(): BudgetState {
    try {
      const state = JSON.parse(localStorage.getItem(this.#opts.storageKey) ?? '') as BudgetState;
      if (state.day === this.#today() && Number.isFinite(state.used)) return state;
    } catch {
      // Missing or corrupt: start a fresh day.
    }
    return { day: this.#today(), used: 0 };
  }

  #consumeBudget(): void {
    const state = this.#readBudget();
    state.used++;
    localStorage.setItem(this.#opts.storageKey, JSON.stringify(state));
  }
}
