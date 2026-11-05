import './styles.css';
import './ui/app-shell.ts';
import { registerPwaUpdate } from './core/pwa-update.ts';

if ('serviceWorker' in navigator && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === 'true')) {
  window.addEventListener('load', () => {
    registerPwaUpdate();
  });
}
