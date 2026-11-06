import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function pwaPlugin(): Plugin {
  return {
    name: 'statim-pwa-sw',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const swPath = path.join(distDir, 'sw.js');
      if (!fs.existsSync(swPath)) return;

      let swContent = fs.readFileSync(swPath, 'utf-8');

      // Enumerate hashed assets from dist/assets
      const assetsDir = path.join(distDir, 'assets');
      const assetFiles = fs.existsSync(assetsDir)
        ? fs.readdirSync(assetsDir).map((f) => `./assets/${f.replace(/\\/g, '/')}`)
        : [];

      // Generate unique cache version for this build
      const buildVersion = `${Date.now()}`;
      swContent = swContent.replace(
        /const CACHE = ['"][^'"]+['"];/,
        `const CACHE = 'statim-v${buildVersion}';`,
      );

      // Precache the full shell including hashed JS and CSS
      const fullShell = [
        './',
        './index.html',
        './manifest.webmanifest',
        './icons/icon.svg',
        ...assetFiles,
      ];
      swContent = swContent.replace(
        /const SHELL = \[[^\]]*\];/,
        `const SHELL = ${JSON.stringify(fullShell, null, 2)};`,
      );

      fs.writeFileSync(swPath, swContent, 'utf-8');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const target = env.CONFLUENCE_BASE_URL;

  return {
    base: './',
    plugins: [pwaPlugin()],
    server: {
      proxy: target
        ? {
            '/wiki': {
              target,
              changeOrigin: true,
              secure: true,
              configure: (proxy) => {
                // Atlassian rejects foreign Origin/Referer with an XSRF 403.
                proxy.on('proxyReq', (req) => {
                  req.removeHeader('origin');
                  req.removeHeader('referer');
                });
              },
            },
            '/rest': {
              target,
              changeOrigin: true,
              secure: true,
              configure: (proxy) => {
                proxy.on('proxyReq', (req) => {
                  req.removeHeader('origin');
                  req.removeHeader('referer');
                });
              },
            },
          }
        : undefined,
    },
  };
});
