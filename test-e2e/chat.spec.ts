import { expect, test } from '@playwright/test';
import { FAKE_URL, PAGE_ID, PROXY_URL } from './env.ts';
import { connectedText, join, message, openClient, send, snapshot, status, type Client } from './helpers.ts';

interface AdminProperty {
  key: string;
  pageId: string;
  version: { authorId: string };
  value: { data: string };
}

test.describe.serial('Sala con 3 clientes (localproxy + fake-atlassian)', () => {
  const clients: Client[] = [];
  const [ana, bob, cid] = [0, 1, 2].map((i) => () => clients[i]);

  test.beforeAll(async ({ browser, request }) => {
    await request.delete(`${FAKE_URL}/__admin/properties`);
    for (const name of ['Ana', 'Bob', 'Cid']) clients.push(await openClient(browser, name));
  });

  test.afterAll(async () => {
    await Promise.all(clients.map((c) => c.context.close().catch(() => { })));
  });

  test('los 3 clientes se unen y se conectan entre sí por WebRTC', async ({ }, testInfo) => {
    await test.step('login de los 3 clientes', async () => {
      await Promise.all(clients.map(join));
    });

    await test.step('cada cliente ve a los otros 2 conectados', async () => {
      for (const c of clients) await expect(status(c.page)).toHaveText(connectedText(2));
    });

    await test.step('la lista de equipo muestra a los compañeros en línea', async () => {
      const page = ana().page;
      await page.getByRole('button', { name: /Equipo/ }).click();
      await expect(page.locator('peer-list li peer-avatar[online]')).toHaveCount(2);
      await snapshot(testInfo, [ana()], 'Panel de equipo');
      await page.getByRole('button', { name: /Equipo/ }).click();
    });

    await snapshot(testInfo, clients, 'Conectados');
  });

  test('los mensajes de cada cliente llegan a los otros dos', async ({ }, testInfo) => {
    const texts = new Map<Client, string>();
    for (const sender of clients) {
      const text = `Hola desde ${sender.name} #${Date.now()}`;
      texts.set(sender, text);
      await test.step(`${sender.name} envía un mensaje`, async () => {
        await send(sender, text);
        for (const receiver of clients.filter((c) => c !== sender)) {
          await expect(message(receiver.page, text)).toBeVisible();
          await expect(message(receiver.page, text)).not.toHaveClass(/mine/);
        }
      });
    }

    await test.step('el orden y el autor se muestran correctamente', async () => {
      const items = cid().page.locator('chat-room li');
      await expect(items).toHaveCount(3);
      await expect(items.nth(0)).toContainText('ana');
      await expect(items.nth(1)).toContainText('bob');
    });

    await snapshot(testInfo, clients, 'Conversación');
    testInfo.annotations.push({ type: 'mensajes', description: [...texts.values()].join(' | ') });
  });

  test('Confluence solo transporta señalización comprimida, nunca los mensajes', async ({ request }) => {
    const res = await request.get(`${FAKE_URL}/__admin/properties`);
    const { results } = (await res.json()) as { results: AdminProperty[] };

    await test.step('hay propiedades de los 3 clientes en la página', async () => {
      const authors = new Set(results.filter((c) => c.pageId === PAGE_ID).map((c) => c.version.authorId));
      expect([...authors].sort()).toEqual(['ana@e2e.test', 'bob@e2e.test', 'cid@e2e.test']);
    });

    await test.step('los valores son stz1: + base64(LZ4) y no superan 32 KB', async () => {
      for (const property of results) {
        expect(property.key).toMatch(/^statim\.v1\./);
        expect(property.value.data).toMatch(/^stz1:[A-Za-z0-9+/=]+$/);
        expect(Buffer.byteLength(JSON.stringify(property.value), 'utf8')).toBeLessThanOrEqual(32768);
      }
    });

    await test.step('ningún texto del chat aparece en Confluence', async () => {
      const dump = JSON.stringify(results);
      expect(dump).not.toContain('Hola desde');
    });
  });

  test('al recargar, el historial persiste y el cliente se reconecta', async ({ }, testInfo) => {
    const page = ana().page;
    await page.reload();

    await test.step('el historial local (IndexedDB) sigue ahí', async () => {
      await expect(page.locator('chat-room li')).toHaveCount(3);
      await expect(message(page, 'Hola desde Bob')).toBeVisible();
    });

    await test.step('la sesión nueva vuelve a conectar con los otros 2', async () => {
      await expect(status(page)).toHaveText(connectedText(2));
      await expect(status(bob().page)).toHaveText(connectedText(2));
      await expect(status(cid().page)).toHaveText(connectedText(2));
    });

    await test.step('la conversación continúa tras la reconexión', async () => {
      const text = `Ana ha vuelto #${Date.now()}`;
      await send(ana(), text);
      await expect(message(bob().page, text)).toBeVisible();
      await expect(message(cid().page, text)).toBeVisible();
    });

    await snapshot(testInfo, clients, 'Tras recargar');
  });

  test('cuando un cliente se va, los demás lo detectan', async ({ }, testInfo) => {
    await cid().context.close();

    await expect(status(ana().page)).toHaveText(connectedText(1));
    await expect(status(bob().page)).toHaveText(connectedText(1));

    await test.step('quien queda puede seguir hablando', async () => {
      const text = `Solo nosotros #${Date.now()}`;
      await send(bob(), text);
      await expect(message(ana().page, text)).toBeVisible();
    });

    await snapshot(testInfo, [ana(), bob()], 'Tras salir Cid');
  });

  test('quien cierra la app y vuelve recupera lo que se perdió (historial 10 h)', async ({ }, testInfo) => {
    const missed = `Mientras Bob no estaba #${Date.now()}`;

    await test.step('Bob cierra la app', async () => {
      await bob().page.close();
      await expect(status(ana().page)).toHaveText(connectedText(0));
    });

    await test.step('Ana escribe sin nadie conectado', async () => {
      await send(ana(), missed);
    });

    await test.step('Bob vuelve a abrir y recibe el mensaje perdido', async () => {
      bob().page = await bob().context.newPage();
      await bob().page.goto('/');
      await expect(status(bob().page)).toHaveText(connectedText(1));
      await expect(message(bob().page, missed)).toBeVisible();
    });

    await snapshot(testInfo, [ana(), bob()], 'Bob recupera');
  });

  test('quien llega tarde recibe el historial de los conectados', async ({ browser }, testInfo) => {
    const dan = await openClient(browser, 'Dan');
    clients.push(dan);
    await join(dan);
    await expect(status(dan.page)).toHaveText(connectedText(2));

    await test.step('recibe los mensajes de Ana y Bob enviados antes de unirse', async () => {
      for (const text of ['Hola desde Ana', 'Hola desde Bob', 'Ana ha vuelto', 'Solo nosotros', 'Mientras Bob no estaba']) {
        await expect(message(dan.page, text)).toBeVisible();
      }
    });

    await test.step('no recibe los de Cid, que ya no está (cada cliente solo publica lo suyo)', async () => {
      await expect(message(dan.page, 'Hola desde Cid')).toHaveCount(0);
    });

    await test.step('los mensajes aparecen en orden de envío', async () => {
      const texts = await dan.page.locator('chat-room li .text').allTextContents();
      const order = ['Hola desde Ana', 'Hola desde Bob', 'Ana ha vuelto', 'Solo nosotros', 'Mientras Bob no estaba'].map((t) =>
        texts.findIndex((x) => x.startsWith(t)),
      );
      expect(order).toEqual([...order].sort((a, b) => a - b));
    });

    await snapshot(testInfo, [dan], 'Dan llega tarde');
  });

  test('leer mensajes antiguos no salta al recibir nuevos; el aviso lleva a lo último', async ({ }, testInfo) => {
    const list = bob().page.locator('chat-room ol');
    const jump = bob().page.getByRole('button', { name: /mensajes? nuevos?/ });

    await test.step('Ana llena la pantalla de Bob', async () => {
      for (let i = 1; i <= 12; i++) await send(ana(), `Relleno ${i}`);
      await expect(message(bob().page, 'Relleno 12')).toBeVisible();
      // The list must scroll internally: the composer stays on screen however long the chat gets.
      await expect(bob().page.getByRole('textbox', { name: 'Mensaje' })).toBeInViewport();
      expect(await list.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    });

    await test.step('Bob sube a leer lo antiguo', async () => {
      await list.evaluate((el) => (el.scrollTop = 0));
    });

    const firstVisible = () =>
      list.evaluate((el) => {
        const items = [...el.querySelectorAll('li')] as HTMLElement[];
        return items.find((li) => li.offsetTop + li.offsetHeight > el.scrollTop)?.querySelector('.text')?.textContent;
      });
    const before = await firstVisible();

    await test.step('llega un mensaje nuevo: Bob no se mueve y ve el aviso', async () => {
      await send(ana(), 'Novedad mientras Bob lee');
      await expect(jump).toBeVisible();
      await expect(jump).toHaveText('1 mensaje nuevo ↓');
      expect(await list.evaluate((el) => el.scrollTop)).toBe(0);
      expect(await firstVisible()).toBe(before);
      await snapshot(testInfo, [bob()], 'Aviso de mensaje nuevo');
    });

    await test.step('al pulsar el aviso baja a lo último', async () => {
      await jump.click();
      await expect(jump).toBeHidden();
      await expect(message(bob().page, 'Novedad mientras Bob lee')).toBeInViewport();
    });
  });
});

test('la pantalla de acceso es mobile-first', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Acceso al equipo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  const button = await page.getByRole('button', { name: 'Entrar' }).boundingBox();
  expect(button!.height).toBeGreaterThanOrEqual(44);
  await testInfo.attach('Login móvil', { body: await page.screenshot(), contentType: 'image/png' });
});

