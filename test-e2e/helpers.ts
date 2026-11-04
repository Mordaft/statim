import { expect, type Browser, type BrowserContext, type Page, type TestInfo } from '@playwright/test';
import { PAGE_ID, PROXY_URL } from './env.ts';

export interface Client {
  name: string;
  email: string;
  context: BrowserContext;
  page: Page;
}

/** Each client gets its own context, i.e. its own IndexedDB and localStorage, like separate devices. */
export async function openClient(browser: Browser, name: string, contextOptions = {}): Promise<Client> {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`[${name}] console.error: ${msg.text()}`);
  });
  await page.goto('/');
  return { name, email: `${name.toLowerCase()}@e2e.test`, context, page };
}

export async function join(client: Client): Promise<void> {
  const { page } = client;
  await page.getByLabel('Email de Atlassian').fill(client.email);
  await page.getByLabel('API token').fill('fake-token');
  await page.getByLabel('ID de la página de Confluence').fill(PAGE_ID);
  await page.getByLabel('URL de Confluence (vacío = mismo origen)').fill(PROXY_URL);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('textbox', { name: 'Mensaje' })).toBeVisible();
}

export const status = (page: Page) => page.locator('statim-app header .status');

export function connectedText(n: number): string {
  return n === 1 ? '1 conectado' : `${n} conectados`;
}

export async function send(client: Client, text: string): Promise<void> {
  const input = client.page.getByRole('textbox', { name: 'Mensaje' });
  await input.fill(text);
  await input.press('Enter');
  await expect(message(client.page, text)).toHaveClass(/mine/);
}

export const message = (page: Page, text: string) => page.locator('chat-room li', { hasText: text });

export async function snapshot(testInfo: TestInfo, clients: Client[], label: string): Promise<void> {
  for (const c of clients) {
    await testInfo.attach(`${label} - ${c.name}`, { body: await c.page.screenshot(), contentType: 'image/png' });
  }
}
