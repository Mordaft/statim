import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ConfluenceCredentials } from '../core/confluence-client.ts';
import { db, type Message } from '../core/db.ts';
import type { Session } from '../core/session.ts';
import './app-shell.ts';
import type { StatimApp } from './app-shell.ts';
import './chat-room.ts';
import type { ChatRoom } from './chat-room.ts';
import './login-view.ts';
import type { LoginDetails, LoginView } from './login-view.ts';
import './peer-avatar.ts';

function mount<T extends HTMLElement>(tag: string): T {
  const el = document.createElement(tag) as T;
  document.body.append(el);
  return el;
}

describe('<login-view>', () => {
  it('emits trimmed credentials on submit', () => {
    const view = mount<LoginView>('login-view');
    view.values = { email: ' ana@x.com ', token: 'tok', pageId: '42', baseUrl: 'http://localhost:8787' };
    const onLogin = vi.fn();
    view.addEventListener('login', (e) => onLogin((e as CustomEvent<ConfluenceCredentials>).detail));

    view.shadowRoot!.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(onLogin).toHaveBeenCalledWith({ email: 'ana@x.com', token: 'tok', pageId: '42', baseUrl: 'http://localhost:8787' });
  });

  it('shows errors and busy state', () => {
    const view = mount<LoginView>('login-view');
    view.error = 'Credenciales no válidas';
    view.busy = true;
    expect(view.shadowRoot!.querySelector('[role=alert]')!.textContent).toBe('Credenciales no válidas');
    expect(view.shadowRoot!.querySelector('button')!.disabled).toBe(true);
  });

  it('emits meteredDomain and meteredApiKey when provided in the TURN section', () => {
    const view = mount<LoginView>('login-view');
    view.values = { email: 'ana@x.com', token: 'tok', pageId: '42', baseUrl: '' };
    const domainInput = view.shadowRoot!.querySelector('input[name=meteredDomain]') as HTMLInputElement;
    const keyInput = view.shadowRoot!.querySelector('input[name=meteredApiKey]') as HTMLInputElement;
    domainInput.value = ' testteam ';
    keyInput.value = ' test-key ';
    const onLogin = vi.fn();
    view.addEventListener('login', (e) => onLogin((e as CustomEvent<LoginDetails>).detail));

    view.shadowRoot!.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(onLogin).toHaveBeenCalledWith({
      email: 'ana@x.com',
      token: 'tok',
      pageId: '42',
      baseUrl: '',
      meteredDomain: 'testteam',
      meteredApiKey: 'test-key',
    });
  });

  it('never restores meteredDomain or meteredApiKey when values setter is called', () => {
    const view = mount<LoginView>('login-view');
    const domainInput = view.shadowRoot!.querySelector('input[name=meteredDomain]') as HTMLInputElement;
    const keyInput = view.shadowRoot!.querySelector('input[name=meteredApiKey]') as HTMLInputElement;
    domainInput.value = 'sensitive-domain';
    keyInput.value = 'secret-key';
    view.values = { email: 'ana@x.com' };
    expect(domainInput.value).toBe('');
    expect(keyInput.value).toBe('');
  });

  it('emits proxy configuration when provided in the proxy section', () => {
    const view = mount<LoginView>('login-view');
    view.values = { email: 'ana@x.com', token: 'tok', pageId: '42', baseUrl: '' };
    const urlInput = view.shadowRoot!.querySelector('input[name=proxyUrl]') as HTMLInputElement;
    const userInput = view.shadowRoot!.querySelector('input[name=proxyUser]') as HTMLInputElement;
    const passInput = view.shadowRoot!.querySelector('input[name=proxyPassword]') as HTMLInputElement;
    const excludedInput = view.shadowRoot!.querySelector('input[name=proxyExcludedDomains]') as HTMLInputElement;
    urlInput.value = ' http://proxy.corp:8080 ';
    userInput.value = ' proxyuser ';
    passInput.value = ' secret ';
    excludedInput.value = ' localhost, 127.0.0.1 ';
    const onLogin = vi.fn();
    view.addEventListener('login', (e) => onLogin((e as CustomEvent<LoginDetails>).detail));

    view.shadowRoot!.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(onLogin).toHaveBeenCalledWith({
      email: 'ana@x.com',
      token: 'tok',
      pageId: '42',
      baseUrl: '',
      proxyUrl: 'http://proxy.corp:8080',
      proxyUser: 'proxyuser',
      proxyPassword: 'secret',
      proxyExcludedDomains: 'localhost, 127.0.0.1',
    });
  });

  it('never restores proxyPassword when values setter is called', () => {
    const view = mount<LoginView>('login-view');
    const passInput = view.shadowRoot!.querySelector('input[name=proxyPassword]') as HTMLInputElement;
    passInput.value = 'secret';
    view.values = { email: 'ana@x.com' };
    expect(passInput.value).toBe('');
  });

  it('displays, copies, and clears diagnostic logs from the logs section', async () => {
    const view = mount<LoginView>('login-view');
    const logsDetails = view.shadowRoot!.querySelector('details.logs-section') as HTMLDetailsElement;
    const logsOutput = view.shadowRoot!.querySelector('.logs-output') as HTMLPreElement;
    const copyBtn = view.shadowRoot!.querySelector('.btn-copy-logs') as HTMLButtonElement;
    const clearBtn = view.shadowRoot!.querySelector('.btn-clear-logs') as HTMLButtonElement;

    expect(logsDetails).not.toBeNull();
    expect(logsOutput).not.toBeNull();

    logsDetails.open = true;
    logsDetails.dispatchEvent(new Event('toggle'));
    expect(logsOutput.textContent).toBeDefined();

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });
    copyBtn.click();
    await vi.waitFor(() => expect(writeTextMock).toHaveBeenCalled());

    clearBtn.click();
    expect(logsOutput.textContent).toBe('No hay registros guardados.');
  });
});

