import { useEffect } from 'react';
import { Download, ExternalLink, Github, X } from 'lucide-react';
import {
  portfolioConfig,
  type BlogArticle,
  type ProjectItem,
} from '../data/portfolioData';

function ModalBackdrop({
  onClose,
  titleId,
  children,
}: {
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#11162A] p-6 sm:p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export function AboutResumeModal({ onClose }: { onClose: () => void }) {
  const { personal } = portfolioConfig;

  return (
    <ModalBackdrop onClose={onClose} titleId="about-modal-title">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
            Profile &amp; Resume
          </p>
          <h3 id="about-modal-title" className="mt-1 font-display text-2xl font-bold text-white">
            {personal.fullName} — {personal.role}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0B0F1E] text-slate-300 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#0B0F1E] p-4">
            <h4 className="font-display text-sm font-semibold text-white">Soft Skills</h4>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300 list-disc pl-4">
              {personal.softSkills.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0B0F1E] p-4">
            <h4 className="font-display text-sm font-semibold text-white">Languages &amp; Location</h4>
            <p className="mt-2.5 text-xs text-slate-300">
              Languages: {personal.languages.join(', ')}
            </p>
            <p className="mt-1.5 text-xs text-slate-400">
              Based in {personal.location}
            </p>
            <p className="mt-1.5 font-mono text-xs text-violet-300">
              {personal.email}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-3">
            <h4 className="font-display text-sm font-semibold text-white">
              Resume Document Preview
            </h4>
            <a
              href={personal.cvPath}
              download={personal.cvDownloadName}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download PDF</span>
            </a>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#070913]">
            <iframe
              src={personal.cvPath}
              title={`${personal.fullName} Resume PDF`}
              className="h-[380px] w-full"
            />
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  return (
    <ModalBackdrop onClose={onClose} titleId="project-modal-title">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-medium text-violet-300">
            {project.category} · {project.tagline}
          </p>
          <h3 id="project-modal-title" className="mt-1 font-display text-2xl font-bold text-white">
            {project.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0B0F1E] text-slate-300 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <p className="text-sm leading-relaxed text-slate-300">{project.description}</p>

        <div>
          <h4 className="font-display text-sm font-semibold text-white">
            Key Engineering Highlights
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc pl-5">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-white">
            Technologies Used
          </h4>
          <p className="mt-2 font-mono text-xs leading-relaxed text-violet-300">
            {project.technologies.join(' · ')}
          </p>
        </div>

        {!project.liveUrl && (
          <div className="rounded-xl border border-white/10 bg-[#0B0F1E] p-4 text-xs text-slate-400">
            Live deployment URL is not yet linked. Add <code className="font-mono text-violet-300">liveUrl</code> for this project in{' '}
            <code className="font-mono text-violet-300">src/data/portfolioData.ts</code> when hosted.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors min-h-[40px]"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span>Open GitHub Profile</span>
          </a>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors min-h-[40px]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span>Visit Live App</span>
            </a>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}

export function ArticleModal({
  article,
  onClose,
}: {
  article: BlogArticle;
  onClose: () => void;
}) {
  return (
    <ModalBackdrop onClose={onClose} titleId="article-modal-title">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-medium text-violet-300">
            {article.topic} · {article.statusLabel} · {article.readingTime}
          </p>
          <h3 id="article-modal-title" className="mt-1 font-display text-2xl font-bold text-white">
            {article.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article outline"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0B0F1E] text-slate-300 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <p className="text-sm leading-relaxed text-slate-300">{article.summary}</p>

        <div>
          <h4 className="font-display text-sm font-semibold text-white">
            Planned Article Sections
          </h4>
          <ol className="mt-3 space-y-2.5 text-sm text-slate-300 list-decimal pl-5">
            {article.outline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0B0F1E] p-4 text-xs text-slate-400">
          Status: <span className="text-slate-200 font-medium">{article.statusLabel}</span> — this write-up is queued in{' '}
          <code className="font-mono text-violet-300">src/data/portfolioData.ts</code> and has not been assigned a fake publication date.
        </div>
      </div>
    </ModalBackdrop>
  );
}
