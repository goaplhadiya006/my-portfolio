import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { type BlogArticle, type ProjectItem } from './data/portfolioData';

// Lazy-load below-the-fold sections for optimal initial bundle splitting
const TechnologyStackSection = lazy(() =>
  import('./components/TechnologyStackSection').then((m) => ({ default: m.TechnologyStackSection }))
);
const ProjectsSection = lazy(() =>
  import('./components/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
);
const BlogSection = lazy(() =>
  import('./components/BlogSection').then((m) => ({ default: m.BlogSection }))
);
const ContactSection = lazy(() =>
  import('./components/ContactSection').then((m) => ({ default: m.ContactSection }))
);
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer }))
);
const AboutResumeModal = lazy(() =>
  import('./components/Modals').then((m) => ({ default: m.AboutResumeModal }))
);
const ProjectDetailModal = lazy(() =>
  import('./components/Modals').then((m) => ({ default: m.ProjectDetailModal }))
);
const ArticleModal = lazy(() =>
  import('./components/Modals').then((m) => ({ default: m.ArticleModal }))
);

const SECTION_IDS = ['home', 'about', 'stack', 'projects', 'blog', 'contact'];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeSection, setActiveSection] = useState<string>('home');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const contactNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'light' ? '#f8fafc' : '#070913'
    );
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // The theme still works for this session when browser storage is unavailable.
    }
  }, [theme]);

  const scrollToSection = useCallback((sectionId: string, focusContact = false) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      if (focusContact) {
        setTimeout(() => {
          contactNameRef.current?.focus({ preventScroll: true });
        }, 450);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = 'home';

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
      />

      <main className="flex-1">
        <HeroSection
          onHireMe={() => scrollToSection('contact', true)}
        />

        <StatsSection />

        <AboutSection onOpenAboutModal={() => setAboutModalOpen(true)} />

        <Suspense fallback={<div className="py-16 text-center text-xs text-slate-500">Loading sections...</div>}>
          <TechnologyStackSection />
          <ProjectsSection onSelectProject={setSelectedProject} />
          <BlogSection onSelectArticle={setSelectedArticle} />
          <ContactSection nameInputRef={contactNameRef} />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer onNavigate={scrollToSection} />
      </Suspense>

      <Suspense fallback={null}>
        {aboutModalOpen && (
          <AboutResumeModal onClose={() => setAboutModalOpen(false)} />
        )}
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </Suspense>
    </div>
  );
}
