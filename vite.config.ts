import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const target = env.CONFLUENCE_BASE_URL;

  return {
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
          }
        : undefined,
    },
  };
});
