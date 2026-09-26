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
  const [diagnosticText, setDiagnosticText] = useState('INITIALIZING ENVIRONMENT // 0x7F3A');
  const [hexCycle, setHexCycle] = useState('0x7F3A');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 1. Lifecycle: Setup session check, atmosphere mode, and generative timing
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    const isSessionReload = sessionStorage.getItem('portfolio_intro_entered') === 'true';

    // Notify WebGL scene of intro mode
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'intro' }));
      window.dispatchEvent(new CustomEvent('intro-state', { detail: { phase: 'initializing', isHovered: false } }));
    }

    // Diagnostics sequence representing AI / computational node convergence
    const diagnostics = [
      'INITIALIZING ENVIRONMENT // 0x7F3A',
      'SPATIAL NODES CONVERGING [99.8%]',
      'NEURAL LATTICE FORMING CONNECTIONS',
      'CALIBRATING LIGHT FIELD & DEPTH',
      'COMPUTATIONAL CORE STABILIZED'
    ];

    let step = 0;
    const tickerInterval = setInterval(() => {
      step++;
      if (step < diagnostics.length) {
        setDiagnosticText(diagnostics[step]);
      }
    }, isSessionReload ? 120 : 360);

    // Subtle random hex scramble for environmental telemetry
    const hexSamples = ['0x7F3A', '0x1C88', '0x9B02', '0x4A1F', '0xFE3D', '0x88D1'];
    const hexInterval = setInterval(() => {
      setHexCycle(hexSamples[Math.floor(Math.random() * hexSamples.length)]);
    }, 480);

    // Time to complete generative emergence: 1.8s
    const initDuration = motionQuery.matches ? 200 : (isSessionReload ? 500 : 1850);

    const readyTimer = setTimeout(() => {
      setPhase('ready');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('intro-state', { detail: { phase: 'ready', isHovered: false } }));
      }
    }, initDuration);

    return () => {
      clearInterval(tickerInterval);
      clearInterval(hexInterval);
      clearTimeout(readyTimer);
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

  // 4. Critical ENTER -> CAMERA THROUGH CORE -> HERO Transition Handoff
  const handleEnter = () => {
    if (phase === 'entering' || phase === 'done') return;
    setPhase('entering');
    onCursorChange?.('default');

    // 1. Notify WebGL of camera forward warp and core contraction/flare
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('intro-state', { detail: { phase: 'entering', isHovered: false } })
      );
    }

    // 2. Animate DOM dissolution
    const root = introRootRef.current;
    if (root) {
      if (isReducedMotion) {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.3,
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

        // 0.00 – 0.15s: Button compresses & reticle brackets flash
        if (enterBtnRef.current) {
          exitTl.to(enterBtnRef.current, {
            scale: 0.92,
            boxShadow: '0 0 28px rgba(140, 210, 255, 0.55)',
            borderColor: 'rgba(255, 255, 255, 0.95)',
            duration: 0.15,
            ease: 'power2.in'
          }, 0);
        }

        // 0.35s: Environmental telemetry fragments dissolve
        if (telemetryRef.current) {
          exitTl.to(telemetryRef.current, {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.out'
          }, 0.35);
        }

        // 0.70s: Lower-center typography blurs and dissolves as camera begins moving toward the core
        if (lowerCenterRef.current) {
          exitTl.to(lowerCenterRef.current, {
            autoAlpha: 0,
            y: -14,
            filter: 'blur(8px)',
            duration: 0.65,
            ease: 'power2.in'
          }, 0.70);
        }

        // 1.40s: Environment collapses toward viewer into brief controlled darkness at 1.80s
        exitTl.to(root, {
          scale: 1.06,
          filter: 'blur(16px)',
          autoAlpha: 0,
          duration: 0.40,
          ease: 'power2.inOut'
        }, 1.40);
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
          /* Step 1: Initializing State with Minimalist Progress Ticker */
          <div className="intro-init-block">
            <div className="intro-diagnostic-ticker">
              <Terminal size={11} className="diagnostic-icon" />
              <span className="diagnostic-text">{diagnosticText}</span>
            </div>
            <div className="intro-progress-rail">
              <div className="intro-progress-bar" />
            </div>
          </div>
        ) : (
          /* Step 2: System State & Integrated Enter Experience */
          <div className="intro-ready-block">
            {/* Status indicator */}
            <div className="intro-status-pill">
              <span className="status-dot" />
              <span className="status-label">SYSTEM STATE // OPTIMAL</span>
            </div>

            {/* Editorial Heading: Refined & Elegant, NOT Dominating Viewport */}
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
