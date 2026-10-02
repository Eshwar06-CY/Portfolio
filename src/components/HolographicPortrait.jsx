import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * HolographicPortrait — Phase 7C Final
 * Unified Holographic Projection Installation:
 * 1. Physical 3D Arc-Reactor Device (Ground Plinth, Cylindrical Depth Wall, 10 Copper Coil Blocks, Stator Vents, 3 Struts, Recessed Core)
 * 2. Visible 3-Layer Projection Field (Intense Core Beam, Volumetric Cone, 4 Converging Coherent Rays, Upward Torso Illumination)
 * 3. Commanding Human-Scale Photographic Portrait (100% Real Photo, Natural Skin Tones, Zero Wireframes/Blue Wash)
 */

// Helper to compute a 3D isometric coil block
function generateCoilBlocks() {
  const blocks = [];
  const cx = 170;
  const cy = 82;
  const RoutX = 122;
  const RoutY = 46;
  const RinX = 84;
  const RinY = 32;
  const H = 13; // Substantial 3D physical block thickness (13px)

  const angles = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  const span = 20; // 20 degrees width, leaving 16 degrees glowing energy gap

  angles.forEach((midAngle, idx) => {
    const a1 = (midAngle - span / 2) * (Math.PI / 180);
    const a2 = (midAngle + span / 2) * (Math.PI / 180);
    const amid = midAngle * (Math.PI / 180);

    // Base coords
    const bo1 = [cx + RoutX * Math.cos(a1), cy + RoutY * Math.sin(a1)];
    const bo2 = [cx + RoutX * Math.cos(a2), cy + RoutY * Math.sin(a2)];
    const bi1 = [cx + RinX * Math.cos(a1), cy + RinY * Math.sin(a1)];
    const bi2 = [cx + RinX * Math.cos(a2), cy + RinY * Math.sin(a2)];

    // Top coords (elevated by H)
    const to1 = [bo1[0], bo1[1] - H];
    const to2 = [bo2[0], bo2[1] - H];
    const ti1 = [bi1[0], bi1[1] - H];
    const ti2 = [bi2[0], bi2[1] - H];

    // Top Face path
    const topPath = `M ${ti1[0].toFixed(1)} ${ti1[1].toFixed(1)} L ${to1[0].toFixed(1)} ${to1[1].toFixed(1)} L ${to2[0].toFixed(1)} ${to2[1].toFixed(1)} L ${ti2[0].toFixed(1)} ${ti2[1].toFixed(1)} Z`;

    // Outer Front Depth Wall (for front-facing blocks)
    const isFront = Math.sin(amid) > -0.25;
    const outerWallPath = `M ${to1[0].toFixed(1)} ${to1[1].toFixed(1)} L ${to2[0].toFixed(1)} ${to2[1].toFixed(1)} L ${bo2[0].toFixed(1)} ${bo2[1].toFixed(1)} L ${bo1[0].toFixed(1)} ${bo1[1].toFixed(1)} Z`;

    // Inner Depth Wall (for back-facing blocks visible from the inside)
    const isBack = Math.sin(amid) < 0.25;
    const innerWallPath = `M ${ti1[0].toFixed(1)} ${ti1[1].toFixed(1)} L ${ti2[0].toFixed(1)} ${ti2[1].toFixed(1)} L ${bi2[0].toFixed(1)} ${bi2[1].toFixed(1)} L ${bi1[0].toFixed(1)} ${bi1[1].toFixed(1)} Z`;

    // Left/Right side flank paths
    const leftFlank = `M ${ti1[0].toFixed(1)} ${ti1[1].toFixed(1)} L ${to1[0].toFixed(1)} ${to1[1].toFixed(1)} L ${bo1[0].toFixed(1)} ${bo1[1].toFixed(1)} L ${bi1[0].toFixed(1)} ${bi1[1].toFixed(1)} Z`;
    const rightFlank = `M ${ti2[0].toFixed(1)} ${ti2[1].toFixed(1)} L ${to2[0].toFixed(1)} ${to2[1].toFixed(1)} L ${bo2[0].toFixed(1)} ${bo2[1].toFixed(1)} L ${bi2[0].toFixed(1)} ${bi2[1].toFixed(1)} Z`;

    // Center clamp band path across the top
    const tmidO = [(to1[0] + to2[0]) / 2, (to1[1] + to2[1]) / 2];
    const tmidI = [(ti1[0] + ti2[0]) / 2, (ti1[1] + ti2[1]) / 2];

    blocks.push({
      idx,
      midAngle,
      isFront,
      isBack,
      topPath,
      outerWallPath,
      innerWallPath,
      leftFlank,
      rightFlank,
      tmidO,
      tmidI,
      amid,
    });
  });

  return blocks;
}

