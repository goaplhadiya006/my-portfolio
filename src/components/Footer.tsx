import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const FOOTER_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export function Footer({ onNavigate }: FooterProps) {
  const { personal, socialLinks } = portfolioConfig;
  const activeSocials = socialLinks.filter((s) => s.href !== null);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#05070F] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="font-display text-lg font-bold tracking-tight text-white hover:text-violet-300 transition-colors"
            >
              {personal.fullName}
            </a>
            <p className="mt-1 text-xs text-slate-400">
              {personal.role} · {personal.location}
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {activeSocials.map((social) => {
              const Icon =
                social.id === 'github'
                  ? Github
                  : social.id === 'linkedin'
                    ? Linkedin
                    : Mail;
              const isExternal = social.href?.startsWith('http');
              return (
                <a
                  key={social.id}
                  href={social.href ?? '#'}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0B0F1E] text-slate-400 hover:border-violet-400/50 hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}

            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0B0F1E] px-3 py-2 text-xs font-medium text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors min-h-[36px] whitespace-nowrap cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {personal.fullName}. All rights reserved.</p>
          <p>Built with React, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
