import { execSync } from 'node:child_process';
import { defineConfig, devices } from '@playwright/test';
import { APP_PORT, APP_URL, FAKE_PORT, FAKE_URL, PROXY_PORT, TIME_SCALE } from './env.ts';

const psCmd = (() => {
  try {
    execSync('pwsh --version', { stdio: 'ignore' });
    return 'pwsh -NoProfile';
  } catch {
    return 'powershell -NoProfile -ExecutionPolicy Bypass';
  }
})();

// Chain under test: browser -> vite (app) -> localproxy (CORS) -> fake-atlassian (in-memory Confluence).
export default defineConfig({
  testDir: '.',
  timeout: 120_000,
  expect: { timeout: 45_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: '../reports/e2e-artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: '../reports/e2e', open: 'never' }],
    ['junit', { outputFile: '../reports/e2e-junit.xml' }],
  ],
  use: {
    baseURL: APP_URL,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        // Without this, host ICE candidates are mDNS names that don't resolve between headless contexts.
        launchOptions: { args: ['--disable-features=WebRtcHideLocalIpsWithMdns'] },
      },
    },
  ],
  webServer: [
    {
      command: `${psCmd} -File fake-atlassian/fake-atlassian.ps1 -Port ${FAKE_PORT}`,
      cwd: '..',
      url: `${FAKE_URL}/__admin/comments`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `${psCmd} -File localproxy/localproxy.ps1 ${FAKE_URL} -Port ${PROXY_PORT} -AllowedOrigin ${APP_URL} -PreviewLength 0`,
      cwd: '..',
      port: PROXY_PORT,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `pnpm exec vite --port ${APP_PORT} --strictPort`,
      cwd: '..',
      url: APP_URL,
      reuseExistingServer: false,
      timeout: 60_000,
      env: { VITE_TIME_SCALE: String(TIME_SCALE), VITE_STUN_URLS: '', VITE_CONFLUENCE_BASE_URL: '', VITE_CONFLUENCE_PAGE_ID: '' },
    },
  ],
});
