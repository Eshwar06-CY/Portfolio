import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ profile, onScrollExplore, onCursorChange }) {
  const heroRootRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const statementRef = useRef(null);
  const portraitRef = useRef(null);
  const bottomBarRef = useRef(null);
  const ambientRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const checkEnvironment = () => {
      setIsMobile(window.innerWidth < 800);
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

  // GSAP ScrollTrigger continuous camera-like depth & transition into About
  useEffect(() => {
    const root = heroRootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mobile = window.innerWidth < 800;

    const ctx = gsap.context(() => {
      // 1. Atmospheric mode shift: deep cinematic in Hero, calming in About
      ScrollTrigger.create({
        trigger: root,
        start: 'top 30%',
        end: 'bottom 40%',
        onEnter: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'hero' }));
          }
        },
        onLeave: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'about' }));
          }
        },
        onEnterBack: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'hero' }));
          }
        }
      });

      // 2. Scroll indicator retracts & fades out immediately in the first 110px
      if (bottomBarRef.current) {
        gsap.to(bottomBarRef.current, {
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=110',
            scrub: 0.3
          },
          y: 18,
          autoAlpha: 0,
          ease: 'none'
        });
      }

      // 3. Continuous Hero exit timeline scrubbing over 100svh
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      // Portrait recedes gently with subtle camera depth:
      // scale: 1.00 -> 0.955, y: -24px, x: 14px, autoAlpha: 0.16
      if (portraitRef.current) {
        exitTl.to(portraitRef.current, {
          scale: mobile ? 0.98 : 0.955,
          y: mobile ? -8 : -24,
          x: mobile ? 4 : 14,
          autoAlpha: 0.16,
          ease: 'power1.in'
        }, 0);
      }

      // Hero Typography moves upward & gently recedes
      if (contentRef.current) {
        exitTl.to(contentRef.current, {
          y: mobile ? -20 : -48,
          scale: mobile ? 0.99 : 0.975,
          autoAlpha: 0.18,
          ease: 'power1.in'
        }, 0);
      }

      if (titleRef.current) {
        exitTl.to(titleRef.current, {
          y: mobile ? -10 : -28,
          ease: 'none'
        }, 0);
      }

      if (roleRef.current) {
        exitTl.to(roleRef.current, {
          x: mobile ? -6 : -14,
          y: mobile ? -8 : -18,
          ease: 'none'
        }, 0);
      }

      if (statementRef.current) {
        exitTl.to(statementRef.current, {
          scale: 0.98,
          autoAlpha: 0.45,
          ease: 'none'
        }, 0);
      }

      if (ambientRef.current) {
        exitTl.to(ambientRef.current, {
          scale: 1.04,
          y: -14,
          autoAlpha: 0.20,
          ease: 'none'
        }, 0);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRootRef} className="hero-container" aria-label="Hero Opening Sequence">
      {/* 0–0.8s Opening Black Screen Veil */}
      <motion.div
        className="cinematic-blackout-veil"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.85, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      {/* Atmospheric Soft Light Behind Subject */}
      <div
        ref={ambientRef}
        className="hero-subject-ambient-glow"
        aria-hidden="true"
      />

      {/* LEFT: Physical Monolithic Typography & Narrative Statement */}
      <div
        ref={contentRef}
        className="hero-content"
      >
        {/* ESHWAR M monumental title */}
        <div className="hero-masthead-mask-wrapper">
          <motion.h1
            ref={titleRef}
            className="hero-title"
            aria-label={profile.name || "Eshwar M"}
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -15 }}
            animate={{ clipPath: 'inset(0 -25% 0 0)', opacity: 1, x: 0 }}
            transition={{
              duration: 0.95,
              delay: 1.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {profile.name || "Eshwar M"}
          </motion.h1>

          {/* Delicate hairline accent */}
          <motion.div
            className="hero-hairline-reveal"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.8,
              ease: [0.16, 1, 0.3, 1]
            }}
          />
        </div>

        {/* Supporting Role */}
        <motion.div
          ref={roleRef}
          className="hero-role"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="role-term">AI</span>
          <span className="role-divider">/</span>
          <span className="role-term">PRODUCT</span>
          <span className="role-divider">/</span>
          <span className="role-term">DATA</span>
          <span className="role-divider">/</span>
          <span className="role-term">INNOVATION</span>
        </motion.div>

        {/* Guiding Statement / Primary Positioning */}
        <motion.p
          ref={statementRef}
          className="hero-supporting-line"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {profile.heroStatement || "Building at the intersection of AI, Product, Data & Innovation."}
        </motion.p>

        {/* Academic Line */}
        <motion.div
          className="hero-academic-line"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="academic-degree">B.E. Computer Science & Engineering Student</span>
          <span className="academic-inst">Vidyavardhaka College of Engineering (VVCE), Mysuru</span>
          <span className="academic-year">Graduating 2028</span>
        </motion.div>
      </div>

      {/* RIGHT: Hero Portrait Emerging from Darkness & Receding with Subtle Depth */}
      <div
        ref={portraitRef}
        className="hero-portrait-stage"
      >
        {/* Subtle organic ambient float + initial entrance reveal */}
        <motion.div
          className="hero-portrait-float"
          initial={{ opacity: 0, filter: 'contrast(1.08) brightness(0.2)' }}
          animate={{
            opacity: 1,
            filter: 'contrast(1.04) brightness(0.98)',
            y: [0, -6, 0]
          }}
          transition={{
            opacity: { duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] },
            y: { repeat: Infinity, duration: 8.0, ease: 'easeInOut', delay: 3.0 }
          }}
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

      {/* BOTTOM BAR: Quiet Minimal Scroll Cue (Fades & Retracts cleanly on scroll) */}
      <div
        ref={bottomBarRef}
        className="hero-bottom-bar"
      >
        <motion.div
          className="hero-bottom-bar-inner"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
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
    </section>
  );
}