export default function HolographicPortrait({
  src = '/portrait_tb.png',
  fallbackSrc = '/portrait.png',
  alt = 'Eshwar M — Portrait',
  hasEntered = true,
  isMobile = false,
  onCursorChange,
  isProjected: controlledProjected,
  phase: controlledPhase,
  isHovered: controlledHovered,
}) {
  const [internalProjected, setInternalProjected] = useState(false);
  const [internalHovered, setInternalHovered] = useState(false);
  const [internalPhase, setInternalPhase] = useState('dormant');
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timersRef = useRef([]);

  const isProjected = controlledProjected !== undefined ? controlledProjected : internalProjected;
  const isHovered = controlledHovered !== undefined ? controlledHovered : internalHovered;
  const phase = controlledPhase !== undefined ? controlledPhase : internalPhase;

  const coilBlocks = useMemo(() => generateCoilBlocks(), []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Activation sequence (1.8s - 2.2s total choreography matching Phase 7C specifications)
  const handleActivate = useCallback(() => {
    clearTimers();

    if (isReducedMotion) {
      setIsProjected(true);
      setPhase('active');
      return;
    }

    setIsProjected(true);
    setPhase('waking'); // Step 1: 0.0s - 0.25s: Reactor wakes, core begins glowing

    // Step 2: 0.25s - 0.55s: Energy builds, vertical projection beam begins rising
    const t1 = setTimeout(() => {
      setPhase('energy-build');
    }, 250);

    // Step 3: 0.55s - 1.15s: Portrait physically emerges upward from reactor
    const t2 = setTimeout(() => {
      setPhase('emerging');
    }, 550);

    // Step 4: 1.15s - 1.70s: Full projection achieved, portrait reaches intended position
    const t3 = setTimeout(() => {
      setPhase('projected');
    }, 1150);

    // Step 5: 1.70s - 2.20s: Portrait gently settles into place
    const t4 = setTimeout(() => {
      setPhase('settling');
    }, 1700);

    // 2.20s+: Resting state with subtle micro-float and resting beam
    const t5 = setTimeout(() => {
      setPhase('active');
    }, 2200);

    timersRef.current = [t1, t2, t3, t4, t5];
  }, [clearTimers, isReducedMotion]);

  // Deactivation sequence (0.8s: portrait moves downward, dissolves back into reactor)
  const handleDeactivate = useCallback(() => {
    clearTimers();

    setIsProjected(false);
    if (isReducedMotion) {
      setPhase('dormant');
      return;
    }

    setPhase('collapsing'); // 0.0s - 0.8s: downward collapse & light contraction

    const t = setTimeout(() => {
      setPhase('dormant');
    }, 800);

    timersRef.current = [t];
  }, [clearTimers, isReducedMotion]);

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

  return (
    <div
      className={`projector-stage-container ${isProjected ? 'projector--on' : 'projector--off'} ${isHovered ? 'sys--hovered' : ''} phase--${phase}`}
      data-phase={phase}
    >
      {/* ── 1. UPPER PROJECTION REGION (55–65% Height) ────────────────── */}
      <div className="projection-space-field">
        {/* Subtle dormant atmospheric particles when portrait is NOT projected */}
        <div className="dormant-atmospheric-haze" aria-hidden="true">
          <span className="dormant-dust dust-1" />
          <span className="dormant-dust dust-2" />
          <span className="dormant-dust dust-3" />
          <div className="dormant-ring-marker" />
        </div>

        {/* The REAL Photographic Portrait Layer (HIDDEN initially, physically emerges on activation) */}
        <div
          className="projected-portrait-wrapper"
          aria-hidden={!isProjected}
        >
          <div className="portrait-image-mask-frame">
            <img
              src={src}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackSrc;
              }}
              alt={alt}
              className="hero-real-portrait-img"
              loading="eager"
              decoding="async"
            />
            {/* Very subtle cyan projection rim light on edges only */}
            <div className="portrait-projection-rim" aria-hidden="true" />
          </div>

          {/* Upward projection light spill illuminating the lower torso/suit */}
          <div className="portrait-projection-underglow" aria-hidden="true" />
        </div>
      </div>

      {/* ── 2. VISIBLE 3-LAYER PHYSICAL PROJECTION FIELD ── */}
      {/* Geometrically connects the central core emitter to the base of the portrait */}
      <div className="projection-field-conduit" aria-hidden="true">
        <svg
          viewBox="0 0 540 200"
          className="projection-field-svg"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Volumetric Expanding Cone Gradient */}
            <linearGradient id="p-volumetric-grad" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.42" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.18" />
              <stop offset="65%" stopColor="#0284c7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>

            {/* Core Intense Vertical Beam Gradient */}
            <linearGradient id="p-core-beam-grad" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="15%" stopColor="#a5f3fc" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.60" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.01" />
            </linearGradient>

            {/* Secondary Coherent Ray Gradients */}
            <linearGradient id="p-ray-outer-grad" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.22" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="p-ray-inner-grad" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.80" />
              <stop offset="20%" stopColor="#00e5ff" stopOpacity="0.46" />
              <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>

            {/* Aperture Emitter Glow */}
            <radialGradient id="p-aperture-flare-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="30%" stopColor="#00e5ff" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Atmospheric Soft Blur Filters */}
            <filter id="p-atmospheric-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id="p-core-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            <filter id="p-ray-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>

          {/* LAYER 2: Wide Soft Volumetric Projection Cone (Shoulder-Scale Human Projection) */}
          <path
            d="M 262 196 L 278 196 L 505 0 L 35 0 Z"
            fill="url(#p-volumetric-grad)"
            filter="url(#p-atmospheric-blur)"
            className="conduit-volumetric-cone"
          />
          <path
            d="M 265 196 L 275 196 L 415 0 L 125 0 Z"
            fill="url(#p-volumetric-grad)"
            className="conduit-volumetric-sheath"
            opacity="0.30"
          />

          {/* LAYER 3: 6 Coherent Secondary Rays Spanning to Shoulders */}
          {/* Ray 1: Outer Left Shoulder */}
          <line
            x1="267" y1="196"
            x2="45" y2="0"
            stroke="url(#p-ray-outer-grad)"
            strokeWidth="1.8"
            filter="url(#p-ray-blur)"
            className="conduit-ray ray-outer-left"
          />
          {/* Ray 2: Mid Left Clavicle */}
          <line
            x1="268" y1="196"
            x2="135" y2="0"
            stroke="url(#p-ray-outer-grad)"
            strokeWidth="2.0"
            filter="url(#p-ray-blur)"
            className="conduit-ray ray-mid-left"
          />
          {/* Ray 3: Inner Left Chest */}
          <line
            x1="269" y1="196"
            x2="215" y2="0"
            stroke="url(#p-ray-inner-grad)"
            strokeWidth="2.2"
            filter="url(#p-ray-blur)"
            className="conduit-ray ray-inner-left"
          />
          {/* Ray 4: Inner Right Chest */}
          <line
            x1="271" y1="196"
            x2="325" y2="0"
            stroke="url(#p-ray-inner-grad)"
            strokeWidth="2.2"
            filter="url(#p-ray-blur)"
            className="conduit-ray ray-inner-right"
          />
          {/* Ray 5: Mid Right Clavicle */}
          <line
            x1="272" y1="196"
            x2="405" y2="0"
            stroke="url(#p-ray-outer-grad)"
            strokeWidth="2.0"
            filter="url(#p-ray-blur)"
            className="conduit-ray ray-mid-right"
          />
          {/* Ray 6: Outer Right Shoulder */}
          <line
            x1="273" y1="196"
            x2="495" y2="0"
            stroke="url(#p-ray-outer-grad)"
            strokeWidth="1.8"
            filter="url(#p-ray-blur)"
            className="conduit-ray ray-outer-right"
          />

          {/* LAYER 1: Core Intense Vertical Beam Column */}
          {/* Broad beam soft bloom */}
          <path
            d="M 262 196 L 278 196 L 292 0 L 248 0 Z"
            fill="url(#p-core-beam-grad)"
            filter="url(#p-core-blur)"
            className="conduit-core-bloom"
            opacity="0.80"
          />
          {/* Concentrated crystalline central shaft */}
          <path
            d="M 267 196 L 273 196 L 274 0 L 266 0 Z"
            fill="url(#p-core-beam-grad)"
            className="conduit-core-shaft"
          />

          {/* Aperture Emitter Source Flare at the Reactor Apex */}
          <ellipse
            cx="270"
            cy="196"
            rx="28"
            ry="7"
            fill="url(#p-aperture-flare-grad)"
            className="conduit-source-flare"
          />
        </svg>
      </div>

      {/* ── 3. SUBSTANTIAL PHYSICAL ARC-REACTOR DEVICE ── */}
      <div className="reactor-device-assembly physical-projector-assembly" aria-hidden="true">
        <svg
          viewBox="0 0 340 180"
          className="physical-reactor-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ground Contact Shadow Gradient */}
            <radialGradient id="r-base-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#000000" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Ground Contact Core Occlusion */}
            <radialGradient id="r-core-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Floor Cyan Energy Spill Reflection */}
            <radialGradient id="r-floor-cyan-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.38" />
              <stop offset="40%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="80%" stopColor="#0369a1" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Cylindrical Chassis Depth Wall (Machined dark gunmetal vertical thickness) */}
            <linearGradient id="r-chassis-depth-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#282a36" />
              <stop offset="15%" stopColor="#1c1d26" />
              <stop offset="55%" stopColor="#101118" />
              <stop offset="85%" stopColor="#08080d" />
              <stop offset="100%" stopColor="#020204" />
            </linearGradient>

            {/* Outer Armor Rim Gradient (Dark brushed graphite) */}
            <linearGradient id="r-armor-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#323440" />
              <stop offset="40%" stopColor="#1b1c24" />
              <stop offset="80%" stopColor="#101116" />
              <stop offset="100%" stopColor="#07070b" />
            </linearGradient>

            {/* Restrained Dark Tungsten-Bronze Metallic Coil Gradient (No bright orange/gold) */}
            <linearGradient id="r-copper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48423c" />
              <stop offset="35%" stopColor="#342e28" />
              <stop offset="70%" stopColor="#221e1a" />
              <stop offset="100%" stopColor="#141210" />
            </linearGradient>

            {/* Coil Dark Steel Cap Gradient */}
            <linearGradient id="r-coil-cap-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3c3c4e" />
              <stop offset="50%" stopColor="#242432" />
              <stop offset="100%" stopColor="#14141e" />
            </linearGradient>

            {/* Inner Stator Ring Gradient */}
            <linearGradient id="r-stator-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#282838" />
              <stop offset="50%" stopColor="#161622" />
              <stop offset="100%" stopColor="#0b0b12" />
            </linearGradient>

            {/* Glowing Energy Ring Gradient */}
            <radialGradient id="r-cyan-energy-ring" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#00e5ff" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.10" />
            </radialGradient>

            {/* Reactor Core Hot Emitter Gradient */}
            <radialGradient id="r-core-emitter-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#a5f3fc" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#00e5ff" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── GROUND CONTACT SHADOW & FLOOR REFLECTION ── */}
          <ellipse cx="170" cy="154" rx="164" ry="24" fill="url(#r-base-shadow)" />
          <ellipse cx="170" cy="146" rx="136" ry="14" fill="url(#r-core-shadow)" />
          <ellipse
            className="reactor-ground-energy-glow"
            cx="170"
            cy="150"
            rx="118"
            ry="18"
            fill="url(#r-floor-cyan-glow)"
          />

          {/* ── GROUND MOUNTING PLINTH (Physical Foundation Platform) ── */}
          <path
            d="M 32 128 L 32 140 Q 170 170 308 140 L 308 128 Q 170 156 32 128 Z"
            fill="#08080e"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="0.8"
          />

          {/* ── CYLINDRICAL CHASSIS DEPTH WALL (42px Solid Height) ── */}
          <path
            d="M 36 84 L 36 132 Q 170 164 304 132 L 304 84 Q 170 116 36 84 Z"
            fill="url(#r-chassis-depth-grad)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />

          {/* Vertical Heat-Sink Fluting / CNC Milling Grooves on Depth Wall */}
          <g stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.2">
            <line x1="68" y1="94" x2="68" y2="137" />
            <line x1="102" y1="104" x2="102" y2="147" />
            <line x1="136" y1="110" x2="136" y2="153" />
            <line x1="170" y1="112" x2="170" y2="155" />
            <line x1="204" y1="110" x2="204" y2="153" />
            <line x1="238" y1="104" x2="238" y2="147" />
            <line x1="272" y1="94" x2="272" y2="137" />
          </g>

          {/* Perimeter Hex Fastener Bolts */}
          <circle cx="56" cy="132" r="2.2" fill="#3a3a4e" stroke="#161622" strokeWidth="0.8" />
          <circle cx="118" cy="147" r="2.2" fill="#3a3a4e" stroke="#161622" strokeWidth="0.8" />
          <circle cx="170" cy="151" r="2.2" fill="#3a3a4e" stroke="#161622" strokeWidth="0.8" />
          <circle cx="222" cy="147" r="2.2" fill="#3a3a4e" stroke="#161622" strokeWidth="0.8" />
          <circle cx="284" cy="132" r="2.2" fill="#3a3a4e" stroke="#161622" strokeWidth="0.8" />

          {/* ── TOP ARMOR COLLAR / BEVELED DECK ── */}
          <ellipse
            cx="170"
            cy="84"
            rx="134"
            ry="50"
            fill="url(#r-armor-rim-grad)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.2"
          />

          {/* Outer Armor Rim 8-Notch Divisions */}
          <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5">
            <line x1="170" y1="34" x2="170" y2="39" />
            <line x1="262" y1="49" x2="258" y2="53" />
            <line x1="304" y1="84" x2="298" y2="84" />
            <line x1="262" y1="119" x2="258" y2="115" />
            <line x1="170" y1="134" x2="170" y2="129" />
            <line x1="78" y1="119" x2="82" y2="115" />
            <line x1="36" y1="84" x2="42" y2="84" />
            <line x1="78" y1="49" x2="82" y2="53" />
          </g>

          {/* ── LUMINOUS ENERGY RING CHAMBER (Under the coils) ── */}
          <ellipse
            className="reactor-energy-ring-chamber"
            cx="170"
            cy="84"
            rx="106"
            ry="41"
            fill="none"
            stroke="url(#r-cyan-energy-ring)"
            strokeWidth="12"
          />

          {/* ── 10 RADIAL ELECTROMAGNETIC INDUCTION COIL BLOCKS ── */}
          {coilBlocks.map((block) => (
            <g key={block.idx} className={`coil-block-unit coil-${block.idx}`}>
              {/* Outer front depth face with restrained tungsten-bronze winding */}
              {block.isFront && (
                <path
                  d={block.outerWallPath}
                  fill="url(#r-copper-grad)"
                  stroke="#161622"
                  strokeWidth="0.8"
                />
              )}

              {/* Inner depth face for rear blocks */}
              {block.isBack && (
                <path
                  d={block.innerWallPath}
                  fill="#14141e"
                  stroke="#0a0a10"
                  strokeWidth="0.8"
                />
              )}

              {/* Side flanks */}
              <path
                d={block.leftFlank}
                fill="#1c1c26"
                stroke="#12121a"
                strokeWidth="0.6"
              />
              <path
                d={block.rightFlank}
                fill="#1c1c26"
                stroke="#12121a"
                strokeWidth="0.6"
              />

              {/* Chunky Top Cap (Machined dark steel cap with copper center) */}
              <path
                d={block.topPath}
                fill="url(#r-coil-cap-grad)"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="0.8"
              />

              {/* Central steel retention clamp bracket line */}
              <line
                x1={block.tmidO[0].toFixed(1)}
                y1={block.tmidO[1].toFixed(1)}
                x2={block.tmidI[0].toFixed(1)}
                y2={block.tmidI[1].toFixed(1)}
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* ── INNER STATOR RING WITH COOLING SLOTS ── */}
          <ellipse
            cx="170"
            cy="84"
            rx="82"
            ry="31"
            fill="url(#r-stator-grad)"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.2"
          />

          {/* 12 Stator Ventilation Slots glowing with cyan energy */}
          <g className="reactor-stator-vents" stroke="#00e5ff" strokeWidth="1.2" opacity="0.4">
            <line x1="170" y1="56" x2="170" y2="60" />
            <line x1="208" y1="61" x2="206" y2="65" />
            <line x1="238" y1="74" x2="234" y2="76" />
            <line x1="250" y1="84" x2="245" y2="84" />
            <line x1="238" y1="94" x2="234" y2="92" />
            <line x1="208" y1="107" x2="206" y2="103" />
            <line x1="170" y1="112" x2="170" y2="108" />
            <line x1="132" y1="107" x2="134" y2="103" />
            <line x1="102" y1="94" x2="106" y2="92" />
            <line x1="90" y1="84" x2="95" y2="84" />
            <line x1="102" y1="74" x2="106" y2="76" />
            <line x1="132" y1="61" x2="134" y2="65" />
          </g>

          {/* ── 3 RADIAL STABILIZER STRUTS (Locking core well at 90°, 210°, 330°) ── */}
          {/* Strut 1: Bottom center pointing to 90° */}
          <polygon
            points="167,84 173,84 172,112 168,112"
            fill="#323246"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.8"
          />
          <circle cx="170" cy="108" r="1.2" fill="#565672" />

          {/* Strut 2: Top-Left pointing to 210° */}
          <polygon
            points="148,84 152,80 128,68 126,73"
            fill="#323246"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.8"
          />
          <circle cx="132" cy="73" r="1.2" fill="#565672" />

          {/* Strut 3: Top-Right pointing to 330° */}
          <polygon
            points="188,80 192,84 214,73 212,68"
            fill="#323246"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.8"
          />
          <circle cx="208" cy="73" r="1.2" fill="#565672" />

          {/* ── RECESSED OPTICAL APERTURE WELL ── */}
          <ellipse
            cx="170"
            cy="84"
            rx="42"
            ry="16"
            fill="#050508"
            stroke="rgba(0, 229, 255, 0.40)"
            strokeWidth="1.5"
          />

          <ellipse
            cx="170"
            cy="84"
            rx="34"
            ry="13"
            fill="#0a1420"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1"
          />

          {/* ── CONCENTRATED LUMINOUS REACTOR CORE ── */}
          <g className="reactor-core-energy-group">
            {/* Ambient diffuse core aura */}
            <ellipse
              className="core-diffuse-disc"
              cx="170"
              cy="84"
              rx="28"
              ry="11"
              fill="url(#r-core-emitter-grad)"
            />

            {/* Concentrated crystalline core */}
            <ellipse
              className="core-hot-crystal"
              cx="170"
              cy="84"
              rx="15"
              ry="6"
              fill="#ffffff"
            />

            {/* Horizontal Flare Bar */}
            <line
              className="core-flare-line"
              x1="115"
              y1="84"
              x2="225"
              y2="84"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Vertical burst beam */}
            <line
              className="core-vertical-beam"
              x1="170"
              y1="72"
              x2="170"
              y2="96"
              stroke="#00e5ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
