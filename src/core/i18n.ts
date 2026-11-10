export type Locale = 'es' | 'en';

const STORAGE_KEY = 'statim.locale';

export const translations = {
  es: {
    // Shell & General
    'app.title': 'Statim',
    'app.offline': 'Sin conexión',
    'app.connected_one': '1 conectado',
    'app.connected_many': '{count} conectados',
    'app.peers_btn': 'Equipo',
    'app.peers_btn_count': 'Equipo ({count})',
    'app.logout': 'Salir',
    'app.update': 'Actualizar',
    'app.updating': 'Actualizando...',
    'app.update_available': 'Actualización disponible',
    'app.update_banner_msg': 'Nueva versión de Statim disponible.',
    'app.update_dismiss': 'Cerrar aviso de actualización',
    'app.lang': 'Idioma',
    'app.switch_lang': 'English',

    // Errors
    'error.unexpected': 'Error inesperado.',
    'error.metered': 'Error con el servidor TURN Metered.',
    'error.confluence_auth': 'Credenciales o permisos no válidos en Confluence.',
    'error.confluence_404': 'No se encuentra la página de Confluence.',
    'error.confluence_429': 'Confluence está limitando las peticiones.',
    'error.confluence_network': 'No se pudo contactar con Confluence (revisa red, CORS o proxy).',

    // Notifications
    'notify.recovered': '{count} mensaje(s) recuperado(s)',

    // Login
    'login.title': 'Acceso al equipo',
    'login.subtitle': 'Mensajería instantánea P2P segura para tu equipo',
    'login.base_url': 'URL de Confluence (vacío = mismo origen)',
    'login.base_url_placeholder': 'https://tu-sitio.atlassian.net',
    'login.page_id': 'ID de la página de Confluence',
    'login.page_id_placeholder': '12345678',
    'login.email': 'Email de Atlassian',
    'login.email_placeholder': 'tu-email@empresa.com',
    'login.token': 'API token',
    'login.token_placeholder': 'Introduce tu API token',
    'login.turn_section': 'Conexión tras cortafuegos / proxy (TURN TLS)',
    'login.metered_domain': 'Subdominio de Metered',
    'login.metered_domain_placeholder': 'subdominio.metered.live',
    'login.metered_api_key': 'API Key de Metered',
    'login.metered_api_key_placeholder': 'Clave de Metered',
    'login.proxy_section': 'Proxy HTTP/HTTPS',
    'login.proxy_url': 'URL y puerto',
    'login.proxy_url_placeholder': 'http://proxy.ejemplo.com:8080',
    'login.proxy_user': 'Usuario',
    'login.proxy_user_placeholder': 'Usuario',
    'login.proxy_password': 'Password',
    'login.proxy_password_placeholder': 'Password',
    'login.proxy_excluded': 'Lista de dominios excluidos',
    'login.proxy_excluded_placeholder': 'localhost, 127.0.0.1, .empresa.com',
    'login.logs_section': 'Diagnóstico y registros (logs)',
    'login.export_logs': 'Copiar registros',
    'login.clear_logs': 'Limpiar',
    'login.submit': 'Entrar',
    'login.connecting': 'Conectando…',

    // Chat room
    'chat.notice_nobody': 'Nadie conectado: tus mensajes llegarán cuando alguien se conecte (hasta 10 h).',
    'chat.send_failed': 'No se pudo enviar el mensaje.',
    'chat.input_placeholder': 'Escribe un mensaje',
    'chat.input_aria': 'Mensaje',
    'chat.send_btn': 'Enviar',
    'chat.jump_one': '1 mensaje nuevo ↓',
    'chat.jump_many': '{count} mensajes nuevos ↓',
    'chat.date_today': 'Hoy',
    'chat.date_yesterday': 'Ayer',
    'chat.status_pending': 'Guardado en local (esperando compañeros)',
    'chat.status_sent': 'Transmitido a la malla P2P',
    'chat.status_searching': 'Buscando compañeros...',
    'chat.copied': 'Texto copiado al portapapeles',

    // Message context menu
    'menu.copy': 'Copiar texto',
    'menu.reply': 'Citar / Responder',
    'menu.info': 'Info del mensaje',
    'menu.close': 'Cerrar',
    'menu.details_title': 'Detalles del mensaje',
    'menu.from': 'Remitente',
    'menu.date': 'Fecha y hora',
    'menu.id': 'ID del mensaje',
    'menu.delivery': 'Estado',
    'menu.delivery_sent': 'Transmitido a la malla WebRTC',
    'menu.delivery_pending': 'Guardado en local (pendiente de pares)',
    'menu.delivery_received': 'Recibido vía WebRTC (cifrado AES-GCM)',

    // Network & Sync Sheet
    'net.title': 'Estado de red y sincronización',
    'net.mesh_status': 'Malla WebRTC (P2P)',
    'net.connected_peers': 'Compañeros conectados directamente',
    'net.active_peers': 'Compañeros activos recientemente',
    'net.confluence_sync': 'Señalización (Confluence)',
    'net.budget': 'Presupuesto de peticiones rápidas hoy',
    'net.budget_val': '{used} / {total} usadas',
    'net.sync_now': 'Comprobar señales ahora',
    'net.syncing': 'Comprobando...',
    'net.close': 'Cerrar',

    // Peer list
    'peers.title': 'Equipo',
    'peers.empty': 'Aún no hay compañeros anunciados.',
    'peers.no_direct_connection': 'sin conexión directa',
    'peers.close': 'Cerrar',

    // PWA Install
    'pwa.install_btn': 'Instalar app',
    'pwa.install_title': 'Instala Statim en tu móvil',
    'pwa.install_desc': 'Acceso rápido y notificaciones en tu pantalla de inicio.',
    'pwa.install_ios': 'Para instalar: pulsa Compartir ⎋ y luego "Añadir a pantalla de inicio" ⊞',
    'pwa.install_dismiss': 'Cerrar aviso de instalación',

    // Emoji Bar
    'chat.emoji_toggle': 'Reacciones y emojis rápidos',
  },
  en: {
    // Shell & General
    'app.title': 'Statim',
    'app.offline': 'Offline',
    'app.connected_one': '1 connected',
    'app.connected_many': '{count} connected',
    'app.peers_btn': 'Team',
    'app.peers_btn_count': 'Team ({count})',
    'app.logout': 'Sign out',
    'app.update': 'Update',
    'app.updating': 'Updating...',
    'app.update_available': 'Update available',
    'app.update_banner_msg': 'A new version of Statim is available.',
    'app.update_dismiss': 'Dismiss update notice',
    'app.lang': 'Language',
    'app.switch_lang': 'Español',

    // Errors
    'error.unexpected': 'Unexpected error.',
    'error.metered': 'Metered TURN server error.',
    'error.confluence_auth': 'Invalid credentials or permissions in Confluence.',
    'error.confluence_404': 'Confluence page not found.',
    'error.confluence_429': 'Confluence is rate limiting requests.',
    'error.confluence_network': 'Could not reach Confluence (check network, CORS or proxy).',

    // Notifications
    'notify.recovered': '{count} recovered message(s)',

    // Login
    'login.title': 'Connect to Statim',
    'login.subtitle': 'Secure P2P instant messaging for your team',
    'login.base_url': 'Confluence Base URL',
    'login.base_url_placeholder': 'E.g.: https://company.atlassian.net (empty for proxy)',
    'login.page_id': 'Page ID',
    'login.page_id_placeholder': 'E.g.: 12345678',
    'login.email': 'Email',
    'login.email_placeholder': 'your-email@company.com',
    'login.token': 'Atlassian API token',
    'login.token_placeholder': 'Enter your API token',
    'login.turn_section': 'TURN Server (optional)',
    'login.metered_domain': 'Metered Domain',
    'login.metered_domain_placeholder': 'E.g.: my-team',
    'login.metered_api_key': 'Metered API Key',
    'login.metered_api_key_placeholder': 'Metered API Key',
    'login.proxy_section': 'Local proxy (optional)',
    'login.proxy_url': 'Proxy URL',
    'login.proxy_url_placeholder': 'http://localhost:8787',
    'login.proxy_user': 'Proxy username (optional)',
    'login.proxy_user_placeholder': 'Username',
    'login.proxy_password': 'Proxy password (optional)',
    'login.proxy_password_placeholder': 'Password',
    'login.proxy_excluded': 'Excluded domains (optional)',
    'login.proxy_excluded_placeholder': 'localhost, 127.0.0.1',
    'login.logs_section': 'Diagnostics and logs',
    'login.export_logs': 'Download logs',
    'login.clear_logs': 'Clear logs',
    'login.submit': 'Connect',
    'login.connecting': 'Connecting...',

    // Chat room
    'chat.notice_nobody': 'Nobody connected: your messages will arrive when someone connects (up to 10 h).',
    'chat.send_failed': 'Failed to send message.',
    'chat.input_placeholder': 'Type a message',
    'chat.input_aria': 'Message',
    'chat.send_btn': 'Send',
    'chat.jump_one': '1 new message ↓',
    'chat.jump_many': '{count} new messages ↓',
    'chat.date_today': 'Today',
    'chat.date_yesterday': 'Yesterday',
    'chat.status_pending': 'Saved locally (waiting for peers)',
    'chat.status_sent': 'Transmitted to P2P mesh',
    'chat.status_searching': 'Searching for peers...',
    'chat.copied': 'Text copied to clipboard',

    // Message context menu
    'menu.copy': 'Copy text',
    'menu.reply': 'Quote / Reply',
    'menu.info': 'Message info',
    'menu.close': 'Close',
    'menu.details_title': 'Message details',
    'menu.from': 'Sender',
    'menu.date': 'Date and time',
    'menu.id': 'Message ID',
    'menu.delivery': 'Status',
    'menu.delivery_sent': 'Transmitted to WebRTC mesh',
    'menu.delivery_pending': 'Saved locally (waiting for peers)',
    'menu.delivery_received': 'Received via WebRTC (AES-GCM encrypted)',

    // Network & Sync Sheet
    'net.title': 'Network and sync status',
    'net.mesh_status': 'WebRTC Mesh (P2P)',
    'net.connected_peers': 'Directly connected peers',
    'net.active_peers': 'Recently active peers',
    'net.confluence_sync': 'Signaling (Confluence)',
    'net.budget': 'Fast request budget today',
    'net.budget_val': '{used} / {total} used',
    'net.sync_now': 'Check signals now',
    'net.syncing': 'Checking...',
    'net.close': 'Close',

    // Peer list
    'peers.title': 'Team',
    'peers.empty': 'No peers announced yet.',
    'peers.no_direct_connection': 'no direct connection',
    'peers.close': 'Close',

    // PWA Install
    'pwa.install_btn': 'Install app',
    'pwa.install_title': 'Install Statim on your phone',
    'pwa.install_desc': 'Fast access and notifications on your home screen.',
    'pwa.install_ios': 'To install: tap Share ⎋ and then "Add to Home Screen" ⊞',
    'pwa.install_dismiss': 'Dismiss install notice',

    // Emoji Bar
    'chat.emoji_toggle': 'Quick reactions and emojis',
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

let currentLocale: Locale = detectInitialLocale();

function detectInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // Ignore storage restrictions
  }
  return 'es';
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (locale !== 'es' && locale !== 'en') return;
  currentLocale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore storage restrictions
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('statim:locale-changed', { detail: locale }));
  }
}

export function toggleLocale(): Locale {
  const next: Locale = currentLocale === 'es' ? 'en' : 'es';
  setLocale(next);
  return next;
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const dict = translations[currentLocale] ?? translations.es;
  let text: string = dict[key] ?? translations.es[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export function formatTime(ts: number | Date, locale: Locale = currentLocale): string {
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(ts);
}

export function formatDateDivider(ts: number | Date, locale: Locale = currentLocale): string {
  const date = new Date(ts);
  const now = new Date();
  const dict = translations[locale] ?? translations.es;
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return dict['chat.date_today'];

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return dict['chat.date_yesterday'];

  // Format as day, month (and year if different)
  const isThisYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    ...(isThisYear ? {} : { year: 'numeric' }),
  }).format(date);
}
