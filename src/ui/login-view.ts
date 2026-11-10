import type { ConfluenceCredentials } from '../core/confluence-client.ts';
import { clearDiagnostics, exportLogs, trace } from '../core/diagnostics.ts';
import { getLocale, t, toggleLocale } from '../core/i18n.ts';

export interface LoginDetails extends ConfluenceCredentials {
  meteredDomain?: string;
  meteredApiKey?: string;
  proxyUrl?: string;
  proxyUser?: string;
  proxyPassword?: string;
  proxyExcludedDomains?: string;
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      padding: 1.5rem 1rem calc(3rem + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    form {
      display: grid;
      gap: 1.25rem;
      max-width: 28rem;
      width: 100%;
      margin: 0 auto;
    }
    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .brand-title-logo {
      width: 2rem;
      height: 2rem;
      border-radius: 8px;
      flex-shrink: 0;
    }
    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }
    .lang-toggle {
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.375rem 0.625rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      touch-action: manipulation;
    }
    label {
      display: grid;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text);
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    input {
      display: block;
      width: 100%;
      min-height: 3.25rem;
      font: inherit;
      font-size: 1.0625rem;
      line-height: 1.5;
      padding: 0.875rem 1rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      -webkit-appearance: none;
      appearance: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.25);
    }
    input::placeholder {
      color: var(--muted);
      opacity: 0.8;
      font-size: 0.9375rem;
    }
    .btn-toggle-pw {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      padding: 0.5rem;
      font-size: 1.125rem;
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius);
    }
    details.turn-section,
    details.proxy-section,
    details.logs-section {
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      overflow: hidden;
    }
    details.turn-section summary,
    details.proxy-section summary,
    details.logs-section summary {
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      user-select: none;
      min-height: 3.25rem;
      padding: 0.875rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.15s ease;
    }
    details.turn-section summary:hover,
    details.proxy-section summary:hover,
    details.logs-section summary:hover {
      background-color: rgba(128, 128, 128, 0.08);
    }
    .turn-fields,
    .proxy-fields,
    .logs-fields {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border-top: 1.5px solid var(--border);
      margin-top: 0;
    }
    button[type="submit"] {
      display: block;
      width: 100%;
      font: inherit;
      font-size: 1.125rem;
      font-weight: 600;
      min-height: 3.375rem;
      padding: 0.875rem 1.25rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
      transition: opacity 0.15s ease, transform 0.1s ease;
    }
    button[type="submit"]:active {
      transform: scale(0.99);
      opacity: 0.9;
    }
    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .hint {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.45;
      color: var(--muted);
    }
    .error {
      margin: 0;
      font-size: 0.9375rem;
      color: #cf222e;
      font-weight: 500;
      line-height: 1.4;
    }
    .error:empty {
      display: none;
    }
    .logs-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-secondary {
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      touch-action: manipulation;
      transition: background 0.15s ease;
    }
    .btn-secondary:active {
      opacity: 0.8;
    }
    .logs-output {
      margin: 0;
      padding: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8125rem;
      line-height: 1.4;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      max-height: 14rem;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
      color: var(--text);
    }
  </style>
  <form>
    <div class="form-header">
      <div class="brand-title">
        <svg class="brand-title-logo" viewBox="0 0 512 512" width="34" height="34" aria-hidden="true">
          <defs>
            <linearGradient id="login-logo-grad" x1="90%" y1="0%" x2="10%" y2="100%">
              <stop offset="0%" stop-color="#00daf3"/>
              <stop offset="25%" stop-color="#00b4d8"/>
              <stop offset="55%" stop-color="#026cb6"/>
              <stop offset="82%" stop-color="#09285b"/>
              <stop offset="100%" stop-color="#07193b"/>
            </linearGradient>
          </defs>
          <path fill="url(#login-logo-grad)" fill-rule="evenodd" d="M 164 202 L 164 160 A 92 92 0 0 1 348 160 L 348 202 L 376 202 L 376 226 C 368 214 354 204 338 202 L 312 202 L 312 160 A 56 56 0 0 0 200 160 L 200 202 L 174 202 C 158 204 144 214 136 226 L 136 202 Z"/>
          <path fill="url(#login-logo-grad)" fill-rule="evenodd" d="M 256 198 A 120 120 0 1 1 255.9 198 Z M 259 238 A 80 80 0 0 0 230 394 L 256 346 L 200 346 Z M 293 247 L 254 318 L 312 318 L 268 397 A 80 80 0 0 0 293 247 Z"/>
        </svg>
        <h2 class="title"></h2>
      </div>
      <span role="button" tabindex="0" class="lang-toggle" aria-label="Cambiar idioma">🌐 ES</span>
    </div>
    <label><span class="label-email"></span>
      <input name="email" type="email" autocomplete="username" required />
    </label>
    <label><span class="label-token"></span>
      <div class="input-wrapper">
        <input name="token" type="password" autocomplete="current-password" required />
        <span role="button" tabindex="0" class="btn-toggle-pw" aria-label="Mostrar contraseña">👁️</span>
      </div>
    </label>
    <label><span class="label-page-id"></span>
      <input name="pageId" inputmode="numeric" pattern="[0-9]+" required />
    </label>
    <label><span class="label-base-url"></span>
      <input name="baseUrl" type="url" />
    </label>
    <details class="turn-section">
      <summary class="summary-turn"></summary>
      <div class="turn-fields">
        <label><span class="label-turn-domain"></span>
          <input name="meteredDomain" type="text" autocomplete="off" />
        </label>
        <label><span class="label-turn-key"></span>
          <input name="meteredApiKey" type="password" autocomplete="off" />
        </label>
        <p class="hint hint-turn"></p>
      </div>
    </details>
    <details class="proxy-section">
      <summary class="summary-proxy"></summary>
      <div class="proxy-fields">
        <label><span class="label-proxy-url"></span>
          <input name="proxyUrl" type="text" autocomplete="off" />
        </label>
        <label><span class="label-proxy-user"></span>
          <input name="proxyUser" type="text" autocomplete="off" />
        </label>
        <label><span class="label-proxy-pass"></span>
          <input name="proxyPassword" type="password" autocomplete="current-password" />
        </label>
        <label><span class="label-proxy-excluded"></span>
          <input name="proxyExcludedDomains" type="text" autocomplete="off" />
        </label>
      </div>
    </details>
    <p class="hint hint-token"></p>
    <p class="error" role="alert"></p>
    <button type="submit"></button>
    <details class="logs-section">
      <summary class="summary-logs"></summary>
      <div class="logs-fields">
        <p class="hint hint-logs"></p>
        <div class="logs-actions">
          <button type="button" class="btn-secondary btn-copy-logs"></button>
          <button type="button" class="btn-secondary btn-clear-logs"></button>
        </div>
        <pre class="logs-output" tabindex="0">Sin eventos registrados aún.</pre>
      </div>
    </details>
  </form>
