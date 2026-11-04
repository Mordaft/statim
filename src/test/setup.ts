import 'fake-indexeddb/auto';
import { afterEach, beforeEach, vi } from 'vitest';
import { db } from '../core/db.ts';

beforeEach(async () => {
  localStorage.clear();
  await Promise.all(db.tables.map((t) => t.clear()));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
