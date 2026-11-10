import { ConfluenceError, type ConfluenceCredentials } from '../core/confluence-client.ts';
import { trace } from '../core/diagnostics.ts';
import { getLocale, t, toggleLocale } from '../core/i18n.ts';
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
      height: var(--viewport-height, 100%);
      max-height: var(--viewport-height, 100dvh);
      padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) 0 env(safe-area-inset-left, 0px);
      box-sizing: border-box;
      overflow: hidden;
    }
    header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-height: var(--header-h);
      padding: 0 0.5rem 0 1rem;
      background: var(--accent);
      color: var(--accent-text);
      z-index: 110;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-shrink: 0;
    }
    .brand-logo {
      width: 1.375rem;
      height: 1.375rem;
      border-radius: 5px;
      flex-shrink: 0;
    }
    h1 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      flex: 1;
      min-width: 0;
      font: inherit;
      font-size: 0.8125rem;
      min-height: 2.25rem;
      padding: 0 0.5rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 999px;
      color: inherit;
      cursor: pointer;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      touch-action: manipulation;
    }
    .status:hover {
      background: rgb(255 255 255 / 0.12);
      border-color: rgb(255 255 255 / 0.25);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e3b341;
      flex-shrink: 0;
      transition: background-color 0.2s ease;
    }
    .status-dot.online {
      background: #3fb950;
    }
    .status-dot.offline {
      background: #f85149;
    }
    .status-dot.searching {
      background: #e3b341;
      animation: pulse 1.6s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.85); }
    }
    .status-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    header button:not(.status) {
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      min-height: 2.375rem;
      padding: 0 0.75rem;
      border: 1px solid rgb(255 255 255 / 0.4);
      border-radius: var(--radius);
      background: transparent;
      color: inherit;
      cursor: pointer;
      touch-action: manipulation;
    }
    header button:not(.status):active {
      background: rgb(255 255 255 / 0.15);
    }
    .lang-btn {
      font-weight: 600;
      font-size: 0.8125rem;
      padding: 0 0.5rem;
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
      z-index: 5;
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
    .install-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      font-size: 0.8125rem;
      color: var(--text);
      animation: fadeIn 0.2s ease-out;
      z-index: 100;
    }
    .install-banner[hidden] {
      display: none !important;
    }
    .install-content {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      flex: 1;
      min-width: 0;
    }
    .install-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .install-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      overflow: hidden;
    }
    .install-title {
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .install-desc {
      color: var(--muted);
      font-size: 0.75rem;
      line-height: 1.3;
    }
    .install-actions {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-shrink: 0;
    }
    .install-btn {
      font: inherit;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.375rem 0.625rem;
      min-height: 2rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      white-space: nowrap;
    }
    .install-dismiss {
      background: transparent;
      border: 0;
      color: var(--muted);
      font-size: 1rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      touch-action: manipulation;
    }
    main {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      overflow: hidden;
    }
    /* Mobile Bottom Sheet */
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.5);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 90;
      animation: fadeIn 0.2s ease-out;
    }
    aside {
      position: fixed;
      inset: auto 0 0 0;
      width: 100%;
      max-height: 80dvh;
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      background: var(--bg);
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
      z-index: 100;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .sheet-handle {
      width: 36px;
      height: 4px;
      background: var(--muted);
      opacity: 0.35;
      border-radius: 999px;
      margin: 0.625rem auto 0.25rem;
      flex-shrink: 0;
    }

    /* Network & Sync Bottom Sheet */
    .net-backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.5);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 95;
      animation: fadeIn 0.2s ease-out;
    }
    .net-sheet {
      position: fixed;
      inset: auto 0 0 0;
      background: var(--bg);
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
      z-index: 105;
      display: flex;
      flex-direction: column;
      padding: 1rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom, 0px));
      max-width: 32rem;
      margin: 0 auto;
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .net-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .net-title {
      margin: 0;
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--text);
    }
    .net-close {
      background: var(--surface);
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: grid;
      place-items: center;
      cursor: pointer;
      color: var(--muted);
      font-size: 1rem;
    }
    .net-body {
      display: grid;
      gap: 0.875rem;
    }
    .net-section {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 0.875rem 1rem;
      display: grid;
      gap: 0.5rem;
    }
    .section-title {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text);
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }
    .stat-label {
      color: var(--muted);
    }
    .stat-val {
      font-weight: 600;
      color: var(--text);
    }
    .stat-desc {
      font-size: 0.75rem;
      color: var(--muted);
      opacity: 0.85;
      line-height: 1.35;
    }
    .btn-sync-now {
      font: inherit;
      font-size: 0.9375rem;
      font-weight: 600;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      transition: opacity 0.15s ease;
    }
    .btn-sync-now:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
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
        display: flex !important;
        position: static;
        width: auto;
        max-height: none;
        border-radius: 0;
        border-top: none;
        border-left: 1px solid var(--border);
        box-shadow: none;
        animation: none;
        z-index: auto;
        padding-bottom: 0;
      }
      .net-sheet {
        inset: auto auto auto auto;
        top: 4.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: 24rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: 0 12px 36px rgb(0 0 0 / 0.25);
        animation: fadeIn 0.15s ease-out;
        padding-bottom: 1.25rem;
      }
      .backdrop,
      .sheet-handle {
        display: none !important;
      }
      :host(.in-session) .peers {
        display: none !important;
      }
    }
  </style>
  <header>
    <div class="brand">
      <svg class="brand-logo" viewBox="0 0 512 512" aria-hidden="true">
        <defs>
          <linearGradient id="header-logo-grad" x1="90%" y1="0%" x2="10%" y2="100%">
            <stop offset="0%" stop-color="#00daf3"/>
            <stop offset="35%" stop-color="#79c0ff"/>
            <stop offset="70%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#e6edf3"/>
          </linearGradient>
        </defs>
        <path fill="url(#header-logo-grad)" fill-rule="evenodd" d="M 164 202 L 164 160 A 92 92 0 0 1 348 160 L 348 202 L 376 202 L 376 226 C 368 214 354 204 338 202 L 312 202 L 312 160 A 56 56 0 0 0 200 160 L 200 202 L 174 202 C 158 204 144 214 136 226 L 136 202 Z"/>
        <path fill="url(#header-logo-grad)" fill-rule="evenodd" d="M 256 198 A 120 120 0 1 1 255.9 198 Z M 259 238 A 80 80 0 0 0 230 394 L 256 346 L 200 346 Z M 293 247 L 254 318 L 312 318 L 268 397 A 80 80 0 0 0 293 247 Z"/>
      </svg>
      <h1>Statim</h1>
    </div>
    <button class="status" type="button" aria-haspopup="dialog" aria-expanded="false" title="Ver detalles de red y sincronización">
      <span class="status-dot"></span>
      <span class="status-text"></span>
    </button>
    <button class="lang-btn" type="button" aria-label="Cambiar idioma">EN</button>
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
  <div class="install-banner" role="region" aria-label="Instalación" hidden>
    <div class="install-content">
      <span class="install-icon" aria-hidden="true">
        <svg viewBox="0 0 512 512" width="22" height="22" aria-hidden="true">
          <defs>
            <linearGradient id="install-logo-grad" x1="90%" y1="0%" x2="10%" y2="100%">
              <stop offset="0%" stop-color="#00daf3"/>
              <stop offset="30%" stop-color="#00b4d8"/>
              <stop offset="70%" stop-color="#026cb6"/>
              <stop offset="100%" stop-color="#08183a"/>
            </linearGradient>
          </defs>
          <path fill="url(#install-logo-grad)" fill-rule="evenodd" d="M 164 202 L 164 160 A 92 92 0 0 1 348 160 L 348 202 L 376 202 L 376 226 C 368 214 354 204 338 202 L 312 202 L 312 160 A 56 56 0 0 0 200 160 L 200 202 L 174 202 C 158 204 144 214 136 226 L 136 202 Z"/>
          <path fill="url(#install-logo-grad)" fill-rule="evenodd" d="M 256 198 A 120 120 0 1 1 255.9 198 Z M 259 238 A 80 80 0 0 0 230 394 L 256 346 L 200 346 Z M 293 247 L 254 318 L 312 318 L 268 397 A 80 80 0 0 0 293 247 Z"/>
        </svg>
      </span>
      <div class="install-info">
        <strong class="install-title"></strong>
        <span class="install-desc"></span>
      </div>
    </div>
    <div class="install-actions">
      <button class="install-btn" type="button"></button>
      <button class="install-dismiss" type="button" aria-label="Cerrar aviso de instalación">✕</button>
    </div>
  </div>
  <main>
    <login-view hidden></login-view>
    <chat-room hidden></chat-room>
    <div class="backdrop" hidden></div>
    <aside hidden>
      <div class="sheet-handle" aria-hidden="true"></div>
      <peer-list></peer-list>
    </aside>
    <div class="net-backdrop" hidden></div>
    <div class="net-sheet" hidden role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="net-header">
        <h3 class="net-title"></h3>
        <button class="net-close" type="button" aria-label="Cerrar">✕</button>
      </div>
      <div class="net-body">
        <div class="net-section">
          <h4 class="section-title net-mesh-title"></h4>
          <div class="stat-row"><span class="stat-label stat-connected-label"></span><span class="stat-val stat-connected-val">0</span></div>
          <div class="stat-row"><span class="stat-label stat-active-label"></span><span class="stat-val stat-active-val">0</span></div>
        </div>
        <div class="net-section">
          <h4 class="section-title net-sync-title"></h4>
          <div class="stat-row"><span class="stat-label stat-budget-label"></span><span class="stat-val stat-budget-val">100 / 100</span></div>
          <div class="stat-desc">Intervalo normal: 60 s · Mínimo urgente: 10 s</div>
        </div>
        <button type="button" class="btn-sync-now"></button>
      </div>
    </div>
  </main>
