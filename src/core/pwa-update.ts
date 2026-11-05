export interface PwaUpdateOptions {
  /** URL of the service worker script. Defaults to './sw.js'. */
  swUrl?: string;
  /** Interval in ms to poll for service worker updates. Defaults to 60 minutes. */
  checkIntervalMs?: number;
  /** Callback fired when an update is ready to be applied. */
  onUpdateAvailable?: (applyUpdate: () => void) => void;
  /** Custom ServiceWorkerContainer for testing or SSR environments. Defaults to navigator.serviceWorker. */
  serviceWorker?: ServiceWorkerContainer;
}

export interface PwaUpdateController {
  /** Manually trigger an update check. */
  checkNow: () => Promise<void>;
  /** Apply the waiting update: messages SW to skip waiting and reloads page on controllerchange. */
  applyUpdate: () => void;
  /** Returns whether an update has been detected and is waiting. */
  isUpdateAvailable: () => boolean;
  /** Clean up timers and event listeners. */
  destroy: () => void;
}

export function registerPwaUpdate(options: PwaUpdateOptions = {}): PwaUpdateController {
  const {
    swUrl = './sw.js',
    checkIntervalMs = 60 * 60 * 1000,
    onUpdateAvailable,
    serviceWorker = typeof navigator !== 'undefined' ? navigator.serviceWorker : undefined,
  } = options;

  let destroyed = false;
  let updateAvailable = false;
  let waitingWorker: ServiceWorker | null = null;
  let registration: ServiceWorkerRegistration | null = null;
  let refreshing = false;

  const onControllerChange = () => {
    if (refreshing) return;
    refreshing = true;
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const applyUpdate = () => {
    if (!serviceWorker) {
      if (typeof window !== 'undefined') window.location.reload();
      return;
    }

    serviceWorker.addEventListener('controllerchange', onControllerChange);

    const target = waitingWorker || registration?.waiting;
    if (target) {
      target.postMessage({ type: 'SKIP_WAITING' });
      // Safety fallback in case controllerchange does not fire
      if (typeof setTimeout !== 'undefined') {
        setTimeout(onControllerChange, 3000);
      }
    } else {
      onControllerChange();
    }
  };

  const notifyUpdate = (worker: ServiceWorker) => {
    if (destroyed || updateAvailable) return;
    updateAvailable = true;
    waitingWorker = worker;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('statim:update-available', { detail: applyUpdate }));
    }
    onUpdateAvailable?.(applyUpdate);
  };

  const trackInstallingWorker = (worker: ServiceWorker) => {
    const onStateChange = () => {
      if (worker.state === 'installed') {
        // If there is already an active controller or registered active worker, this installed worker is an update
        if (serviceWorker?.controller || registration?.active) {
          notifyUpdate(worker);
        }
      }
    };
    worker.addEventListener('statechange', onStateChange);
  };

  const checkNow = async () => {
    if (destroyed || !registration) return;
    try {
      await registration.update();
    } catch {
      // Silently ignore network failures or offline state
    }
  };

  if (!serviceWorker) {
    return {
      checkNow: async () => {},
      applyUpdate,
      isUpdateAvailable: () => false,
      destroy: () => {},
    };
  }

  // Register service worker
  serviceWorker
    .register(swUrl, { updateViaCache: 'none' })
    .then((reg) => {
      if (destroyed) return;
      registration = reg;

      // 1. If an update is already waiting:
      if (reg.waiting && (serviceWorker.controller || reg.active)) {
        notifyUpdate(reg.waiting);
      }

      // 2. If a worker is currently installing:
      if (reg.installing) {
        trackInstallingWorker(reg.installing);
      }

      // 3. Listen for future updates:
      reg.addEventListener('updatefound', () => {
        if (reg.installing) {
          trackInstallingWorker(reg.installing);
        }
      });
    })
    .catch(() => {
      // Silently catch registration errors
    });

  // Event-driven update checks
  const onVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      void checkNow();
    }
  };
  const onFocus = () => {
    void checkNow();
  };
  const onOnline = () => {
    void checkNow();
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibilityChange);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onOnline);
  }

  let intervalId: ReturnType<typeof setInterval> | undefined;
  if (checkIntervalMs > 0 && typeof setInterval !== 'undefined') {
    intervalId = setInterval(() => {
      void checkNow();
    }, checkIntervalMs);
  }

  const destroy = () => {
    destroyed = true;
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onOnline);
    }
    if (serviceWorker) {
      serviceWorker.removeEventListener('controllerchange', onControllerChange);
    }
  };

  return {
    checkNow,
    applyUpdate,
    isUpdateAvailable: () => updateAvailable,
    destroy,
  };
}

