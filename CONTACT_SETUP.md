# Contact form email setup

The form now sends from the server through Resend. The Resend API key is only read by the server and Vercel Function; it is never added to the browser bundle. The form reports success only after Resend's email record says `last_event: delivered` (meaning the recipient mail server accepted it).

## Required environment variables

Set `RESEND_API_KEY` in local `.env` and in Vercel's Development, Preview, and Production environments. The recipient defaults to the portfolio's contact email. `CONTACT_FROM_EMAIL` defaults to Resend's test sender locally, but is required on Vercel and must use a verified domain.

```dotenv
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=goaplahir006@gmail.com
CONTACT_FROM_EMAIL="Gopal Hadiya Portfolio <contact@your-verified-domain.com>"
```

Create a Resend API key with **Full access** because the server reads the sent email's delivery event after sending. With no sender override, Resend's `onboarding@resend.dev` address is only for testing and Resend restricts test mail to the account email. For public production, verify a sender domain in Resend and set `CONTACT_FROM_EMAIL` to an address on that domain. `CONTACT_TO_EMAIL` defaults to the email address shown in the portfolio. Never put the API key in a `VITE_` variable or frontend file.

## Local development

1. Copy `.env.example` to `.env` and set `RESEND_API_KEY`. If your `.env` already has `CONTACT_EMAIL`, it is accepted as the recipient mailbox; otherwise the recipient defaults to the portfolio email. For real delivery outside Resend test mode, set `CONTACT_FROM_EMAIL` to your verified sender address.
2. Run `npm install` and `npm run dev` from the project root. This starts Express on port 3000 and serves the Vite app through the same origin, so `/api/contact` reaches Express without a Vite proxy. Restart the dev server after changing `.env`.
3. Submit the form. The form validates all fields, sends one idempotent request, and checks delivery status. It only displays success after Resend confirms delivery.
4. Run `npm test` for API validation, provider-error, idempotency-header, pending, delivered, and bounced-status checks. These tests mock the Resend HTTP responses and do not send a real email.

To verify a real local email, use the Resend key and verified sender, submit the form once, and confirm that Resend's Emails dashboard shows **Delivered** for that email. The form also waits for that delivery event before showing success.

## Vercel deployment

1. Import this repository as a Vercel project. Keep the project root at the repository root.
2. Use `npm run build` as the build command and `dist` as the output directory. These are also set in `vercel.json`.
3. In **Project Settings → Environment Variables**, add `RESEND_API_KEY` and a verified `CONTACT_FROM_EMAIL` for the environments you use. Optionally add `CONTACT_TO_EMAIL` (or `CONTACT_EMAIL`) to choose the receiving mailbox.
4. Deploy or redeploy. Vercel automatically deploys `api/contact.ts` as the `/api/contact` Node.js Function; Vercel does not start `server.ts` for this deployment. The static Vite site and function share the same origin.
5. Submit a real test message from the deployed site. Confirm **Delivered** in the Resend dashboard and that the form changes to success only after it sees the provider's delivered status.

The repository does not contain Vercel credentials, a deployed Vercel project, or Resend credentials. Production deployment and real inbox delivery must be verified after those are configured; no test or success response in this code fakes a delivered email.
