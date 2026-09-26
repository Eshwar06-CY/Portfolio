import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import gsap from 'gsap';
import Magnetic from './Magnetic';

/**
 * PHASE 6B: Cinematic Computational Environment Intro
 * 
 * Hierarchy:
 * 1. COMPUTATIONAL ENVIRONMENT (Primary - Living 3D WebGL Core in Center Stage)
 * 2. SYSTEM STATE (Secondary - Elegant editorial state in Lower-Center)
 * 3. ENTER (Tertiary - Architectural entry trigger)
 * 
 * Strict Constraint: ABSOLUTELY ZERO personal info before ENTER.
 */
export default function CinematicIntro({ onEnter, onCursorChange }) {
  const introRootRef = useRef(null);
  const lowerCenterRef = useRef(null);
  const enterBtnRef = useRef(null);
  const telemetryRef = useRef(null);

  const [phase, setPhase] = useState('initializing'); // 'initializing' | 'ready' | 'entering' | 'done'
  const [diagnosticText, setDiagnosticText] = useState('INITIALIZING ENVIRONMENT');
  const [hexCycle, setHexCycle] = useState('0x7F3A');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 1. Lifecycle: Platform duration, WebGL dispatch, and phased neural status schedule
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hasReducedMotion = motionQuery.matches;
    setIsReducedMotion(hasReducedMotion);

    // Notify WebGL scene of intro mode
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'intro' }));
      window.dispatchEvent(new CustomEvent('intro-state', { detail: { phase: 'initializing', isHovered: false } }));
    }

    // Platform-aware duration: Desktop ~7.8s, Tablet ~6.0s, Mobile ~4.8s, Reduced Motion ~1.6s
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    let totalDuration = 7800;
    if (hasReducedMotion) {
      totalDuration = 1600;
    } else if (w < 768) {
      totalDuration = 4800; // Mobile
    } else if (w < 1024) {
      totalDuration = 6000; // Tablet
    } else {
      totalDuration = 7800; // Desktop
    }

    // Phase 6D status text sequence (single primary state at a time)
    const statusTimeline = [
      { at: 0, text: 'INITIALIZING ENVIRONMENT' },
      { at: Math.round(totalDuration * 0.16), text: 'MAPPING NEURAL DATA' },
      { at: Math.round(totalDuration * 0.36), text: 'ESTABLISHING CONNECTIONS' },
      { at: Math.round(totalDuration * 0.58), text: 'DATA STREAMS CONVERGING' },
      { at: Math.round(totalDuration * 0.78), text: 'COMPUTATIONAL CORE ONLINE' }
    ];

    const timers = [];
    statusTimeline.forEach(({ at, text }) => {
      const tid = setTimeout(() => {
        setDiagnosticText(text);
      }, at);
      timers.push(tid);
    });

    // Subtle random hex scramble for ambient telemetry
    const hexSamples = ['0x7F3A', '0x1C88', '0x9B02', '0x4A1F', '0xFE3D', '0x88D1'];
    const hexInterval = setInterval(() => {
      setHexCycle(hexSamples[Math.floor(Math.random() * hexSamples.length)]);
    }, 480);

    const readyTimer = setTimeout(() => {
      setPhase('ready');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('intro-state', { detail: { phase: 'ready', isHovered: false } }));
      }
    }, totalDuration);
    timers.push(readyTimer);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(hexInterval);
    };
  }, []);

  // 2. Animate Lower-Center elements into view when 'ready'
  useEffect(() => {
    if (phase !== 'ready') return;
    const root = introRootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (lowerCenterRef.current) {
        gsap.fromTo(
          lowerCenterRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
      }
      if (enterBtnRef.current) {
        gsap.fromTo(
          enterBtnRef.current,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power2.out' }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [phase]);

  // 3. Accessibility: Keyboard triggers (Enter or Space)
  useEffect(() => {
    if (phase !== 'ready') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // 4. Critical ENTER -> NEURAL CASCADE -> CAMERA TRAVEL THROUGH CORE -> HERO TRANSITION
  const handleEnter = () => {
    if (phase === 'entering' || phase === 'done') return;
    setPhase('entering');
    onCursorChange?.('default');

    // 1. Notify WebGL of entry trigger to initiate neural cascade and forward camera journey
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('intro-state', { detail: { phase: 'entering', isHovered: false } })
      );
    }

    // 2. Animate DOM dissolution synchronized with the 3.00s transition
    const root = introRootRef.current;
    if (root) {
      if (isReducedMotion) {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            setPhase('done');
            sessionStorage.setItem('portfolio_intro_entered', 'true');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('intro-state', { detail: { phase: 'done', isHovered: false } }));
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'hero' }));
            }
            onEnter?.();
          }
        });
      } else {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
        const isMobileScreen = w < 768;
        const isTabletScreen = w >= 768 && w < 1024;
        const totalEnterDuration = isMobileScreen ? 2.60 : (isTabletScreen ? 2.90 : 3.20);

        const exitTl = gsap.timeline({
          onComplete: () => {
            setPhase('done');
            sessionStorage.setItem('portfolio_intro_entered', 'true');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('intro-state', { detail: { phase: 'done', isHovered: false } }));
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'hero' }));
            }
            onEnter?.();
          }
        });

        // 0.00s: ENTER button compresses slightly with subtle glow response
        if (enterBtnRef.current) {
          exitTl.to(enterBtnRef.current, {
            scale: 0.94,
            borderColor: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 0 20px rgba(160, 220, 255, 0.60)',
            duration: 0.08,
            ease: 'power2.in'
          }, 0.00);

          // 0.08s: Button begins fading
          exitTl.to(enterBtnRef.current, {
            autoAlpha: 0,
            scale: 0.90,
            duration: 0.25,
            ease: 'power2.out'
          }, 0.08);
        }

        // 0.12s: SYSTEM READY typography and state pill begin fading
        if (lowerCenterRef.current) {
          const heading = lowerCenterRef.current.querySelector('.intro-monumental-heading');
          const sub = lowerCenterRef.current.querySelector('.intro-access-sub');
          const pill = lowerCenterRef.current.querySelector('.intro-status-pill');
          if (heading) exitTl.to(heading, { autoAlpha: 0, y: -6, duration: 0.30, ease: 'power2.out' }, 0.12);
          if (sub) exitTl.to(sub, { autoAlpha: 0, y: -4, duration: 0.25, ease: 'power2.out' }, 0.12);
          if (pill) exitTl.to(pill, { autoAlpha: 0, duration: 0.22, ease: 'power2.out' }, 0.12);
        }

        // 0.45s: Ambient telemetry fragments dissolve into space
        if (telemetryRef.current) {
          exitTl.to(telemetryRef.current, {
            autoAlpha: 0,
            duration: 0.40,
            ease: 'power2.out'
          }, 0.45);
        }

        // 0.85s: Entire intro overlay dissolves completely before camera enters outer network at 1.00s
        exitTl.to(root, {
          autoAlpha: 0,
          duration: 0.35,
          ease: 'power2.inOut'
        }, isMobileScreen ? 0.65 : (isTabletScreen ? 0.75 : 0.85));

        // Hold through core pass-through (2.50s - 2.90s) and controlled darkness (2.90s - 3.20s)
        exitTl.to({}, { duration: 0.30 }, totalEnterDuration - 0.30);
      }
    } else {
      setPhase('done');
      onEnter?.();
    }
  };

  const handleHoverChange = (hovered) => {
    if (phase !== 'ready') return;
    onCursorChange?.(hovered ? 'link' : 'default');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('intro-state', { detail: { phase: 'ready', isHovered: hovered } })
      );
    }
  };

  if (phase === 'done') return null;

  return (
    <div
      ref={introRootRef}
      className={`cinematic-intro-root ${phase === 'entering' ? 'intro-is-entering' : ''}`}
      aria-label="Computational Environment Entry"
    >
      {/* Background Volumetric Glow & Depth Fog (No heavy grid) */}
      <div className="intro-bg-ambient" aria-hidden="true" />
      <div className="intro-scanlines" aria-hidden="true" />
      <div className="intro-faint-grid" aria-hidden="true" />

      {/* ====================================================================
          ENVIRONMENTAL TELEMETRY (DRIFTING, SUBTLE MICRO-FRAGMENTS AT DEPTH)
          ==================================================================== */}
      <div ref={telemetryRef} className="intro-telemetry-layer" aria-hidden="true">
        {/* Top-Left: System Identity */}
        <div className="telemetry-item telemetry-top-left">
          <div className="telemetry-beacon-row">
            <span className="telemetry-beacon" />
            <span className="telemetry-tag">COMPUTATIONAL_SPACE // LAB_01</span>
          </div>
          <span className="telemetry-sub">AUTH_CHANNEL: ENCRYPTED [{hexCycle}]</span>
        </div>

        {/* Top-Right: Spatial Runtime */}
        <div className="telemetry-item telemetry-top-right">
          <span className="telemetry-tag">RUNTIME: WEBGL_2.0 // GPU_ACTIVE</span>
          <span className="telemetry-sub">SHADER_PIPELINE: CALIBRATED</span>
        </div>

        {/* Drifting Floating Fragments in Negative Space */}
        <div className="telemetry-fragment drift-fragment-1">
          <span>0x7F3A // NODE_07</span>
        </div>
        <div className="telemetry-fragment drift-fragment-2">
          <span>SIGNAL_INTEGRITY: 99.8%</span>
        </div>
        <div className="telemetry-fragment drift-fragment-3">
          <span>PACKET_STREAM // SYNC</span>
        </div>

        {/* Bottom-Right: Environmental Spec */}
        <div className="telemetry-item telemetry-bottom-right">
          <span className="telemetry-sub">SPATIAL_CORE: ONLINE</span>
        </div>
      </div>

      {/* ====================================================================
          CENTER VIEWPORT: UNCLUTTERED FOR 3D COMPUTATIONAL CORE
          The 3D WebGL core occupies the center stage without text obstruction.
          ==================================================================== */}

      {/* ====================================================================
          LOWER-CENTER: SYSTEM STATE + ENTER INTERACTION
          Hierarchy: Computational Environment (Center 3D) -> System State -> Enter
          ==================================================================== */}
      <div ref={lowerCenterRef} className="intro-lower-center">
        {phase === 'initializing' ? (
          /* Step 1: Initializing State with Minimalist Single-Line Status Ticker (No progress bar) */
          <div className="intro-init-block">
            <div className="intro-diagnostic-ticker" key={diagnosticText}>
              <span className="diagnostic-beacon" aria-hidden="true" />
              <span className="diagnostic-text">{diagnosticText}</span>
            </div>
          </div>
        ) : (
          /* Step 2: System State & Integrated Enter Experience (Unmounted during initializing) */
          <div className="intro-ready-block">
            {/* Status indicator */}
            <div className="intro-status-pill">
              <span className="status-dot" />
              <span className="status-label">SYSTEM STATE // ONLINE</span>
            </div>

            {/* Editorial Heading: Refined & Understated, NOT Dominating Viewport */}
            <h1 className="intro-monumental-heading">
              SYSTEM READY
            </h1>

            {/* Subtle Invitation */}
            <p className="intro-access-sub">
              ACCESS THE ENVIRONMENT
            </p>

            {/* Integrated Enter Action */}
            <div className="intro-enter-wrap">
              <Magnetic strength={0.25}>
                <button
                  ref={enterBtnRef}
                  className="intro-enter-btn"
                  onClick={handleEnter}
                  onMouseEnter={() => handleHoverChange(true)}
                  onMouseLeave={() => handleHoverChange(false)}
                  aria-label="Enter Experience"
                  tabIndex={0}
                >
                  {/* Precision Reticle Corner Markers */}
                  <span className="btn-reticle reticle-tl" aria-hidden="true" />
                  <span className="btn-reticle reticle-tr" aria-hidden="true" />
                  <span className="btn-reticle reticle-bl" aria-hidden="true" />
                  <span className="btn-reticle reticle-br" aria-hidden="true" />

                  {/* Subtle Light Sweep Shimmer */}
                  <span className="btn-light-sweep" aria-hidden="true" />

                  <span className="btn-label-text">
                    {phase === 'entering' ? 'CONNECTING...' : 'ENTER EXPERIENCE'}
                  </span>
                  <ArrowRight size={13} className="btn-enter-arrow" />
                </button>
              </Magnetic>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