describe('<peer-avatar>', () => {
  it('renders the identicon for its email', async () => {
    const avatar = mount<HTMLElement>('peer-avatar');
    avatar.setAttribute('email', 'ana@x.com');
    const img = avatar.shadowRoot!.querySelector('img')!;
    await vi.waitFor(() => expect(img.src).toMatch(/^data:image\/svg\+xml/));
    expect(img.alt).toBe('ana@x.com');
  });
});

describe('<chat-room>', () => {
  function fakeSession(connected: string[] = []) {
    const mesh = Object.assign(new EventTarget(), {
      connectedPeers: () => connected,
      send: vi.fn(async (text: string): Promise<Message> => ({ id: 99, msgId: 'm', from: 'ana@x.com', text, ts: Date.now() })),
    });
    return { mesh, registry: { email: 'ana@x.com' } } as unknown as Session & { mesh: typeof mesh };
  }

  it('renders stored history, marking own messages', async () => {
    await db.messages.bulkAdd([
      { msgId: 'a', from: 'bob@x.com', text: 'hola', ts: 1 },
      { msgId: 'b', from: 'ana@x.com', text: 'buenas', ts: 2 },
    ]);
    const room = mount<ChatRoom>('chat-room');
    await room.attach(fakeSession(['bob@x.com']));

    const items = [...room.shadowRoot!.querySelectorAll('li')];
    expect(items.map((li) => li.querySelector('.text')!.textContent)).toEqual(['hola', 'buenas']);
    expect(items.map((li) => li.classList.contains('mine'))).toEqual([false, true]);
  });

  it('renders incoming text safely (no HTML injection)', async () => {
    const session = fakeSession(['bob@x.com']);
    const room = mount<ChatRoom>('chat-room');
    await room.attach(session);
    const payload = '<img src=x onerror="alert(1)">';
    session.mesh.dispatchEvent(new CustomEvent('messages', { detail: { from: 'bob@x.com', messages: [{ msgId: 'x', from: 'bob@x.com', text: payload, ts: 3 }] } }));

    const text = room.shadowRoot!.querySelector('li .text')!;
    expect(text.textContent).toBe(payload);
    expect(text.querySelector('img')).toBeNull();
  });

  it('warns when nobody is connected', async () => {
    const room = mount<ChatRoom>('chat-room');
    await room.attach(fakeSession([]));
    expect(room.shadowRoot!.querySelector('.notice')!.textContent).toMatch(/Nadie conectado/);
  });

  it('sends on Enter and appends the message', async () => {
    const session = fakeSession(['bob@x.com']);
    const room = mount<ChatRoom>('chat-room');
    await room.attach(session);
    const input = room.shadowRoot!.querySelector('textarea')!;
    input.value = 'qué tal';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));

    await vi.waitFor(() => expect(session.mesh.send).toHaveBeenCalledWith('qué tal'));
    await vi.waitFor(() => expect(room.shadowRoot!.querySelector('li.mine .text')!.textContent).toBe('qué tal'));
    expect(input.value).toBe('');
  });

  const msg = (text: string, ts: number): Message => ({ msgId: `bob|${ts}`, from: 'bob@x.com', text, ts });
  const emit = (session: ReturnType<typeof fakeSession>, messages: Message[]) =>
    session.mesh.dispatchEvent(new CustomEvent('messages', { detail: { from: 'bob@x.com', messages } }));
  const texts = (room: ChatRoom) => [...room.shadowRoot!.querySelectorAll('li .text')].map((t) => t.textContent);

  it('inserts late history in sender-time order', async () => {
    const session = fakeSession(['bob@x.com']);
    const room = mount<ChatRoom>('chat-room');
    await room.attach(session);

    emit(session, [msg('tercero', 300)]);
    emit(session, [msg('primero', 100), msg('segundo', 200)]);
    emit(session, [msg('cuarto', 400)]);

    expect(texts(room)).toEqual(['primero', 'segundo', 'tercero', 'cuarto']);
  });

  it('ignores messages already on screen', async () => {
    const session = fakeSession(['bob@x.com']);
    const room = mount<ChatRoom>('chat-room');
    await room.attach(session);
    emit(session, [msg('uno', 1)]);
    emit(session, [msg('uno', 1), msg('dos', 2)]);
    expect(texts(room)).toEqual(['uno', 'dos']);
  });

  describe('with simulated layout (100 px per message, 500 px viewport)', () => {
    const ROW = 100;
    const VIEW = 500;
    const originals = new Map<string, PropertyDescriptor>();

    function fakeLayout(room: ChatRoom): HTMLOListElement {
      const list = room.shadowRoot!.querySelector('ol')!;
      let scrollTop = 0;
      Object.defineProperties(list, {
        scrollHeight: { configurable: true, get: () => list.children.length * ROW },
        clientHeight: { configurable: true, get: () => VIEW },
        scrollTop: {
          configurable: true,
          get: () => scrollTop,
          set: (v: number) => (scrollTop = Math.max(0, Math.min(v, list.children.length * ROW - VIEW))),
        },
      });
      for (const prop of ['offsetTop', 'offsetHeight'] as const) {
        originals.set(prop, Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)!);
      }
      Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
        configurable: true,
        get(this: HTMLElement) {
          return this.parentElement ? [...this.parentElement.children].indexOf(this) * ROW : 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => ROW });
      return list;
    }

    afterEach(() => {
      for (const [prop, desc] of originals) Object.defineProperty(HTMLElement.prototype, prop, desc);
      originals.clear();
    });

    async function roomWith(count: number) {
      await db.messages.bulkAdd(Array.from({ length: count }, (_, i) => msg(`m${i}`, 1000 + i)));
      const session = fakeSession(['bob@x.com']);
      const room = mount<ChatRoom>('chat-room');
      await room.attach(session);
      return { session, room, list: fakeLayout(room), jump: room.shadowRoot!.querySelector<HTMLButtonElement>('.jump')! };
    }

    it('stays pinned to the newest message when the reader is at the bottom', async () => {
      const { session, list, jump } = await roomWith(10);
      list.scrollTop = 10_000;
      emit(session, [msg('viejo', 1), msg('nuevo', 5000)]);
      expect(list.scrollTop).toBe(12 * ROW - VIEW);
      expect(jump.hidden).toBe(true);
    });

    it('keeps the first visible message in place when older history is inserted above', async () => {
      const { session, room, list } = await roomWith(10);
      list.scrollTop = 3 * ROW;
      const firstVisible = () => texts(room)[Math.floor(list.scrollTop / ROW)];
      expect(firstVisible()).toBe('m3');

      emit(session, [msg('antiguo-1', 1), msg('antiguo-2', 2)]);

      expect(list.scrollTop).toBe(5 * ROW);
      expect(firstVisible()).toBe('m3');
    });

    it('shows a jump pill for newer messages while reading older ones, and clears it at the bottom', async () => {
      const { session, list, jump } = await roomWith(10);
      list.scrollTop = 0;

      emit(session, [msg('nuevo-1', 5000), msg('nuevo-2', 5001)]);
      expect(list.scrollTop).toBe(0);
      expect(jump.hidden).toBe(false);
      expect(jump.textContent).toBe('2 mensajes nuevos ↓');

      jump.click();
      expect(list.scrollTop).toBe(12 * ROW - VIEW);
      expect(jump.hidden).toBe(true);
    });

    it('animates arrivals but not the initial render', async () => {
      const { session, room } = await roomWith(2);
      expect(room.shadowRoot!.querySelectorAll('li.arrived')).toHaveLength(0);
      emit(session, [msg('nuevo', 5000)]);
      expect(room.shadowRoot!.querySelectorAll('li.arrived')).toHaveLength(1);
    });
  });

  describe('<statim-app> update notification', () => {
    it('displays update banner when update is available and allows applying update', () => {
      const app = mount<StatimApp>('statim-app');
      const banner = app.shadowRoot!.querySelector<HTMLElement>('.update-banner')!;
      const applyBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.update-apply')!;
      const indicator = app.shadowRoot!.querySelector<HTMLButtonElement>('.update-indicator')!;

      expect(banner.hidden).toBe(true);
      expect(indicator.hidden).toBe(true);

      const applyMock = vi.fn();
      app.showUpdateNotification(applyMock);

      expect(banner.hidden).toBe(false);
      expect(indicator.hidden).toBe(true);

      applyBtn.click();
      expect(applyMock).toHaveBeenCalledTimes(1);
      expect(applyBtn.disabled).toBe(true);
      expect(applyBtn.textContent).toBe('Actualizando...');
    });

    it('shows indicator in header when update banner is dismissed and allows updating from indicator', () => {
      const app = mount<StatimApp>('statim-app');
      const banner = app.shadowRoot!.querySelector<HTMLElement>('.update-banner')!;
      const dismissBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.update-dismiss')!;
      const indicator = app.shadowRoot!.querySelector<HTMLButtonElement>('.update-indicator')!;

      const applyMock = vi.fn();
      window.dispatchEvent(new CustomEvent('statim:update-available', { detail: applyMock }));

      expect(banner.hidden).toBe(false);
      expect(indicator.hidden).toBe(true);

      dismissBtn.click();
      expect(banner.hidden).toBe(true);
      expect(indicator.hidden).toBe(false);

      indicator.click();
      expect(applyMock).toHaveBeenCalledTimes(1);
      expect(indicator.disabled).toBe(true);
      expect(indicator.textContent).toBe('Actualizando...');
    });
  });

  describe('Fase 1: Mobile UI & i18n additions', () => {
    it('groups consecutive messages from the same sender within 3 minutes', async () => {
      const session = fakeSession(['bob@x.com']);
      const room = mount<ChatRoom>('chat-room');
      await room.attach(session);

      // Same sender, 30s apart
      emit(session, [
        { msgId: 'm1', from: 'bob@x.com', text: 'uno', ts: 1000 },
        { msgId: 'm2', from: 'bob@x.com', text: 'dos', ts: 31_000 },
        // Same sender, 4 minutes later (> 180s)
        { msgId: 'm3', from: 'bob@x.com', text: 'tres', ts: 300_000 },
      ]);

      const items = room.shadowRoot!.querySelectorAll('li');
      expect(items[0].classList.contains('grouped')).toBe(false);
      expect(items[1].classList.contains('grouped')).toBe(true);
      expect(items[2].classList.contains('grouped')).toBe(false);
    });

    it('emits close event from peer-list close button', () => {
      const peerList = mount<HTMLElement>('peer-list');
      const closeBtn = peerList.shadowRoot!.querySelector<HTMLButtonElement>('.close-btn')!;
      const onClose = vi.fn();
      peerList.addEventListener('close', onClose);

      closeBtn.click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('toggles language and updates UI labels', () => {
      const app = mount<StatimApp>('statim-app');
      const langBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.lang-btn')!;

      // Starts in ES, button offers to switch to EN
      expect(langBtn.textContent).toBe('EN');
      langBtn.click();

      // Now in EN, button offers to switch to ES
      expect(langBtn.textContent).toBe('ES');
      expect(app.shadowRoot!.querySelector('.logout')!.textContent).toBe('Sign out');

      langBtn.click();
      expect(langBtn.textContent).toBe('EN');
      expect(app.shadowRoot!.querySelector('.logout')!.textContent).toBe('Salir');
    });

    it('closes mobile bottom sheet when backdrop is clicked', () => {
      const app = mount<StatimApp>('statim-app');
      const aside = app.shadowRoot!.querySelector<HTMLElement>('aside')!;
      const backdrop = app.shadowRoot!.querySelector<HTMLElement>('.backdrop')!;
      const peersBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.peers')!;

      expect(aside.hidden).toBe(true);
      expect(backdrop.hidden).toBe(true);

      peersBtn.click();
      expect(aside.hidden).toBe(false);
      expect(backdrop.hidden).toBe(false);

      backdrop.click();
      expect(aside.hidden).toBe(true);
      expect(backdrop.hidden).toBe(true);
    });
  });

  describe('Fase 2: P2P Feedback & Touch Interactions', () => {
    it('shows delivery status pending when 0 peers and sent when peers connect', async () => {
      const session = fakeSession([]); // 0 peers connected
      const room = mount<ChatRoom>('chat-room');
      await room.attach(session);

      // Send a message as ana@x.com
      emit(session, [{ msgId: 'm1', from: 'ana@x.com', text: 'propio', ts: 1000 }]);

      const delivery = room.shadowRoot!.querySelector<HTMLElement>('li.mine .delivery-status')!;
      expect(delivery).not.toBeNull();
      expect(delivery.textContent).toBe('🕒');
      expect(delivery.classList.contains('pending')).toBe(true);

      // Now 1 peer connects
      (session.mesh as any).connectedPeers = () => ['bob@x.com'];
      session.mesh.dispatchEvent(new Event('links'));

      expect(delivery.textContent).toBe('✓✓');
      expect(delivery.classList.contains('sent')).toBe(true);
    });

    it('opens context menu on message and formats quote in input on reply click', async () => {
      const session = fakeSession(['bob@x.com']);
      const room = mount<ChatRoom>('chat-room');
      await room.attach(session);

      emit(session, [{ msgId: 'm1', from: 'bob@x.com', text: 'mensaje original', ts: 1000 }]);

      const bubble = room.shadowRoot!.querySelector<HTMLElement>('li .bubble')!;
      const sheet = room.shadowRoot!.querySelector<HTMLElement>('.msg-menu-sheet')!;
      const backdrop = room.shadowRoot!.querySelector<HTMLElement>('.msg-menu-backdrop')!;
      const replyBtn = room.shadowRoot!.querySelector<HTMLButtonElement>('.btn-reply')!;
      const input = room.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;

      expect(sheet.hidden).toBe(true);

      // Context menu / long-press trigger
      bubble.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

      expect(sheet.hidden).toBe(false);
      expect(backdrop.hidden).toBe(false);

      // Click reply
      replyBtn.click();
      expect(sheet.hidden).toBe(true);
      expect(input.value).toContain('> bob: mensaje original');
    });

    it('opens and closes network status sheet from header pill', () => {
      const app = mount<StatimApp>('statim-app');
      const statusBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.status')!;
      const netSheet = app.shadowRoot!.querySelector<HTMLElement>('.net-sheet')!;
      const netBackdrop = app.shadowRoot!.querySelector<HTMLElement>('.net-backdrop')!;
      const closeBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.net-close')!;

      expect(netSheet.hidden).toBe(true);
      expect(netBackdrop.hidden).toBe(true);

      // Fake active session on app
      app.setSessionForTesting({
        registry: { activePeers: async () => [], remainingFastBudget: 95, holdFastPolling: vi.fn() },
      } as any);

      statusBtn.click();
      expect(netSheet.hidden).toBe(false);
      expect(netBackdrop.hidden).toBe(false);

      closeBtn.click();
      expect(netSheet.hidden).toBe(true);
      expect(netBackdrop.hidden).toBe(true);
    });
  });

  describe('Fase 3: Emojis, PWA install banner & Visual identity', () => {
    it('toggles quick emoji bar and inserts emoji into input', async () => {
      const session = fakeSession(['bob@x.com']);
      const room = mount<ChatRoom>('chat-room');
      await room.attach(session);

      const toggleBtn = room.shadowRoot!.querySelector<HTMLButtonElement>('.btn-emoji-toggle')!;
      const emojiBar = room.shadowRoot!.querySelector<HTMLElement>('.emoji-bar')!;
      const input = room.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;

      expect(emojiBar.hidden).toBe(true);
      toggleBtn.click();
      expect(emojiBar.hidden).toBe(false);

      const emojiBtn = room.shadowRoot!.querySelector<HTMLButtonElement>('.emoji-btn[data-emoji="👍"]')!;
      expect(emojiBtn).not.toBeNull();
      emojiBtn.click();

      expect(input.value).toBe('👍');

      // Click another emoji
      const fireBtn = room.shadowRoot!.querySelector<HTMLButtonElement>('.emoji-btn[data-emoji="🔥"]')!;
      fireBtn.click();
      expect(input.value).toBe('👍🔥');
    });

    it('quotes message with reaction emoji from context menu', async () => {
      const session = fakeSession(['bob@x.com']);
      const room = mount<ChatRoom>('chat-room');
      await room.attach(session);

      emit(session, [{ msgId: 'm2', from: 'bob@x.com', text: 'gran trabajo', ts: 2000 }]);

      const bubble = room.shadowRoot!.querySelector<HTMLElement>('li .bubble')!;
      const sheet = room.shadowRoot!.querySelector<HTMLElement>('.msg-menu-sheet')!;
      const input = room.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;

      bubble.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      expect(sheet.hidden).toBe(false);

      const heartReact = room.shadowRoot!.querySelector<HTMLButtonElement>('.react-btn[data-emoji="❤️"]')!;
      expect(heartReact).not.toBeNull();
      heartReact.click();

      expect(sheet.hidden).toBe(true);
      expect(input.value).toContain('> bob: gran trabajo\n❤️ ');
    });

    it('shows and dismisses PWA install banner on beforeinstallprompt', () => {
      localStorage.removeItem('statim.install_dismissed');
      const app = mount<StatimApp>('statim-app');
      const banner = app.shadowRoot!.querySelector<HTMLElement>('.install-banner')!;
      const dismissBtn = app.shadowRoot!.querySelector<HTMLButtonElement>('.install-dismiss')!;

      expect(banner.hidden).toBe(true);

      const promptEvent = new Event('beforeinstallprompt');
      (promptEvent as any).prompt = vi.fn();
      window.dispatchEvent(promptEvent);

      expect(banner.hidden).toBe(false);

      dismissBtn.click();
      expect(banner.hidden).toBe(true);
      expect(localStorage.getItem('statim.install_dismissed')).toBe('1');
    });
  });
});
