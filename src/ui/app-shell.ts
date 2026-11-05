import { ConfluenceError, type ConfluenceCredentials } from '../core/confluence-client.ts';
import { trace } from '../core/diagnostics.ts';
import type { MessageBatch } from '../core/mesh.ts';
import { fetchMeteredIceServers } from '../core/metered.ts';
import { clearToken, isComplete, loadCredentials, saveCredentials, Session } from '../core/session.ts';
import type { ChatRoom } from './chat-room.ts';
import './chat-room.ts';
import type { LoginDetails, LoginView } from './login-view.ts';
import './login-view.ts';
import type { PeerList } from './peer-list.ts';
import './peer-list.ts';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-rows: auto auto 1fr;
      height: 100%;
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    }
    header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-height: var(--header-h);
      padding: 0 0.5rem 0 1rem;
      background: var(--accent);
      color: var(--accent-text);
    }
    h1 {
      margin: 0;
      font-size: 1.125rem;
    }
    .status {
      flex: 1;
      font-size: 0.8125rem;
      opacity: 0.9;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    header button {
      font: inherit;
      font-size: 0.875rem;
      min-height: 2.5rem;
      padding: 0 0.75rem;
      border: 1px solid rgb(255 255 255 / 0.4);
      border-radius: var(--radius);
      background: transparent;
      color: inherit;
    }
    .update-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      color: var(--text);
      font-size: 0.8125rem;
    }
    .update-msg {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .update-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    .update-apply {
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      min-height: 2rem;
      padding: 0 0.75rem;
      border: none;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
    }
    .update-apply:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .update-dismiss {
      font: inherit;
      font-size: 0.875rem;
      min-height: 2rem;
      min-width: 2rem;
      padding: 0;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
    }
    .update-indicator {
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      min-height: 2.25rem;
      padding: 0 0.75rem;
      border: 1px solid rgb(255 255 255 / 0.5);
      border-radius: var(--radius);
      background: rgb(255 255 255 / 0.15);
      color: inherit;
      cursor: pointer;
    }
    .update-indicator:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    main {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      overflow: hidden;
    }
    aside {
      position: absolute;
      inset: 0 0 0 auto;
      width: min(85vw, 20rem);
      border-left: 1px solid var(--border);
      box-shadow: -8px 0 24px rgb(0 0 0 / 0.2);
    }
    [hidden] {
      display: none !important;
    }
    @media (min-width: 900px) {
      :host {
        max-width: 1200px;
        margin: 0 auto;
        border-inline: 1px solid var(--border);
      }
      :host(.in-session) main {
        grid-template-columns: 1fr 20rem;
      }
      :host(.in-session) aside {
        display: block !important;
        position: static;
        width: auto;
        box-shadow: none;
      }
      :host(.in-session) .peers {
        display: none !important;
      }
    }
  </style>
  <header>
    <h1>Statim</h1>
    <span class="status" role="status"></span>
    <button class="update-indicator" type="button" hidden title="Actualización disponible">Actualizar</button>
    <button class="peers" type="button" hidden aria-expanded="false">Equipo</button>
    <button class="logout" type="button" hidden>Salir</button>
  </header>
  <div class="update-banner" role="status" hidden>
    <span class="update-msg">Nueva versión de Statim disponible.</span>
    <div class="update-actions">
      <button class="update-apply" type="button">Actualizar</button>
      <button class="update-dismiss" type="button" aria-label="Cerrar aviso de actualización">✕</button>
    </div>
  </div>
  <main>
    <login-view hidden></login-view>
    <chat-room hidden></chat-room>
    <aside hidden><peer-list></peer-list></aside>
  </main>
`;

function describeError(e: unknown): string {
  if (e instanceof Error && e.message.includes('Metered')) return e.message;
  if (e instanceof ConfluenceError) {
    if (e.status === 401 || e.status === 403) return 'Credenciales o permisos no válidos en Confluence.';
    if (e.status === 404) return 'No se encuentra la página de Confluence.';
    if (e.status === 429) return 'Confluence está limitando las peticiones.';
    return e.message;
  }
  if (e instanceof TypeError) return 'No se pudo contactar con Confluence (revisa red, CORS o proxy).';
  return 'Error inesperado.';
}

export class StatimApp extends HTMLElement {
  #status: HTMLElement;
  #peersButton: HTMLButtonElement;
  #logoutButton: HTMLButtonElement;
  #login: LoginView;
  #chat: ChatRoom;
  #aside: HTMLElement;
  #peerList: PeerList;
  #updateBanner: HTMLElement;
  #updateApply: HTMLButtonElement;
  #updateDismiss: HTMLButtonElement;
  #updateIndicator: HTMLButtonElement;
  #applyUpdateFn?: () => void;
  #session?: Session;
  #connected = 0;
  #lastError = '';

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#status = root.querySelector('.status')!;
    this.#peersButton = root.querySelector('.peers')!;
    this.#logoutButton = root.querySelector('.logout')!;
    this.#login = root.querySelector('login-view')!;
    this.#chat = root.querySelector('chat-room')!;
    this.#aside = root.querySelector('aside')!;
    this.#peerList = root.querySelector('peer-list')!;
    this.#updateBanner = root.querySelector('.update-banner')!;
    this.#updateApply = root.querySelector('.update-apply')!;
    this.#updateDismiss = root.querySelector('.update-dismiss')!;
    this.#updateIndicator = root.querySelector('.update-indicator')!;

    this.#login.addEventListener('login', (e) => void this.#onLogin((e as CustomEvent<LoginDetails>).detail));
    this.#logoutButton.addEventListener('click', () => void this.#logout(''));
    this.#peersButton.addEventListener('click', () => this.#togglePeers());
    this.#updateApply.addEventListener('click', () => this.#onApplyUpdate());
    this.#updateIndicator.addEventListener('click', () => this.#onApplyUpdate());
    this.#updateDismiss.addEventListener('click', () => this.#onDismissUpdate());
    this.#peerList.addEventListener('count', (e) => {
      this.#connected = (e as CustomEvent<number>).detail;
      this.#renderStatus();
    });
  }

  async connectedCallback() {
    window.addEventListener('online', this.#renderStatus);
    window.addEventListener('offline', this.#renderStatus);
    window.addEventListener('statim:update-available', this.#onUpdateAvailable);
    this.#renderStatus();

    const credentials = await loadCredentials();
    if (!isComplete(credentials)) {
      this.#showLogin(credentials, '');
      return;
    }
    try {
      await this.#startSession(credentials);
    } catch (e) {
      this.#showLogin(credentials, describeError(e));
    }
  }

  disconnectedCallback() {
    window.removeEventListener('online', this.#renderStatus);
    window.removeEventListener('offline', this.#renderStatus);
    window.removeEventListener('statim:update-available', this.#onUpdateAvailable);
    this.#session?.stop();
  }

  showUpdateNotification(applyUpdate: () => void): void {
    this.#applyUpdateFn = applyUpdate;
    this.#updateBanner.hidden = false;
    this.#updateIndicator.hidden = true;
  }

  #onUpdateAvailable = (e: Event) => {
    const apply = (e as CustomEvent<() => void>).detail;
    this.showUpdateNotification(apply);
  };

  #onApplyUpdate(): void {
    trace('pwa.update.applying');
    this.#updateApply.disabled = true;
    this.#updateApply.textContent = 'Actualizando...';
    this.#updateIndicator.disabled = true;
    this.#updateIndicator.textContent = 'Actualizando...';
    this.#applyUpdateFn?.();
  }

  #onDismissUpdate(): void {
    trace('pwa.update.dismissed');
    this.#updateBanner.hidden = true;
    this.#updateIndicator.hidden = false;
  }

  async #onLogin(details: LoginDetails): Promise<void> {
    trace('app.login_attempt', {
      email: details.email,
      pageId: details.pageId,
      hasTurn: Boolean(details.meteredApiKey),
      hasProxy: Boolean(details.proxyUrl),
    });
    this.#login.busy = true;
    this.#login.error = '';
    if ('Notification' in window && Notification.permission === 'default') void Notification.requestPermission();
    try {
      let iceServers: RTCIceServer[] | undefined;
      if (details.meteredApiKey) {
        iceServers = await fetchMeteredIceServers(details.meteredApiKey, details.meteredDomain);
      }
      const credentials: ConfluenceCredentials = {
        email: details.email,
        token: details.token,
        pageId: details.pageId,
        baseUrl: details.baseUrl,
      };
      await this.#startSession(credentials, iceServers);
      await saveCredentials(credentials);
      trace('app.login_success', { email: details.email });
    } catch (e) {
      trace('app.login_failed', { error: describeError(e) });
      this.#login.error = describeError(e);
    } finally {
      this.#login.busy = false;
    }
  }

  async #startSession(credentials: ConfluenceCredentials, iceServers?: RTCIceServer[]): Promise<void> {
    trace('session.start', { email: credentials.email, pageId: credentials.pageId, iceServerCount: iceServers?.length ?? 0 });
    const session = new Session(credentials, iceServers);
    session.registry.addEventListener('error', this.#onRegistryError);
    session.registry.addEventListener('signal', this.#clearError);
    session.registry.addEventListener('peer', this.#clearError);
    session.mesh.addEventListener('messages', this.#onMessages);
    await session.start();

    this.#session = session;
    this.#lastError = '';
    this.classList.add('in-session');
    this.#login.hidden = true;
    this.#chat.hidden = false;
    this.#peersButton.hidden = false;
    this.#logoutButton.hidden = false;
    await this.#chat.attach(session);
    this.#peerList.attach(session);
    this.#renderStatus();
  }

  async #logout(error: string): Promise<void> {
    trace('app.logout', { error });
    const session = this.#session;
    this.#session = undefined;
    session?.stop();
    this.#chat.detach();
    this.#peerList.detach();
    await clearToken();
    this.#showLogin(await loadCredentials(), error);
  }

  #showLogin(credentials: Partial<ConfluenceCredentials>, error: string): void {
    this.classList.remove('in-session');
    this.#chat.hidden = true;
    this.#aside.hidden = true;
    this.#peersButton.hidden = true;
    this.#logoutButton.hidden = true;
    this.#login.values = credentials;
    this.#login.error = error;
    this.#login.hidden = false;
    this.#connected = 0;
    this.#renderStatus();
  }

  #togglePeers(): void {
    this.#aside.hidden = !this.#aside.hidden;
    this.#peersButton.setAttribute('aria-expanded', String(!this.#aside.hidden));
  }

  #onRegistryError = (e: Event) => {
    const error = (e as CustomEvent<unknown>).detail;
    if (error instanceof ConfluenceError && (error.status === 401 || error.status === 403)) {
      void this.#logout(describeError(error));
      return;
    }
    this.#lastError = describeError(error);
    this.#renderStatus();
  };

  #clearError = () => {
    if (!this.#lastError) return;
    this.#lastError = '';
    this.#renderStatus();
  };

  #onMessages = (e: Event) => {
    void this.#notify((e as CustomEvent<MessageBatch>).detail);
  };

  async #notify({ from, messages, current }: MessageBatch): Promise<void> {
    if (!document.hidden || !('Notification' in window) || Notification.permission !== 'granted') return;
    const title = from.split('@')[0];
    // One notification per frame: the live message, or a summary when only history was recovered.
    const body = current ? current.text.slice(0, 140) : `${messages.length} mensaje(s) recuperado(s)`;
    const icon = typeof window !== 'undefined' ? new URL('icons/icon.svg', window.location.href).href : './icons/icon.svg';
    const options: NotificationOptions = { body, tag: 'statim', icon };
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) await registration.showNotification(title, options);
    else new Notification(title, options);
  }

  #renderStatus = () => {
    let text = '';
    if (!navigator.onLine) text = 'Sin conexión';
    else if (this.#lastError) text = this.#lastError;
    else if (this.#session) text = this.#connected === 1 ? '1 conectado' : `${this.#connected} conectados`;
    this.#status.textContent = text;
    this.#peersButton.textContent = `Equipo (${this.#connected})`;
  };
}

customElements.define('statim-app', StatimApp);
