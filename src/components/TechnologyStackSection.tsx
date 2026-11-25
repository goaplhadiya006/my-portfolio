import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BrainCircuit, Braces, Code2, Database, Server, Wrench } from 'lucide-react';
import { portfolioConfig, type TechnologyCategory } from '../data/portfolioData';

type CategoryFilter = 'all' | TechnologyCategory['id'];

function getCategoryIcon(id: TechnologyCategory['id']) {
  switch (id) {
    case 'languages':
      return Braces;
    case 'frontend':
      return Code2;
    case 'backend':
      return Server;
    case 'aiml':
      return BrainCircuit;
    case 'database':
      return Database;
    default:
      return Wrench;
  }
}

export function TechnologyStackSection() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const categories = portfolioConfig.technologyCategories;
  const visibleCategories = selectedCategory === 'all'
    ? categories
    : categories.filter((category) => category.id === selectedCategory);

  const selectCategory = (category: CategoryFilter) => {
    setSelectedCategory(category);
    setSelectedTechnology(null);
  };

  return (
    <section id="stack" className="relative isolate overflow-hidden border-t border-white/10 bg-[#0B0F1E]/50 py-16 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[110px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Technology Stack</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tools I use to turn ideas into working software
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Technologies drawn from my projects, coursework, resume, and this portfolio. The list shows practical exposure, not proficiency scores.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter technology categories">
          <button
            type="button"
            aria-pressed={selectedCategory === 'all'}
            onClick={() => selectCategory('all')}
            className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-offset-4 ${selectedCategory === 'all' ? 'border-violet-400/50 bg-violet-500/15 text-violet-200' : 'border-white/10 bg-[#11162A] text-slate-300 hover:border-violet-400/40 hover:text-white'}`}
          >
            All stack
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={selectedCategory === category.id}
              onClick={() => selectCategory(category.id)}
              className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-offset-4 ${selectedCategory === category.id ? 'border-violet-400/50 bg-violet-500/15 text-violet-200' : 'border-white/10 bg-[#11162A] text-slate-300 hover:border-violet-400/40 hover:text-white'}`}
            >
              {category.title}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCategories.map((category, index) => {
              const Icon = getCategoryIcon(category.id);
              return (
                <motion.article
                  key={category.id}
                  layout
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, delay: prefersReducedMotion ? 0 : index * 0.035, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-2xl border border-white/10 bg-[#11162A]/90 p-5 shadow-lg shadow-black/10 transition-colors duration-200 hover:border-violet-400/35 sm:p-6"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300 transition-colors group-hover:bg-violet-500/15">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-semibold text-white">{category.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{category.subtitle}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-400" aria-label={`${category.technologies.length} technologies`}>
                      {String(category.technologies.length).padStart(2, '0')}
                    </span>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${category.title} technologies`}>
                    {category.technologies.map((technology) => {
                      const isSelected = selectedTechnology === technology.name;
                      return (
                        <li key={technology.name}>
                          <button
                            type="button"
                            aria-expanded={isSelected}
                            onClick={() => setSelectedTechnology(isSelected ? null : technology.name)}
                            className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-offset-2 sm:text-[13px] ${isSelected ? 'border-violet-400/50 bg-violet-500/15 text-violet-100' : 'border-white/[0.08] bg-white/[0.03] text-slate-200 hover:border-violet-400/35 hover:bg-violet-500/[0.08]'}`}
                          >
                            <span aria-hidden="true" className="flex h-6 min-w-6 items-center justify-center rounded-md bg-violet-500/10 px-1 font-mono text-[9px] font-bold text-violet-300">
                              {technology.mark}
                            </span>
                            {technology.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <AnimatePresence initial={false}>
                    {category.technologies.map((technology) => technology.name === selectedTechnology ? (
                      <motion.p
                        key={technology.name}
                        initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-400"
                      >
                        <span className="font-semibold text-violet-300">{technology.name} </span>
                        {technology.detail}
                      </motion.p>
                    ) : null)}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
