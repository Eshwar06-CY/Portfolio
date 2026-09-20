import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, ExternalLink, Code2, Layers, Cpu, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsData } from '../data/projects';
import Magnetic from '../components/Magnetic';
import { triggerCinematicCut } from '../components/CinematicTransitionVeil';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetails({
  projectId: propProjectId,
  onClose,
  onCursorChange,
  scrollTo
}) {
  const params = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);

  const currentParam = (propProjectId || params.id || 'specra').toLowerCase();
  const currentIndex = projectsData.findIndex(
    (p) =>
      p.id.toLowerCase() === currentParam ||
      p.slug?.toLowerCase() === currentParam ||
      p.id.replace(/[^a-z0-9]/g, '') === currentParam.replace(/[^a-z0-9]/g, '') ||
      p.slug?.replace(/[^a-z0-9]/g, '') === currentParam.replace(/[^a-z0-9]/g, '')
  );
  const project = currentIndex !== -1 ? projectsData[currentIndex] : projectsData[0];
  const nextProject = projectsData[(currentIndex + 1) % projectsData.length];

  const handleReturn = () => {
    if (heroImageRef.current) {
      gsap.to(heroImageRef.current, { scale: 0.97, duration: 0.2, ease: 'power2.in' });
    }
    triggerCinematicCut('SELECTED WORK', () => {
      if (onClose) {
        onClose();
      } else {
        navigate('/', { state: { returnTo: 'work' } });
      }
    });
  };

  const handleNextProject = () => {
    const targetSlug = nextProject.slug || nextProject.id;
    triggerCinematicCut(nextProject.title, () => {
      navigate(`/projects/${targetSlug}`);
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleReturn();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Restrained parallax on the hero visual (scale 1.0 -> 1.04)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroImageRef.current && heroRef.current) {
        gsap.fromTo(
          heroImageRef.current,
          { scale: 1.0 },
          {
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [project.id]);

  const cs = project.caseStudy || {};

  const scrollToSection = (id) => {
    if (scrollTo) {
      scrollTo(`#${id}`, { offset: -80 });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="case-study-page-root"
      role="dialog"
      aria-modal="true"
      aria-label={`Case Study: ${project.title}`}
    >
      {/* Sticky Minimal Header Navigation */}
      <nav className="case-study-nav-bar" aria-label="Case study navigation">
        <Magnetic strength={0.12} maxOffset={3.5}>
          <button
            className="cs-back-btn"
            onClick={handleReturn}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={16} />
            <span>BACK TO WORK</span>
          </button>
        </Magnetic>

        <div className="cs-nav-center-title">
          <span className="cs-title-indicator">{project.title}</span>
          <span className="cs-sep">/</span>
          <span className="cs-sub-indicator">CASE STUDY</span>
        </div>

        <div className="cs-nav-anchors">
          <button onClick={() => scrollToSection('cs-overview')} className="cs-anchor-link">01 OVERVIEW</button>
          <button onClick={() => scrollToSection('cs-problem')} className="cs-anchor-link">02 PROBLEM</button>
          <button onClick={() => scrollToSection('cs-approach')} className="cs-anchor-link">03 APPROACH</button>
          <button onClick={() => scrollToSection('cs-process')} className="cs-anchor-link">04 PROCESS</button>
          <button onClick={() => scrollToSection('cs-outcome')} className="cs-anchor-link">05 OUTCOME</button>
          <button onClick={() => scrollToSection('cs-tech')} className="cs-anchor-link">06 TECH</button>
          <button onClick={() => scrollToSection('cs-next')} className="cs-anchor-link">07 NEXT</button>
        </div>
      </nav>

      {/* Main Case Study Scroll Stream */}
      <main className="case-study-scroll-container">
        {/* =================================================================
            HERO SECTION
            ================================================================= */}
        <header ref={heroRef} className="cs-hero-section">
          <div className="cs-hero-header-meta">
            <span className="cs-hero-label">{project.number} / SELECTED WORK</span>
            <span className="cs-hero-category">{project.category}</span>
          </div>

          <motion.h1
            className="cs-monumental-title"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.title}
          </motion.h1>

          <p className="cs-subtitle-lead">
            {project.subtitle || project.tagline}
          </p>

          <div className="cs-hero-tech-line">
            {project.tags.map((tag) => (
              <span key={tag} className="cs-hero-tech-tag">{tag}</span>
            ))}
          </div>

          {/* Large Project Visual with Restrained Parallax */}
          <motion.div
            className="cs-hero-image-frame"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              ref={heroImageRef}
              src={project.image}
              alt={`${project.title} Interface Visual`}
              className="cs-full-image"
            />
          </motion.div>

          {/* =================================================================
              METADATA AREA (4 Columns with Fine Hairline Dividers)
              ================================================================= */}
          <div className="cs-meta-strip">
            <div className="cs-meta-col">
              <span className="cs-meta-label">ROLE</span>
              <span className="cs-meta-value">Engineering & Architecture</span>
            </div>
            <div className="cs-meta-col">
              <span className="cs-meta-label">TECHNOLOGY</span>
              <span className="cs-meta-value">{project.tags.slice(0, 3).join(', ')}</span>
            </div>
            <div className="cs-meta-col">
              <span className="cs-meta-label">YEAR</span>
              <span className="cs-meta-value">2024</span>
            </div>
            <div className="cs-meta-col">
              <span className="cs-meta-label">TYPE</span>
              <span className="cs-meta-value">{project.category}</span>
            </div>
          </div>
        </header>

        {/* =================================================================
            SECTION 01 — OVERVIEW
            ================================================================= */}
        <section id="cs-overview" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-num">01</span>
            <div>
              <span className="kicker">SECTION 01 — OVERVIEW</span>
              <h2 className="cs-section-heading">PROJECT PURPOSE</h2>
            </div>
          </div>

          <div className="cs-quote-banner" style={{ margin: '0 0 40px 0' }}>
            <p className="cs-opening-statement">
              “{project.tagline || project.description}”
            </p>
          </div>

          <p className="cs-body-text" style={{ maxWidth: '820px', marginBottom: '24px' }}>
            {project.description}
          </p>
          {cs.idea && (
            <p className="cs-body-text" style={{ maxWidth: '820px' }}>
              {cs.idea}
            </p>
          )}
        </section>

        {/* =================================================================
            SECTION 02 — THE PROBLEM
            ================================================================= */}
        <section id="cs-problem" className="cs-section cs-problem-section">
          <div className="cs-section-header">
            <span className="cs-section-num">02</span>
            <div>
              <span className="kicker">SECTION 02 — THE PROBLEM</span>
              <h2 className="cs-section-heading">OPERATIONAL FRICTION</h2>
            </div>
          </div>

          <div className="cs-editorial-split">
            <div className="cs-split-narrative">
              <p className="cs-body-text">
                {cs.problem || project.description}
              </p>

              <div className="cs-friction-cards">
                <div className="cs-friction-card">
                  <span className="friction-badge">FRICTION 01</span>
                  <p>Disconnected communication protocols and fragmented coordination workflows across stakeholders.</p>
                </div>
                <div className="cs-friction-card">
                  <span className="friction-badge">FRICTION 02</span>
                  <p>Lack of real-time validation leading to race conditions and operational inefficiency.</p>
                </div>
                <div className="cs-friction-card">
                  <span className="friction-badge">FRICTION 03</span>
                  <p>Absence of centralized metrics preventing timely, data-backed interventions.</p>
                </div>
              </div>
            </div>

            <div className="cs-comparison-box">
              <div className="comp-col comp-before">
                <span className="comp-label">BEFORE: MANUAL FRICTION</span>
                <ul>
                  <li>Scattered tracking across disjointed channels</li>
                  <li>Delayed decision cycles and opaque statuses</li>
                  <li>High risk of errors during peak operational volume</li>
                  <li>Inflexible static interfaces with steep learning curves</li>
                </ul>
              </div>
              <div className="comp-col comp-after">
                <span className="comp-label">AFTER: UNIFIED PLATFORM</span>
                <ul>
                  <li>Single auditable architecture with automated verification</li>
                  <li>Immediate response times and proactive state handling</li>
                  <li>Predictable scaling under concurrent user interactions</li>
                  <li>Intuitive editorial UI prioritizing focused decision-making</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 03 — APPROACH & METHODOLOGY
            ================================================================= */}
        <section id="cs-approach" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-num">03</span>
            <div>
              <span className="kicker">SECTION 03 — APPROACH</span>
              <h2 className="cs-section-heading">SYSTEM DESIGN & STRATEGY</h2>
            </div>
          </div>

          <p className="cs-body-text" style={{ maxWidth: '820px', marginBottom: '40px' }}>
            {cs.approach || "Adopted a structured engineering methodology focusing on resilient data models, declarative state transitions, and responsive interactive feedback loops."}
          </p>

          <div className="cs-data-flow-box">
            <span className="flow-title">ARCHITECTURAL TOPOLOGY & CORE FEEDBACK FLOW</span>
            <div className="flow-nodes-row">
              <div className="flow-node">
                <span className="node-type">LAYER 01</span>
                <strong>Ingest & Input</strong>
                <span>Event Stream & Requests</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node node-core">
                <span className="node-type">LAYER 02</span>
                <strong>Core Engine</strong>
                <span>Validation & Heuristics</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node node-output">
                <span className="node-type">LAYER 03</span>
                <strong>State & Visual</strong>
                <span>Synchronized Feedback</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 04 — SYSTEM / PROCESS (Build & Engineering)
            ================================================================= */}
        <section id="cs-process" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-num">04</span>
            <div>
              <span className="kicker">SECTION 04 — SYSTEM / BUILD</span>
              <h2 className="cs-section-heading">HOW IT WAS CONSTRUCTED</h2>
            </div>
          </div>

          <p className="cs-body-text" style={{ maxWidth: '820px', marginBottom: '40px' }}>
            {cs.build || "Constructed with modular services, strict schema enforcement, and responsive presentation components designed for durability and speed."}
          </p>

          <div className="cs-horizontal-pipeline-wrapper">
            <div className="cs-horizontal-pipeline">
              <div className="pipeline-stage-item">
                <div className="stage-top-rail">
                  <span className="stage-step">STAGE 01</span>
                  <span className="stage-status-indicator" />
                </div>
                <h3 className="stage-title">RESEARCH & DISCOVERY</h3>
                <p className="stage-desc">Defining operational bottlenecks, boundary conditions, and latency targets.</p>
              </div>
              <div className="pipeline-stage-item">
                <div className="stage-top-rail">
                  <span className="stage-step">STAGE 02</span>
                  <span className="stage-status-indicator" />
                </div>
                <h3 className="stage-title">SCHEMA & ENGINE</h3>
                <p className="stage-desc">Modeling data entities, transaction state machines, and API boundaries.</p>
              </div>
              <div className="pipeline-stage-item">
                <div className="stage-top-rail">
                  <span className="stage-step">STAGE 03</span>
                  <span className="stage-status-indicator" />
                </div>
                <h3 className="stage-title">UI & INTERACTION</h3>
                <p className="stage-desc">Refining ergonomics, typography hierarchy, and micro-interactions.</p>
              </div>
              <div className="pipeline-stage-item">
                <div className="stage-top-rail">
                  <span className="stage-step">STAGE 04</span>
                  <span className="stage-status-indicator" />
                </div>
                <h3 className="stage-title">BENCHMARK & VERIFY</h3>
                <p className="stage-desc">Validating reliability, edge cases, and cross-platform consistency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 05 — OUTCOME & ENGINEERING LESSONS
            ================================================================= */}
        <section id="cs-outcome" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-num">05</span>
            <div>
              <span className="kicker">SECTION 05 — OUTCOME & IMPACT</span>
              <h2 className="cs-section-heading">VERIFIED RESULTS</h2>
            </div>
          </div>

          <p className="cs-body-text" style={{ maxWidth: '820px', marginBottom: '40px' }}>
            {cs.result || "Delivered measured efficiency gains, validated through load benchmarks, user feedback cycles, and operational stress runs."}
          </p>

          {cs.learned && (
            <div className="cs-lessons-grid">
              <div className="cs-lesson-card">
                <span className="lesson-num">ENGINEERING TAKEAWAY</span>
                <h3 className="lesson-topic">Core Principle & Product Insight</h3>
                <p className="lesson-takeaway">{cs.learned}</p>
              </div>
              <div className="cs-lesson-card">
                <span className="lesson-num">OPERATIONAL RESILIENCE</span>
                <h3 className="lesson-topic">Production-Grade Design</h3>
                <p className="lesson-takeaway">
                  Architectural complexity must always serve human clarity. Designing clear fallback states and deterministic data lifecycles prevents runtime regressions.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* =================================================================
            SECTION 06 — TECHNOLOGY (Built With Typographic Stack)
            ================================================================= */}
        <section id="cs-tech" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-num">06</span>
            <div>
              <span className="kicker">SECTION 06 — TECHNOLOGY</span>
              <h2 className="cs-section-heading">BUILT WITH</h2>
            </div>
          </div>

          <div className="cs-tech-typographic-list">
            {project.tags.map((tag) => (
              <div
                key={tag}
                className="cs-tech-typographic-item"
                onMouseEnter={() => onCursorChange?.('link')}
                onMouseLeave={() => onCursorChange?.('default')}
              >
                <span className="cs-tech-typo-name">{tag}</span>
                <span className="cs-tech-typo-role">CORE COMPONENT</span>
                <p className="cs-tech-typo-desc">Production-validated stack delivering modular performance and reliable interface execution.</p>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            SECTION 07 — NEXT PROJECT TEASER
            ================================================================= */}
        <section id="cs-next" className="cs-next-project-section">
          <div
            className="cs-next-project-card"
            onClick={handleNextProject}
            onMouseEnter={() => onCursorChange?.('view')}
            onMouseLeave={() => onCursorChange?.('default')}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to next project: ${nextProject.title}`}
          >
            <div className="cs-next-kicker">
              <span>NEXT PROJECT</span>
              <span>—</span>
              <span>{nextProject.number} / 05</span>
            </div>

            <div className="cs-next-title-row">
              <span className="cs-next-title">{nextProject.title}</span>
              <div className="cs-next-arrow">
                <ArrowRight size={22} />
              </div>
            </div>

            <p className="cs-next-desc">
              {nextProject.subtitle || nextProject.tagline} — {nextProject.description}
            </p>
          </div>
        </section>

        {/* Footer Return Bar */}
        <footer className="cs-footer-bar">
          <Magnetic strength={0.25}>
            <button
              className="btn-case-study cs-return-btn"
              onClick={handleReturn}
              onMouseEnter={() => onCursorChange?.('link')}
              onMouseLeave={() => onCursorChange?.('default')}
            >
              <ArrowLeft size={16} />
              <span>RETURN TO SELECTED WORK</span>
            </button>
          </Magnetic>
        </footer>
      </main>
    </div>
  );
}
