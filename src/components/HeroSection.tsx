import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownToLine, ArrowRight, BrainCircuit, Code2, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioData';

interface HeroSectionProps {
  onHireMe: () => void;
}

export function HeroSection({ onHireMe }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { personal, socialLinks } = portfolioConfig;
  const activeSocials = socialLinks.filter((social) => social.href !== null);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-architectural-grid pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      <div aria-hidden="true" className="hero-photo-backdrop pointer-events-none absolute inset-0 z-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 z-0 h-[30rem] w-[30rem] rounded-full bg-violet-700/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start lg:col-span-7"
          >
            <p className="text-xs font-bold tracking-[0.18em] text-violet-300 sm:text-sm">
              {personal.greeting}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                {!prefersReducedMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {personal.availabilityNote}
            </div>

            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {personal.firstName}{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                {personal.lastName}
              </span>
            </h1>

            <p className="mt-5 font-display text-xl font-semibold text-slate-200 sm:text-2xl">
              {personal.role}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {personal.shortIntro}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-violet-400" aria-hidden="true" />
                {personal.location}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" aria-hidden="true" />
              <span>Open to software development opportunities</span>
            </div>

            <div className="mt-7 max-w-2xl border-l-2 border-violet-500/60 pl-4 sm:pl-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">Career objective</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300 sm:text-base">
                {personal.careerObjective}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-wrap items-center gap-3 sm:w-auto sm:gap-4">
              <a
                href={personal.cvPath}
                download={personal.cvDownloadName}
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-violet-900/40 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-6"
              >
                <ArrowDownToLine className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                Download My Resume
              </a>
              <button
                type="button"
                onClick={onHireMe}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#11162A]/80 px-5 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/45 hover:text-white active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-6"
              >
                Let’s Connect
                <ArrowRight className="h-4 w-4 text-violet-300" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3" aria-label="Professional links">
              <span className="mr-1 text-xs font-medium text-slate-500">Find me on</span>
              {activeSocials.map((social) => {
                const Icon = social.id === 'github' ? Github : social.id === 'linkedin' ? Linkedin : Mail;
                const isExternal = social.href?.startsWith('http');
                return (
                  <a
                    key={social.id}
                    href={social.href ?? '#'}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={`${social.label}: ${social.displayValue}`}
                    title={`${social.label}: ${social.displayValue}`}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 bg-[#11162A]/70 text-slate-300 transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-400/40 hover:text-violet-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:col-span-5 lg:justify-end"
          >
            <motion.figure
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative flex h-64 w-64 items-center justify-center sm:h-[22rem] sm:w-[22rem] lg:h-96 lg:w-96"
            >
              <div aria-hidden="true" className="absolute inset-0 rounded-full border border-violet-400/20" />
              <div aria-hidden="true" className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-500/25 via-purple-700/15 to-indigo-950/50 shadow-[0_0_90px_-24px_rgba(139,92,246,0.6)]" />
              <div className="relative z-10 h-56 w-56 overflow-hidden rounded-full border border-white/15 bg-[#0E1326] shadow-2xl shadow-black/30 sm:h-80 sm:w-80 lg:h-[21rem] lg:w-[21rem]">
                {personal.profileImageUrl ? (
                  <img
                    src={personal.profileImageUrl}
                    alt={`${personal.fullName}, ${personal.role}`}
                    width={1417}
                    height={1600}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.025] motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#151B36] to-[#0B0F1E] font-display text-5xl font-bold text-violet-200">
                    {personal.initials}
                  </div>
                )}
              </div>

              <motion.div
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -right-3 top-7 z-20 min-w-44 rounded-xl border border-white/10 bg-[#11162A]/95 px-4 py-2 shadow-xl shadow-black/20 backdrop-blur-sm sm:-right-4 sm:top-10"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                    <BrainCircuit className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block whitespace-nowrap text-xs font-semibold text-white">AI/ML Engineer</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">Applied projects</span>
                  </span>
                </div>
              </motion.div>

              <motion.div
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                className="pointer-events-none absolute bottom-7 -left-3 z-20 min-w-44 rounded-xl border border-white/10 bg-[#11162A]/95 px-4 py-2 shadow-xl shadow-black/20 backdrop-blur-sm sm:bottom-10 sm:-left-4"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                    <Code2 className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-white">Python Developer</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">Flask · Web apps</span>
                  </span>
                </div>
              </motion.div>
            </motion.figure>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-12 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5 lg:pt-8"
          aria-label="Professional highlights"
        >
          {personal.profileHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : index * 0.06 }}
              className="rounded-xl border border-white/[0.08] bg-[#11162A]/65 px-4 py-4 transition-colors hover:border-violet-400/25 sm:px-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">{highlight.label}</p>
              <p className="mt-2 text-sm font-medium leading-snug text-slate-100">{highlight.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
