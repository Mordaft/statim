import type { Session } from '../core/session.ts';
import './peer-avatar.ts';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      background: var(--bg);
    }
    h2 {
      margin: 0;
      padding: 1rem;
      font-size: 1rem;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0 0.5rem 1rem;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--radius);
    }
    .info {
      display: grid;
      min-width: 0;
    }
    .name {
      font-weight: 600;
    }
    .email {
      font-size: 0.8125rem;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .empty {
      padding: 0 1rem;
      color: var(--muted);
    }
  </style>
  <h2>Equipo</h2>
  <ul></ul>
`;

/** Emits `count` (CustomEvent<number>) with the number of connected peers. */
export class PeerList extends HTMLElement {
  #list: HTMLUListElement;
  #session?: Session;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#list = root.querySelector('ul')!;
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

  #render = async () => {
    const session = this.#session;
    if (!session) return;
    const peers = await session.registry.activePeers();
    const connected = new Set(session.mesh.connectedPeers());
    peers.sort((a, b) => Number(connected.has(b.email)) - Number(connected.has(a.email)) || a.email.localeCompare(b.email));

    if (!peers.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'Aún no hay compañeros anunciados.';
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
          email.textContent = connected.has(peer.email) ? peer.email : `${peer.email} · sin conexión directa`;
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
