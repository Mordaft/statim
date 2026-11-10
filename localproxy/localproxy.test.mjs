import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { test } from 'node:test';

for (const contextPath of ['', '/confluence']) {
test(`proxy forwards only Bruno headers with context '${contextPath}'`, { timeout: 60_000 }, async () => {
  const requests = [];
  const upstream = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    requests.push({ path: request.url, headers: request.headers, body });
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip', 'Set-Cookie': 'upstream=not-for-reuse' });
    response.end(gzipSync(JSON.stringify({ ok: true })));
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const upstreamPort = upstream.address().port;
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const proxyPort = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const proxy = spawn('pwsh', [
    '-NoLogo', '-NoProfile', '-File', fileURLToPath(new URL('./localproxy.ps1', import.meta.url)),
    `http://127.0.0.1:${upstreamPort}${contextPath}`, '-Port', String(proxyPort), '-PreviewLength', '0',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Proxy startup timed out: ' + logs)), 30_000);
      proxy.stdout.on('data', (chunk) => {
        logs += chunk;
        if (logs.includes('Orígenes permitidos:')) { clearTimeout(timer); resolve(); }
      });
      proxy.stderr.on('data', (chunk) => { logs += chunk; });
      proxy.once('error', (error) => { clearTimeout(timer); reject(error); });
      proxy.once('exit', (code) => { clearTimeout(timer); reject(new Error(`Proxy exited ${code}: ${logs}`)); });
    });
    const proxyUrl = `http://localhost:${proxyPort}`;
    const body = JSON.stringify({ value: { data: 'test-' + String.fromCharCode(241) } });
    const result = await fetch(proxyUrl + '/rest/api/content/42/property', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-only-token', Accept: 'application/json', 'Content-Type': 'application/json',
        Cookie: 'session=test-only', Origin: 'http://localhost:5173', Referer: 'http://localhost:5173/',
        'User-Agent': 'browser-agent', 'Sec-Fetch-Site': 'cross-site', 'X-Unlisted': 'must-not-pass',
        'X-Atlassian-Token': 'browser-value',
      },
      body,
    });
    assert.equal(result.status, 200);
    assert.deepEqual(await result.json(), { ok: true });
    assert.equal(result.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    const forwarded = requests[0];
    assert.equal(forwarded.path, contextPath + '/rest/api/content/42/property');
    assert.equal(forwarded.headers.host, `127.0.0.1:${upstreamPort}`);
    assert.notEqual(forwarded.headers.host, `localhost:${proxyPort}`);
    assert.equal(forwarded.body, body);
    assert.equal(forwarded.headers.authorization, 'Bearer test-only-token');
    assert.equal(forwarded.headers.cookie, 'session=test-only');
    assert.equal(forwarded.headers['user-agent'], 'bruno-runtime/1.0');
    assert.equal(forwarded.headers['x-atlassian-token'], 'no-check');
    assert.equal(forwarded.headers['content-type'], 'application/json');
    assert.equal(Number(forwarded.headers['content-length']), Buffer.byteLength(body));
    assert.match(forwarded.headers['request-start-time'], /^\d{13}$/);
    const allowed = new Set([
      'accept', 'content-type', 'user-agent', 'connection', 'x-atlassian-token', 'authorization',
      'cookie', 'request-start-time', 'content-length', 'accept-encoding', 'host',
    ]);
    for (const header of Object.keys(forwarded.headers)) assert.ok(allowed.has(header), `Unexpected upstream header: ${header}`);
    const direct = await fetch(proxyUrl + '/confluence/rest/api/content/42/property');
    assert.equal(direct.status, 200);
    await direct.arrayBuffer();
    assert.equal(requests[1].path, '/confluence/rest/api/content/42/property');
    assert.equal(requests[1].headers.host, `127.0.0.1:${upstreamPort}`);
    assert.equal(requests[1].headers.cookie, undefined);
    const preflight = await fetch(proxyUrl + '/rest/api/content/42/property', {
      method: 'OPTIONS', headers: { Origin: 'http://localhost:5173' },
    });
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get('access-control-allow-headers'), /X-Atlassian-Token/i);
    const blocked = await fetch(proxyUrl + '/not-an-api');
    assert.equal(blocked.status, 404);
    await blocked.arrayBuffer();
    assert.equal(requests.length, 2);
    assert.ok(logs.includes('Cabeceras de entrada (navegador -> proxy):'));
    assert.ok(logs.includes(`SALIDA proxy -> destino: POST http://127.0.0.1:${upstreamPort}${contextPath}/rest/api/content/42/property`));
    assert.ok(logs.includes(`Host: 127.0.0.1:${upstreamPort}`));
    assert.ok(!logs.includes('test-only-token'));
    assert.ok(!logs.includes('session=test-only'));
  } finally {
    const exited = once(proxy, 'exit');
    proxy.kill();
    await exited;
    upstream.closeAllConnections();
    await new Promise((resolve) => upstream.close(resolve));
  }
});
}