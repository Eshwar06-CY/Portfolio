import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Github, CheckCircle2 } from 'lucide-react';

export default function CaseStudyModal({ project, onClose, onCursorChange }) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  const { caseStudy } = project;

  const phases = [
    { label: '01 — THE PROBLEM', content: caseStudy.problem },
    { label: '02 — THE IDEA', content: caseStudy.idea },
    { label: '03 — THE APPROACH', content: caseStudy.approach },
    { label: '04 — THE BUILD', content: caseStudy.build },
    { label: '05 — THE RESULT', content: caseStudy.result },
    { label: '06 — WHAT I LEARNED', content: caseStudy.learned }
  ];

  return (
    <AnimatePresence>
      <div className="case-study-backdrop" onClick={onClose}>
        <motion.aside
          className="case-study-sheet"
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Case Study`}
        >
          {/* Sticky Header */}
          <div className="case-study-header-bar">
            <div className="case-study-header-meta">
              <span>PROJECT {project.number}</span>
              <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
              <span>{project.category}</span>
            </div>

            <button
              className="btn-close-modal"
              onClick={onClose}
              onMouseEnter={() => onCursorChange?.('hover')}
              onMouseLeave={() => onCursorChange?.(null)}
              aria-label="Close Case Study"
            >
              <span>CLOSE [ESC]</span>
              <X size={15} />
            </button>
          </div>

          {/* Case Study Body */}
          <div className="case-study-content-body">
            {/* Hero Header */}
            <div className="case-study-hero-block">
              <h2 className="case-study-big-title">{project.title}</h2>
              <p className="case-study-tagline">{project.tagline}</p>
            </div>

            {/* Media Banner */}
            <div className="case-study-media-banner">
              <img src={project.image} alt={project.title} />
            </div>

            {/* Tech Badges */}
            <div className="project-tags-list" style={{ marginBottom: 0 }}>
              {project.tags.map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>

            {/* 6 Mandatory Phases */}
            <div className="case-study-phases-container">
              {phases.map((phase, idx) => (
                <div key={phase.label} className="phase-item">
                  <div className="phase-label">{phase.label}</div>
                  <div className="phase-text">{phase.content}</div>
                </div>
              ))}
            </div>

            {/* Footer / Links */}
            <div style={{ display: 'flex', gap: '18px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-project-secondary"
                  onMouseEnter={() => onCursorChange?.('hover')}
                  onMouseLeave={() => onCursorChange?.(null)}
                >
                  <Github size={14} />
                  <span>VIEW REPOSITORY</span>
                </a>
              )}
              <button
                className="btn-case-study"
                onClick={onClose}
                onMouseEnter={() => onCursorChange?.('hover')}
                onMouseLeave={() => onCursorChange?.(null)}
              >
                <span>BACK TO PROJECTS</span>
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
