import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';
import { triggerCinematicCut } from './CinematicTransitionVeil';

gsap.registerPlugin(ScrollTrigger);

/**
 * Atmospheric background color tones for each project scene
 */
const PROJECT_TONES = [
  'radial-gradient(circle at 65% 50%, rgba(24, 34, 52, 0.45) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 01 SPECra: Deep Navy
  'radial-gradient(circle at 35% 50%, rgba(35, 35, 45, 0.40) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 02 CapacityX: Cool Charcoal
  'radial-gradient(circle at 50% 60%, rgba(42, 32, 56, 0.40) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 03 Academic Planner: Obsidian/Violet
  'radial-gradient(circle at 60% 40%, rgba(22, 42, 38, 0.35) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 04 ExpenseFlow: Slate/Emerald
  'radial-gradient(circle at 50% 50%, rgba(18, 18, 22, 0.40) 0%, rgba(0, 0, 0, 0.98) 75%)',  // 05 Movie Booking: Pure Deep Black
];

/**
 * Interactive Desktop Project Visual Frame
 * Emulates physical camera lens + screen depth + cursor-guided atmospheric specular light.
 * Driven entirely via GSAP quickTo for 60/120fps with zero React state re-renders.
 */
function InteractiveProjectVisual({
  project,
  idx,
  titleEl,
  onSelect,
  onCursorChange,
  setFrameRef,
  setImageRef
}) {
  const frameRef = useRef(null);
  const lensInnerRef = useRef(null);
  const imageRef = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    if (frameRef.current && setFrameRef) {
      setFrameRef(frameRef.current);
    }
    if (imageRef.current && setImageRef) {
      setImageRef(imageRef.current);
    }
  }, [setFrameRef, setImageRef]);

  useEffect(() => {
    const frame = frameRef.current;
    const lens = lensInnerRef.current;
    const img = imageRef.current;
    const glare = glareRef.current;
    if (!frame || !lens || !img) return;

    // Check fine-pointer capability and reduced-motion preference
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    // High performance GSAP quickTo interpolators
    const qLensX = gsap.quickTo(lens, 'x', { duration: 0.45, ease: 'power2.out' });
    const qLensY = gsap.quickTo(lens, 'y', { duration: 0.45, ease: 'power2.out' });
    const qLensRotX = gsap.quickTo(lens, 'rotationX', { duration: 0.55, ease: 'power2.out' });
    const qLensRotY = gsap.quickTo(lens, 'rotationY', { duration: 0.55, ease: 'power2.out' });
    const qImgX = gsap.quickTo(img, 'x', { duration: 0.5, ease: 'power2.out' });
    const qImgY = gsap.quickTo(img, 'y', { duration: 0.5, ease: 'power2.out' });
    const qImgScale = gsap.quickTo(img, 'scale', { duration: 0.45, ease: 'power2.out' });

    let qTitleX = null;
    let qTitleY = null;
    if (titleEl) {
      qTitleX = gsap.quickTo(titleEl, 'x', { duration: 0.6, ease: 'power2.out' });
      qTitleY = gsap.quickTo(titleEl, 'y', { duration: 0.6, ease: 'power2.out' });
    }

    const onMouseMove = (e) => {
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Coordinate from -1 (left/top) to +1 (right/bottom)
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Subtle camera lens movement: 3–6px
      const lensX = normX * 5.0;
      const lensY = normY * 5.0;

      // Subtle rotation: ~0.5–0.8 degree
      const rotY = normX * 0.7;
      const rotX = -normY * 0.7;

      // Layered image depth (1.02x relative parallax)
      const imgX = normX * 2.2;
      const imgY = normY * 2.2;

      qLensX(lensX);
      qLensY(lensY);
      qLensRotX(rotX);
      qLensRotY(rotY);
      qImgX(imgX);
      qImgY(imgY);

      // Title spatial response
      if (qTitleX && qTitleY) {
        qTitleX(normX * 2.0);
        qTitleY(normY * 1.5);
      }

      // Atmospheric specular highlight following cursor
      if (glare) {
        const pctX = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
        const pctY = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
        glare.style.background = `radial-gradient(circle 380px at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 42%, transparent 75%)`;
        glare.style.opacity = '1';
      }
    };

    const onMouseEnter = () => {
      qImgScale(1.025);
      onCursorChange?.('project');
    };

    const onMouseLeave = () => {
      qLensX(0);
      qLensY(0);
      qLensRotX(0);
      qLensRotY(0);
      qImgX(0);
      qImgY(0);
      qImgScale(1.0);
      if (qTitleX && qTitleY) {
        qTitleX(0);
        qTitleY(0);
      }
      if (glare) {
        glare.style.opacity = '0';
      }
      onCursorChange?.('default');
    };

    frame.addEventListener('mousemove', onMouseMove);
    frame.addEventListener('mouseenter', onMouseEnter);
    frame.addEventListener('mouseleave', onMouseLeave);

    return () => {
      frame.removeEventListener('mousemove', onMouseMove);
      frame.removeEventListener('mouseenter', onMouseEnter);
      frame.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [titleEl, onCursorChange]);

  return (
    <div
      ref={frameRef}
      className="slide-visual-frame"
      onClick={() => onSelect?.(project, idx)}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title} presentation`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(project, idx);
        }
      }}
    >
      <div ref={lensInnerRef} className="slide-visual-lens-inner">
        <img
          ref={imageRef}
          src={project.image}
          alt={`${project.title} Visual Showcase`}
          className="slide-visual-img"
          loading={idx < 2 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div ref={glareRef} className="slide-visual-glare" />
        <div className="slide-visual-vignette" />
        <div className="slide-visual-film-edge" />
      </div>
    </div>
  );
}

/**
 * Desktop Pinned Cinematic Project Reel
 */
function DesktopProjectReel({
  projects,
  onOpenCaseStudy,
  onCursorChange,
  activeIndex,
  setActiveIndex
}) {
  const reelRootRef = useRef(null);
  const stageRef = useRef(null);
  const slidesRef = useRef([]);
  const numbersRef = useRef([]);
  const titlesRef = useRef([]);
  const visualsRef = useRef([]);
  const imagesRef = useRef([]);
  const metasRef = useRef([]);
  const bgsRef = useRef([]);

  useEffect(() => {
    const root = reelRootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const ctx = gsap.context(() => {
      // Set initial states: Slide 0 is established at start; Slides 1..4 are hidden
      projects.forEach((_, i) => {
        const slide = slidesRef.current[i];
        const num = numbersRef.current[i];
        const title = titlesRef.current[i];
        const visual = visualsRef.current[i];
        const meta = metasRef.current[i];
        const bg = bgsRef.current[i];
        const img = imagesRef.current[i];

        if (i === 0) {
          if (slide) gsap.set(slide, { autoAlpha: 1, y: 0, scale: 1, zIndex: 10 });
          if (num) gsap.set(num, { autoAlpha: 1, y: 0 });
          if (title) gsap.set(title, { autoAlpha: 1, y: 0, scale: 1 });
          if (visual) gsap.set(visual, { autoAlpha: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)' });
          if (img) gsap.set(img, { scale: 1.0 });
          if (meta) gsap.set(meta, { autoAlpha: 1, y: 0 });
          if (bg) gsap.set(bg, { opacity: 0.85 });
        } else {
          if (slide) gsap.set(slide, { autoAlpha: 0, y: 40, scale: 0.96, zIndex: 1 });
          if (num) gsap.set(num, { autoAlpha: 0, y: 15 });
          if (title) gsap.set(title, { autoAlpha: 0, y: 30, scale: 0.95 });
          if (visual) gsap.set(visual, {
            autoAlpha: 0,
            x: i % 2 === 0 ? 55 : -55,
            clipPath: 'inset(14% 10% 14% 10%)'
          });
          if (img) gsap.set(img, { scale: 1.08 });
          if (meta) gsap.set(meta, { autoAlpha: 0, y: 18 });
          if (bg) gsap.set(bg, { opacity: 0 });
        }
      });

      // Master scrubbing timeline pinned over +=320% (balanced, no scroll fatigue)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=320%',
          pin: stage,
          scrub: 0.85,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(projects.length - 1, Math.floor(p * projects.length));
            setActiveIndex(idx);
            if (typeof window !== 'undefined') {
              const modes = ['p1', 'p2', 'p3', 'p4', 'p5'];
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: modes[idx] || 'default' }));
            }
          }
        }
      });

      const dur = 1.0;
      for (let i = 0; i < projects.length; i++) {
        const currentSlide = slidesRef.current[i];
        const currentTitle = titlesRef.current[i];
        const currentVisual = visualsRef.current[i];
        const currentImg = imagesRef.current[i];
        const currentMeta = metasRef.current[i];
        const currentBg = bgsRef.current[i];

        const t0 = i * dur;
        const holdEnd = t0 + 0.60 * dur;

        // Subtle differential layer parallax during hold (Stillness & depth)
        if (currentTitle) {
          tl.to(currentTitle, { y: -18, ease: 'none', duration: 0.60 * dur }, t0);
        }
        if (currentVisual) {
          tl.to(currentVisual, { y: -24, ease: 'none', duration: 0.60 * dur }, t0);
        }
        if (currentImg) {
          tl.to(currentImg, { scale: 1.02, ease: 'none', duration: 0.60 * dur }, t0);
        }
        if (currentBg) {
          tl.to(currentBg, { y: -10, ease: 'none', duration: 0.60 * dur }, t0);
        }

        // Seamless Hand-off to Next Slide (OVERLAPPING: Zero Dead Black Gap)
        if (i < projects.length - 1) {
          const nextSlide = slidesRef.current[i + 1];
          const nextNum = numbersRef.current[i + 1];
          const nextTitle = titlesRef.current[i + 1];
          const nextVisual = visualsRef.current[i + 1];
          const nextImg = imagesRef.current[i + 1];
          const nextMeta = metasRef.current[i + 1];
          const nextBg = bgsRef.current[i + 1];

          const transStart = holdEnd;
          const transDur = 0.40 * dur;

          // 1. Current Slide recedes and translates away into depth
          if (currentMeta) {
            tl.to(currentMeta, { autoAlpha: 0, y: -12, ease: 'power1.in', duration: 0.22 * dur }, transStart);
          }
          if (currentTitle) {
            tl.to(currentTitle, { autoAlpha: 0, y: -35, ease: 'power2.in', duration: 0.28 * dur }, transStart);
          }
          if (currentVisual) {
            tl.to(currentVisual, {
              autoAlpha: 0,
              x: i % 2 === 0 ? -45 : 45,
              scale: 0.94,
              ease: 'power2.in',
              duration: 0.28 * dur
            }, transStart);
          }
          if (currentSlide) {
            tl.to(currentSlide, { autoAlpha: 0, y: -30, scale: 0.95, ease: 'power2.inOut', duration: transDur }, transStart);
            tl.set(currentSlide, { zIndex: 1 }, transStart + transDur);
          }
          if (currentBg) {
            tl.to(currentBg, { opacity: 0, duration: 0.28 * dur }, transStart + 0.10 * dur);
          }

          // 2. Next Slide is ALREADY entering simultaneously (OVERLAPPING HAND-OFF)
          if (nextSlide) {
            tl.set(nextSlide, { zIndex: 10 }, transStart + 0.08 * dur);
            tl.fromTo(nextSlide,
              { autoAlpha: 0, y: 35, scale: 0.96 },
              { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out', duration: transDur },
              transStart + 0.08 * dur
            );
          }
          if (nextBg) {
            tl.fromTo(nextBg,
              { opacity: 0 },
              { opacity: 0.85, ease: 'power1.out', duration: 0.28 * dur },
              transStart + 0.08 * dur
            );
          }
          if (nextNum) {
            tl.fromTo(nextNum,
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.22 * dur },
              transStart + 0.10 * dur
            );
          }
          if (nextTitle) {
            tl.fromTo(nextTitle,
              { autoAlpha: 0, y: 28, scale: 0.96 },
              { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.28 * dur },
              transStart + 0.14 * dur
            );
          }
          if (nextVisual) {
            tl.fromTo(nextVisual,
              {
                autoAlpha: 0,
                x: (i + 1) % 2 === 0 ? 50 : -50,
                clipPath: 'inset(14% 10% 14% 10%)'
              },
              {
                autoAlpha: 1,
                x: 0,
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: 'power2.out',
                duration: 0.32 * dur
              },
              transStart + 0.16 * dur
            );
          }
          if (nextImg) {
            tl.fromTo(nextImg,
              { scale: 1.08 },
              { scale: 1.0, ease: 'none', duration: 0.32 * dur },
              transStart + 0.16 * dur
            );
          }
          if (nextMeta) {
            tl.fromTo(nextMeta,
              { autoAlpha: 0, y: 15 },
              { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.25 * dur },
              transStart + 0.22 * dur
            );
          }
        }
      }
    }, root);

    return () => ctx.revert();
  }, [projects, setActiveIndex]);

  // Composition class mapping for controlled asymmetry
  const getCompositionClass = (index) => {
    switch (index) {
      case 0: return 'comp-asymmetric-right';  // 01 SPECra: visual right
      case 1: return 'comp-offset-diagonal';   // 02 ExpenseFlow AI: offset diagonal
      case 2: return 'comp-centered-lower';    // 03 Academic Planner: centered lower
      case 3: return 'comp-asymmetric-left';   // 04 CapacityX: visual left
      default: return 'comp-asymmetric-right';
    }
  };

  const activeProject = projects[activeIndex] || projects[0];

  const handleSelectProject = (project, idx) => {
    if (typeof idx === 'number' && visualsRef.current[idx]) {
      gsap.to(visualsRef.current[idx], {
        scale: 1.03,
        duration: 0.22,
        ease: 'power2.out'
      });
    }
    triggerCinematicCut(project.title);
    if (onOpenCaseStudy) {
      onOpenCaseStudy(project);
    }
  };

  return (
    <div ref={reelRootRef} className="project-reel-container" aria-label="Selected Work Pinned Reel">
      <div ref={stageRef} className="reel-pinned-stage">

        {/* 1. HUD Chrome: Top Header Bar */}
        <div className="reel-hud-top">
          <div className="hud-eyebrow-box">
            <span className="hud-kicker">02 / SELECTED WORK</span>
            <span className="hud-divider">•</span>
            <span className="hud-reel-label">THE PROJECT REEL</span>
          </div>
          <div className="hud-category-box">
            <span className="hud-active-category">{activeProject.category}</span>
          </div>
        </div>

        {/* 2. HUD Chrome: Bottom Indicator Bar */}
        <div className="reel-hud-bottom">
          <div className="hud-counter-box">
            <span className="hud-digit-current">0{activeIndex + 1}</span>
            <div className="hud-progress-track">
              <div
                className="hud-progress-fill"
                style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
              />
            </div>
            <span className="hud-digit-total">0{projects.length}</span>
          </div>

          <div className="hud-scroll-cue">
            <span className="hud-scroll-text">SCROLL TO ADVANCE REEL</span>
            <span className="hud-scroll-arrow">↓</span>
          </div>
        </div>

        {/* 3. The 5 Project Scenes */}
        <div className="reel-slides-viewport">
          {projects.map((project, idx) => {
            const isCurrent = idx === activeIndex;
            const compClass = getCompositionClass(idx);
            const toneBg = PROJECT_TONES[idx] || PROJECT_TONES[0];
            const projectSlug = project.slug || project.id;

            return (
              <div
                key={project.id}
                ref={(el) => (slidesRef.current[idx] = el)}
                className={`reel-slide reel-slide-${idx + 1} ${compClass} ${isCurrent ? 'slide-active' : ''}`}
              >
                {/* Layer 1: Background Ambient Glow (0.7x speed) */}
                <div
                  ref={(el) => (bgsRef.current[idx] = el)}
                  className="slide-bg-atmosphere"
                  style={{ background: toneBg }}
                />

                {/* Layer 2, 3, 4: Content Composition */}
                <div className="slide-content-frame">

                  {/* Editorial Column */}
                  <div className="slide-editorial-col">
                    <div
                      ref={(el) => (numbersRef.current[idx] = el)}
                      className="slide-num-eyebrow"
                    >
                      <span className="slide-num-tag">SCENE 0{idx + 1}</span>
                      <span className="slide-tagline">{project.tagline || project.subtitle}</span>
                    </div>

                    {/* Monumental Title Layer (0.9x speed) */}
                    <div
                      ref={(el) => (titlesRef.current[idx] = el)}
                      className="slide-title-wrap"
                    >
                      <Link
                        to={`/projects/${projectSlug}`}
                        className="slide-title-link"
                        onClick={() => handleSelectProject(project, idx)}
                        onMouseEnter={() => onCursorChange?.('project')}
                        onMouseLeave={() => onCursorChange?.('default')}
                        aria-label={`View ${project.title} project`}
                      >
                        <h3 className="slide-project-title">
                          {project.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Progressive Metadata Layer (Beat 5) */}
                    <div
                      ref={(el) => (metasRef.current[idx] = el)}
                      className="slide-meta-wrap"
                    >
                      <p className="slide-description-text">
                        {project.description}
                      </p>

                      {/* Minimalist Tech Tags */}
                      <div className="slide-tech-stream">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="slide-tech-pill">{tag}</span>
                        ))}
                      </div>

                      {/* Direct External GitHub Link & Case Study Option */}
                      <div className="slide-actions-cluster">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="editorial-action-link"
                            onMouseEnter={() => onCursorChange?.('link')}
                            onMouseLeave={() => onCursorChange?.('default')}
                            aria-label={`Open ${project.title} on GitHub in a new tab`}
                          >
                            <span className="action-text">VIEW PROJECT</span>
                            <ArrowUpRight size={14} className="action-arrow" />
                          </a>
                        ) : null}

                        {project.hasDedicatedCaseStudy && (
                          <button
                            type="button"
                            className="editorial-secondary-link"
                            onClick={() => handleSelectProject(project, idx)}
                            onMouseEnter={() => onCursorChange?.('project')}
                            onMouseLeave={() => onCursorChange?.('default')}
                            aria-label={`Read ${project.title} Case Study`}
                          >
                            <span>CASE STUDY</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Physical Visual Lens Frame */}
                  <InteractiveProjectVisual
                    project={project}
                    idx={idx}
                    titleEl={titlesRef.current[idx]}
                    onSelect={handleSelectProject}
                    onCursorChange={onCursorChange}
                    setFrameRef={(el) => (visualsRef.current[idx] = el)}
                    setImageRef={(el) => (imagesRef.current[idx] = el)}
                  />

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

/**
 * Mobile & Reduced Motion Fallback
 * Streamlined vertical flow ensuring 100% natural, effortless touch scrolling
 */
function MobileProjectReel({ projects, onOpenCaseStudy, onCursorChange }) {
  const handleMobileSelect = (project) => {
    triggerCinematicCut(project.title);
    if (onOpenCaseStudy) {
      onOpenCaseStudy(project);
    }
  };

  return (
    <div className="mobile-project-reel" aria-label="Selected Work Mobile Reel">
      <div className="mobile-reel-opener">
        <span className="editorial-eyebrow">02 / SELECTED WORK</span>
        <h2 className="mobile-reel-headline">THE PROJECTS</h2>
        <p className="mobile-reel-sub">Five platforms architected with precision and real-world utility.</p>
      </div>

      <div className="mobile-projects-stack">
        {projects.map((project, idx) => {
          const projectSlug = project.slug || project.id;

          return (
            <motion.div
              key={project.id}
              className="mobile-project-scene"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-scene-eyebrow">
                <span className="mobile-scene-num">0{idx + 1}</span>
                <span className="mobile-scene-category">{project.category}</span>
              </div>

              <Link
                to={`/projects/${projectSlug}`}
                className="mobile-scene-title-link"
                onClick={() => handleMobileSelect(project)}
              >
                <h3 className="mobile-scene-title">
                  {project.title}
                </h3>
              </Link>

              <Link
                to={`/projects/${projectSlug}`}
                className="mobile-scene-visual"
                onClick={() => handleMobileSelect(project)}
                aria-label={`View ${project.title} visual showcase`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="mobile-img"
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <p className="mobile-scene-desc">{project.description}</p>

              <div className="mobile-tech-row">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="mobile-tech-tag">{tag}</span>
                ))}
              </div>

              <div className="mobile-scene-actions">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-action-link"
                    aria-label={`Open ${project.title} on GitHub in a new tab`}
                  >
                    <span className="action-text">VIEW PROJECT</span>
                    <ArrowUpRight size={14} className="action-arrow" />
                  </a>
                ) : null}

                {project.hasDedicatedCaseStudy && (
                  <button
                    type="button"
                    className="editorial-secondary-link"
                    onClick={() => handleMobileSelect(project)}
                    aria-label={`Read ${project.title} Case Study`}
                  >
                    <span>CASE STUDY</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Main ProjectShowcase Component
 */
export default function ProjectShowcase({ projects, onOpenCaseStudy, onCursorChange }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const checkEnvironment = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkEnvironment();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    window.addEventListener('resize', checkEnvironment);
    return () => {
      window.removeEventListener('resize', checkEnvironment);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <section id="work" className="project-showcase-section" aria-label="Selected Work Showcase">
      {isMobile || isReducedMotion ? (
        <MobileProjectReel
          projects={projects}
          onOpenCaseStudy={onOpenCaseStudy}
          onCursorChange={onCursorChange}
        />
      ) : (
        <DesktopProjectReel
          projects={projects}
          onOpenCaseStudy={onOpenCaseStudy}
          onCursorChange={onCursorChange}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}
    </section>
  );
}

