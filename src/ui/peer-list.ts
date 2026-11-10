import { t } from '../core/i18n.ts';
import type { Session } from '../core/session.ts';
import './peer-avatar.ts';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      background: var(--bg);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text);
    }
    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: none;
      border-radius: 50%;
      background: var(--surface);
      color: var(--text);
      font-size: 1rem;
      cursor: pointer;
    }
    @media (min-width: 900px) {
      .close-btn {
        display: none;
      }
      .header {
        border-bottom: none;
        padding: 1rem;
      }
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0.5rem;
      overflow-y: auto;
      flex: 1;
      -webkit-overflow-scrolling: touch;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: var(--radius);
      transition: background-color 0.15s ease;
    }
    li:hover {
      background: var(--surface);
    }
    .info {
      display: grid;
      min-width: 0;
      gap: 0.125rem;
    }
    .name {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--text);
    }
    .email {
      font-size: 0.8125rem;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .empty {
      padding: 1.5rem 1rem;
      text-align: center;
      color: var(--muted);
      font-size: 0.875rem;
    }
  </style>
  <div class="header">
    <h2 class="title"></h2>
    <button class="close-btn" type="button" aria-label="Cerrar">✕</button>
  </div>
  <ul></ul>
`;

/** Emits `count` (CustomEvent<number>) with the number of connected peers and `close` when closed. */
export class PeerList extends HTMLElement {
  #list: HTMLUListElement;
  #title: HTMLElement;
  #closeBtn: HTMLButtonElement;
  #session?: Session;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#list = root.querySelector('ul')!;
    this.#title = root.querySelector('.title')!;
    this.#closeBtn = root.querySelector('.close-btn')!;

    this.#closeBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    });
    this.#updateTexts();
  }

  connectedCallback() {
    window.addEventListener('statim:locale-changed', this.#onLocaleChanged);
  }

  disconnectedCallback() {
    window.removeEventListener('statim:locale-changed', this.#onLocaleChanged);
    this.detach();
  }

  attach(session: Session): void {
    this.detach();
    this.#session = session;
    session.registry.addEventListener('peer', this.#render);
    session.mesh.addEventListener('links', this.#render);
    this.#render();
  }

  detach(): void {
    this.#session?.registry.removeEventListener('peer', this.#render);
    this.#session?.mesh.removeEventListener('links', this.#render);
    this.#session = undefined;
    this.#list.replaceChildren();
  }

  #onLocaleChanged = () => {
    this.#updateTexts();
    void this.#render();
  };

  #updateTexts(): void {
    this.#title.textContent = t('peers.title');
    this.#closeBtn.setAttribute('aria-label', t('peers.close'));
  }

  #render = async () => {
    const session = this.#session;
    if (!session) return;
    const peers = await session.registry.activePeers();
    const connected = new Set(session.mesh.connectedPeers());
    peers.sort((a, b) => Number(connected.has(b.email)) - Number(connected.has(a.email)) || a.email.localeCompare(b.email));

    if (!peers.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = t('peers.empty');
      this.#list.replaceChildren(empty);
    } else {
      this.#list.replaceChildren(
        ...peers.map((peer) => {
          const li = document.createElement('li');
          const avatar = document.createElement('peer-avatar');
          avatar.setAttribute('email', peer.email);
          avatar.toggleAttribute('online', connected.has(peer.email));
          const info = document.createElement('div');
          info.className = 'info';
          const name = document.createElement('span');
          name.className = 'name';
          name.textContent = peer.email.split('@')[0];
          const email = document.createElement('span');
          email.className = 'email';
          email.textContent = connected.has(peer.email) ? peer.email : `${peer.email} · ${t('peers.no_direct_connection')}`;
          info.append(name, email);
          li.append(avatar, info);
          return li;
        }),
      );
    }
    this.dispatchEvent(new CustomEvent<number>('count', { detail: connected.size }));
  };
}

customElements.define('peer-list', PeerList);
