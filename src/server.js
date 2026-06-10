import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { buildInfo } from './build-info.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/info', (req, res) => {
    res.json(buildInfo());
  });

  app.get('/healthz', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

// Server nur starten, wenn die Datei direkt ausgeführt wird (nicht im Test).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => {
    console.log(`clean-infrastructure-demo listening on http://localhost:${port}`);
  });
}
