import { db, type Message } from '../core/db.ts';
import type { MessageBatch } from '../core/mesh.ts';
import type { Session } from '../core/session.ts';
import './peer-avatar.ts';

const HISTORY_LIMIT = 200;
const NEAR_BOTTOM_PX = 80;
const timeFormat = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' });

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      height: 100%;
      min-height: 0;
    }
    .notice {
      margin: 0;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      text-align: center;
      background: var(--surface);
      color: var(--muted);
    }
    .notice:empty {
      display: none;
    }
    .viewport {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
    }
    ol {
      position: relative;
      list-style: none;
      margin: 0;
      padding: 1rem 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overscroll-behavior: contain;
      /* Scroll position is preserved manually; native anchoring is missing on iOS Safari and would double-correct. */
      overflow-anchor: none;
    }
    li.arrived {
      animation: arrive 240ms ease-out;
    }
    @keyframes arrive {
      from {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      li.arrived {
        animation: none;
      }
    }
    .jump {
      position: absolute;
      left: 50%;
      bottom: 0.75rem;
      transform: translateX(-50%);
      min-height: 2.25rem;
      padding: 0 1rem;
      border-radius: 999px;
      font-size: 0.875rem;
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.25);
    }
    .jump[hidden] {
      display: none;
    }
    li {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      max-width: 85%;
    }
    li.mine {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .bubble {
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius);
      background: var(--surface);
      min-width: 0;
    }
    li.mine .bubble {
      background: var(--accent);
      color: var(--accent-text);
    }
    .meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.75rem;
      opacity: 0.75;
      margin-bottom: 0.125rem;
    }
    .text {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    form {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    textarea {
      flex: 1;
      font: inherit;
      font-size: 1rem;
      resize: none;
      max-height: 10rem;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
    }
    button {
      font: inherit;
      font-weight: 600;
      min-width: 3rem;
      min-height: 2.75rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
    }
  </style>
  <p class="notice" role="status"></p>
  <div class="viewport">
    <ol aria-live="polite"></ol>
    <button class="jump" type="button" hidden></button>
  </div>
  <form>
    <textarea rows="1" maxlength="4000" placeholder="Escribe un mensaje" aria-label="Mensaje" enterkeyhint="send"></textarea>
    <button type="submit" aria-label="Enviar">Enviar</button>
  </form>
`;

export class ChatRoom extends HTMLElement {
  #list: HTMLOListElement;
  #form: HTMLFormElement;
  #input: HTMLTextAreaElement;
  #notice: HTMLElement;
  #jump: HTMLButtonElement;
  #session?: Session;
  #rendered = new Set<string>();
  #unseen = 0;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#list = root.querySelector('ol')!;
    this.#form = root.querySelector('form')!;
    this.#input = root.querySelector('textarea')!;
    this.#notice = root.querySelector('.notice')!;
    this.#jump = root.querySelector('.jump')!;

    this.#jump.addEventListener('click', () => this.#scrollToEnd());
    this.#list.addEventListener('scroll', () => this.#isNearBottom() && this.#clearUnseen(), { passive: true });

    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.#send();
    });
    this.#input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        this.#form.requestSubmit();
      }
    });
    this.#input.addEventListener('input', () => this.#autosize());
  }

  async attach(session: Session): Promise<void> {
    this.detach();
    this.#session = session;
    session.mesh.addEventListener('messages', this.#onMessages);
    session.mesh.addEventListener('links', this.#updateNotice);
    const recent = await db.messages.orderBy('ts').reverse().limit(HISTORY_LIMIT).toArray();
    recent.reverse();
    this.#rendered = new Set(recent.map((m) => m.msgId));
    this.#list.replaceChildren(...recent.map((m) => this.#render(m)));
    this.#updateNotice();
    this.#scrollToEnd();
  }

  detach(): void {
    this.#session?.mesh.removeEventListener('messages', this.#onMessages);
    this.#session?.mesh.removeEventListener('links', this.#updateNotice);
    this.#session = undefined;
  }

  #onMessages = (e: Event) => {
    this.#insert((e as CustomEvent<MessageBatch>).detail.messages, true);
  };

  #updateNotice = () => {
    const connected = this.#session?.mesh.connectedPeers().length ?? 0;
    this.#notice.textContent = connected ? '' : 'Nadie conectado: tus mensajes llegarán cuando alguien se conecte (hasta 10 h).';
  };

  async #send(): Promise<void> {
    const text = this.#input.value;
    if (!text.trim() || !this.#session) return;
    this.#input.value = '';
    this.#autosize();
    try {
      this.#insert([await this.#session.mesh.send(text)], false, true);
    } catch {
      this.#input.value = text;
      this.#notice.textContent = 'No se pudo enviar el mensaje.';
    }
  }

  /**
   * Inserts a batch in sender-time order in a single pass. If the reader was at the bottom it stays there;
   * otherwise the first visible message keeps its on-screen position and newer arrivals are counted in the jump pill.
   */
  #insert(messages: Message[], animate: boolean, stickToBottom = false): void {
    const fresh = messages.filter((m) => !this.#rendered.has(m.msgId)).sort((a, b) => b.ts - a.ts);
    if (!fresh.length) return;

    const atBottom = stickToBottom || this.#isNearBottom();
    const anchor = atBottom ? null : this.#firstVisible();
    const anchorOffset = anchor ? anchor.offsetTop - this.#list.scrollTop : 0;
    const last = this.#list.lastElementChild as HTMLLIElement | null;
    const lastTs = last ? Number(last.dataset.ts) : -Infinity;

    let cursor = last;
    let below = 0;
    for (const message of fresh) {
      while (cursor && Number(cursor.dataset.ts) > message.ts) cursor = cursor.previousElementSibling as HTMLLIElement | null;
      const li = this.#render(message);
      if (animate) li.classList.add('arrived');
      if (cursor) cursor.after(li);
      else this.#list.prepend(li);
      this.#rendered.add(message.msgId);
      if (message.ts >= lastTs) below++;
    }

    if (atBottom) {
      this.#scrollToEnd();
      return;
    }
    if (anchor) this.#list.scrollTop = anchor.offsetTop - anchorOffset;
    if (below) {
      this.#unseen += below;
      this.#jump.textContent = this.#unseen === 1 ? '1 mensaje nuevo ↓' : `${this.#unseen} mensajes nuevos ↓`;
      this.#jump.hidden = false;
    }
  }

  #firstVisible(): HTMLLIElement | null {
    const top = this.#list.scrollTop;
    for (const li of this.#list.children as HTMLCollectionOf<HTMLLIElement>) {
      if (li.offsetTop + li.offsetHeight > top) return li;
    }
    return null;
  }

  #isNearBottom(): boolean {
    return this.#list.scrollHeight - this.#list.scrollTop - this.#list.clientHeight < NEAR_BOTTOM_PX;
  }

  #clearUnseen(): void {
    this.#unseen = 0;
    this.#jump.hidden = true;
  }

  #render(message: Message): HTMLLIElement {
    const li = document.createElement('li');
    li.dataset.ts = String(message.ts);
    li.classList.toggle('mine', message.from === this.#session?.registry.email);

    const avatar = document.createElement('peer-avatar');
    avatar.setAttribute('email', message.from);

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('span');
    name.textContent = message.from.split('@')[0];
    const time = document.createElement('time');
    time.dateTime = new Date(message.ts).toISOString();
    time.textContent = timeFormat.format(message.ts);
    meta.append(name, time);
    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = message.text;
    bubble.append(meta, text);

    li.append(avatar, bubble);
    return li;
  }

  #scrollToEnd(): void {
    this.#list.scrollTop = this.#list.scrollHeight;
    this.#clearUnseen();
  }

  #autosize(): void {
    this.#input.style.height = 'auto';
    this.#input.style.height = `${this.#input.scrollHeight}px`;
  }
}

customElements.define('chat-room', ChatRoom);
