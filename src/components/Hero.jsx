import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';
import HolographicPortrait from './HolographicPortrait';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ profile, onScrollExplore, onCursorChange, hasEntered = true }) {
  const heroRootRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const hairlineRef = useRef(null);
  const roleRef = useRef(null);
  const statementRef = useRef(null);
  const taglineControlRef = useRef(null);
  const telemetryRef = useRef(null);
  const academicRef = useRef(null);
  const portraitStageRef = useRef(null);
  const portraitFloatRef = useRef(null);
  const bottomBarRef = useRef(null);
  const ambientRef = useRef(null);
  const veilRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isProjected, setIsProjected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [phase, setPhase] = useState('dormant');
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const dispatchProjectorState = useCallback((isProj, p) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projector-state', { detail: { isProjected: isProj, phase: p } }));
    }
  }, []);

  const handleActivate = useCallback(() => {
    clearTimers();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsProjected(true);
      setPhase('active');
      dispatchProjectorState(true, 'active');
      return;
    }

    setIsProjected(true);
    setPhase('waking');
    dispatchProjectorState(true, 'waking');

    const t1 = setTimeout(() => {
      setPhase('energy-build');
      dispatchProjectorState(true, 'energy-build');
    }, 250);
    const t2 = setTimeout(() => {
      setPhase('emerging');
      dispatchProjectorState(true, 'emerging');
    }, 550);
    const t3 = setTimeout(() => {
      setPhase('projected');
      dispatchProjectorState(true, 'projected');
    }, 1150);
    const t4 = setTimeout(() => {
      setPhase('settling');
      dispatchProjectorState(true, 'settling');
    }, 1700);
    const t5 = setTimeout(() => {
      setPhase('active');
      dispatchProjectorState(true, 'active');
    }, 2200);

    timersRef.current = [t1, t2, t3, t4, t5];
  }, [clearTimers, dispatchProjectorState]);

  const handleDeactivate = useCallback(() => {
    clearTimers();
    setIsProjected(false);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPhase('dormant');
      dispatchProjectorState(false, 'dormant');
      return;
    }

    setPhase('collapsing');
    dispatchProjectorState(false, 'collapsing');
    const t = setTimeout(() => {
      setPhase('dormant');
      dispatchProjectorState(false, 'dormant');
    }, 800);
    timersRef.current = [t];
  }, [clearTimers, dispatchProjectorState]);

  const handleToggle = useCallback(() => {
    if (!isProjected) {
      handleActivate();
    } else {
      handleDeactivate();
    }
  }, [isProjected, handleActivate, handleDeactivate]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  useEffect(() => {
    const checkEnvironment = () => {
      setIsMobile(window.innerWidth < 800);
    };
    checkEnvironment();
    window.addEventListener('resize', checkEnvironment);
    return () => window.removeEventListener('resize', checkEnvironment);
  }, []);

  // ==========================================================================
  // 1. HERO ENTRANCE CHOREOGRAPHY (8 MEASURED BEATS - MINH PHAM & BENJAMIN SIMON)
  // ==========================================================================
  useEffect(() => {
    const root = heroRootRef.current;
    if (!root) return;

    if (!hasEntered) {
      gsap.set(root, { autoAlpha: 0 });
      return;
    }

    gsap.set(root, { autoAlpha: 1 });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (veilRef.current) gsap.set(veilRef.current, { autoAlpha: 0 });
      if (contentRef.current) gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      if (portraitFloatRef.current) {
        gsap.set(portraitFloatRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1
        });
      }
      if (ambientRef.current) gsap.set(ambientRef.current, { autoAlpha: 1, scale: 1 });
      if (bottomBarRef.current) gsap.set(bottomBarRef.current, { autoAlpha: 1, y: 0 });
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.hero-title-word');
        gsap.set(words, { yPercent: 0, autoAlpha: 1, letterSpacing: '-0.035em' });
      }
      if (hairlineRef.current) gsap.set(hairlineRef.current, { scaleX: 1, autoAlpha: 1 });
      if (roleRef.current) gsap.set(roleRef.current, { y: 0, autoAlpha: 1 });
      if (statementRef.current) gsap.set(statementRef.current, { y: 0, autoAlpha: 1 });
      if (taglineControlRef.current) gsap.set(taglineControlRef.current, { y: 0, autoAlpha: 1 });
      if (telemetryRef.current) gsap.set(telemetryRef.current, { y: 0, autoAlpha: 1 });
      if (academicRef.current) gsap.set(academicRef.current, { y: 0, autoAlpha: 1 });
      return;
    }

    // One-time opening veil dissolution: permanently hide once faded out so it never covers sections
    if (veilRef.current) {
      gsap.to(veilRef.current, {
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          if (veilRef.current) {
            veilRef.current.style.display = 'none';
          }
        }
      });
    }

    const ctx = gsap.context(() => {
      const entryTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Ambient key illumination blooms (0.05s - 0.85s)
      if (ambientRef.current) {
        entryTl.fromTo(ambientRef.current,
          { scale: 0.90, autoAlpha: 0 },
          { scale: 1.0, autoAlpha: 1, duration: 0.80, ease: 'power2.out' },
          0.05
        );
      }

      // 2. Navigation / Identity / Telemetry reveal (0.18s – 0.55s)
      if (telemetryRef.current) {
        entryTl.fromTo(telemetryRef.current,
          { y: -6, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
          0.18
        );
      }

      // 3. Main Headline: ESHWAR M typography resolves through line mask (0.35s – 1.10s)
      const titleWords = titleRef.current?.querySelectorAll('.hero-title-word');
      if (titleWords && titleWords.length) {
        entryTl.fromTo(titleWords,
          {
            yPercent: 105,
            letterSpacing: '0.01em',
            autoAlpha: 0
          },
          {
            yPercent: 0,
            letterSpacing: '-0.035em',
            autoAlpha: 1,
            stagger: 0.07,
            duration: 0.75,
            ease: 'power4.out'
          },
          0.35
        );
      }

      // Delicate hairline accent expands directly after headline (0.65s - 1.15s)
      if (hairlineRef.current) {
        entryTl.fromTo(hairlineRef.current,
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: 0.55, ease: 'power2.out' },
          0.65
        );
      }

      // 4. Supporting Tagline & Academic Context (0.80s – 1.35s)
      if (roleRef.current) {
        entryTl.fromTo(roleRef.current,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.50, ease: 'power3.out' },
          0.80
        );
      }
      if (statementRef.current) {
        entryTl.fromTo(statementRef.current,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.50, ease: 'power3.out' },
          0.88
        );
      }
      if (academicRef.current) {
        entryTl.fromTo(academicRef.current,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.50, ease: 'power3.out' },
          0.96
        );
      }

      // 5. Portrait / Reactor installation enters smoothly (1.10s – 1.75s)
      if (portraitFloatRef.current) {
        entryTl.fromTo(portraitFloatRef.current,
          {
            scale: 0.98,
            y: 18,
            autoAlpha: 0
          },
          {
            scale: 1.0,
            y: 0,
            autoAlpha: 1,
            duration: 0.70,
            ease: 'power3.out'
          },
          1.10
        );
      }

      // 6. View Portrait Control physical entrance (1.35s – 1.85s)
      if (taglineControlRef.current) {
        entryTl.fromTo(taglineControlRef.current,
          { scale: 0.97, y: 8, autoAlpha: 0 },
          { scale: 1.0, y: 0, autoAlpha: 1, duration: 0.50, ease: 'power3.out' },
          1.35
        );
      }

      // 7. Bottom Bar & Scroll Indicator stabilize (1.55s – 2.05s)
      if (bottomBarRef.current) {
        entryTl.fromTo(bottomBarRef.current,
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.50, ease: 'power2.out' },
          1.55
        );
      }

      // Replayable Hero ScrollTrigger: Reset when scrolling past Hero, replay on returning
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom 15%',
        onLeave: () => {
          entryTl.pause(0);
        },
        onEnterBack: () => {
          entryTl.restart();
        }
      });
    }, root);

    return () => ctx.revert();
  }, [hasEntered]);

  // ==========================================================================
  // 2. DESKTOP POINTER PARALLAX & OPTICAL DEPTH (ACTIVE THEORY & BENJAMIN SIMON)
  // ==========================================================================
  useEffect(() => {
    const root = heroRootRef.current;
    if (!root) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const portrait = portraitFloatRef.current;
    const ambient = ambientRef.current;
    if (!portrait || !ambient) return;

    // Smooth physics quickTo setters
    const setPortraitX = gsap.quickTo(portrait, 'x', { duration: 0.65, ease: 'power2.out' });
    const setPortraitY = gsap.quickTo(portrait, 'y', { duration: 0.65, ease: 'power2.out' });
    const setAmbientX = gsap.quickTo(ambient, 'x', { duration: 0.85, ease: 'power2.out' });
    const setAmbientY = gsap.quickTo(ambient, 'y', { duration: 0.85, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const rect = root.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      // Optical separation: subject shifts slightly opposite to pointer, light follows pointer
      setPortraitX(-normX * 10);
      setPortraitY(-normY * 8);
      setAmbientX(normX * 16);
      setAmbientY(normY * 12);
    };

    const handleMouseLeave = () => {
      setPortraitX(0);
      setPortraitY(0);
      setAmbientX(0);
      setAmbientY(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    root.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      root.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ==========================================================================
  // 3. CONTINUOUS HERO EXIT SCRUBBING & HERO → ABOUT CAMERA HANDOFF
  // ==========================================================================
  useEffect(() => {
    const root = heroRootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mobile = window.innerWidth < 800;

    const ctx = gsap.context(() => {
      // Atmospheric mode shift: hero in top area, about as user scrolls out
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

      // Bottom bar retracts and fades completely within the first 110px of scroll
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

      // Continuous Hero exit timeline scrubbing over 100svh
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      // Portrait recedes gently with subtle camera depth
      if (portraitStageRef.current) {
        exitTl.to(portraitStageRef.current, {
          scale: mobile ? 0.98 : 0.94,
          y: mobile ? -8 : -26,
          x: mobile ? 4 : 14,
          autoAlpha: 0.12,
          ease: 'power1.in'
        }, 0);
      }

      // Hero Typography moves upward & gently recedes
      if (contentRef.current) {
        exitTl.to(contentRef.current, {
          y: mobile ? -20 : -52,
          scale: mobile ? 0.99 : 0.97,
          autoAlpha: 0.12,
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
          autoAlpha: 0.40,
          ease: 'none'
        }, 0);
      }

      if (ambientRef.current) {
        exitTl.to(ambientRef.current, {
          scale: 1.05,
          y: -14,
          autoAlpha: 0.15,
          ease: 'none'
        }, 0);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRootRef} className="hero-container" aria-label="Hero Opening Sequence">
      {/* 0.0–0.45s Opening Black Screen Veil */}
      <div
        ref={veilRef}
        className="cinematic-blackout-veil"
        aria-hidden="true"
      />

      {/* Atmospheric Soft Key Illumination Behind Subject */}
      <div
        ref={ambientRef}
        className="hero-subject-ambient-glow"
        aria-hidden="true"
      />

      {/* LEFT: Physical Monolithic Typography & Editorial Narrative */}
      <div
        ref={contentRef}
        className="hero-content"
      >
        {/* Step 0: Architectural Telemetry Framing (Benjamin Simon inspired) */}
        <div
          ref={telemetryRef}
          className="hero-system-telemetry"
        >
          <span className="system-indicator-dot" />
          <span className="system-tag">ESHWAR M // ARCHIVE</span>
          <span className="system-sep">•</span>
          <span className="system-tag">MYSURU, KARNATAKA</span>
        </div>

        {/* Step 1: Academic context metadata */}
        <div
          ref={academicRef}
          className="hero-academic-line"
        >
          <span className="academic-degree">B.E. Computer Science & Engineering Student</span>
          <span className="academic-inst">Vidyavardhaka College of Engineering (VVCE), Mysuru</span>
          <span className="academic-year">Graduating 2028</span>
        </div>

        {/* Step 2: ESHWAR M monumental title resolves through line-masks (Minh Pham inspired) */}
        <div className="hero-masthead-mask-wrapper">
          <h1
            ref={titleRef}
            className="hero-title"
            aria-label={profile.name || "Eshwar M"}
          >
            <span className="hero-title-mask">
              <span className="hero-title-word word-1">ESHWAR</span>
            </span>
            <span className="hero-title-space"> </span>
            <span className="hero-title-mask">
              <span className="hero-title-word word-2">M</span>
            </span>
          </h1>

          {/* Delicate hairline accent */}
          <div
            ref={hairlineRef}
            className="hero-hairline-reveal"
          />
        </div>

        {/* Step 3: Supporting Role & Primary Positioning Statement */}
        <div
          ref={roleRef}
          className="hero-role"
        >
          <span className="role-term">AI</span>
          <span className="role-divider">/</span>
          <span className="role-term">PRODUCT</span>
          <span className="role-divider">/</span>
          <span className="role-term">DATA</span>
          <span className="role-divider">/</span>
          <span className="role-term">INNOVATION</span>
        </div>

        <p
          ref={statementRef}
          className="hero-supporting-line"
        >
          {profile.heroStatement || "Building at the intersection of AI, Product, Data & Innovation."}
        </p>

        {/* Step 4: Holographic Projection Discovery Control — Placed directly below tagline */}
        <div ref={taglineControlRef} className="hero-tagline-control-dock">
          <button
            type="button"
            className={`projector-action-btn ${isProjected ? 'btn--projected' : ''}`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => {
              setIsHovered(true);
              onCursorChange?.('hover');
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              onCursorChange?.('default');
            }}
            aria-label={isProjected ? 'Close projected portal' : 'View portal'}
            aria-pressed={isProjected}
            tabIndex={0}
          >
            <span className="btn-action-label">
              {isProjected ? 'CLOSE PORTAL' : 'VIEW PORTAL'}
            </span>
            <span className="btn-action-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Hero Portrait Emerging from Darkness & Receding with Spatial Depth */}
      <div
        ref={portraitStageRef}
        className="hero-portrait-stage"
      >
        <div
          ref={portraitFloatRef}
          className="hero-portrait-float"
        >
          <HolographicPortrait
            src="/portrait_tb.png"
            fallbackSrc="/portrait.png"
            alt={`${profile.name || 'Eshwar M'} — Editorial Portrait`}
            hasEntered={hasEntered}
            isMobile={isMobile}
            onCursorChange={onCursorChange}
            isProjected={isProjected}
            phase={phase}
            isHovered={isHovered}
          />
        </div>
      </div>

      {/* Step 5: Bottom Bar & Explore Invitation */}
      <div
        ref={bottomBarRef}
        className="hero-bottom-bar"
      >
        <div
          className="hero-bottom-bar-inner"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Magnetic strength={0.25}>
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
        </div>
      </div>
    </section>
  );
}
