import { db, type Message } from '../core/db.ts';
import { formatDateDivider, formatTime, t } from '../core/i18n.ts';
import type { MessageBatch } from '../core/mesh.ts';
import type { Session } from '../core/session.ts';
import './peer-avatar.ts';

const HISTORY_LIMIT = 200;
const NEAR_BOTTOM_PX = 80;
const GROUP_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      height: 100%;
      min-height: 0;
      position: relative;
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
      overflow: hidden;
    }
    .pull-indicator {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: var(--accent);
      color: var(--accent-text);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
      z-index: 15;
      pointer-events: none;
      animation: fadeIn 0.15s ease-out;
    }
    .sticky-date {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: var(--surface);
      color: var(--muted);
      border: 1px solid var(--border);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.12);
      z-index: 5;
      pointer-events: none;
      user-select: none;
      transition: opacity 0.2s ease;
    }
    .sticky-date[hidden],
    .pull-indicator[hidden] {
      display: none;
    }
    ol {
      position: relative;
      list-style: none;
      margin: 0;
      padding: 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      overflow-anchor: none;
    }
    li {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      max-width: 88%;
      transition: margin 0.15s ease;
      touch-action: pan-y;
      -webkit-touch-callout: none;
      user-select: text;
    }
    li.arrived {
      animation: arrive 240ms ease-out;
    }
    @keyframes arrive {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      li.arrived {
        animation: none;
      }
    }
    li.mine {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    /* Grouped consecutive messages from the same sender */
    li.grouped {
      margin-top: -0.375rem;
    }
    li.grouped peer-avatar {
      visibility: hidden;
      pointer-events: none;
    }
    li.grouped .meta {
      display: none;
    }
    .bubble {
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius);
      background: var(--surface);
      border: 1px solid var(--border);
      min-width: 0;
      word-break: break-word;
      cursor: pointer;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
    }
    li:not(.mine).grouped .bubble {
      border-top-left-radius: 4px;
    }
    li.mine .bubble {
      background: var(--accent);
      color: var(--accent-text);
      border: 1px solid transparent;
      box-shadow: 0 2px 8px rgb(59 130 246 / 0.25);
    }
    li.mine.grouped .bubble {
      border-top-right-radius: 4px;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      margin-bottom: 0.125rem;
    }
    li:not(.mine) .meta span:first-child {
      color: var(--author-accent, var(--soft-lavender, #c4b5fd));
      font-weight: 600;
    }
    li.mine .meta {
      opacity: 0.85;
    }
    .delivery-status {
      display: inline-flex;
      align-items: center;
      font-size: 0.6875rem;
      user-select: none;
      margin-left: 0.125rem;
    }
    .delivery-status.sent {
      color: var(--celery-mist, #a8b899);
      opacity: 1;
    }
    li.mine .delivery-status.sent {
      color: rgba(255, 255, 255, 0.9);
    }
    .delivery-status.pending {
      color: var(--topaz-volt, #f4a261);
      font-size: 0.625rem;
      opacity: 0.9;
    }
    li.mine .delivery-status.pending {
      color: rgba(255, 255, 255, 0.75);
    }
    .msg-quote {
      margin: 0 0 0.375rem 0;
      padding: 0.25rem 0.5rem;
      border-left: 3px solid var(--soft-lavender, #c4b5fd);
      background: rgba(196, 181, 253, 0.12);
      border-radius: 0 4px 4px 0;
      font-size: 0.8125rem;
      color: var(--muted);
      font-style: italic;
    }
    li.mine .msg-quote {
      border-left-color: rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.9);
    }
    .text {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.4;
    }
    .jump {
      position: absolute;
      left: 50%;
      bottom: 0.75rem;
      transform: translateX(-50%);
      min-height: 2.25rem;
      padding: 0 1rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      background: var(--surface);
      color: var(--text);
      box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      z-index: 10;
      transition: transform 0.1s ease, background 0.15s ease;
    }
    .jump:active {
      transform: translateX(-50%) scale(0.97);
    }
    .jump[hidden] {
      display: none;
    }
    form {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      padding-bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    textarea {
      flex: 1;
      font: inherit;
      font-size: 1rem;
      line-height: 1.4;
      resize: none;
      max-height: 9rem;
      padding: 0.625rem 0.75rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      -webkit-appearance: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    .btn-emoji-toggle {
      font-size: 1.25rem;
      line-height: 1;
      width: 2.75rem;
      min-width: 2.75rem;
      height: 2.75rem;
      display: grid;
      place-items: center;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      cursor: pointer;
      touch-action: manipulation;
      transition: background 0.15s ease, border-color 0.15s ease;
      padding: 0;
      color: var(--text);
      flex-shrink: 0;
    }
    .btn-emoji-toggle:active {
      background: var(--bg);
    }
    .btn-emoji-toggle.active {
      border-color: var(--accent);
      background: rgb(31 111 235 / 0.15);
    }
    .emoji-bar {
      display: flex;
      align-items: center;
      padding: 0.375rem 0.5rem;
      background: var(--surface);
      border-top: 1px solid var(--border);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      animation: fadeIn 0.15s ease-out;
    }
    .emoji-bar::-webkit-scrollbar {
      display: none;
    }
    .emoji-bar[hidden] {
      display: none !important;
    }
    .emoji-scroll {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin: 0 auto;
      max-width: 100%;
    }
    .emoji-btn {
      font-size: 1.35rem;
      line-height: 1;
      width: 2.375rem;
      height: 2.375rem;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
      touch-action: manipulation;
      transition: transform 0.1s ease, background 0.15s ease;
      flex-shrink: 0;
      padding: 0;
    }
    .emoji-btn:active {
      transform: scale(1.25);
      background: rgb(255 255 255 / 0.12);
    }
    button[type="submit"] {
      font: inherit;
      font-weight: 600;
      min-width: 3.25rem;
      min-height: 2.75rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 2px 8px rgb(59 130 246 / 0.3);
      transition: opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    button[type="submit"]:hover:not(:disabled) {
      background: var(--accent-hover);
      box-shadow: 0 4px 12px rgb(59 130 246 / 0.4);
    }
    button[type="submit"]:active {
      transform: scale(0.97);
    }

    /* Toast Notification */
    .toast {
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.5rem 1rem;
      background: var(--text);
      color: var(--bg);
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 999px;
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.25);
      z-index: 100;
      pointer-events: none;
      animation: fadeIn 0.15s ease-out;
    }
    .toast[hidden] {
      display: none;
    }

    /* Context Menu Bottom Sheet */
    .msg-menu-backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.5);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 80;
      animation: fadeIn 0.15s ease-out;
    }
    .msg-menu-sheet {
      position: fixed;
      inset: auto 0 0 0;
      background: var(--bg);
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
      padding: 1rem;
      padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
      z-index: 85;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 28rem;
      margin: 0 auto;
      animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .msg-menu-backdrop[hidden],
    .msg-menu-sheet[hidden] {
      display: none;
    }
    .menu-handle {
      width: 36px;
      height: 4px;
      background: var(--muted);
      opacity: 0.35;
      border-radius: 999px;
      margin: 0 auto 0.5rem;
    }
    .menu-preview {
      font-size: 0.8125rem;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0.375rem 0.625rem;
      border-left: 3px solid var(--soft-lavender, #c4b5fd);
      background: var(--surface);
      border-radius: 0 6px 6px 0;
      margin-bottom: 0.5rem;
    }
    .menu-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      font: inherit;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      width: 100%;
      touch-action: manipulation;
    }
    .menu-btn:active {
      background: var(--border);
    }
    .menu-reactions {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0.375rem 0.25rem 0.625rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0.375rem;
    }
    .react-btn {
      font-size: 1.5rem;
      line-height: 1;
      width: 2.75rem;
      height: 2.75rem;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 50%;
      background: var(--surface);
      cursor: pointer;
      touch-action: manipulation;
      transition: transform 0.12s ease;
      padding: 0;
    }
    .react-btn:active {
      transform: scale(1.3);
    }
    .info-card {
      display: grid;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--surface);
      border-radius: var(--radius);
      font-size: 0.8125rem;
      margin-bottom: 0.25rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .info-label {
      color: var(--muted);
      font-weight: 500;
    }
    .info-val {
      font-weight: 600;
      color: var(--text);
      text-align: right;
      word-break: break-all;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  </style>
  <p class="notice" role="status"></p>
  <div class="viewport">
    <div class="pull-indicator" hidden>↓ Desliza para comprobar señales</div>
    <div class="sticky-date" hidden></div>
    <ol aria-live="polite"></ol>
    <button class="jump" type="button" hidden></button>
  </div>
  <div class="emoji-bar" role="toolbar" aria-label="Emojis rápidos" hidden>
    <div class="emoji-scroll">
      <button type="button" class="emoji-btn" data-emoji="👍" aria-label="👍">👍</button>
      <button type="button" class="emoji-btn" data-emoji="❤️" aria-label="❤️">❤️</button>
      <button type="button" class="emoji-btn" data-emoji="😂" aria-label="😂">😂</button>
      <button type="button" class="emoji-btn" data-emoji="🎉" aria-label="🎉">🎉</button>
      <button type="button" class="emoji-btn" data-emoji="👀" aria-label="👀">👀</button>
      <button type="button" class="emoji-btn" data-emoji="✅" aria-label="✅">✅</button>
      <button type="button" class="emoji-btn" data-emoji="🚀" aria-label="🚀">🚀</button>
      <button type="button" class="emoji-btn" data-emoji="🙏" aria-label="🙏">🙏</button>
      <button type="button" class="emoji-btn" data-emoji="🔥" aria-label="🔥">🔥</button>
      <button type="button" class="emoji-btn" data-emoji="👏" aria-label="👏">👏</button>
    </div>
  </div>
  <form>
    <button type="button" class="btn-emoji-toggle" aria-label="Reacciones y emojis rápidos" title="Emojis">😊</button>
    <textarea rows="1" maxlength="4000" enterkeyhint="send"></textarea>
    <button type="submit"></button>
  </form>
  <div class="toast" hidden></div>
  <div class="msg-menu-backdrop" hidden></div>
  <div class="msg-menu-sheet" hidden>
    <div class="menu-handle"></div>
    <div class="menu-preview"></div>
    <div class="menu-reactions">
      <button type="button" class="react-btn" data-emoji="👍" aria-label="👍">👍</button>
      <button type="button" class="react-btn" data-emoji="❤️" aria-label="❤️">❤️</button>
      <button type="button" class="react-btn" data-emoji="😂" aria-label="😂">😂</button>
      <button type="button" class="react-btn" data-emoji="🎉" aria-label="🎉">🎉</button>
      <button type="button" class="react-btn" data-emoji="👀" aria-label="👀">👀</button>
      <button type="button" class="react-btn" data-emoji="🚀" aria-label="🚀">🚀</button>
    </div>
    <div class="info-card" hidden>
      <div class="info-row"><span class="info-label label-from"></span><span class="info-val val-from"></span></div>
      <div class="info-row"><span class="info-label label-date"></span><span class="info-val val-date"></span></div>
      <div class="info-row"><span class="info-label label-id"></span><span class="info-val val-id"></span></div>
      <div class="info-row"><span class="info-label label-delivery"></span><span class="info-val val-delivery"></span></div>
    </div>
    <button type="button" class="menu-btn btn-copy">📋 <span class="txt-copy"></span></button>
    <button type="button" class="menu-btn btn-reply">💬 <span class="txt-reply"></span></button>
    <button type="button" class="menu-btn btn-info">ℹ️ <span class="txt-info"></span></button>
    <button type="button" class="menu-btn btn-close-menu">✕ <span class="txt-close"></span></button>
  </div>
`;

export class ChatRoom extends HTMLElement {
  #list: HTMLOListElement;
  #form: HTMLFormElement;
  #input: HTMLTextAreaElement;
  #submitBtn: HTMLButtonElement;
  #notice: HTMLElement;
  #jump: HTMLButtonElement;
  #stickyDate: HTMLElement;
  #pullIndicator: HTMLElement;
  #toast: HTMLElement;
  #menuBackdrop: HTMLElement;
  #menuSheet: HTMLElement;
  #menuPreview: HTMLElement;
  #menuReactions: HTMLElement;
  #infoCard: HTMLElement;
  #emojiBar: HTMLElement;
  #emojiToggleBtn: HTMLButtonElement;
  #session?: Session;
  #rendered = new Set<string>();
  #unseen = 0;
  #activeMessage?: Message;
  #toastTimer?: ReturnType<typeof setTimeout>;

  // Touch & Pull-to-refresh
  #pullStartY = 0;
  #isPulling = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#list = root.querySelector('ol')!;
    this.#form = root.querySelector('form')!;
    this.#input = root.querySelector('textarea')!;
    this.#submitBtn = root.querySelector('button[type="submit"]')!;
    this.#notice = root.querySelector('.notice')!;
    this.#jump = root.querySelector('.jump')!;
    this.#stickyDate = root.querySelector('.sticky-date')!;
    this.#pullIndicator = root.querySelector('.pull-indicator')!;
    this.#toast = root.querySelector('.toast')!;
    this.#menuBackdrop = root.querySelector('.msg-menu-backdrop')!;
    this.#menuSheet = root.querySelector('.msg-menu-sheet')!;
    this.#menuPreview = root.querySelector('.menu-preview')!;
    this.#menuReactions = root.querySelector('.menu-reactions')!;
    this.#infoCard = root.querySelector('.info-card')!;
    this.#emojiBar = root.querySelector('.emoji-bar')!;
    this.#emojiToggleBtn = root.querySelector('.btn-emoji-toggle')!;

    try {
      if (localStorage.getItem('statim.emoji_open') === 'true') {
        this.#emojiBar.hidden = false;
        this.#emojiToggleBtn.classList.add('active');
      }
    } catch {
      // Storage access may be restricted
    }

    this.#emojiToggleBtn.addEventListener('click', () => {
      const willShow = Boolean(this.#emojiBar.hidden);
      this.#emojiBar.hidden = !willShow;
      this.#emojiToggleBtn.classList.toggle('active', willShow);
      try {
        localStorage.setItem('statim.emoji_open', String(willShow));
      } catch {
        // Storage access may be restricted
      }
    });

    this.#emojiBar.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.emoji-btn');
      if (!btn) return;
      const emoji = btn.dataset.emoji;
      if (!emoji) return;

      const start = this.#input.selectionStart ?? this.#input.value.length;
      const end = this.#input.selectionEnd ?? this.#input.value.length;
      const val = this.#input.value;
      this.#input.value = val.slice(0, start) + emoji + val.slice(end);
      const newPos = start + emoji.length;
      this.#input.setSelectionRange(newPos, newPos);
      this.#autosize();
      this.#input.focus();
      try {
        navigator.vibrate?.(10);
      } catch {
        // Haptics unavailable
      }
    });

    this.#jump.addEventListener('click', () => this.#scrollToEnd());
    this.#list.addEventListener(
      'scroll',
      () => {
        if (this.#isNearBottom()) this.#clearUnseen();
        this.#updateStickyDate();
      },
      { passive: true },
    );

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
    this.#input.addEventListener('focus', () => {
      if (this.#isNearBottom()) {
        setTimeout(() => this.#scrollToEnd(), 200);
      }
    });

    this.#setupPullToRefresh();
    this.#setupMenuListeners();
    this.#updateTexts();
  }

  connectedCallback() {
    window.addEventListener('statim:locale-changed', this.#onLocaleChanged);
  }

  disconnectedCallback() {
    window.removeEventListener('statim:locale-changed', this.#onLocaleChanged);
    this.detach();
  }

  async attach(session: Session): Promise<void> {
    this.detach();
    this.#session = session;
    session.mesh.addEventListener('messages', this.#onMessages);
    session.mesh.addEventListener('links', this.#onLinksChanged);
    const recent = await db.messages.orderBy('ts').reverse().limit(HISTORY_LIMIT).toArray();
    recent.reverse();
    this.#rendered = new Set(recent.map((m) => m.msgId));
    this.#list.replaceChildren(...recent.map((m) => this.#render(m)));
    this.#refreshGrouping();
    this.#updateDeliveryStatuses();
    this.#updateStickyDate();
    this.#updateNotice();
    this.#scrollToEnd();
  }

  detach(): void {
    this.#session?.mesh.removeEventListener('messages', this.#onMessages);
    this.#session?.mesh.removeEventListener('links', this.#onLinksChanged);
    this.#session = undefined;
  }

  #onLocaleChanged = () => {
    this.#updateTexts();
    this.#updateNotice();
    this.#updateStickyDate();
    this.#updateDeliveryStatuses();
    if (this.#unseen > 0) {
      this.#jump.textContent = this.#unseen === 1 ? t('chat.jump_one') : t('chat.jump_many', { count: this.#unseen });
    }
  };

  #updateTexts(): void {
    this.#input.placeholder = t('chat.input_placeholder');
    this.#input.setAttribute('aria-label', t('chat.input_aria'));
    this.#submitBtn.textContent = t('chat.send_btn');
    this.#submitBtn.setAttribute('aria-label', t('chat.send_btn'));

    const root = this.shadowRoot!;
    root.querySelector('.txt-copy')!.textContent = t('menu.copy');
    root.querySelector('.txt-reply')!.textContent = t('menu.reply');
    root.querySelector('.txt-info')!.textContent = t('menu.info');
    root.querySelector('.txt-close')!.textContent = t('menu.close');
    root.querySelector('.label-from')!.textContent = t('menu.from');
    root.querySelector('.label-date')!.textContent = t('menu.date');
    root.querySelector('.label-id')!.textContent = t('menu.id');
    root.querySelector('.label-delivery')!.textContent = t('menu.delivery');
    this.#emojiToggleBtn.setAttribute('aria-label', t('chat.emoji_toggle'));
    this.#emojiToggleBtn.title = t('chat.emoji_toggle');
    this.#emojiBar.setAttribute('aria-label', t('chat.emoji_toggle'));
  }

  #onMessages = (e: Event) => {
    this.#insert((e as CustomEvent<MessageBatch>).detail.messages, true);
  };

  #onLinksChanged = () => {
    this.#updateNotice();
    this.#updateDeliveryStatuses();
  };

  #updateNotice = () => {
    const connected = this.#session?.mesh.connectedPeers().length ?? 0;
    this.#notice.textContent = connected ? '' : t('chat.notice_nobody');
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
      this.#notice.textContent = t('chat.send_failed');
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
      while (cursor && Number(cursor.dataset.ts) > message.ts) {
        cursor = cursor.previousElementSibling as HTMLLIElement | null;
      }
      const li = this.#render(message);
      if (animate) li.classList.add('arrived');
      if (cursor) cursor.after(li);
      else this.#list.prepend(li);
      this.#rendered.add(message.msgId);
      if (message.ts >= lastTs) below++;
    }

    this.#refreshGrouping();
    this.#updateDeliveryStatuses();

    if (atBottom) {
      this.#scrollToEnd();
      return;
    }
    if (anchor) this.#list.scrollTop = anchor.offsetTop - anchorOffset;
    if (below) {
      this.#unseen += below;
      this.#jump.textContent = this.#unseen === 1 ? t('chat.jump_one') : t('chat.jump_many', { count: this.#unseen });
      this.#jump.hidden = false;
    }
    this.#updateStickyDate();
  }

  #refreshGrouping(): void {
    const items = this.#list.children as HTMLCollectionOf<HTMLLIElement>;
    let prev: HTMLLIElement | null = null;
    for (const li of items) {
      const isGrouped =
        Boolean(prev) &&
        prev!.dataset.from === li.dataset.from &&
        Number(li.dataset.ts) - Number(prev!.dataset.ts) < GROUP_THRESHOLD_MS &&
        Number(li.dataset.ts) >= Number(prev!.dataset.ts);

      li.classList.toggle('grouped', isGrouped);
      prev = li;
    }
  }

  #updateDeliveryStatuses(): void {
    const connected = (this.#session?.mesh.connectedPeers().length ?? 0) > 0;
    for (const li of this.#list.querySelectorAll<HTMLLIElement>('li.mine')) {
      const statusEl = li.querySelector<HTMLElement>('.delivery-status');
      if (statusEl) {
        statusEl.className = `delivery-status ${connected ? 'sent' : 'pending'}`;
        statusEl.textContent = connected ? '✓✓' : '🕒';
        statusEl.title = connected ? t('chat.status_sent') : t('chat.status_pending');
      }
    }
  }

  #updateStickyDate(): void {
    const first = this.#firstVisible();
    if (!first) {
      this.#stickyDate.hidden = true;
      return;
    }
    const ts = Number(first.dataset.ts);
    if (!ts) {
      this.#stickyDate.hidden = true;
      return;
    }
    this.#stickyDate.textContent = formatDateDivider(ts);
    this.#stickyDate.hidden = false;
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
    li.dataset.from = message.from;
    const isMine = message.from === this.#session?.registry.email;
    li.classList.toggle('mine', isMine);

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
    time.textContent = formatTime(message.ts);
    meta.append(name, time);

    if (isMine) {
      const delivery = document.createElement('span');
      const hasPeers = (this.#session?.mesh.connectedPeers().length ?? 0) > 0;
      delivery.className = `delivery-status ${hasPeers ? 'sent' : 'pending'}`;
      delivery.textContent = hasPeers ? '✓✓' : '🕒';
      delivery.title = hasPeers ? t('chat.status_sent') : t('chat.status_pending');
      meta.append(delivery);
    }

    const text = document.createElement('div');
    text.className = 'text';
    if (message.text.startsWith('> ')) {
      const nl = message.text.indexOf('\n');
      if (nl !== -1) {
        const quotePart = message.text.slice(2, nl).trim();
        const bodyPart = message.text.slice(nl + 1).replace(/^\n+/, '');
        const qEl = document.createElement('div');
        qEl.className = 'msg-quote';
        qEl.textContent = quotePart;
        const bodyEl = document.createElement('div');
        bodyEl.textContent = bodyPart;
        text.append(qEl, bodyEl);
      } else {
        text.textContent = message.text;
      }
    } else {
      text.textContent = message.text;
    }
    bubble.append(meta, text);

    // Setup Long-press & Context Menu on bubble
    this.#attachMessageInteractions(bubble, message);

    li.append(avatar, bubble);
    return li;
  }

  #attachMessageInteractions(bubble: HTMLElement, message: Message): void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let startX = 0;
    let startY = 0;

    const cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    bubble.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        timer = setTimeout(() => {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate?.(15);
          }
          this.#openMenu(message);
        }, 400);
      },
      { passive: true },
    );

    bubble.addEventListener(
      'touchmove',
      (e) => {
        if (!timer) return;
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > 10 || dy > 10) cancel();
      },
      { passive: true },
    );

    bubble.addEventListener('touchend', cancel);
    bubble.addEventListener('touchcancel', cancel);

    // Desktop right-click
    bubble.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.#openMenu(message);
    });
  }

  #openMenu(message: Message): void {
    this.#activeMessage = message;
    this.#menuPreview.textContent = `${message.from.split('@')[0]}: ${message.text.slice(0, 80)}`;
    this.#infoCard.hidden = true;
    this.#menuBackdrop.hidden = false;
    this.#menuSheet.hidden = false;
  }

  #closeMenu(): void {
    this.#menuBackdrop.hidden = true;
    this.#menuSheet.hidden = true;
    this.#activeMessage = undefined;
  }

  #setupMenuListeners(): void {
    this.#menuBackdrop.addEventListener('click', () => this.#closeMenu());
    this.shadowRoot!.querySelector('.btn-close-menu')!.addEventListener('click', () => this.#closeMenu());

    // Copy action
    this.shadowRoot!.querySelector('.btn-copy')!.addEventListener('click', async () => {
      if (!this.#activeMessage) return;
      const textToCopy = this.#activeMessage.text;
      this.#closeMenu();
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          this.#showToast(t('chat.copied'));
        }
      } catch {
        // Fallback
      }
    });

    // Reply / Quote action
    this.shadowRoot!.querySelector('.btn-reply')!.addEventListener('click', () => {
      if (!this.#activeMessage) return;
      const author = this.#activeMessage.from.split('@')[0];
      const preview = this.#activeMessage.text.split('\n')[0].slice(0, 60);
      const quote = `> ${author}: ${preview}\n\n`;
      this.#input.value = `${quote}${this.#input.value}`;
      this.#closeMenu();
      this.#autosize();
      this.#input.focus();
      this.#input.setSelectionRange(this.#input.value.length, this.#input.value.length);
    });

    // Info action
    this.shadowRoot!.querySelector('.btn-info')!.addEventListener('click', () => {
      if (!this.#activeMessage) return;
      const m = this.#activeMessage;
      const isMine = m.from === this.#session?.registry.email;
      const hasPeers = (this.#session?.mesh.connectedPeers().length ?? 0) > 0;
      const root = this.shadowRoot!;
      root.querySelector('.val-from')!.textContent = m.from;
      root.querySelector('.val-date')!.textContent = new Date(m.ts).toLocaleString();
      root.querySelector('.val-id')!.textContent = m.msgId;

      let delivery = t('menu.delivery_received');
      if (isMine) {
        delivery = hasPeers ? t('menu.delivery_sent') : t('menu.delivery_pending');
      }
      root.querySelector('.val-delivery')!.textContent = delivery;
      this.#infoCard.hidden = !this.#infoCard.hidden;
    });

    // Quick reaction from message menu
    this.#menuReactions.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.react-btn');
      if (!btn || !this.#activeMessage) return;
      const emoji = btn.dataset.emoji;
      if (!emoji) return;

      const author = this.#activeMessage.from.split('@')[0];
      const preview = this.#activeMessage.text.split('\n')[0].slice(0, 60);
      const quote = `> ${author}: ${preview}\n${emoji} `;
      this.#input.value = `${quote}${this.#input.value}`;
      this.#closeMenu();
      this.#autosize();
      this.#input.focus();
      this.#input.setSelectionRange(this.#input.value.length, this.#input.value.length);
      try {
        navigator.vibrate?.(15);
      } catch {
        // Haptics unavailable
      }
    });
  }

  #showToast(text: string): void {
    if (this.#toastTimer) clearTimeout(this.#toastTimer);
    this.#toast.textContent = text;
    this.#toast.hidden = false;
    this.#toastTimer = setTimeout(() => {
      this.#toast.hidden = true;
    }, 2000);
  }

  #setupPullToRefresh(): void {
    this.#list.addEventListener(
      'touchstart',
      (e) => {
        if (this.#list.scrollTop <= 0 && e.touches.length === 1) {
          this.#pullStartY = e.touches[0].clientY;
          this.#isPulling = true;
        }
      },
      { passive: true },
    );

    this.#list.addEventListener(
      'touchmove',
      (e) => {
        if (!this.#isPulling) return;
        const diff = e.touches[0].clientY - this.#pullStartY;
        if (diff > 40 && this.#list.scrollTop <= 0) {
          this.#pullIndicator.hidden = false;
        } else {
          this.#pullIndicator.hidden = true;
        }
      },
      { passive: true },
    );

    this.#list.addEventListener('touchend', (e) => {
      if (!this.#isPulling) return;
      this.#isPulling = false;
      const diff = e.changedTouches[0].clientY - this.#pullStartY;
      if (diff > 60 && this.#list.scrollTop <= 0) {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.(10);
        }
        this.dispatchEvent(new CustomEvent('statim:refresh', { bubbles: true, composed: true }));
      }
      this.#pullIndicator.hidden = true;
    });
  }

  #scrollToEnd(): void {
    this.#list.scrollTop = this.#list.scrollHeight;
    this.#clearUnseen();
    this.#updateStickyDate();
  }

  #autosize(): void {
    this.#input.style.height = 'auto';
    this.#input.style.height = `${this.#input.scrollHeight}px`;
  }
}

customElements.define('chat-room', ChatRoom);
