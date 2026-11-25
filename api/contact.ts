type ApiRequest = {
  method?: string;
  url?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
  ip?: string;
};

type ApiResponse = {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionId: string;
};

type ResendResult = { id?: string; last_event?: string; message?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTACT_RATE_LIMIT = 5;
const CONTACT_RATE_WINDOW_MS = 10 * 60 * 1000;
const STATUS_RATE_LIMIT = 90;
const STATUS_RATE_WINDOW_MS = 60 * 1000;
const sendRateLimits = new Map<string, { count: number; startedAt: number }>();
const statusRateLimits = new Map<string, { count: number; startedAt: number }>();

function consumeRateLimit(
  limits: Map<string, { count: number; startedAt: number }>,
  ip: string,
  maxCount: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const current = limits.get(ip);
  if (!current || now - current.startedAt >= windowMs) {
    limits.set(ip, { count: 1, startedAt: now });
    return false;
  }
  if (current.count >= maxCount) return true;
  current.count += 1;
  if (limits.size > 10_000) {
    for (const [key, entry] of limits) {
      if (now - entry.startedAt >= windowMs) limits.delete(key);
    }
  }
  return false;
}

function getClientIp(req: ApiRequest): string {
  if (req.ip) return req.ip;
  if (req.socket?.remoteAddress) return req.socket.remoteAddress;
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') return forwardedFor.split(',')[0].trim() || 'unknown';
  return 'unknown';
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function cleanField(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
}

function cleanMessage(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function readContactInput(body: unknown): { value?: ContactInput; error?: string } {
  const data = asRecord(body);
  if (!data) return { error: 'Please send a valid contact form.' };
  if (cleanField(data.companyWebsite)) return { error: 'Submission rejected by spam protection.' };
  if (typeof data.formElapsedMs === 'number' && data.formElapsedMs > 0 && data.formElapsedMs < 1200) {
    return { error: 'Please take a moment to review your message before sending.' };
  }

  const name = cleanField(data.name);
  const email = cleanField(data.email);
  const subject = cleanField(data.subject);
  const message = cleanMessage(data.message);
  const submissionId = cleanField(data.submissionId);
  if (name.length < 2) return { error: 'Please enter your full name (at least 2 characters).' };
  if (name.length > 100) return { error: 'Please keep your name under 100 characters.' };
  if (!EMAIL_REGEX.test(email)) return { error: 'Please provide a valid email address.' };
  if (email.length > 160) return { error: 'Please keep your email address under 160 characters.' };
  if (subject.length < 3) return { error: 'Please enter a subject (at least 3 characters).' };
  if (subject.length > 160) return { error: 'Please keep your subject under 160 characters.' };
  if (message.length < 10) return { error: 'Please enter a message of at least 10 characters.' };
  if (message.length > 3000) return { error: 'Please keep your message under 3000 characters.' };
  if (!/^[\w-]{8,100}$/.test(submissionId)) return { error: 'Please refresh the page and try again.' };
  return { value: { name, email, subject, message, submissionId } };
}

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim(),
    from: process.env.CONTACT_FROM_EMAIL?.trim(),
    to: process.env.CONTACT_TO_EMAIL?.trim(),
  };
}

export async function handleContactRequest(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  const ip = getClientIp(req);
  if (consumeRateLimit(sendRateLimits, ip, CONTACT_RATE_LIMIT, CONTACT_RATE_WINDOW_MS)) {
    res.status(429).json({ ok: false, error: 'Too many messages sent recently. Please try again later.' });
    return;
  }

  const parsed = readContactInput(req.body);
  if (!parsed.value) {
    res.status(400).json({ ok: false, error: parsed.error });
    return;
  }

  const { apiKey, from, to } = getEmailConfig();
  if (!apiKey || !from || !to) {
    res.status(503).json({ ok: false, error: 'Contact email is not configured on the server yet.' });
    return;
  }

  const { name, email, subject, message, submissionId } = parsed.value;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    '',
    message,
  ].join('\n');

  try {
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `portfolio-contact-${submissionId}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact: ${subject}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await providerResponse.json() as ResendResult;
    if (!providerResponse.ok || !result.id) {
      console.error('Contact email provider rejected a message:', providerResponse.status);
      res.status(502).json({ ok: false, error: 'The email provider could not accept your message. Please try again.' });
      return;
    }

    // This is only an acknowledgement. The client must query the provider until
    // last_event is "delivered" before presenting a success state to the visitor.
    res.status(202).json({ ok: true, status: 'pending', emailId: result.id });
  } catch {
    res.status(502).json({ ok: false, error: 'The email provider could not be reached. Please try again.' });
  }
}

export async function handleContactStatusRequest(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }
  const ip = getClientIp(req);
  if (consumeRateLimit(statusRateLimits, ip, STATUS_RATE_LIMIT, STATUS_RATE_WINDOW_MS)) {
    res.status(429).json({ ok: false, error: 'Please wait before checking the delivery status again.' });
    return;
  }
  const emailId = new URL(req.url || '/', 'http://localhost').searchParams.get('id') || '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(emailId)) {
    res.status(400).json({ ok: false, error: 'A valid email status ID is required.' });
    return;
  }
  const { apiKey } = getEmailConfig();
  if (!apiKey) {
    res.status(503).json({ ok: false, error: 'Contact email is not configured on the server yet.' });
    return;
  }

  try {
    const providerResponse = await fetch(`https://api.resend.com/emails/${encodeURIComponent(emailId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8_000),
    });
    if (!providerResponse.ok) {
      console.error('Contact email delivery status could not be retrieved:', providerResponse.status);
      res.status(502).json({ ok: false, error: 'Delivery status could not be checked right now.' });
      return;
    }
    const result = await providerResponse.json() as ResendResult;
    const event = result.last_event?.toLowerCase();
    if (event && ['delivered', 'opened', 'clicked', 'complained'].includes(event)) {
      res.json({ ok: true, status: 'delivered' });
      return;
    }
    if (event && ['bounced', 'failed', 'suppressed', 'complained'].includes(event)) {
      res.json({ ok: true, status: 'failed' });
      return;
    }
    res.json({ ok: true, status: 'pending' });
  } catch {
    res.status(502).json({ ok: false, error: 'Delivery status could not be checked right now.' });
  }
}

const vercelHandler = async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  if (req.method === 'POST') return handleContactRequest(req, res);
  if (req.method === 'GET') return handleContactStatusRequest(req, res);
  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ ok: false, error: 'Method not allowed.' });
};

export default vercelHandler;
