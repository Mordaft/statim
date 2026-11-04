import { avatarUrl } from '../core/identicon.ts';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-block;
      flex: none;
      width: var(--avatar-size, 2.25rem);
      height: var(--avatar-size, 2.25rem);
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--surface);
    }
    .dot {
      display: none;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 28%;
      height: 28%;
      border-radius: 50%;
      background: #2da44e;
      border: 2px solid var(--bg);
    }
    :host([online]) .dot {
      display: block;
    }
  </style>
  <img alt="" />
  <span class="dot"></span>
`;

export class PeerAvatar extends HTMLElement {
  static observedAttributes = ['email'];
  #img: HTMLImageElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#img = root.querySelector('img')!;
  }

  attributeChangedCallback() {
    const email = this.getAttribute('email') ?? '';
    this.#img.alt = email;
    if (!email) return;
    void avatarUrl(email).then((url) => {
      if (this.getAttribute('email') === email) this.#img.src = url;
    });
  }
}

customElements.define('peer-avatar', PeerAvatar);
