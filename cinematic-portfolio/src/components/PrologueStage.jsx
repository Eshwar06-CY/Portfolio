import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

/**
 * PrologueStage: Unifies Hero (Opening Frame) and Philosophy (About) into
 * ONE CONTINUOUS CINEMATIC SCENE in digital space.
 *
 * Scrolling moves ESHWAR M upward and away into depth while the portrait recedes.
 * From the exact same visual space, "I BUILD THINGS THAT SOLVE PROBLEMS." emerges
 * as the camera dollies forward, creating seamless filmic continuity.
 */
export default function PrologueStage({
  profile,
  aboutData,
  onScrollExplore,
  onCursorChange
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const heroContentRef = useRef(null);
  const portraitRef = useRef(null);
  const philosophyContentRef = useRef(null);
  const ambientGlowRef = useRef(null);
  const bottomBarRef = useRef(null);
  const sceneMarkerRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    checkViewport();
    window.addEventListener('resize', checkViewport);
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkViewport);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    const heroContent = heroContentRef.current;
    const portrait = portraitRef.current;
    const philosophyContent = philosophyContentRef.current;
    const ambientGlow = ambientGlowRef.current;
    const bottomBar = bottomBarRef.current;
    const sceneMarker = sceneMarkerRef.current;

    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(heroContent, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(portrait, { autoAlpha: 1, y: 0, scale: 1, filter: 'contrast(1.04) brightness(0.98)' });
      gsap.set(philosophyContent, { autoAlpha: 0, y: 55, scale: 0.96 });
      gsap.set(sceneMarker, { autoAlpha: 0, y: 20 });
      gsap.set(bottomBar, { autoAlpha: 1, y: 0 });

      // Master scrubbing timeline pinned over +=180%
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=180%',
          pin: stage,
          scrub: 0.85,
          anticipatePin: 1
        }
      });

      // 1. Hero Exit & Spatial Recession (0.0 -> 0.45)
      // Bottom explore bar fades out immediately
      tl.to(bottomBar, { autoAlpha: 0, y: 15, duration: 0.15, ease: 'power1.out' }, 0);

      // Monolithic ESHWAR M moves upward and recedes into depth beyond viewport
      tl.to(heroContent, {
        y: -110,
        scale: 0.93,
        autoAlpha: 0,
        ease: 'power2.inOut',
        duration: 0.42
      }, 0.05);

      // Portrait recedes deeper into darkness (drops scale, brightness, and drifts downward)
      tl.to(portrait, {
        y: 65,
        scale: 0.82,
        autoAlpha: 0.05,
        filter: 'contrast(1.2) brightness(0.12)',
        ease: 'power2.inOut',
        duration: 0.45
      }, 0.05);

      // Background ambient light deepens from cool glow to rich abyss
      if (ambientGlow) {
        tl.to(ambientGlow, {
          scale: 1.15,
          opacity: 0.08,
          ease: 'power1.out',
          duration: 0.45
        }, 0.05);
      }

      // 2. Transformation: Philosophy Statement Emerges From The Same Visual Space (0.40 -> 0.80)
      tl.fromTo(philosophyContent,
        { autoAlpha: 0, y: 55, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.38 },
        0.38
      );

      // 3. Stillness & Approach to Work (0.78 -> 1.0)
      // Statement holds stillness; then tiny 01 marker emerges to preview approaching Scene 01
      tl.to(sceneMarker, {
        autoAlpha: 1,
        y: 0,
        ease: 'power1.out',
        duration: 0.18
      }, 0.80);

      // Subtle exit of statement toward top as we release into Project Reel
      tl.to(philosophyContent, {
        y: -30,
        autoAlpha: 0.85,
        ease: 'power1.in',
        duration: 0.18
      }, 0.82);

    }, container);

    return () => ctx.revert();
  }, [isDesktop, isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`prologue-continuous-container ${!isDesktop || isReducedMotion ? 'prologue-fallback-flow' : ''}`}
      id="hero"
    >
      <div ref={stageRef} className="prologue-pinned-stage">

        {/* 0–0.8s Opening Black Screen Veil */}
        <motion.div
          className="cinematic-blackout-veil"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.85, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />

        {/* Atmospheric Ambient Light Behind Subject */}
        <div
          ref={ambientGlowRef}
          className="hero-subject-ambient-glow"
          aria-hidden="true"
        />

        {/* ================================================================
            SCENE A: HERO IDENTITY LAYER
            ================================================================ */}
        <div ref={heroContentRef} className="prologue-hero-layer">
          <div className="hero-content">
            {/* ESHWAR M monumental title */}
            <div className="hero-masthead-mask-wrapper">
              <motion.h1
                className="hero-title"
                aria-label={profile.name || "ESHWAR M"}
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -15 }}
                animate={{ clipPath: 'inset(0 -25% 0 0)', opacity: 1, x: 0 }}
                transition={{ duration: 0.95, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {profile.name || "ESHWAR M"}
              </motion.h1>

              <motion.div
                className="hero-hairline-reveal"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Supporting Role */}
            <motion.div
              className="hero-role"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="role-term">AI</span>
              <span className="role-divider">/</span>
              <span className="role-term">PRODUCT</span>
              <span className="role-divider">/</span>
              <span className="role-term">DATA</span>
            </motion.div>

            {/* Guiding Statement */}
            <motion.p
              className="hero-supporting-line"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.heroStatement || "BUILDING IDEAS INTO INTELLIGENT PRODUCTS."}
            </motion.p>
          </div>
        </div>

        {/* Hero Portrait Emerging from Darkness & Receding on Scroll */}
        <div ref={portraitRef} className="prologue-portrait-layer">
          <motion.div
            className="hero-portrait-stage"
            initial={{ opacity: 0, filter: 'contrast(1.08) brightness(0.2)' }}
            animate={{ opacity: 1, filter: 'contrast(1.04) brightness(0.98)' }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-portrait-mask-layer">
              <img
                src="/portrait.png"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/portrait.png";
                }}
                alt={`${profile.name} — Editorial Portrait`}
                className="hero-portrait-img"
                loading="eager"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>

        {/* ================================================================
            SCENE B: PHILOSOPHY STATEMENT (EMERGING FROM SAME VISUAL SPACE)
            ================================================================ */}
        <div
          ref={philosophyContentRef}
          className="prologue-philosophy-layer"
          id="about"
          aria-label="Philosophy Interlude"
        >
          <div className="philosophy-inner-frame">
            {/* Tiny Monospace Eyebrow */}
            <div className="about-index-rail">
              <span className="editorial-eyebrow">01 — PHILOSOPHY</span>
            </div>

            {/* Monumental Asymmetric Editorial Statement */}
            <div className="about-spatial-manifesto">
              <h2 className="asymmetric-statement">
                <span className="statement-row row-1">I BUILD THINGS</span>
                <span className="statement-row row-2">THAT SOLVE</span>
                <span className="statement-row row-3">PROBLEMS.</span>
              </h2>

              {/* Concise Narrative Across Negative Space */}
              <div className="about-offset-narrative">
                <p className="narrative-lead-text">
                  CSE student exploring AI, product thinking, data and intelligent digital experiences.
                </p>
                <div className="narrative-meta-specs">
                  <span>MYSORE, INDIA</span>
                  <span className="spec-dot">•</span>
                  <span>DATA & AI ARCHITECTURE</span>
                </div>
              </div>
            </div>

            {/* Delicate Minimal Metrics Line */}
            <div className="about-minimal-metrics-line">
              <div className="metric-quiet-item">
                <span className="metric-val">05</span>
                <span className="metric-dim">ARCHITECTED PLATFORMS</span>
              </div>
              <div className="metric-quiet-item">
                <span className="metric-val">06+</span>
                <span className="metric-dim">HACKATHON SPRINT BUILDS</span>
              </div>
              <div className="metric-quiet-item">
                <span className="metric-val">100%</span>
                <span className="metric-dim">FOCUS ON REAL PRODUCT UTILITY</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            SCENE C: APPROACHING SCENE 01 PREVIEW MARKER
            ================================================================ */}
        <div ref={sceneMarkerRef} className="prologue-approaching-marker" aria-hidden="true">
          <div className="approaching-inner">
            <span className="approaching-index">01</span>
            <span className="approaching-sep">—</span>
            <span className="approaching-title">APPROACHING SELECTED WORK</span>
            <span className="approaching-arrow">↓</span>
          </div>
        </div>

        {/* Bottom Explore Cue Bar */}
        <motion.div
          ref={bottomBarRef}
          className="hero-bottom-bar"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic strength={0.2}>
            <button
              className="scroll-indicator-button"
              onClick={onScrollExplore}
              onMouseEnter={() => onCursorChange?.('link')}
              onMouseLeave={() => onCursorChange?.('default')}
              aria-label="Scroll to explore"
            >
              <span className="scroll-arrow-box" aria-hidden="true">
                <span className="scroll-pulsing-dot" />
              </span>
              <span className="btn-text">EXPLORE</span>
              <ArrowDown size={13} className="btn-down-icon" />
            </button>
          </Magnetic>

          <div className="hero-meta-details">
            <span>{profile.location || 'KARNATAKA, INDIA'}</span>
            <span className="meta-sep">•</span>
            <span>{profile.status || 'OPEN FOR COLLABORATION'}</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
