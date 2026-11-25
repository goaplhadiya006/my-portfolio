import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Cpu, FolderCheck, GraduationCap } from 'lucide-react';
import { portfolioConfig, type StatItem } from '../data/portfolioData';

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      if (prefersReducedMotion) setDisplayValue(target);
      return;
    }

    if (target === 0) {
      setDisplayValue(0);
      return;
    }

    let rafId = 0;
    const duration = 700;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span ref={ref} className="font-mono text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
      {displayValue}
      <span className="text-violet-400">{suffix}</span>
    </span>
  );
}

function getStatIcon(id: StatItem['id']) {
  switch (id) {
    case 'education-span':
      return GraduationCap;
    case 'projects-completed':
      return FolderCheck;
    default:
      return Cpu;
  }
}

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Portfolio key statistics" className="border-y border-white/10 bg-[#0B0F1E]/70 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {portfolioConfig.stats.map((stat, idx) => {
            const Icon = getStatIcon(stat.id);
            return (
              <motion.div
                key={stat.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-white/10 bg-[#11162A] p-5 transition-colors hover:border-violet-500/35"
              >
                <div className="flex items-center justify-between gap-3">
                  <AnimatedCounter target={stat.numericValue} suffix={stat.suffix} />
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/15 text-violet-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-slate-100">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {stat.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
