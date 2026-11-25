import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { portfolioConfig, type BlogArticle } from '../data/portfolioData';

interface BlogSectionProps {
  onSelectArticle: (article: BlogArticle) => void;
}

export function BlogSection({ onSelectArticle }: BlogSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showAllDetails, setShowAllDetails] = useState(false);

  return (
    <section id="blog" className="border-t border-white/10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
              Engineering Notes &amp; Articles
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Technical Write-ups in Progress
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Structured article drafts documenting engineering decisions behind my Flask, AI inference, and database builds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllDetails((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#11162A] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-violet-400/50 hover:text-white transition-colors min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer w-fit"
          >
            <BookOpenText className="h-4 w-4 text-violet-400" aria-hidden="true" />
            <span>{showAllDetails ? 'Compact View' : 'View All Outlines'}</span>
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {portfolioConfig.blogArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11162A] transition-colors hover:border-violet-500/40"
            >
              {/* Clean geometric editorial header thumbnail */}
              <div className="relative h-36 w-full border-b border-white/10 bg-gradient-to-br from-[#141A35] via-[#0F1328] to-[#080B18] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-violet-300">0{index + 1}</span>
                  <span>{article.statusLabel}</span>
                </div>
                <p className="font-mono text-xs text-slate-300 truncate">
                  {article.relatedTech.join(' · ')}
                </p>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  {/* Unboxed static metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-violet-300">{article.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readingTime}</span>
                  </div>

                  <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-white">
                    {article.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {article.summary}
                  </p>

                  {showAllDetails && (
                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-xs text-slate-400 list-disc pl-4">
                      {article.outline.slice(0, 3).map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onSelectArticle(article)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 transition-colors min-h-[36px] cursor-pointer"
                  >
                    <span>Read Draft Outline</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
