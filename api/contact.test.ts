import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { handleContactRequest, handleContactStatusRequest } from './contact.ts';

const originalFetch = globalThis.fetch;
const originalEnv = {
  key: process.env.RESEND_API_KEY,
  from: process.env.CONTACT_FROM_EMAIL,
  to: process.env.CONTACT_TO_EMAIL,
  legacyTo: process.env.CONTACT_EMAIL,
  vercel: process.env.VERCEL,
};

const validBody = {
  name: 'Gopal Hadiya',
  email: 'visitor@example.com',
  subject: 'Role inquiry',
  message: 'I would like to discuss a developer role.',
  submissionId: 'test-submission-1234',
  formElapsedMs: 5000,
};

function fakeRequest(method: string, body?: unknown, url = '/api/contact') {
  return {
    method,
    url,
    body,
    headers: {},
    ip: `test-${Math.random()}`,
  };
}

function captureResponse() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    status(code: number) { statusCode = code; return response; },
    json(value: unknown) { body = value; },
    setHeader() {},
  };
  return { response, get status() { return statusCode; }, get body() { return body as Record<string, unknown>; } };
}

beforeEach(() => {
  process.env.RESEND_API_KEY = 're_test_key';
  process.env.CONTACT_FROM_EMAIL = 'Portfolio <contact@example.com>';
  process.env.CONTACT_TO_EMAIL = 'owner@example.com';
  delete process.env.VERCEL;
  globalThis.fetch = originalFetch;
});

after(() => {
  globalThis.fetch = originalFetch;
  if (originalEnv.key === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalEnv.key;
  if (originalEnv.from === undefined) delete process.env.CONTACT_FROM_EMAIL;
  else process.env.CONTACT_FROM_EMAIL = originalEnv.from;
  if (originalEnv.to === undefined) delete process.env.CONTACT_TO_EMAIL;
  else process.env.CONTACT_TO_EMAIL = originalEnv.to;
  if (originalEnv.legacyTo === undefined) delete process.env.CONTACT_EMAIL;
  else process.env.CONTACT_EMAIL = originalEnv.legacyTo;
  if (originalEnv.vercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = originalEnv.vercel;
});

test('rejects invalid fields before calling the email provider', async () => {
  globalThis.fetch = async () => { throw new Error('Provider must not be called for invalid input'); };
  const invalidCases = [
    [{ ...validBody, name: 'G' }, /full name/i],
    [{ ...validBody, email: 'not-an-email' }, /valid email/i],
    [{ ...validBody, subject: 'Hi' }, /subject/i],
    [{ ...validBody, message: 'Short' }, /message/i],
    [{ ...validBody, companyWebsite: 'spam.test' }, /spam protection/i],
    [{ ...validBody, formElapsedMs: 300 }, /review your message/i],
  ] as const;
  for (const [body, error] of invalidCases) {
    const result = captureResponse();
    await handleContactRequest(fakeRequest('POST', body), result.response);
    assert.equal(result.status, 400);
    assert.match(String(result.body.error), error);
  }
});

test('returns a configuration error when Resend credentials are missing', async () => {
  delete process.env.RESEND_API_KEY;
  const result = captureResponse();
  await handleContactRequest(fakeRequest('POST', validBody), result.response);
  assert.equal(result.status, 503);
  assert.equal(result.body.ok, false);
});

test('requires a verified sender address in Vercel deployments', async () => {
  process.env.VERCEL = '1';
  delete process.env.CONTACT_FROM_EMAIL;
  const result = captureResponse();
  await handleContactRequest(fakeRequest('POST', validBody), result.response);
  assert.equal(result.status, 503);
  assert.match(String(result.body.error), /verified in Resend/i);
});

test('uses the portfolio mailbox and Resend test sender when optional addresses are omitted', async () => {
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.CONTACT_TO_EMAIL;
  let requestBody: Record<string, unknown> | undefined;
  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({ id: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c' }), { status: 200 });
  };
  const result = captureResponse();
  await handleContactRequest(fakeRequest('POST', { ...validBody, submissionId: 'test-default-mailbox-01' }), result.response);
  assert.equal(result.status, 202);
  assert.equal(requestBody?.from, 'Gopal Hadiya Portfolio <onboarding@resend.dev>');
  assert.deepEqual(requestBody?.to, ['goaplahir006@gmail.com']);
});

test('accepts the existing CONTACT_EMAIL setting as the recipient mailbox', async () => {
  delete process.env.CONTACT_TO_EMAIL;
  process.env.CONTACT_EMAIL = 'legacy-recipient@example.com';
  let requestBody: Record<string, unknown> | undefined;
  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({ id: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c' }), { status: 200 });
  };
  const result = captureResponse();
  await handleContactRequest(fakeRequest('POST', { ...validBody, submissionId: 'test-legacy-contact-email' }), result.response);
  assert.equal(result.status, 202);
  assert.deepEqual(requestBody?.to, ['legacy-recipient@example.com']);
});

test('submits through Resend and reports success only after delivery is confirmed', async () => {
  const emailId = '4ef9a417-02e9-4d39-ad75-9611e0fcc33c';
  let requestBody: Record<string, unknown> | undefined;
  let requestHeaders: HeadersInit | undefined;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url === 'https://api.resend.com/emails') {
      requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
      requestHeaders = init?.headers;
      return new Response(JSON.stringify({ id: emailId }), { status: 200 });
    }
    assert.equal(url, `https://api.resend.com/emails/${emailId}`);
    return new Response(JSON.stringify({ last_event: 'delivered' }), { status: 200 });
  };

  const sent = captureResponse();
  await handleContactRequest(fakeRequest('POST', validBody), sent.response);
  assert.equal(sent.status, 202);
  assert.equal(sent.body.status, 'pending');
  assert.equal(sent.body.emailId, emailId);
  assert.equal((requestHeaders as Record<string, string>)['Idempotency-Key'], `portfolio-contact-${validBody.submissionId}`);
  assert.equal(requestBody?.reply_to, validBody.email);
  assert.deepEqual(requestBody?.to, ['owner@example.com']);

  const checked = captureResponse();
  await handleContactStatusRequest(fakeRequest('GET', undefined, `/api/contact?id=${emailId}`), checked.response);
  assert.equal(checked.status, 200);
  assert.deepEqual(checked.body, { ok: true, status: 'delivered' });
});

test('does not mark provider-accepted but undelivered email as success', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ last_event: 'sent' }), { status: 200 });
  const result = captureResponse();
  await handleContactStatusRequest(fakeRequest('GET', undefined, '/api/contact?id=4ef9a417-02e9-4d39-ad75-9611e0fcc33c'), result.response);
  assert.deepEqual(result.body, { ok: true, status: 'pending' });
});

test('reports a bounced email as failed', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ last_event: 'bounced' }), { status: 200 });
  const result = captureResponse();
  await handleContactStatusRequest(fakeRequest('GET', undefined, '/api/contact?id=4ef9a417-02e9-4d39-ad75-9611e0fcc33c'), result.response);
  assert.deepEqual(result.body, { ok: true, status: 'failed' });
});

test('returns an error when Resend rejects a send request', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'rejected' }), { status: 403 });
  const result = captureResponse();
  await handleContactRequest(fakeRequest('POST', { ...validBody, submissionId: 'test-submission-provider-error' }), result.response);
  assert.equal(result.status, 502);
  assert.equal(result.body.ok, false);
});
