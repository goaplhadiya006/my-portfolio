import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, FileText, Globe, GraduationCap } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioData';

interface AboutSectionProps {
  onOpenAboutModal: () => void;
}

export function AboutSection({ onOpenAboutModal }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { personal } = portfolioConfig;

  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
            About Me
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Engineering practical AI, data, and web applications
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Narrative & CTA */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#11162A] p-6 sm:p-8"
          >
            <div className="space-y-4 text-base leading-relaxed text-slate-300">
              {personal.aboutParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onOpenAboutModal}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 active:scale-[0.98] transition-all duration-150 min-h-[44px] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>More About Me &amp; Resume</span>
              </button>

              <a
                href={personal.cvPath}
                download={personal.cvDownloadName}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-violet-400/50 hover:text-white transition-colors min-h-[44px] whitespace-nowrap shrink-0"
              >
                <span>Download PDF Resume</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Structured Academic & Profile Summary */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0F1E] p-6 sm:p-8 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2.5 text-white">
                <GraduationCap className="h-5 w-5 text-violet-400" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold">Education</h3>
              </div>

              <div className="mt-4 space-y-4">
                {personal.education.map((edu, index) => (
                  <div
                    key={edu.degree}
                    className={index > 0 ? 'pt-4 border-t border-white/10' : ''}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{edu.degree}</p>
                      <span className="font-mono text-xs text-violet-300 shrink-0 tabular-nums">
                        {edu.period}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{edu.institution}</p>
                    {edu.score && (
                      <p className="mt-1 font-mono text-xs text-slate-300">{edu.score}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 text-slate-100">
                  <Globe className="h-4 w-4 text-violet-400" aria-hidden="true" />
                  <h4 className="font-display text-sm font-semibold">Languages</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {personal.languages.join(' · ')}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-100">
                  <BookOpen className="h-4 w-4 text-violet-400" aria-hidden="true" />
                  <h4 className="font-display text-sm font-semibold">Strengths</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Teamwork · Leadership · Communication
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
