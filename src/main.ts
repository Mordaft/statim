import './styles.css';
import './ui/app-shell.ts';
import { installDiagnosticsGlobal, trace } from './core/diagnostics.ts';
import { registerPwaUpdate } from './core/pwa-update.ts';

installDiagnosticsGlobal();
trace('app.init', {
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  standalone: typeof window !== 'undefined' ? window.matchMedia('(display-mode: standalone)').matches : false,
});

if ('serviceWorker' in navigator && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === 'true')) {
  window.addEventListener('load', () => {
    trace('pwa.sw.register_start');
    registerPwaUpdate();
  });
}