`;

function describeError(e: unknown): string {
  if (e instanceof Error && e.message.includes('Metered')) return t('error.metered');
  if (e instanceof ConfluenceError) {
    if (e.status === 401 || e.status === 403) return t('error.confluence_auth');
    if (e.status === 404) return t('error.confluence_404');
    if (e.status === 429) return t('error.confluence_429');
    return e.message;
  }
  if (e instanceof TypeError) return t('error.confluence_network');
  return t('error.unexpected');
}

export class StatimApp extends HTMLElement {
  #statusButton: HTMLButtonElement;
  #statusDot: HTMLElement;
  #statusText: HTMLElement;
  #langButton: HTMLButtonElement;
  #peersButton: HTMLButtonElement;
  #logoutButton: HTMLButtonElement;
  #login: LoginView;
  #chat: ChatRoom;
  #aside: HTMLElement;
  #backdrop: HTMLElement;
  #peerList: PeerList;
  #netBackdrop: HTMLElement;
  #netSheet: HTMLElement;
  #netTitle: HTMLElement;
  #netClose: HTMLButtonElement;
  #netMeshTitle: HTMLElement;
  #statConnectedLabel: HTMLElement;
  #statConnectedVal: HTMLElement;
  #statActiveLabel: HTMLElement;
  #statActiveVal: HTMLElement;
  #netSyncTitle: HTMLElement;
  #statBudgetLabel: HTMLElement;
  #statBudgetVal: HTMLElement;
  #btnSyncNow: HTMLButtonElement;
  #updateBanner: HTMLElement;
  #updateBannerMsg: HTMLElement;
  #updateApply: HTMLButtonElement;
  #updateDismiss: HTMLButtonElement;
  #updateIndicator: HTMLButtonElement;
  #applyUpdateFn?: () => void;
  #installBanner: HTMLElement;
  #installTitle: HTMLElement;
  #installDesc: HTMLElement;
  #installBtn: HTMLButtonElement;
  #installDismiss: HTMLButtonElement;
  #deferredInstallPrompt: any = null;
  #isIosInstall = false;
  #unseenCount = 0;
  #session?: Session;
  #connected = 0;
  #lastError = '';

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#statusButton = root.querySelector('.status')!;
    this.#statusDot = root.querySelector('.status-dot')!;
    this.#statusText = root.querySelector('.status-text')!;
    this.#langButton = root.querySelector('.lang-btn')!;
    this.#peersButton = root.querySelector('.peers')!;
    this.#logoutButton = root.querySelector('.logout')!;
    this.#login = root.querySelector('login-view')!;
    this.#chat = root.querySelector('chat-room')!;
    this.#aside = root.querySelector('aside')!;
    this.#backdrop = root.querySelector('.backdrop')!;
    this.#peerList = root.querySelector('peer-list')!;

    this.#netBackdrop = root.querySelector('.net-backdrop')!;
    this.#netSheet = root.querySelector('.net-sheet')!;
    this.#netTitle = root.querySelector('.net-title')!;
    this.#netClose = root.querySelector('.net-close')!;
    this.#netMeshTitle = root.querySelector('.net-mesh-title')!;
    this.#statConnectedLabel = root.querySelector('.stat-connected-label')!;
    this.#statConnectedVal = root.querySelector('.stat-connected-val')!;
    this.#statActiveLabel = root.querySelector('.stat-active-label')!;
    this.#statActiveVal = root.querySelector('.stat-active-val')!;
    this.#netSyncTitle = root.querySelector('.net-sync-title')!;
    this.#statBudgetLabel = root.querySelector('.stat-budget-label')!;
    this.#statBudgetVal = root.querySelector('.stat-budget-val')!;
    this.#btnSyncNow = root.querySelector('.btn-sync-now')!;

    this.#updateBanner = root.querySelector('.update-banner')!;
    this.#updateBannerMsg = root.querySelector('.update-msg')!;
    this.#updateApply = root.querySelector('.update-apply')!;
    this.#updateDismiss = root.querySelector('.update-dismiss')!;
    this.#updateIndicator = root.querySelector('.update-indicator')!;

    this.#installBanner = root.querySelector('.install-banner')!;
    this.#installTitle = root.querySelector('.install-title')!;
    this.#installDesc = root.querySelector('.install-desc')!;
    this.#installBtn = root.querySelector('.install-btn')!;
    this.#installDismiss = root.querySelector('.install-dismiss')!;

    this.#installDismiss.addEventListener('click', () => {
      this.#installBanner.hidden = true;
      try {
        localStorage.setItem('statim.install_dismissed', '1');
      } catch {
        // Storage access may be restricted
      }
    });

    this.#installBtn.addEventListener('click', async () => {
      if (this.#isIosInstall) {
        this.#installBanner.hidden = true;
        try {
          localStorage.setItem('statim.install_dismissed', '1');
        } catch {}
        return;
      }
      if (this.#deferredInstallPrompt) {
        this.#deferredInstallPrompt.prompt();
        try {
          const choice = await this.#deferredInstallPrompt.userChoice;
          if (choice?.outcome === 'accepted') {
            this.#installBanner.hidden = true;
          }
        } catch {}
        this.#deferredInstallPrompt = null;
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.#unseenCount = 0;
        this.#clearAppBadge();
      }
    });

    this.#statusButton.addEventListener('click', () => this.#openNetSheet());
    this.#netClose.addEventListener('click', () => this.#closeNetSheet());
    this.#netBackdrop.addEventListener('click', () => this.#closeNetSheet());
    this.#btnSyncNow.addEventListener('click', () => this.#triggerManualSync());

    this.#langButton.addEventListener('click', () => {
      toggleLocale();
    });
    this.#login.addEventListener('login', (e) => void this.#onLogin((e as CustomEvent<LoginDetails>).detail));
    this.#logoutButton.addEventListener('click', () => void this.#logout(''));
    this.#peersButton.addEventListener('click', () => this.#togglePeers());
    this.#backdrop.addEventListener('click', () => this.#togglePeers(false));
    this.#peerList.addEventListener('close', () => this.#togglePeers(false));
    this.#updateApply.addEventListener('click', () => this.#onApplyUpdate());
    this.#updateIndicator.addEventListener('click', () => this.#onApplyUpdate());
    this.#updateDismiss.addEventListener('click', () => this.#onDismissUpdate());
    this.#peerList.addEventListener('count', (e) => {
      this.#connected = (e as CustomEvent<number>).detail;
      this.#renderStatus();
    });

    this.addEventListener('statim:refresh', () => {
      this.#triggerManualSync();
    });

    this.#setupVisualViewport();
    this.#updateTexts();
  }

  async connectedCallback() {
    window.addEventListener('online', this.#renderStatus);
    window.addEventListener('offline', this.#renderStatus);
    window.addEventListener('statim:update-available', this.#onUpdateAvailable);
    window.addEventListener('statim:locale-changed', this.#onLocaleChanged);
    window.addEventListener('beforeinstallprompt', this.#onBeforeInstallPrompt);
    this.#checkInstallability();
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
    window.removeEventListener('statim:locale-changed', this.#onLocaleChanged);
    window.removeEventListener('beforeinstallprompt', this.#onBeforeInstallPrompt);
    this.#session?.stop();
  }

  showUpdateNotification(applyUpdate: () => void): void {
    this.#applyUpdateFn = applyUpdate;
    this.#updateBanner.hidden = false;
    this.#updateIndicator.hidden = true;
  }

  setSessionForTesting(session: Session): void {
    this.#session = session;
  }

  #setupVisualViewport(): void {
    if (typeof window !== 'undefined' && window.visualViewport) {
      const updateViewportHeight = () => {
        const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        this.style.setProperty('--viewport-height', `${height}px`);
      };
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
      updateViewportHeight();
    }
  }

  #onLocaleChanged = () => {
    this.#updateTexts();
  };

  #updateTexts(): void {
    const locale = getLocale();
    this.#langButton.textContent = locale === 'es' ? 'EN' : 'ES';
    this.#langButton.setAttribute('aria-label', t('app.switch_lang'));
    this.#logoutButton.textContent = t('app.logout');
    this.#updateIndicator.textContent = t('app.update');
    this.#updateIndicator.title = t('app.update_available');
    this.#updateBannerMsg.textContent = t('app.update_banner_msg');
    this.#updateApply.textContent = t('app.update');
    this.#updateDismiss.setAttribute('aria-label', t('app.update_dismiss'));

    this.#netTitle.textContent = t('net.title');
    this.#netMeshTitle.textContent = t('net.mesh_status');
    this.#statConnectedLabel.textContent = t('net.connected_peers');
    this.#statActiveLabel.textContent = t('net.active_peers');
    this.#netSyncTitle.textContent = t('net.confluence_sync');
    this.#statBudgetLabel.textContent = t('net.budget');
    this.#btnSyncNow.textContent = t('net.sync_now');

    if (this.#isIosInstall) {
      this.#installTitle.textContent = t('pwa.install_title');
      this.#installDesc.textContent = t('pwa.install_ios');
      this.#installBtn.textContent = 'OK';
    } else {
      this.#installTitle.textContent = t('pwa.install_title');
      this.#installDesc.textContent = t('pwa.install_desc');
      this.#installBtn.textContent = t('pwa.install_btn');
    }
    this.#installDismiss.setAttribute('aria-label', t('pwa.install_dismiss'));

    this.#renderStatus();
  }

  #openNetSheet(): void {
    if (!this.#session) return;
    this.#netBackdrop.hidden = false;
    this.#netSheet.hidden = false;
    this.#statusButton.setAttribute('aria-expanded', 'true');
    this.#statConnectedVal.textContent = String(this.#connected);
    const budget = this.#session.registry.remainingFastBudget;
    this.#statBudgetVal.textContent = `${budget} / 100`;
    void this.#session.registry.activePeers().then((active) => {
      this.#statActiveVal.textContent = String(active.length);
    });
  }

  #closeNetSheet(): void {
    this.#netBackdrop.hidden = true;
    this.#netSheet.hidden = true;
    this.#statusButton.setAttribute('aria-expanded', 'false');
  }

  #triggerManualSync(): void {
    if (!this.#session) return;
    this.#session.registry.holdFastPolling();
    this.#btnSyncNow.disabled = true;
    this.#btnSyncNow.textContent = t('net.syncing');
    this.#statusDot.className = 'status-dot searching';

    setTimeout(() => {
      this.#btnSyncNow.disabled = false;
      this.#btnSyncNow.textContent = t('net.sync_now');
      this.#renderStatus();
    }, 1500);
  }

  #onUpdateAvailable = (e: Event) => {
    const apply = (e as CustomEvent<() => void>).detail;
    this.showUpdateNotification(apply);
  };

  #onApplyUpdate(): void {
    trace('pwa.update.applying');
    this.#updateApply.disabled = true;
    this.#updateApply.textContent = t('app.updating');
    this.#updateIndicator.disabled = true;
    this.#updateIndicator.textContent = t('app.updating');
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
    this.#backdrop.hidden = true;
    this.#netSheet.hidden = true;
    this.#netBackdrop.hidden = true;
    this.#peersButton.hidden = true;
    this.#logoutButton.hidden = true;
    this.#login.values = credentials;
    this.#login.error = error;
    this.#login.hidden = false;
    this.#connected = 0;
    this.#renderStatus();
  }

  #togglePeers(open?: boolean): void {
    const next = open !== undefined ? open : this.#aside.hidden;
    this.#aside.hidden = !next;
    this.#backdrop.hidden = !next;
    this.#peersButton.setAttribute('aria-expanded', String(next));
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
    const detail = (e as CustomEvent<MessageBatch>).detail;
    if (typeof document !== 'undefined' && document.hidden) {
      this.#unseenCount += detail.current ? 1 : detail.messages.length;
      this.#updateAppBadge();
    }
    void this.#notify(detail);
  };

  #onBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    this.#deferredInstallPrompt = e;
    try {
      if (!localStorage.getItem('statim.install_dismissed')) {
        this.#showPwaInstallBanner();
      }
    } catch {
      this.#showPwaInstallBanner();
    }
  };

  #checkInstallability(): void {
    const isStandalone =
      (typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches) ||
      (typeof navigator !== 'undefined' && (navigator as any).standalone === true);
    if (isStandalone) return;

    try {
      if (localStorage.getItem('statim.install_dismissed')) return;
    } catch {
      // Storage access may be restricted
    }

    const isIos = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) {
      this.#isIosInstall = true;
      this.#showIosInstallBanner();
    }
  }

  #showPwaInstallBanner(): void {
    this.#isIosInstall = false;
    this.#installTitle.textContent = t('pwa.install_title');
    this.#installDesc.textContent = t('pwa.install_desc');
    this.#installBtn.textContent = t('pwa.install_btn');
    this.#installBtn.hidden = false;
    this.#installBanner.hidden = false;
  }

  #showIosInstallBanner(): void {
    this.#installTitle.textContent = t('pwa.install_title');
    this.#installDesc.textContent = t('pwa.install_ios');
    this.#installBtn.textContent = 'OK';
    this.#installBtn.hidden = false;
    this.#installBanner.hidden = false;
  }

  #updateAppBadge(): void {
    if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator && this.#unseenCount > 0) {
      navigator.setAppBadge(this.#unseenCount).catch(() => {});
    }
  }

  #clearAppBadge(): void {
    if (typeof navigator !== 'undefined' && 'clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(() => {});
    }
  }

  async #notify({ from, messages, current }: MessageBatch): Promise<void> {
    if (!document.hidden || !('Notification' in window) || Notification.permission !== 'granted') return;
    const title = from.split('@')[0];
    const body = current ? current.text.slice(0, 140) : t('notify.recovered', { count: messages.length });
    const icon = typeof window !== 'undefined' ? new URL('icons/icon.svg', window.location.href).href : './icons/icon.svg';
    const options: NotificationOptions = { body, tag: 'statim', icon };
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) await registration.showNotification(title, options);
    else new Notification(title, options);
  }

  #renderStatus = () => {
    let text = '';
    let dotState = 'searching';
    if (!navigator.onLine) {
      text = t('app.offline');
      dotState = 'offline';
    } else if (this.#lastError) {
      text = this.#lastError;
      dotState = 'offline';
    } else if (this.#session) {
      if (this.#connected > 0) {
        text = this.#connected === 1 ? t('app.connected_one') : t('app.connected_many', { count: this.#connected });
        dotState = 'online';
      } else {
        text = t('app.connected_many', { count: 0 });
        dotState = 'searching';
      }
    }
    this.#statusText.textContent = text;
    this.#statusDot.className = `status-dot ${dotState}`;
    this.#peersButton.textContent = t('app.peers_btn_count', { count: this.#connected });
  };
}

customElements.define('statim-app', StatimApp);
