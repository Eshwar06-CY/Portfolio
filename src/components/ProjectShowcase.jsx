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
  'radial-gradient(circle at 60% 40%, rgba(22, 42, 38, 0.35) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 02 ExpenseFlow: Slate/Emerald
  'radial-gradient(circle at 50% 60%, rgba(42, 32, 56, 0.40) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 03 Academic Planner: Obsidian/Violet
  'radial-gradient(circle at 35% 50%, rgba(35, 35, 45, 0.40) 0%, rgba(0, 0, 0, 0.98) 72%)',  // 04 CapacityX: Cool Charcoal
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

  const artifactClasses = [
    'artifact-specra',
    'artifact-expenseflow',
    'artifact-planner',
    'artifact-capacityx'
  ];
  const artifactClass = artifactClasses[idx] || 'artifact-specra';

  return (
    <div
      ref={frameRef}
      className={`slide-visual-frame ${artifactClass}`}
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
        <div className="slide-visual-artifact-glow" />
        <div className="slide-visual-trace-beam" />
        {/* Optical corner reticle micro-marks */}
        <span className="slide-visual-reticle reticle-tl" aria-hidden="true">+</span>
        <span className="slide-visual-reticle reticle-tr" aria-hidden="true">+</span>
        <span className="slide-visual-reticle reticle-bl" aria-hidden="true">+</span>
        <span className="slide-visual-reticle reticle-br" aria-hidden="true">+</span>
        <div className="slide-visual-telemetry-badge" aria-hidden="true">
          <span className="telemetry-badge-dot" />
          <span className="telemetry-badge-code">
            {idx === 0 ? 'ARCHIVE ARTIFACT 01 // PRECISION CORE' :
             idx === 1 ? 'ARCHIVE ARTIFACT 02 // DYNAMIC FLOW' :
             idx === 2 ? 'ARCHIVE ARTIFACT 03 // STRUCTURED NAVE' :
             'ARCHIVE ARTIFACT 04 // MONOLITHIC HALL'}
          </span>
        </div>
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
  const activeIdxRef = useRef(0);

  useEffect(() => {
    const root = reelRootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // 1. Initial visual states
      // Slide 0 starts in responsive entry state (ready to lock into focus on scroll)
      // Slides 1..3 start hidden with personality-calibrated entry offsets
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
          if (title) gsap.set(title, { autoAlpha: 1, y: 0, scale: 1.0 });
          if (visual) gsap.set(visual, { autoAlpha: 1, x: 0, y: 0, scale: 1.0, clipPath: 'inset(0% 0% 0% 0%)' });
          if (img) gsap.set(img, { scale: 1.0 });
          if (meta) gsap.set(meta, { autoAlpha: 1, y: 0 });
          if (bg) gsap.set(bg, { opacity: 0.85 });
        } else {
          // Personality-calibrated initial positions for slides 1..3 (zero lateral shift on mobile to avoid overflow)
          let initX = 0;
          let initY = isMobile ? 16 : 22;
          let initClip = 'inset(0% 0% 0% 0%)';
          let initScale = isMobile ? 1.02 : 1.04;

          if (!isMobile) {
            if (i === 1) {
              // ExpenseFlow AI: slightly flowing lateral glide
              initX = 28;
              initY = 16;
              initClip = 'inset(0% 0% 0% 6%)';
              initScale = 1.04;
            } else if (i === 2) {
              // AI UG Academic Planner: calm / organized steady vertical
              initX = 0;
              initY = 24;
              initClip = 'inset(4% 0% 0% 0%)';
              initScale = 1.03;
            } else if (i === 3) {
              // CAPACITYX: spatial / expansive panoramic breath
              initX = -24;
              initY = 18;
              initClip = 'inset(0% 6% 0% 0%)';
              initScale = 1.05;
            }
          }

          if (slide) gsap.set(slide, { autoAlpha: 0, y: isMobile ? 16 : 24, scale: 0.99, zIndex: 1 });
          if (num) gsap.set(num, { autoAlpha: 0, y: isMobile ? 10 : 14 });
          if (title) gsap.set(title, { autoAlpha: 0, y: isMobile ? 14 : 22, scale: 0.98 });
          if (visual) gsap.set(visual, { autoAlpha: 0, x: initX, y: initY, scale: initScale, clipPath: initClip });
          if (img) gsap.set(img, { scale: 1.06 });
          if (meta) gsap.set(meta, { autoAlpha: 0, y: isMobile ? 10 : 16 });
          if (bg) gsap.set(bg, { opacity: 0 });
        }
      });

      // Spatial Chamber Coordinates within the Gravitational Archive Megastructure
      const chamberShifts = [
        { x: -0.18, y: 0.04, z: -0.7 },  // 01 SPECra: Chamber 1 (Cold Navy / Deep Blue)
        { x: 0.20, y: -0.04, z: -1.4 },  // 02 ExpenseFlowAI: Chamber 2 (Warm Graphite / Emerald)
        { x: 0.0, y: 0.08, z: -2.0 },   // 03 AI UG Academic Planner: Chamber 3 (Structured Obsidian / Violet)
        { x: -0.22, y: -0.05, z: -2.7 }  // 04 CAPACITYX: Chamber 4 (Monolithic Tungsten / Silver)
      ];

      // 2. Master pinned timeline scrubbing over calibrated travel (+240%)
      // Eliminates excessive empty scroll distance while giving each project ample showcase time
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=240%',
          pin: stage,
          scrub: 0.65,
          anticipatePin: 1,
          onEnter: () => {
            const modes = ['p1', 'p2', 'p3', 'p4'];
            if (typeof window !== 'undefined') {
              const curIdx = activeIdxRef.current || 0;
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: modes[curIdx] || 'p1' }));
              const c = chamberShifts[curIdx] || chamberShifts[0];
              window.dispatchEvent(new CustomEvent('camera-shift', { detail: c }));
            }
          },
          onEnterBack: () => {
            const modes = ['p1', 'p2', 'p3', 'p4'];
            if (typeof window !== 'undefined') {
              const curIdx = activeIdxRef.current || 3;
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: modes[curIdx] || 'p4' }));
              const c = chamberShifts[curIdx] || chamberShifts[3];
              window.dispatchEvent(new CustomEvent('camera-shift', { detail: c }));
            }
          },
          onLeave: () => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('camera-shift', { detail: { x: 0, y: 0, z: 0 } }));
            }
          },
          onLeaveBack: () => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'work' }));
              window.dispatchEvent(new CustomEvent('camera-shift', { detail: { x: 0, y: 0.05, z: -0.5 } }));
            }
          },
          onUpdate: (self) => {
            const p = self.progress;
            // Map progress to discrete active index
            const idx = Math.min(projects.length - 1, Math.floor(p * projects.length));
            if (idx !== activeIdxRef.current) {
              activeIdxRef.current = idx;
              setActiveIndex(idx);
              if (typeof window !== 'undefined') {
                const modes = ['p1', 'p2', 'p3', 'p4'];
                window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: modes[idx] || 'default' }));
              }
            }

            // Spatial Chamber Camera Travel: Smoothly interpolate camera position across chambers
            if (typeof window !== 'undefined' && !isMobile) {
              const totalSegs = projects.length - 1;
              const clamped = Math.max(0, Math.min(1, p));
              const seg = Math.min(totalSegs - 1, Math.floor(clamped * totalSegs));
              const localT = (clamped * totalSegs) - seg;
              const easeT = localT * localT * (3 - 2 * localT);
              const cA = chamberShifts[seg];
              const cB = chamberShifts[Math.min(totalSegs, seg + 1)];
              const cx = cA.x + (cB.x - cA.x) * easeT;
              const cy = cA.y + (cB.y - cA.y) * easeT;
              const cz = cA.z + (cB.z - cA.z) * easeT;
              window.dispatchEvent(new CustomEvent('camera-shift', { detail: { x: cx, y: cy, z: cz } }));
            }
          }
        }
      });

      const dur = 1.0;

      // 3. First Project (SPECra) starts active and locked in
      const p0Visual = visualsRef.current[0];
      const p0Title = titlesRef.current[0];
      const p0Num = numbersRef.current[0];
      const p0Meta = metasRef.current[0];
      const p0Img = imagesRef.current[0];
      const p0Bg = bgsRef.current[0];

      if (p0Visual) {
        tl.to(p0Visual, {
          autoAlpha: 1,
          y: 0,
          scale: 1.00,
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.out',
          duration: 0.20 * dur
        }, 0);
      }
      if (p0Img) {
        tl.to(p0Img, { scale: 1.00, ease: 'none', duration: 0.20 * dur }, 0);
      }
      if (p0Num) {
        tl.to(p0Num, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.16 * dur }, 0);
      }
      if (p0Title) {
        tl.to(p0Title, { autoAlpha: 1, y: 0, scale: 1.00, ease: 'power2.out', duration: 0.18 * dur }, 0);
      }
      if (p0Meta) {
        tl.to(p0Meta, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.18 * dur }, 0);
      }
      if (p0Bg) {
        tl.to(p0Bg, { opacity: 0.85, ease: 'power1.out', duration: 0.20 * dur }, 0);
      }

      // 4. Sequential Project Scenes & Continuous Overlapping Transitions
      for (let i = 0; i < projects.length; i++) {
        const currentSlide = slidesRef.current[i];
        const currentNum = numbersRef.current[i];
        const currentTitle = titlesRef.current[i];
        const currentVisual = visualsRef.current[i];
        const currentImg = imagesRef.current[i];
        const currentMeta = metasRef.current[i];
        const currentBg = bgsRef.current[i];

        const t0 = i * dur;
        const sceneHoldStart = i === 0 ? 0.20 * dur : t0;
        // CapacityX (final chapter) receives extra breathing room (0.85 dur hold)
        const isLastProject = i === projects.length - 1;
        const holdDur = isLastProject ? 0.85 * dur : 0.65 * dur;
        const holdEnd = sceneHoldStart + holdDur;

        // Differential Camera Parallax during active scene hold:
        // Visual moves at a slightly different rate from typography
        // Image slowly settles from 1.02 down to 1.00
        if (currentImg) {
          tl.to(currentImg, { scale: 1.00, ease: 'none', duration: holdDur }, sceneHoldStart);
        }
        if (currentVisual) {
          // Personality-specific hold drift (kept vertical on mobile to avoid lateral overflow)
          const driftX = isMobile ? 0 : (i === 1 ? -6 : (i === 3 ? 8 : 0));
          tl.to(currentVisual, { y: isMobile ? -8 : -16, x: driftX, ease: 'none', duration: holdDur }, sceneHoldStart);
        }
        if (currentTitle) {
          tl.to(currentTitle, { y: isMobile ? -6 : -10, ease: 'none', duration: holdDur }, sceneHoldStart);
        }
        if (currentBg) {
          tl.to(currentBg, { y: isMobile ? -4 : -8, ease: 'none', duration: holdDur }, sceneHoldStart);
        }

        // Seamless Overlapping Hand-off to Next Slide (Scene 1 leaves WHILE Scene 2 arrives)
        if (!isLastProject) {
          const nextSlide = slidesRef.current[i + 1];
          const nextNum = numbersRef.current[i + 1];
          const nextTitle = titlesRef.current[i + 1];
          const nextVisual = visualsRef.current[i + 1];
          const nextImg = imagesRef.current[i + 1];
          const nextMeta = metasRef.current[i + 1];
          const nextBg = bgsRef.current[i + 1];

          const transStart = holdEnd;
          const transDur = 0.35 * dur;

          // Outgoing Scene i: shifts away smoothly
          if (currentMeta) {
            tl.to(currentMeta, { autoAlpha: 0, y: isMobile ? -8 : -14, ease: 'power1.in', duration: 0.22 * dur }, transStart);
          }
          if (currentNum) {
            tl.to(currentNum, { autoAlpha: 0, y: isMobile ? -8 : -12, ease: 'power1.in', duration: 0.20 * dur }, transStart);
          }
          if (currentTitle) {
            tl.to(currentTitle, { autoAlpha: 0, y: isMobile ? -14 : -24, scale: 0.98, ease: 'power2.in', duration: 0.26 * dur }, transStart);
          }
          if (currentVisual) {
            if (i === 0) {
              // Requirement 18: As SPECra exits, surface fragments into tiny architectural light traces and disappears into darkness
              tl.to(currentVisual, {
                filter: 'brightness(1.5) contrast(1.2)',
                duration: 0.08 * dur,
                ease: 'power1.in'
              }, transStart);
              tl.to(currentVisual, {
                autoAlpha: 0,
                x: isMobile ? 0 : -22,
                y: isMobile ? -14 : -24,
                scale: isMobile ? 0.98 : 0.965,
                clipPath: 'polygon(0% 49%, 100% 49%, 100% 51%, 0% 51%)',
                filter: 'brightness(0.0) contrast(1.0)',
                ease: 'power2.in',
                duration: 0.24 * dur
              }, transStart + 0.06 * dur);
            } else {
              const exitX = isMobile ? 0 : (i === 1 ? 20 : -16);
              tl.to(currentVisual, {
                autoAlpha: 0,
                x: exitX,
                y: isMobile ? -14 : -24,
                scale: isMobile ? 0.98 : 0.965,
                ease: 'power2.in',
                duration: 0.30 * dur
              }, transStart);
            }
          }
          if (currentImg) {
            tl.to(currentImg, { scale: 0.98, ease: 'power1.in', duration: 0.30 * dur }, transStart);
          }
          if (currentSlide) {
            tl.to(currentSlide, { autoAlpha: 0, y: isMobile ? -10 : -18, ease: 'power2.inOut', duration: transDur }, transStart);
            tl.set(currentSlide, { zIndex: 1 }, transStart + transDur);
          }
          if (currentBg) {
            tl.to(currentBg, { opacity: 0, duration: 0.26 * dur }, transStart + 0.08 * dur);
          }

          // Incoming Scene i+1: ALREADY begins entering (OVERLAPPING HAND-OFF)
          const nextIndex = i + 1;
          const arriveStart = transStart + 0.03 * dur;

          if (nextSlide) {
            tl.set(nextSlide, { zIndex: 10 }, arriveStart);
            tl.fromTo(nextSlide,
              { autoAlpha: 0, y: isMobile ? 14 : 22, scale: 0.99 },
              { autoAlpha: 1, y: 0, scale: 1.00, ease: 'power2.out', duration: transDur },
              arriveStart
            );
          }
          if (nextBg) {
            tl.fromTo(nextBg,
              { opacity: 0 },
              { opacity: 0.85, ease: 'power1.out', duration: 0.28 * dur },
              arriveStart + 0.04 * dur
            );
          }
          if (nextNum) {
            tl.fromTo(nextNum,
              { autoAlpha: 0, y: isMobile ? 8 : 14 },
              { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.24 * dur },
              arriveStart + 0.06 * dur
            );
          }
          if (nextTitle) {
            tl.fromTo(nextTitle,
              { autoAlpha: 0, y: isMobile ? 12 : 20, scale: 0.98 },
              { autoAlpha: 1, y: 0, scale: 1.00, ease: 'power2.out', duration: 0.28 * dur },
              arriveStart + 0.07 * dur
            );
          }
          if (nextVisual) {
            let nextInitX = 0;
            let nextInitY = isMobile ? 12 : 20;
            let nextInitClip = 'inset(0% 0% 0% 0%)';
            let nextInitScale = isMobile ? 1.02 : 1.04;

            if (!isMobile) {
              if (nextIndex === 1) {
                // 02 ExpenseFlow AI: slightly flowing lateral glide
                nextInitX = 28;
                nextInitY = 16;
                nextInitClip = 'inset(0% 0% 0% 6%)';
                nextInitScale = 1.04;
              } else if (nextIndex === 2) {
                // 03 Academic Planner: calm / organized steady vertical rise
                nextInitX = 0;
                nextInitY = 24;
                nextInitClip = 'inset(4% 0% 0% 0%)';
                nextInitScale = 1.03;
              } else if (nextIndex === 3) {
                // 04 CAPACITYX: spatial / expansive panoramic breath
                nextInitX = -24;
                nextInitY = 18;
                nextInitClip = 'inset(0% 6% 0% 0%)';
                nextInitScale = 1.05;
              }
            }

            tl.fromTo(nextVisual,
              {
                autoAlpha: 0,
                x: nextInitX,
                y: nextInitY,
                scale: nextInitScale,
                clipPath: nextInitClip
              },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1.00,
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: 'power2.out',
                duration: 0.32 * dur
              },
              arriveStart + 0.06 * dur
            );
          }
          if (nextImg) {
            tl.fromTo(nextImg,
              { scale: 1.06 },
              { scale: 1.02, ease: 'power2.out', duration: 0.32 * dur },
              arriveStart + 0.06 * dur
            );
          }
          if (nextMeta) {
            tl.fromTo(nextMeta,
              { autoAlpha: 0, y: isMobile ? 10 : 16 },
              { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.25 * dur },
              arriveStart + 0.12 * dur
            );
          }
        }

        // Final Project (CAPACITYX) remains 100% visible and stable through to the unpinning into Experience
        if (isLastProject) {
          // No vanishing exit: keep elements visible so there is zero black gap before Experience
          if (currentSlide) {
            tl.to(currentSlide, { autoAlpha: 1, y: 0, duration: 0.1 }, holdEnd);
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
            <span className="hud-kicker">SELECTED WORK</span>
            <span className="hud-divider">/</span>
            <span className="hud-reel-label">PROJECT_REEL</span>
            <span className="hud-divider">/</span>
            <span className="hud-chapter-counter">CHAPTER 0{activeIndex + 1} OF 0{projects.length}</span>
          </div>
          <div className="hud-telemetry-box">
            <span className="hud-telemetry-label">PROJECT</span>
            <span className="hud-telemetry-val">{activeProject.title}</span>
            <span className="hud-divider">•</span>
            <span className="hud-active-category">{activeProject.category}</span>
          </div>
        </div>

        {/* 2. HUD Chrome: Bottom Indicator Bar */}
        <div className="reel-hud-bottom">
          <div className="hud-counter-box">
            <span className="hud-chapter-label">CHAPTER</span>
            <div className="hud-digit-current-wrap">
              <span key={activeIndex} className="hud-digit-current hud-digit-rolling">
                0{activeIndex + 1}
              </span>
            </div>
            <span className="hud-digit-sep">/</span>
            <span className="hud-digit-total">0{projects.length}</span>
            <div className="hud-progress-track">
              <div
                className="hud-progress-fill"
                style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="hud-scroll-cue">
            <span className="hud-pulse-dot" />
            <span className="hud-scroll-text">SCROLL TO ADVANCE CHAPTERS</span>
            <span className="hud-scroll-arrow">↓</span>
          </div>
        </div>

        {/* 3. The 4 Project Scenes */}
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
                      <div className="slide-chapter-tag-wrap">
                        <span className="slide-chapter-prefix">CHAPTER</span>
                        <span className="slide-num-tag">0{idx + 1}</span>
                        <span className="slide-chapter-divider">/</span>
                        <span className="slide-total-tag">0{projects.length}</span>
                      </div>
                      <span className="slide-eyebrow-sep">•</span>
                      <span className="slide-technical-domain">{project.category}</span>
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
                      {/* Editorial Tagline / Quote */}
                      {project.tagline && (
                        <div className="slide-tagline-bar">
                          <span className="slide-tagline-quote">“</span>
                          <p className="slide-tagline-text">{project.tagline}</p>
                        </div>
                      )}

                      {/* Descriptive Body */}
                      <p className="slide-description-text">
                        {project.description}
                      </p>

                      {/* Technical Micro-Telemetry Strip (Curated Layer) */}
                      <div className="slide-micro-telemetry-strip">
                        <div className="micro-telemetry-item">
                          <span className="micro-telemetry-label">STAGE</span>
                          <span className="micro-telemetry-val">
                            {idx === 0 ? 'PROTOTYPE PROVEN' : idx === 1 ? 'APPLICATION' : idx === 2 ? 'ACTIVE ENGINEERING' : 'CONCEPT ARCHITECTURE'}
                          </span>
                        </div>
                        <div className="micro-telemetry-divider">•</div>
                        <div className="micro-telemetry-item">
                          <span className="micro-telemetry-label">DOMAIN</span>
                          <span className="micro-telemetry-val">
                            {idx === 0 ? 'AI HYDRAULICS' : idx === 1 ? 'FINANCIAL AI' : idx === 2 ? 'OCR SCHEDULING' : 'LOGISTICS PLATFORM'}
                          </span>
                        </div>
                      </div>

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
                        ) : (
                          <span className="editorial-concept-badge">RESEARCH / CONCEPT STAGE</span>
                        )}

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
      <div className="mobile-projects-stack">
        {projects.map((project, idx) => {
          const projectSlug = project.slug || project.id;

          return (
            <motion.div
              key={project.id}
              className="mobile-project-scene"
              initial={{ opacity: 0.9, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => {
                const modes = ['p1', 'p2', 'p3', 'p4'];
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: modes[idx] || 'p1' }));
                }
              }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-scene-eyebrow">
                <div className="mobile-chapter-pill">
                  <span className="mobile-chapter-txt">CHAPTER</span>
                  <span className="mobile-scene-num">0{idx + 1}</span>
                  <span className="mobile-chapter-sep">/</span>
                  <span className="mobile-total-num">0{projects.length}</span>
                </div>
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

              <div
                className="mobile-scene-visual"
                onClick={() => handleMobileSelect(project)}
                role="button"
                tabIndex={0}
                aria-label={`View ${project.title} visual showcase`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMobileSelect(project);
                  }
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="mobile-img"
                  loading={idx < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div className="mobile-visual-vignette" />
                <div className="mobile-visual-film-edge" />
                <span className="mobile-reticle reticle-tl">+</span>
                <span className="mobile-reticle reticle-br">+</span>
              </div>

              {project.tagline && (
                <p className="mobile-scene-tagline">“{project.tagline}”</p>
              )}

              <p className="mobile-scene-desc">{project.description}</p>

              <div className="mobile-tech-row">
                {project.tags.slice(0, 4).map((tag) => (
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
                ) : (
                  <span className="editorial-concept-badge">RESEARCH / CONCEPT STAGE</span>
                )}

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
  const introRef = useRef(null);

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

  // Selected Work Introduction: Cinematic reveal of the vast archive colonnade
  useEffect(() => {
    const introEl = introRef.current;
    if (!introEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: introEl,
        start: 'top 75%',
        end: 'bottom 20%',
        onEnter: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'work' }));
            window.dispatchEvent(new CustomEvent('camera-shift', { detail: { x: 0, y: 0.05, z: -0.5 } }));
          }
        },
        onLeaveBack: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'exploring' }));
            window.dispatchEvent(new CustomEvent('camera-shift', { detail: { x: 0, y: 0, z: 0 } }));
          }
        }
      });
    }, introEl);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="project-showcase-section" aria-label="Selected Work Showcase">
      {/* SINGLE DOMINANT EDITORIAL SECTION INTRODUCTION */}
      <div ref={introRef} className="work-editorial-intro">
        <motion.div
          className="work-intro-kicker-wrap"
          initial={{ opacity: 0.85, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="kicker">02 — SELECTED WORK</span>
        </motion.div>

        <motion.h2
          className="work-monumental-heading"
          initial={{ opacity: 0.85, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          SELECTED WORK
        </motion.h2>

        <motion.p
          className="work-supporting-text"
          initial={{ opacity: 0.85, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.75, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          The ideas in action: four projects exploring practical applications of technology.
        </motion.p>

        <motion.div
          className="work-reel-cue"
          initial={{ opacity: 0.75 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="reel-cue-text">THE PROJECT REEL</span>
          <span className="reel-cue-arrow">↓</span>
        </motion.div>
      </div>

      {(isMobile || isReducedMotion) ? (
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

