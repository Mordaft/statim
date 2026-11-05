import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerPwaUpdate, type PwaUpdateController } from './pwa-update.ts';

type MockWorker = {
  state: 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';
  postMessage: ReturnType<typeof vi.fn>;
  addEventListener: (event: string, handler: EventListener) => void;
  removeEventListener: (event: string, handler: EventListener) => void;
  dispatchEvent: (event: Event) => boolean;
};

function createMockWorker(initialState: MockWorker['state'] = 'installing'): MockWorker {
  const target = new EventTarget();
  return {
    state: initialState,
    postMessage: vi.fn(),
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
  };
}

type MockRegistration = {
  active: MockWorker | null;
  waiting: MockWorker | null;
  installing: MockWorker | null;
  update: ReturnType<typeof vi.fn>;
  addEventListener: (event: string, handler: EventListener) => void;
  removeEventListener: (event: string, handler: EventListener) => void;
  dispatchEvent: (event: Event) => boolean;
};

function createMockRegistration(): MockRegistration {
  const target = new EventTarget();
  return {
    active: createMockWorker('activated'),
    waiting: null,
    installing: null,
    update: vi.fn().mockResolvedValue(undefined),
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
  };
}

describe('pwa-update', () => {
  let controller: PwaUpdateController | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    controller?.destroy();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('handles environment without serviceWorker support gracefully', () => {
    controller = registerPwaUpdate({ serviceWorker: undefined });
    expect(controller.isUpdateAvailable()).toBe(false);
  });

  it('detects an update already waiting upon registration', async () => {
    const swContainerTarget = new EventTarget();
    const reg = createMockRegistration();
    reg.waiting = createMockWorker('installed');

    const swContainer = {
      controller: createMockWorker('activated'),
      register: vi.fn().mockResolvedValue(reg),
      addEventListener: swContainerTarget.addEventListener.bind(swContainerTarget),
      removeEventListener: swContainerTarget.removeEventListener.bind(swContainerTarget),
      dispatchEvent: swContainerTarget.dispatchEvent.bind(swContainerTarget),
    } as unknown as ServiceWorkerContainer;

    const onUpdateAvailable = vi.fn();
    const onWindowEvent = vi.fn();
    window.addEventListener('statim:update-available', onWindowEvent);

    controller = registerPwaUpdate({
      serviceWorker: swContainer,
      onUpdateAvailable,
    });

    await vi.waitFor(() => expect(onUpdateAvailable).toHaveBeenCalledTimes(1));
    expect(controller.isUpdateAvailable()).toBe(true);
    expect(onWindowEvent).toHaveBeenCalledTimes(1);

    window.removeEventListener('statim:update-available', onWindowEvent);
  });

  it('detects when an installing worker finishes installing (update waiting)', async () => {
    const swContainerTarget = new EventTarget();
    const reg = createMockRegistration();
    const newWorker = createMockWorker('installing');
    reg.installing = newWorker;

    const swContainer = {
      controller: createMockWorker('activated'),
      register: vi.fn().mockResolvedValue(reg),
      addEventListener: swContainerTarget.addEventListener.bind(swContainerTarget),
      removeEventListener: swContainerTarget.removeEventListener.bind(swContainerTarget),
      dispatchEvent: swContainerTarget.dispatchEvent.bind(swContainerTarget),
    } as unknown as ServiceWorkerContainer;

    const onUpdateAvailable = vi.fn();
    controller = registerPwaUpdate({
      serviceWorker: swContainer,
      onUpdateAvailable,
    });

    await vi.waitFor(() => expect(swContainer.register).toHaveBeenCalled());
    expect(controller.isUpdateAvailable()).toBe(false);

    // Transition installing worker to installed
    newWorker.state = 'installed';
    newWorker.dispatchEvent(new Event('statechange'));

    expect(onUpdateAvailable).toHaveBeenCalledTimes(1);
    expect(controller.isUpdateAvailable()).toBe(true);
  });

  it('detects future updates via updatefound event', async () => {
    const swContainerTarget = new EventTarget();
    const reg = createMockRegistration();

    const swContainer = {
      controller: createMockWorker('activated'),
      register: vi.fn().mockResolvedValue(reg),
      addEventListener: swContainerTarget.addEventListener.bind(swContainerTarget),
      removeEventListener: swContainerTarget.removeEventListener.bind(swContainerTarget),
      dispatchEvent: swContainerTarget.dispatchEvent.bind(swContainerTarget),
    } as unknown as ServiceWorkerContainer;

    const onUpdateAvailable = vi.fn();
    controller = registerPwaUpdate({
      serviceWorker: swContainer,
      onUpdateAvailable,
    });

    await vi.waitFor(() => expect(swContainer.register).toHaveBeenCalled());

    // Update found later
    const newWorker = createMockWorker('installing');
    reg.installing = newWorker;
    reg.dispatchEvent(new Event('updatefound'));

    expect(controller.isUpdateAvailable()).toBe(false);

    newWorker.state = 'installed';
    newWorker.dispatchEvent(new Event('statechange'));

    expect(onUpdateAvailable).toHaveBeenCalledTimes(1);
    expect(controller.isUpdateAvailable()).toBe(true);
  });

  it('applies update by posting SKIP_WAITING to waiting worker and reloads on controllerchange', async () => {
    const swContainerTarget = new EventTarget();
    const reg = createMockRegistration();
    const waitingWorker = createMockWorker('installed');
    reg.waiting = waitingWorker;

    const swContainer = {
      controller: createMockWorker('activated'),
      register: vi.fn().mockResolvedValue(reg),
      addEventListener: swContainerTarget.addEventListener.bind(swContainerTarget),
      removeEventListener: swContainerTarget.removeEventListener.bind(swContainerTarget),
      dispatchEvent: swContainerTarget.dispatchEvent.bind(swContainerTarget),
    } as unknown as ServiceWorkerContainer;

    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    });

    let applyFn: (() => void) | undefined;
    controller = registerPwaUpdate({
      serviceWorker: swContainer,
      onUpdateAvailable: (apply) => {
        applyFn = apply;
      },
    });

    await vi.waitFor(() => expect(applyFn).toBeDefined());

    applyFn!();
    expect(waitingWorker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });

    // Emulate controllerchange event
    swContainer.dispatchEvent(new Event('controllerchange'));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('checks for updates on visibility change, focus, online and periodic interval', async () => {
    const swContainerTarget = new EventTarget();
    const reg = createMockRegistration();

    const swContainer = {
      controller: createMockWorker('activated'),
      register: vi.fn().mockResolvedValue(reg),
      addEventListener: swContainerTarget.addEventListener.bind(swContainerTarget),
      removeEventListener: swContainerTarget.removeEventListener.bind(swContainerTarget),
      dispatchEvent: swContainerTarget.dispatchEvent.bind(swContainerTarget),
    } as unknown as ServiceWorkerContainer;

    controller = registerPwaUpdate({
      serviceWorker: swContainer,
      checkIntervalMs: 60_000,
    });

    await vi.waitFor(() => expect(swContainer.register).toHaveBeenCalled());

    // 1. Window focus
    window.dispatchEvent(new Event('focus'));
    expect(reg.update).toHaveBeenCalledTimes(1);

    // 2. Window online
    window.dispatchEvent(new Event('online'));
    expect(reg.update).toHaveBeenCalledTimes(2);

    // 3. Document visibility change (visible)
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reg.update).toHaveBeenCalledTimes(3);

    // 4. Timer interval
    vi.advanceTimersByTime(60_000);
    expect(reg.update).toHaveBeenCalledTimes(4);

    // 5. Cleanup stops updates
    controller.destroy();
    window.dispatchEvent(new Event('focus'));
    expect(reg.update).toHaveBeenCalledTimes(4);
  });
});

