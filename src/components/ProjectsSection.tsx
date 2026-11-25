import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ExternalLink, FileSpreadsheet, Github, Image as ImageIcon, Layers } from 'lucide-react';
import { portfolioConfig, type ProjectItem } from '../data/portfolioData';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

type ProjectFilter = 'All' | ProjectItem['category'];

function ProjectVisualPreview({ visualType, title }: { visualType: ProjectItem['visualType']; title: string }) {
  if (visualType === 'mytools') {
    return (
      <div
        aria-label={`${title} interface preview`}
        className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#131936] via-[#0E1328] to-[#080B18] p-5 flex flex-col justify-between border-b border-white/10 group-hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-violet-300">Flask · ONNX Runtime · PIL</span>
          <span className="font-mono">AI Image Utility</span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-auto py-3">
          <div className="rounded-lg border border-white/10 bg-[#182042]/80 p-3">
            <div className="flex items-center gap-2 text-violet-300">
              <ImageIcon className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold text-white">BG Remover</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-9 w-9 rounded bg-gradient-to-tr from-violet-600/40 to-indigo-400/30 border border-white/10" />
              <span className="text-[11px] text-slate-400">rembg segmentation</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#182042]/80 p-3">
            <div className="flex items-center gap-2 text-indigo-300">
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold text-white">Batch Compress</span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div className="h-full w-3/4 bg-violet-500" />
              </div>
              <span className="block text-[11px] text-slate-400">ZIP Export Ready</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>MySQL / TiDB Storage</span>
          <span>PyMySQL Auth</span>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={`${title} interface preview`}
      className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#161435] via-[#0F1228] to-[#080B18] p-5 flex flex-col justify-between border-b border-white/10 group-hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-violet-300">Flask · Pandas · ReportLab</span>
        <span className="font-mono">Resume Analyzer</span>
      </div>

      <div className="grid grid-cols-5 gap-3 my-auto py-3 items-center">
        <div className="col-span-3 rounded-lg border border-white/10 bg-[#181D3D]/85 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-violet-300" aria-hidden="true" />
            <span className="text-xs font-semibold text-white">PyPDF2 Extraction</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-4/5 rounded bg-slate-600/60" />
            <div className="h-1.5 w-3/5 rounded bg-slate-600/40" />
            <div className="h-1.5 w-2/3 rounded bg-violet-500/50" />
          </div>
        </div>

        <div className="col-span-2 rounded-lg border border-violet-400/25 bg-violet-600/15 p-3 text-center">
          <span className="block font-mono text-[10px] text-violet-200">Section Check</span>
          <span className="mt-1 block font-display text-lg font-bold text-white">PDF Export</span>
          <span className="block text-[10px] text-slate-300">ReportLab</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Skills &amp; Section Audit</span>
        <span>MySQL History</span>
      </div>
    </div>
  );
}

export function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');

  const filters: ProjectFilter[] = ['All', 'AI & ML', 'Python & Flask'];

  const filteredProjects =
    activeFilter === 'All'
      ? portfolioConfig.projects
      : portfolioConfig.projects.filter((p) => p.category === activeFilter);

  const githubProfile =
    portfolioConfig.socialLinks.find((s) => s.id === 'github')?.href ??
    'https://github.com/goaplhadiya006';

  return (
    <section id="projects" className="border-t border-white/10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
              Featured Projects
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built with Python, Flask, AI Inference &amp; SQL
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Real engineering builds documented in my resume. Click Case Study to inspect architecture highlights and full stack details.
            </p>
          </div>

          {/* Filter Segmented Control */}
          <div
            role="tablist"
            aria-label="Filter projects by focus area"
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#11162A] p-1 w-fit"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11162A] transition-all duration-200 hover:border-violet-500/45 shadow-lg shadow-black/20"
            >
              <div className="overflow-hidden">
                <ProjectVisualPreview visualType={project.visualType} title={project.title} />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex items-center gap-2 text-xs text-violet-300">
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{project.tagline}</span>
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {project.description}
                  </p>

                  {/* Unboxed clean typographic tech list (zero-pill discipline) */}
                  <p className="mt-4 font-mono text-xs leading-relaxed text-slate-400">
                    {project.technologies.join(' · ')}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-white/10">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors min-h-[40px] whitespace-nowrap shrink-0"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Case Study &amp; Stack</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-violet-400/50 hover:text-white transition-colors min-h-[40px] whitespace-nowrap shrink-0"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={githubProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#11162A] px-6 py-3 text-sm font-semibold text-slate-100 hover:border-violet-400/50 hover:bg-[#171E38] transition-colors min-h-[44px]"
          >
            <Github className="h-4 w-4 text-violet-400" aria-hidden="true" />
            <span>View All Repositories on GitHub</span>
            <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