test('inicio de sesión con subdominio y API Key de Metered usa TURNS y nunca los almacena', async ({ browser }, testInfo) => {
  const eva = await openClient(browser, 'Eva');
  const { page } = eva;
  const domain = process.env.VITE_METERED_DOMAIN || process.env.METERED_DOMAIN || 'subdomain.metered.live';
  const apiKey = process.env.VITE_METERED_API_KEY || process.env.METERED_API_KEY || 'test-metered-key-safe';

  // Si no se proporcionaron credenciales reales por entorno, simular respuesta TURNS para el subdominio por defecto
  if (domain === 'subdomain.metered.live') {
    await page.route(`https://${domain}/**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            urls: `turns:${domain}:443?transport=tcp`,
            username: 'mock-user',
            credential: 'mock-password',
          },
        ]),
      });
    });
  }

  await test.step('introducir credenciales de Confluence, subdominio y API Key en la sección TURN', async () => {
    await page.getByLabel('Email de Atlassian').fill(eva.email);
    await page.getByLabel('API token').fill('fake-token');
    await page.getByLabel('ID de la página de Confluence').fill(PAGE_ID);
    await page.getByLabel('URL de Confluence (vacío = mismo origen)').fill(PROXY_URL);

    // Abrir la sección separada de TURN TLS
    await page.getByText(/TURN TLS/).click();
    const domainInput = page.getByLabel(/Subdominio de Metered/);
    const keyInput = page.getByLabel(/API Key de Metered/);
    await expect(domainInput).toBeVisible();
    await expect(keyInput).toBeVisible();
    await domainInput.fill(domain);
    await keyInput.fill(apiKey);
    await snapshot(testInfo, [eva], 'Login con Metered');
  });

  await test.step('iniciar sesión y verificar entrada a la sala', async () => {
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('textbox', { name: 'Mensaje' })).toBeVisible();
  });

  await test.step('ni la API Key ni el subdominio se almacenan en localStorage ni en sessionStorage', async () => {
    const storages = await page.evaluate(
      ({ key, dom }) => {
        const inLocal = Object.values(localStorage).some((v) => typeof v === 'string' && (v.includes(key) || v.includes(dom)));
        const inSession = Object.values(sessionStorage).some((v) => typeof v === 'string' && (v.includes(key) || v.includes(dom)));
        return { inLocal, inSession };
      },
      { key: apiKey, dom: domain },
    );
    expect(storages.inLocal).toBe(false);
    expect(storages.inSession).toBe(false);
  });

  await test.step('ni la API Key ni el subdominio se almacenan en IndexedDB', async () => {
    const inIdb = await page.evaluate(
      async ({ key, dom }) => {
        return new Promise<boolean>((resolve) => {
          const req = indexedDB.open('statim');
          req.onsuccess = () => {
            const idb = req.result;
            if (!idb.objectStoreNames.contains('settings')) return resolve(false);
            const tx = idb.transaction('settings', 'readonly');
            const store = tx.objectStore('settings');
            const getAll = store.getAll();
            getAll.onsuccess = () => {
              const values = JSON.stringify(getAll.result);
              resolve(values.includes(key) || values.includes(dom));
            };
            getAll.onerror = () => resolve(false);
          };
          req.onerror = () => resolve(false);
        });
      },
      { key: apiKey, dom: domain },
    );
    expect(inIdb).toBe(false);
  });

  await test.step('al salir, el formulario vuelve a mostrarse y los campos sensibles están vacíos', async () => {
    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await page.getByText(/TURN TLS/).click();
    const domainInput = page.getByLabel(/Subdominio de Metered/);
    const keyInput = page.getByLabel(/API Key de Metered/);
    await expect(domainInput).toHaveValue('');
    await expect(keyInput).toHaveValue('');
  });

  await eva.context.close();
});