`;

/** Emits `login` (CustomEvent<LoginDetails>). */
export class LoginView extends HTMLElement {
  #form: HTMLFormElement;
  #error: HTMLElement;
  #button: HTMLButtonElement;
  #langToggle: HTMLElement;
  #logsDetails: HTMLDetailsElement;
  #logsOutput: HTMLPreElement;
  #copyLogsBtn: HTMLButtonElement;
  #clearLogsBtn: HTMLButtonElement;
  #tokenInput: HTMLInputElement;
  #pwToggleBtn: HTMLElement;
  #busy = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#form = root.querySelector('form')!;
    this.#error = root.querySelector('.error')!;
    this.#button = root.querySelector('button[type="submit"]') || root.querySelector('button')!;
    this.#langToggle = root.querySelector('.lang-toggle')!;
    this.#logsDetails = root.querySelector('details.logs-section')!;
    this.#logsOutput = root.querySelector('.logs-output')!;
    this.#copyLogsBtn = root.querySelector('.btn-copy-logs')!;
    this.#clearLogsBtn = root.querySelector('.btn-clear-logs')!;
    this.#tokenInput = root.querySelector('input[name="token"]')!;
    this.#pwToggleBtn = root.querySelector('.btn-toggle-pw')!;

    const onToggleLang = () => toggleLocale();
    this.#langToggle.addEventListener('click', onToggleLang);
    this.#langToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggleLang();
      }
    });

    const onTogglePw = () => {
      const isPassword = this.#tokenInput.type === 'password';
      this.#tokenInput.type = isPassword ? 'text' : 'password';
      this.#pwToggleBtn.textContent = isPassword ? '🔒' : '👁️';
    };
    this.#pwToggleBtn.addEventListener('click', onTogglePw);
    this.#pwToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onTogglePw();
      }
    });

    const renderLogs = () => {
      this.#logsOutput.textContent = exportLogs();
    };

    this.#logsDetails.addEventListener('toggle', () => {
      if (this.#logsDetails.open) {
        renderLogs();
      }
    });

    this.#copyLogsBtn.addEventListener('click', async () => {
      const logs = exportLogs();
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(logs);
        }
        const originalText = this.#copyLogsBtn.textContent;
        this.#copyLogsBtn.textContent = '¡Copiado!';
        setTimeout(() => {
          this.#copyLogsBtn.textContent = originalText;
        }, 1500);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(this.#logsOutput);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });

    this.#clearLogsBtn.addEventListener('click', () => {
      clearDiagnostics();
      renderLogs();
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('statim-trace', () => {
        if (this.#logsDetails.open) {
          renderLogs();
        }
      });
      window.addEventListener('statim-trace-cleared', () => {
        if (this.#logsDetails.open) {
          renderLogs();
        }
      });
    }

    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(this.#form);
      const value = (k: string) => String(data.get(k) ?? '').trim();
      const detail: LoginDetails = {
        email: value('email'),
        token: value('token'),
        pageId: value('pageId'),
        baseUrl: value('baseUrl'),
      };
      const meteredDomain = value('meteredDomain');
      const meteredApiKey = value('meteredApiKey');
      if (meteredDomain) detail.meteredDomain = meteredDomain;
      if (meteredApiKey) detail.meteredApiKey = meteredApiKey;
      const proxyUrl = value('proxyUrl');
      const proxyUser = value('proxyUser');
      const proxyPassword = value('proxyPassword');
      const proxyExcludedDomains = value('proxyExcludedDomains');
      if (proxyUrl) detail.proxyUrl = proxyUrl;
      if (proxyUser) detail.proxyUser = proxyUser;
      if (proxyPassword) detail.proxyPassword = proxyPassword;
      if (proxyExcludedDomains) detail.proxyExcludedDomains = proxyExcludedDomains;

      trace('ui.login.submit', {
        email: detail.email,
        pageId: detail.pageId,
        hasTurn: Boolean(detail.meteredApiKey),
        hasProxy: Boolean(detail.proxyUrl),
      });

      this.dispatchEvent(
        new CustomEvent<LoginDetails>('login', { detail }),
      );
    });

    this.#updateTexts();
  }

  connectedCallback() {
    window.addEventListener('statim:locale-changed', this.#onLocaleChanged);
  }

  disconnectedCallback() {
    window.removeEventListener('statim:locale-changed', this.#onLocaleChanged);
  }

  #onLocaleChanged = () => {
    this.#updateTexts();
  };

  #updateTexts(): void {
    const root = this.shadowRoot!;
    const locale = getLocale();
    this.#langToggle.textContent = `🌐 ${locale.toUpperCase()}`;

    root.querySelector('.title')!.textContent = t('login.title');
    root.querySelector('.label-email')!.textContent = t('login.email');
    root.querySelector('.label-token')!.textContent = t('login.token');
    root.querySelector('.label-page-id')!.textContent = t('login.page_id');
    root.querySelector('.label-base-url')!.textContent = t('login.base_url');

    const emailInput = root.querySelector('input[name="email"]') as HTMLInputElement;
    if (emailInput) emailInput.placeholder = t('login.email_placeholder');
    const tokenInput = root.querySelector('input[name="token"]') as HTMLInputElement;
    if (tokenInput) tokenInput.placeholder = t('login.token_placeholder');
    const pageIdInput = root.querySelector('input[name="pageId"]') as HTMLInputElement;
    if (pageIdInput) pageIdInput.placeholder = t('login.page_id_placeholder');
    const baseUrlInput = root.querySelector('input[name="baseUrl"]') as HTMLInputElement;
    if (baseUrlInput) baseUrlInput.placeholder = t('login.base_url_placeholder');

    root.querySelector('.summary-turn')!.textContent = t('login.turn_section');
    root.querySelector('.label-turn-domain')!.textContent = t('login.metered_domain');
    root.querySelector('.label-turn-key')!.textContent = t('login.metered_api_key');
    const domainInput = root.querySelector('input[name="meteredDomain"]') as HTMLInputElement;
    if (domainInput) domainInput.placeholder = t('login.metered_domain_placeholder');
    const keyInput = root.querySelector('input[name="meteredApiKey"]') as HTMLInputElement;
    if (keyInput) keyInput.placeholder = t('login.metered_api_key_placeholder');
    root.querySelector('.hint-turn')!.textContent =
      locale === 'es'
        ? 'Usará TURNS sobre TLS (puerto 443). Estos datos son sensibles y no se almacenan.'
        : 'Uses TURNS over TLS (port 443). This data is sensitive and not stored.';

    root.querySelector('.summary-proxy')!.textContent = t('login.proxy_section');
    root.querySelector('.label-proxy-url')!.textContent = t('login.proxy_url');
    root.querySelector('.label-proxy-user')!.textContent = t('login.proxy_user');
    root.querySelector('.label-proxy-pass')!.textContent = t('login.proxy_password');
    root.querySelector('.label-proxy-excluded')!.textContent = t('login.proxy_excluded');
    const proxyUrlInput = root.querySelector('input[name="proxyUrl"]') as HTMLInputElement;
    if (proxyUrlInput) proxyUrlInput.placeholder = t('login.proxy_url_placeholder');
    const proxyUserInput = root.querySelector('input[name="proxyUser"]') as HTMLInputElement;
    if (proxyUserInput) proxyUserInput.placeholder = t('login.proxy_user_placeholder');
    const proxyPassInput = root.querySelector('input[name="proxyPassword"]') as HTMLInputElement;
    if (proxyPassInput) proxyPassInput.placeholder = t('login.proxy_password_placeholder');
    const proxyExcInput = root.querySelector('input[name="proxyExcludedDomains"]') as HTMLInputElement;
    if (proxyExcInput) proxyExcInput.placeholder = t('login.proxy_excluded_placeholder');

    root.querySelector('.hint-token')!.textContent =
      locale === 'es'
        ? 'El token se guarda sin cifrar en este dispositivo.'
        : 'Token is saved unencrypted on this device.';

    this.#button.textContent = this.#busy ? t('login.connecting') : t('login.submit');

    root.querySelector('.summary-logs')!.textContent = t('login.logs_section');
    root.querySelector('.hint-logs')!.textContent =
      locale === 'es'
        ? 'Trazas y eventos del sistema útiles para diagnosticar incidencias de conexión o red.'
        : 'System traces and events useful for diagnosing network or connection issues.';
    this.#copyLogsBtn.textContent = t('login.export_logs');
    this.#clearLogsBtn.textContent = t('login.clear_logs');
  }

  set values(c: Partial<LoginDetails>) {
    for (const key of ['email', 'token', 'pageId', 'baseUrl'] as const) {
      const input = this.#form.elements.namedItem(key) as HTMLInputElement;
      input.value = c[key] ?? '';
    }
    const domainInput = this.#form.elements.namedItem('meteredDomain') as HTMLInputElement | null;
    if (domainInput) domainInput.value = '';
    const keyInput = this.#form.elements.namedItem('meteredApiKey') as HTMLInputElement | null;
    if (keyInput) keyInput.value = '';
    const proxyUrlInput = this.#form.elements.namedItem('proxyUrl') as HTMLInputElement | null;
    if (proxyUrlInput) proxyUrlInput.value = c.proxyUrl ?? '';
    const proxyUserInput = this.#form.elements.namedItem('proxyUser') as HTMLInputElement | null;
    if (proxyUserInput) proxyUserInput.value = c.proxyUser ?? '';
    const proxyPasswordInput = this.#form.elements.namedItem('proxyPassword') as HTMLInputElement | null;
    if (proxyPasswordInput) proxyPasswordInput.value = '';
    const proxyExcludedInput = this.#form.elements.namedItem('proxyExcludedDomains') as HTMLInputElement | null;
    if (proxyExcludedInput) proxyExcludedInput.value = c.proxyExcludedDomains ?? '';
  }

  set error(message: string) {
    this.#error.textContent = message;
    if (message) {
      trace('ui.login.error', { error: message });
    }
  }

  set busy(busy: boolean) {
    this.#busy = busy;
    this.#button.disabled = busy;
    this.#button.textContent = busy ? t('login.connecting') : t('login.submit');
  }
}

customElements.define('login-view', LoginView);
