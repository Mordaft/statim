import type { ConfluenceCredentials } from '../core/confluence-client.ts';

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
      padding: 1.5rem 1rem;
    }
    form {
      display: grid;
      gap: 1rem;
      max-width: 26rem;
      margin: 0 auto;
    }
    h2 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
    }
    label {
      display: grid;
      gap: 0.375rem;
      font-size: 0.875rem;
      color: var(--muted);
    }
    input {
      font: inherit;
      font-size: 1rem;
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
    }
    details.turn-section,
    details.proxy-section {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 0.625rem 0.75rem;
      background: var(--surface);
    }
    details.turn-section summary,
    details.proxy-section summary {
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
      user-select: none;
    }
    .turn-fields,
    .proxy-fields {
      display: grid;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    button {
      font: inherit;
      font-weight: 600;
      min-height: 3rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
    }
    button:disabled {
      opacity: 0.6;
    }
    .hint {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--muted);
    }
    .error {
      margin: 0;
      color: #cf222e;
    }
    .error:empty {
      display: none;
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
  </form>
`;

/** Emits `login` (CustomEvent<LoginDetails>). */
export class LoginView extends HTMLElement {
  #form: HTMLFormElement;
  #error: HTMLElement;
  #button: HTMLButtonElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#form = root.querySelector('form')!;
    this.#error = root.querySelector('.error')!;
    this.#button = root.querySelector('button')!;
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
  }

  set busy(busy: boolean) {
    this.#button.disabled = busy;
    this.#button.textContent = busy ? 'Conectando…' : 'Entrar';
  }
}

customElements.define('login-view', LoginView);
