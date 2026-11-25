import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Safe confined storage directory for verified contact inquiries
const DATA_DIR = path.resolve(__dirname, 'data');
const SUBMISSIONS_FILE = path.resolve(DATA_DIR, 'contact-submissions.json');

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  deliveredVia: 'webhook' | 'inbox';
}

// Simple in-memory rate limit map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function saveSubmission(entry: ContactSubmission): Promise<void> {
  // Path confinement check
  if (!SUBMISSIONS_FILE.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid storage path configuration.');
  }
  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing: ContactSubmission[] = [];
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      existing = parsed;
    }
  } catch {
    existing = [];
  }

  existing.unshift(entry);
  // Keep latest 200 submissions bounded
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(existing.slice(0, 200), null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        error: 'Too many messages sent recently. Please wait a few minutes before trying again.',
      });
      return;
    }

    const body = req.body as Record<string, unknown>;

    // Honeypot anti-spam check
    const honeypot = sanitizeText(body.companyWebsite, 120);
    if (honeypot.length > 0) {
      res.status(400).json({
        ok: false,
        error: 'Submission rejected by spam protection.',
      });
      return;
    }

    // Minimum form dwell time check (bot protection)
    const elapsedMs = typeof body.formElapsedMs === 'number' ? body.formElapsedMs : 0;
    if (elapsedMs > 0 && elapsedMs < 1200) {
      res.status(400).json({
        ok: false,
        error: 'Please take a moment to review your message before sending.',
      });
      return;
    }

    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 160);
    const subject = sanitizeText(body.subject, 160);
    const message = sanitizeText(body.message, 3000);

    if (name.length < 2) {
      res.status(400).json({ ok: false, error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
      return;
    }
    if (subject.length < 3) {
      res.status(400).json({ ok: false, error: 'Please enter a subject (at least 3 characters).' });
      return;
    }
    if (message.length < 10) {
      res.status(400).json({ ok: false, error: 'Please enter a message of at least 10 characters.' });
      return;
    }

    let deliveredVia: 'webhook' | 'inbox' = 'inbox';
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();

    if (webhookUrl) {
      try {
        const parsed = new URL(webhookUrl);
        if (parsed.protocol === 'https:') {
          const forwardRes = await fetch(parsed.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              subject,
              message,
              source: 'Hadiya Gopal Portfolio',
              submittedAt: new Date().toISOString(),
            }),
          });
          if (forwardRes.ok) {
            deliveredVia = 'webhook';
          }
        }
      } catch (err) {
        console.error('Optional contact webhook forwarding failed:', err);
      }
    }

    const entry: ContactSubmission = {
      id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      deliveredVia,
    };

    try {
      await saveSubmission(entry);
      res.status(201).json({
        ok: true,
        id: entry.id,
        deliveredVia,
        message:
          deliveredVia === 'webhook'
            ? 'Your message has been delivered and recorded. Thank you for reaching out!'
            : 'Your message was received and saved to the portfolio inbox. You can also reach me directly at goaplahir006@gmail.com.',
      });
    } catch (err) {
      console.error('Failed to persist contact submission:', err);
      res.status(500).json({
        ok: false,
        error: 'Unable to save your message on the server right now. Please email goaplahir006@gmail.com directly.',
      });
    }
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
