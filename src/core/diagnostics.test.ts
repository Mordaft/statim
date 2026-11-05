import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  trace,
  getTraceEntries,
  getDiagnostics,
  getDiagnosticsEvents,
  clearDiagnostics,
  exportLogs,
  installDiagnosticsGlobal,
} from './diagnostics.ts';

describe('Diagnostics logging system', () => {
  beforeEach(() => {
    clearDiagnostics();
    sessionStorage.clear();
  });

  it('records trace entries and diagnostic events', () => {
    trace('test.event', { foo: 'bar' });
    const traces = getTraceEntries();
    expect(traces).toHaveLength(1);
    expect(traces[0].step).toBe('test.event');
    expect(traces[0].detail).toEqual({ foo: 'bar' });
    expect(typeof traces[0].elapsedMs).toBe('number');

    const events = getDiagnosticsEvents();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('test.event');
    expect(events[0].details).toEqual({ foo: 'bar' });
    expect(typeof events[0].at).toBe('string');
  });

  it('sanitizes sensitive tokens, passwords, and payload keys', () => {
    trace('auth.attempt', {
      email: 'user@test.com',
      token: 'secret-token',
      meteredApiKey: 'sensitive-api-key',
      proxyPassword: 'mypassword',
      content: 'private chat message',
      body: 'request body',
      seed: 'seed123',
      safeParam: 'public-data',
    });

    const events = getDiagnosticsEvents();
    expect(events).toHaveLength(1);
    const details = events[0].details!;
    expect(details.email).toBe('user@test.com');
    expect(details.safeParam).toBe('public-data');
    expect(details.token).toBeUndefined();
    expect(details.meteredApiKey).toBeUndefined();
    expect(details.proxyPassword).toBeUndefined();
    expect(details.content).toBeUndefined();
    expect(details.body).toBeUndefined();
    expect(details.seed).toBeUndefined();
  });

  it('serializes Error instances in details', () => {
    const err = new Error('Connection failed');
    trace('net.error', { error: err });

    const traces = getTraceEntries();
    expect(traces[0].detail?.error).toEqual(
      expect.objectContaining({
        name: 'Error',
        message: 'Connection failed',
      })
    );
  });

  it('limits stored events to maximum capacity', () => {
    for (let i = 0; i < 160; i++) {
      trace(`step.${i}`, { index: i });
    }
    const traces = getTraceEntries();
    expect(traces.length).toBe(150);
    expect(traces[0].step).toBe('step.10');
    expect(traces[149].step).toBe('step.159');
  });

  it('persists and retrieves from sessionStorage', () => {
    trace('storage.test', { val: 42 });
    const raw = getDiagnostics();
    expect(raw).toContain('storage.test');
    expect(JSON.parse(raw)).toHaveLength(1);

    clearDiagnostics();
    expect(getDiagnostics()).toBe('[]');
    expect(getTraceEntries()).toHaveLength(0);
  });

  it('exports formatted logs', () => {
    expect(exportLogs()).toBe('No hay registros guardados.');

    trace('first.step', { meta: 'ok' });
    const formatted = exportLogs();
    expect(formatted).toContain('first.step');
    expect(formatted).toContain('meta');
  });

  it('installs global window hook', () => {
    installDiagnosticsGlobal();
    const globalDiag = (window as unknown as Record<string, unknown>).__STATIM_DIAGNOSTICS__;
    expect(globalDiag).toBeDefined();
    expect(typeof (globalDiag as Record<string, unknown>).getDiagnostics).toBe('function');
    expect(typeof (globalDiag as Record<string, unknown>).trace).toBe('function');
  });

  it('dispatches window events when trace occurs', () => {
    const onTrace = vi.fn();
    window.addEventListener('statim-trace', onTrace);
    trace('event.dispatched', { a: 1 });
    expect(onTrace).toHaveBeenCalledTimes(1);
    window.removeEventListener('statim-trace', onTrace);
  });
});

