import type { ConfluenceCredentials } from '../core/confluence-client.ts';
import { clearDiagnostics, exportLogs, trace } from '../core/diagnostics.ts';

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
      padding: 1.5rem 1rem 3rem;
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
    h2 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }
    label {
      display: grid;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text);
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
    <h2>Acceso al equipo</h2>
    <label>Email de Atlassian
      <input name="email" type="email" autocomplete="username" required />
    </label>
    <label>API token
      <input name="token" type="password" autocomplete="current-password" required />
    </label>
    <label>ID de la página de Confluence
      <input name="pageId" inputmode="numeric" pattern="[0-9]+" required />
    </label>
    <label>URL de Confluence (vacío = mismo origen)
      <input name="baseUrl" type="url" placeholder="https://tu-sitio.atlassian.net" />
    </label>
    <details class="turn-section">
      <summary>Conexión tras cortafuegos / proxy (TURN TLS)</summary>
      <div class="turn-fields">
        <label>Subdominio de Metered
          <input name="meteredDomain" type="text" placeholder="subdominio.metered.live" autocomplete="off" />
        </label>
        <label>API Key de Metered
          <input name="meteredApiKey" type="password" placeholder="Clave de Metered" autocomplete="off" />
        </label>
        <p class="hint">Usará TURNS sobre TLS (puerto 443). Estos datos son sensibles y no se almacenan.</p>
      </div>
    </details>
    <details class="proxy-section">
      <summary>Proxy HTTP/HTTPS</summary>
      <div class="proxy-fields">
        <label>URL y puerto
          <input name="proxyUrl" type="text" placeholder="http://proxy.ejemplo.com:8080" autocomplete="off" />
        </label>
        <label>Usuario
          <input name="proxyUser" type="text" placeholder="Usuario" autocomplete="off" />
        </label>
        <label>Password
          <input name="proxyPassword" type="password" placeholder="Password" autocomplete="current-password" />
        </label>
        <label>Lista de dominios excluidos
          <input name="proxyExcludedDomains" type="text" placeholder="localhost, 127.0.0.1, .empresa.com" autocomplete="off" />
        </label>
      </div>
    </details>
    <p class="hint">El token se guarda sin cifrar en este dispositivo.</p>
    <p class="error" role="alert"></p>
    <button type="submit">Entrar</button>
    <details class="logs-section">
      <summary>Diagnóstico y registros (logs)</summary>
      <div class="logs-fields">
        <p class="hint">Trazas y eventos del sistema útiles para diagnosticar incidencias de conexión o red.</p>
        <div class="logs-actions">
          <button type="button" class="btn-secondary btn-copy-logs">Copiar registros</button>
          <button type="button" class="btn-secondary btn-clear-logs">Limpiar</button>
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
  #logsDetails: HTMLDetailsElement;
  #logsOutput: HTMLPreElement;
  #copyLogsBtn: HTMLButtonElement;
  #clearLogsBtn: HTMLButtonElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#form = root.querySelector('form')!;
    this.#error = root.querySelector('.error')!;
    this.#button = root.querySelector('button[type="submit"]') || root.querySelector('button')!;
    this.#logsDetails = root.querySelector('details.logs-section')!;
    this.#logsOutput = root.querySelector('.logs-output')!;
    this.#copyLogsBtn = root.querySelector('.btn-copy-logs')!;
    this.#clearLogsBtn = root.querySelector('.btn-clear-logs')!;

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
        // Fallback: select text inside pre
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
  }

  set values(c: Partial<LoginDetails>) {
    for (const key of ['email', 'token', 'pageId', 'baseUrl'] as const) {
      const input = this.#form.elements.namedItem(key) as HTMLInputElement;
      input.value = c[key] ?? '';
    }
    // Sensitive TURN parameters are never restored or persisted
    const domainInput = this.#form.elements.namedItem('meteredDomain') as HTMLInputElement | null;
    if (domainInput) domainInput.value = '';
    const keyInput = this.#form.elements.namedItem('meteredApiKey') as HTMLInputElement | null;
    if (keyInput) keyInput.value = '';
    const proxyUrlInput = this.#form.elements.namedItem('proxyUrl') as HTMLInputElement | null;
    if (proxyUrlInput) proxyUrlInput.value = c.proxyUrl ?? '';
    const proxyUserInput = this.#form.elements.namedItem('proxyUser') as HTMLInputElement | null;
    if (proxyUserInput) proxyUserInput.value = c.proxyUser ?? '';
    // Sensitive proxy password is never restored or persisted
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
    this.#button.disabled = busy;
    this.#button.textContent = busy ? 'Conectando…' : 'Entrar';
  }
}

customElements.define('login-view', LoginView);
