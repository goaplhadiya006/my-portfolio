import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { portfolioConfig } from '../data/portfolioData';

interface ContactSectionProps {
  nameInputRef: React.RefObject<HTMLInputElement | null>;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactSection({ nameInputRef }: ContactSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { personal, socialLinks } = portfolioConfig;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState(''); // Honeypot
  const formLoadedAtRef = useRef<number>(Date.now());

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    status: 'idle' | 'success' | 'error';
    text: string;
  }>({ status: 'idle', text: '' });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const emailDraftHref = `mailto:${personal.email}?subject=${encodeURIComponent(subject.trim() || 'Portfolio inquiry for Gopal Hadiya')}&body=${encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`)}`;

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a subject (at least 3 characters).';
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Please write a message of at least 10 characters.';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitState({ status: 'idle', text: '' });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          companyWebsite,
          formElapsedMs: Date.now() - formLoadedAtRef.current,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };

      if (!response.ok || !data.ok) {
        setSubmitState({
          status: 'error',
          text:
            data.error ||
            'Could not send your message right now. Please email goaplahir006@gmail.com directly.',
        });
        return;
      }

      setSubmitState({
        status: 'success',
        text: data.message || 'Your message was received by the server.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      formLoadedAtRef.current = Date.now();
    } catch {
      setSubmitState({
        status: 'error',
        text: 'The contact server could not be reached. Your message is still here; use the email option below to send it.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const activeSocials = socialLinks.filter((s) => s.href !== null && s.id !== 'email');

  return (
    <section id="contact" className="border-t border-white/10 bg-[#0B0F1E]/60 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
            Contact
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Let&apos;s Work Together
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Looking for an enthusiastic AI/ML Engineer, Python Developer, or Full Stack intern or junior developer? Send a message below or connect directly.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Direct Details & Socials */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#11162A] p-6 sm:p-8"
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Direct Contact Details
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Available for full-time entry-level roles, internships, and collaborative Python / ML projects.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-[#0B0F1E] p-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <Mail className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">Email</p>
                      <a
                        href={`mailto:${personal.email}`}
                        className="mt-0.5 block truncate text-sm font-medium text-white hover:text-violet-300 transition-colors"
                      >
                        {personal.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#11162A] text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0B0F1E] p-4">
                  <Phone className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-slate-400">Phone</p>
                    <a
                      href={personal.phoneHref}
                      className="mt-0.5 block font-mono text-sm font-medium text-white hover:text-violet-300 transition-colors"
                    >
                      {personal.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0B0F1E] p-4">
                  <MapPin className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-slate-400">Location</p>
                    <p className="mt-0.5 text-sm font-medium text-white">{personal.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {activeSocials.map((social) => {
                  const Icon = social.id === 'github' ? Github : Linkedin;
                  return (
                    <a
                      key={social.id}
                      href={social.href ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0B0F1E] text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>

              <a
                href={`mailto:${personal.email}?subject=Opportunity%20for%20Gopal%20Hadiya`}
                className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-600/15 px-4 py-2.5 text-xs font-semibold text-violet-200 hover:bg-violet-600/25 transition-colors min-h-[40px] whitespace-nowrap"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Get In Touch via Email</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Validated Backend Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#11162A] p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Honeypot Spam Trap (hidden from screen readers and keyboard users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company-website">Company Website</label>
                <input
                  id="company-website"
                  name="companyWebsite"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-200">
                    Full Name
                  </label>
                  <input
                    ref={nameInputRef}
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder="Your name"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-[#0B0F1E] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none min-h-[44px]"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs text-rose-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-200">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    placeholder="you@company.com"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-[#0B0F1E] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none min-h-[44px]"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs text-rose-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-200">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  placeholder="Role inquiry, collaboration, or project discussion"
                  className="mt-2 w-full rounded-lg border border-white/15 bg-[#0B0F1E] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none min-h-[44px]"
                />
                {errors.subject && (
                  <p id="contact-subject-error" className="mt-1.5 text-xs text-rose-400">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-200">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  placeholder="Share details about the opportunity or project..."
                  className="mt-2 w-full rounded-lg border border-white/15 bg-[#0B0F1E] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none resize-y"
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-xs text-rose-400">
                    {errors.message}
                  </p>
                )}
              </div>

              {submitState.status !== 'idle' && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex flex-wrap items-start gap-2.5 rounded-xl border p-4 text-sm ${
                    submitState.status === 'success'
                      ? 'border-emerald-500/35 bg-emerald-950/30 text-emerald-200'
                      : 'border-rose-500/35 bg-rose-950/30 text-rose-200'
                  }`}
                >
                  {submitState.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1">{submitState.text}</span>
                  {submitState.status === 'error' && (
                    <a
                      href={emailDraftHref}
                      className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-300/40 bg-white/10 px-3 py-2 text-xs font-semibold text-current underline-offset-2 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      Send via email instead
                    </a>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 min-h-[44px] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
