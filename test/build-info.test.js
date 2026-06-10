import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildInfo } from '../src/build-info.js';

test('liefert Pipeline-Metadaten aus der Umgebung', () => {
  const info = buildInfo({
    APP_VERSION: '1.2.3',
    GIT_SHA: 'abc1234',
    BUILD_TIME: '2026-06-10T12:00:00Z',
  });

  assert.equal(info.version, '1.2.3');
  assert.equal(info.commit, 'abc1234');
  assert.equal(info.builtAt, '2026-06-10T12:00:00Z');
});

test('fällt ohne Pipeline-Variablen auf dev-Werte zurück', () => {
  const info = buildInfo({});

  assert.equal(info.version, 'dev');
  assert.equal(info.commit, 'local');
  assert.equal(info.builtAt, null);
});
