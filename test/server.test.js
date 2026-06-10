import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

const server = createApp().listen(0);
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(() => server.close());

test('GET / liefert die Startseite aus', async () => {
  const res = await fetch(`${baseUrl}/`);

  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.match(await res.text(), /Clean Infrastructure Demo/);
});

test('GET /api/info liefert Build-Metadaten', async () => {
  const res = await fetch(`${baseUrl}/api/info`);

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, 'clean-infrastructure-demo');
  assert.ok(body.version);
  assert.ok(body.commit);
});

test('GET /healthz meldet ok', async () => {
  const res = await fetch(`${baseUrl}/healthz`);

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});
