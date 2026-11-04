import type { ConfluenceCredentials } from '../core/confluence-client.ts';

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
    <p class="hint">El token se guarda sin cifrar en este dispositivo.</p>
    <p class="error" role="alert"></p>
    <button type="submit">Entrar</button>
  </form>
`;

/** Emits `login` (CustomEvent<ConfluenceCredentials>). */
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
      this.dispatchEvent(
        new CustomEvent<ConfluenceCredentials>('login', {
          detail: { email: value('email'), token: value('token'), pageId: value('pageId'), baseUrl: value('baseUrl') },
        }),
      );
    });
  }

  set values(c: Partial<ConfluenceCredentials>) {
    for (const key of ['email', 'token', 'pageId', 'baseUrl'] as const) {
      const input = this.#form.elements.namedItem(key) as HTMLInputElement;
      input.value = c[key] ?? '';
    }
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
