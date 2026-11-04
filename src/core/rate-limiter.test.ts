import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RateLimiter } from './rate-limiter.ts';

const KEY = 'test.budget';
const opts = { minGapMs: 10_000, normalGapMs: 60_000, dailyFastBudget: 100, storageKey: KEY };

function track(limiter: RateLimiter, urgent: boolean | (() => boolean) = false) {
  const state = { ranAt: -1 };
  const promise = limiter.schedule(async () => {
    state.ranAt = Date.now();
  }, urgent);
  return { state, promise };
}

describe('RateLimiter', () => {
  let t0: number;

  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-11-04T10:00:00Z') });
    t0 = Date.now();
  });

  it('runs the first request immediately', async () => {
    const l = new RateLimiter(opts);
    const a = track(l);
    await vi.advanceTimersByTimeAsync(0);
    expect(a.state.ranAt).toBe(t0);
  });

  it('spaces normal requests by 60 s without consuming budget', async () => {
    const l = new RateLimiter(opts);
    track(l);
    const b = track(l);
    await vi.advanceTimersByTimeAsync(59_999);
    expect(b.state.ranAt).toBe(-1);
    await vi.advanceTimersByTimeAsync(1);
    expect(b.state.ranAt).toBe(t0 + 60_000);
    expect(l.remainingFastBudget).toBe(100);
  });

  it('never goes below 10 s, even for urgent requests', async () => {
    const l = new RateLimiter(opts);
    track(l, true);
    const b = track(l, true);
    await vi.advanceTimersByTimeAsync(9_999);
    expect(b.state.ranAt).toBe(-1);
    await vi.advanceTimersByTimeAsync(1);
    expect(b.state.ranAt).toBe(t0 + 10_000);
    expect(l.remainingFastBudget).toBe(99);
  });

  it('caps fast requests at 100 per day and then falls back to 60 s', async () => {
    const l = new RateLimiter(opts);
    for (let i = 0; i < 102; i++) track(l, true);
    await vi.advanceTimersByTimeAsync(100 * 10_000);
    expect(l.remainingFastBudget).toBe(0);

    const before = Date.now();
    await vi.advanceTimersByTimeAsync(59_999);
    expect(l.remainingFastBudget).toBe(0);
    const last = track(l, true);
    await vi.advanceTimersByTimeAsync(120_000);
    expect(last.state.ranAt).toBeGreaterThanOrEqual(before + 60_000);
  });

  it('persists the budget and resets it on a new day', () => {
    localStorage.setItem(KEY, JSON.stringify({ day: '2026-11-04', used: 40 }));
    expect(new RateLimiter(opts).remainingFastBudget).toBe(60);
    localStorage.setItem(KEY, JSON.stringify({ day: '2026-11-03', used: 100 }));
    expect(new RateLimiter(opts).remainingFastBudget).toBe(100);
  });

  it('lets urgent requests jump ahead of queued normal ones', async () => {
    const l = new RateLimiter(opts);
    track(l);
    const normal = track(l);
    const urgent = track(l, true);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(urgent.state.ranAt).toBe(t0 + 10_000);
    expect(normal.state.ranAt).toBe(-1);
  });

  it('re-evaluates dynamic urgency on pump()', async () => {
    const l = new RateLimiter(opts);
    let urgent = false;
    track(l);
    const b = track(l, () => urgent);
    await vi.advanceTimersByTimeAsync(5_000);
    urgent = true;
    l.pump();
    await vi.advanceTimersByTimeAsync(5_000);
    expect(b.state.ranAt).toBe(t0 + 10_000);
  });

  it('honours penalize() (Retry-After)', async () => {
    const l = new RateLimiter(opts);
    l.penalize(30_000);
    const a = track(l, true);
    await vi.advanceTimersByTimeAsync(29_999);
    expect(a.state.ranAt).toBe(-1);
    await vi.advanceTimersByTimeAsync(1);
    expect(a.state.ranAt).toBe(t0 + 30_000);
  });

  it('rejects queued and new jobs after close()', async () => {
    const l = new RateLimiter(opts);
    track(l);
    const pending = track(l).promise;
    l.close();
    await expect(pending).rejects.toThrow(/cerrado/);
    await expect(l.schedule(async () => 1)).rejects.toThrow(/cerrado/);
  });

  it('propagates job errors without blocking the queue', async () => {
    const l = new RateLimiter(opts);
    const failing = l.schedule(async () => {
      throw new Error('boom');
    }, true);
    const next = track(l, true);
    await expect(failing).rejects.toThrow('boom');
    await vi.advanceTimersByTimeAsync(10_000);
    expect(next.state.ranAt).toBe(t0 + 10_000);
  });
});
