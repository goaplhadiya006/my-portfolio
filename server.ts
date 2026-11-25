import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleContactRequest, handleContactStatusRequest } from './api/contact.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.all('/api/contact', (req: Request, res: Response) => {
    if (req.method === 'GET') {
      void handleContactStatusRequest(req, res);
      return;
    }
    void handleContactRequest(req, res);
  });

  app.use((error: unknown, _req: Request, res: Response, next: (error?: unknown) => void) => {
    if (res.headersSent) return next(error);
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status: unknown }).status)
      : 500;
    if (status === 413) {
      res.status(413).json({ ok: false, code: 'payload_too_large', error: 'The request is too large.' });
      return;
    }
    if (status === 400) {
      res.status(400).json({ ok: false, code: 'invalid_json', error: 'Please send valid JSON.' });
      return;
    }
    res.status(500).json({ ok: false, error: 'The request could not be processed.' });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Portfolio server running at ${url}`);

    // Open the development site in Chrome when `npm run dev` starts.
    if (!IS_PROD) {
      const browser = process.platform === 'win32'
        ? spawn('cmd', ['/c', 'start', '', 'chrome', url], { detached: true, stdio: 'ignore' })
        : process.platform === 'darwin'
          ? spawn('open', ['-a', 'Google Chrome', url], { detached: true, stdio: 'ignore' })
          : spawn('google-chrome', [url], { detached: true, stdio: 'ignore' });
      browser.on('error', (error) => {
        console.warn(`Could not open Chrome automatically: ${error.message}`);
      });
      browser.unref();
    }
  });
}

startServer();
