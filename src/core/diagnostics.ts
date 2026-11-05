export interface DiagnosticEvent {
  at: string;
  event: string;
  details?: Record<string, unknown>;
}

export interface TraceEntry {
  step: string;
  elapsedMs: number;
  detail?: Record<string, unknown>;
}

export interface DiagnosticsApi {
  trace: (event: string, details?: Record<string, unknown>) => void;
  getTraceEntries: () => TraceEntry[];
  getDiagnostics: () => string;
  getDiagnosticsEvents: () => DiagnosticEvent[];
  clearDiagnostics: () => void;
  exportLogs: () => string;
}

const STORAGE_KEY = 'statim-diagnostics';
const MAX_EVENTS = 150;
const startEpoch = Date.now();
const inMemoryTraces: TraceEntry[] = [];
const inMemoryEvents: DiagnosticEvent[] = [];

function serializeValue(val: unknown): unknown {
  if (val instanceof Error) {
    return {
      name: val.name,
      message: val.message,
      stack: val.stack,
    };
  }
  return val;
}

function safeDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined;
  return Object.fromEntries(
    Object.entries(details)
      .filter(([key]) => !/token|authorization|apikey|api_key|meteredApiKey|password|secret|seed|^content$|^patch$|^body$/i.test(key))
      .map(([key, val]) => [key, serializeValue(val)])
  );
}

export function trace(event: string, details?: Record<string, unknown>): void {
  const cleaned = safeDetails(details);
  const entry: DiagnosticEvent = { at: new Date().toISOString(), event, details: cleaned };

  inMemoryEvents.push(entry);
  if (inMemoryEvents.length > MAX_EVENTS) {
    inMemoryEvents.shift();
  }

  inMemoryTraces.push({
    step: event,
    elapsedMs: Date.now() - startEpoch,
    detail: cleaned,
  });
  if (inMemoryTraces.length > MAX_EVENTS) {
    inMemoryTraces.shift();
  }

  if (/error|fail/i.test(event) || (cleaned && 'error' in cleaned)) {
    console.error(`[Statim] ${entry.event}`, entry.details ?? '');
  } else if (/warn/i.test(event)) {
    console.warn(`[Statim] ${entry.event}`, entry.details ?? '');
  } else {
    console.info(`[Statim] ${entry.event}`, entry.details ?? '');
  }

  try {
    if (typeof sessionStorage !== 'undefined') {
      const previous = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') as DiagnosticEvent[];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...previous, entry].slice(-MAX_EVENTS)));
    }
  } catch {
    // Diagnostics must never interrupt application execution
  }

  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('statim-trace', { detail: entry }));
    }
  } catch {
    // Ignore
  }
}

export function getTraceEntries(): TraceEntry[] {
  return [...inMemoryTraces];
}

export function getDiagnosticsEvents(): DiagnosticEvent[] {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as DiagnosticEvent[];
      }
    }
  } catch {
    // Fall back to in-memory
  }
  return [...inMemoryEvents];
}

export function getDiagnostics(): string {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    }
  } catch {
    // Fall back to in-memory
  }
  return JSON.stringify(inMemoryEvents);
}

export function clearDiagnostics(): void {
  inMemoryTraces.length = 0;
  inMemoryEvents.length = 0;
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('statim-trace-cleared'));
    }
  } catch {
    // Ignore
  }
}

export function exportLogs(): string {
  const events = getDiagnosticsEvents();
  if (events.length === 0) {
    return 'No hay registros guardados.';
  }
  return events
    .map((e) => {
      const detailStr = e.details && Object.keys(e.details).length > 0 ? ` ${JSON.stringify(e.details)}` : '';
      return `[${e.at}] ${e.event}${detailStr}`;
    })
    .join('\n');
}

export function installDiagnosticsGlobal(): void {
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__STATIM_DIAGNOSTICS__ = {
      trace,
      getTraceEntries,
      getDiagnostics,
      getDiagnosticsEvents,
      clearDiagnostics,
      exportLogs,
    };
  }
}

