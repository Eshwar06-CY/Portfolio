import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * APPROVED COMPUTATIONAL INTELLIGENCE CORE
 * 
 * Matches the approved reference screenshot (localhost:5173 at SYSTEM READY):
 * - Radiant central point light & volumetric inner bloom sprite
 * - Nested geometric polyhedral wireframes:
 *     1. Outer Dodecahedron (r = 1.20, wireframe, #72a8d2, opacity 0.38)
 *     2. Middle Subdivided Icosahedron (r = 1.10, detail = 1, scale 0.82, #5b90be, opacity 0.28)
 *     3. Inner High-Density Octahedron (r = 1.0, scale 0.52, #a8d6f5, opacity 0.45)
 * - 2 Large Sweeping Orbital Coordinate Rings + Distant Atmospheric Ring:
 *     1. Ring 1: r = 2.05, rotation [0.68, 0.22, 0.45], #72a8d2, opacity 0.35
 *     2. Ring 2: r = 2.50, rotation [-0.62, -0.35, -0.58], #72a8d2, opacity 0.25
 *     3. Distant Ring: r = 4.20, pos [0.4, -0.2, -2.8], rot [0.3, 0.4, 0.15], #3a6282, opacity 0.16
 * - Living Synapse Neural Network:
 *     - 50 golden-spiral nodes flocking in 3D ellipsoidal depth
 *     - Dynamic proximity connection lines (connectDistSq = 1.05 * 1.05) calculated every frame
 *     - Near-field luminous floating dust & spatial crosshair reticles
 * - Staged Emergence during initialization (0.0s – 7.8s) -> SYSTEM READY
 * - 14-beat cinematic camera pass-through transition on ENTER -> controlled darkness -> Hero reveal
 */
export default function ComputationalCore3D({
  phase = 'initializing',
  isHovered = false,
  mouseRef,
  isReducedMotion = false,
  isMobile = false,
  isTablet = false
}) {
  const rootGroupRef = useRef();

  // Nested geometric wireframe shells
  const corePolyRef1 = useRef(); // Outer Dodecahedron
  const corePolyRef2 = useRef(); // Middle Subdivided Icosahedron (detail 1)
  const corePolyRef3 = useRef(); // Inner High-Density Octahedron

  // Large orbital coordinate structures
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const distantRingRef = useRef();

  // Illumination & volumetric core bloom
  const glowSpriteRef = useRef();
  const pointLightRef = useRef();

  // Particle layers & dynamic proximity network
  const nearPointsRef = useRef();
  const midPointsRef = useRef();
  const farPointsRef = useRef();
  const fgCrosshairsRef = useRef();
  const linesRef = useRef();

  // Internal animation state container
  const sim = useRef({
    elapsed: 0,
    initProgress: 0,
    scale: 0.1,
    burstZ: 0,
    lightIntensity: 0.1,
    latticeAlpha: 0,
    ringAlpha: 0,
    lineAlpha: 0,
    glowAlpha: 0,
    hoverLerp: 0,
    enterTime: 0
  });

  // Calculate platform-adjusted initialization duration
  const initDuration = useMemo(() => {
    if (isReducedMotion) return 1.6;
    if (isMobile) return 4.8;
    if (isTablet) return 6.0;
    return 7.8;
  }, [isMobile, isTablet, isReducedMotion]);

  // -------------------------------------------------------------
  // 1. PROCEDURAL SOFT LUMINOUS TEXTURES
  // -------------------------------------------------------------
  const particleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.22, 'rgba(185, 225, 255, 0.88)');
    grad.addColorStop(0.55, 'rgba(110, 175, 240, 0.28)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  const volumetricGlowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(215, 242, 255, 0.90)');
    grad.addColorStop(0.24, 'rgba(130, 195, 255, 0.50)');
    grad.addColorStop(0.60, 'rgba(70, 135, 215, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // -------------------------------------------------------------
  // 2. PROCEDURAL ORBITAL COORDINATE RINGS
  // -------------------------------------------------------------
  const ring1Geo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const segs = 72;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  const ring2Geo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const segs = 72;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(Math.cos(a) * 2.50, Math.sin(a) * 2.50, 0);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  const distantRingGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const segs = 64;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(Math.cos(a) * 4.20, Math.sin(a) * 4.20, 0);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  // -------------------------------------------------------------
  // 3. DATA BUFFERS: Foreground, Core Synapses, Deep Field & FG Reticles
  // -------------------------------------------------------------
  const nearCount = isMobile ? 8 : 18;
  const midCount = isMobile ? 24 : 50;
  const farCount = isMobile ? 14 : 32;

  // Foreground particles (close to camera: z in [+1.4, +3.2])
  const [nearPositions, nearVelocities] = useMemo(() => {
    const pos = new Float32Array(nearCount * 3);
    const vel = new Float32Array(nearCount * 3);
    for (let i = 0; i < nearCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
      pos[i * 3 + 2] = 1.4 + Math.random() * 1.8;
      vel[i * 3] = (Math.random() - 0.5) * 0.0035;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.0035;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0025;
    }
    return [pos, vel];
  }, [nearCount]);

  // Foreground Data Reticle crosshairs (subtle drifting spatial coordinate markers)
  const fgReticlePositions = useMemo(() => {
    const pts = [
      // Crosshair 1 (upper-left foreground)
      -1.8, 1.4, 1.8,
      -1.6, 1.4, 1.8,
      -1.7, 1.3, 1.8,
      -1.7, 1.5, 1.8,

      // Crosshair 2 (lower-right foreground)
      1.9, -1.2, 2.2,
      2.1, -1.2, 2.2,
      2.0, -1.3, 2.2,
      2.0, -1.1, 2.2,

      // Crosshair 3 (mid-right foreground)
      2.2, 0.8, 1.6,
      2.35, 0.8, 1.6,
      2.27, 0.72, 1.6,
      2.27, 0.88, 1.6
    ];
    return new Float32Array(pts);
  }, []);

  // Central living synapse nodes (midfield: z in [-1.4, +1.4])
  const [midPositions, midVelocities, targetPositions, linePositions] = useMemo(() => {
    const pos = new Float32Array(midCount * 3);
    const vel = new Float32Array(midCount * 3);
    const target = new Float32Array(midCount * 3);

    for (let i = 0; i < midCount; i++) {
      // Golden spiral distribution with 3D ellipsoidal depth matching approved reference
      const phi = Math.acos(1 - (2 * (i + 0.5)) / midCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = 1.15 + (i % 3) * 0.32 + Math.random() * 0.28;

      const tx = r * Math.sin(phi) * Math.cos(theta);
      const ty = r * Math.sin(phi) * Math.sin(theta);
      const tz = r * Math.cos(phi) * 1.25;

      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;

      // Dispersed start during initialization
      const disperseDist = 3.8 + Math.random() * 2.4;
      pos[i * 3] = tx * (disperseDist / r);
      pos[i * 3 + 1] = ty * (disperseDist / r);
      pos[i * 3 + 2] = tz * (disperseDist / r);

      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    const maxLines = midCount * 4;
    const lPos = new Float32Array(maxLines * 6);

    return [pos, vel, target, lPos];
  }, [midCount]);

  // Precompute distance from origin and activation timing for inside-out cascade (Requirement 4)
  const nodeCascadeData = useMemo(() => {
    const cascadeTimes = new Float32Array(midCount);
    for (let i = 0; i < midCount; i++) {
      const tx = targetPositions[i * 3];
      const ty = targetPositions[i * 3 + 1];
      const tz = targetPositions[i * 3 + 2];
      const dist = Math.sqrt(tx * tx + ty * ty + tz * tz);

      // Section 4 Cascade:
      // Central Core: dist < 1.35 (0.15 - 0.30s)
      // Inner Neural Structure: 1.35 <= dist < 1.65 (0.30 - 0.50s)
      // Left Cluster: 1.65 <= dist < 1.95, tx <= 0 (0.50 - 0.65s)
      // Right Cluster: 1.65 <= dist < 1.95, tx > 0 (0.65 - 0.80s)
      // Outer Network: dist >= 1.95 (0.80 - 1.05s)
      if (dist < 1.35) {
        cascadeTimes[i] = 0.15 + (dist / 1.35) * 0.15;
      } else if (dist < 1.65) {
        cascadeTimes[i] = 0.30 + ((dist - 1.35) / 0.30) * 0.20;
      } else if (dist < 1.95) {
        if (tx <= 0) {
          cascadeTimes[i] = 0.50 + ((dist - 1.65) / 0.30) * 0.15;
        } else {
          cascadeTimes[i] = 0.65 + ((dist - 1.65) / 0.30) * 0.15;
        }
      } else {
        cascadeTimes[i] = 0.80 + Math.min(0.25, ((dist - 1.95) / 0.50) * 0.25);
      }
    }
    return cascadeTimes;
  }, [midCount, targetPositions]);

  // Vertex color buffers for dynamic neural signal propagation & locked visual fidelity
  const midColors = useMemo(() => {
    const colors = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      colors[i * 3] = 0.75;
      colors[i * 3 + 1] = 0.88;
      colors[i * 3 + 2] = 0.98;
    }
    return colors;
  }, [midCount]);

  const maxLines = midCount * 4;
  const lineColors = useMemo(() => {
    const colors = new Float32Array(maxLines * 6);
    for (let k = 0; k < colors.length; k += 3) {
      colors[k] = 0.45;
      colors[k + 1] = 0.66;
      colors[k + 2] = 0.82;
    }
    return colors;
  }, [maxLines]);

  // Deep field particles (background: z in [-3.0, -8.0])
  const [farPositions, farVelocities] = useMemo(() => {
    const pos = new Float32Array(farCount * 3);
    const vel = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11.0;
      pos[i * 3 + 2] = -3.0 - Math.random() * 4.8;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vel];
  }, [farCount]);

  // -------------------------------------------------------------
  // 4. ANIMATION FRAME LOOP
  // -------------------------------------------------------------
  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;
    const s = sim.current;
    s.elapsed += delta;
    const t = state.clock.elapsedTime;
    const damp = isReducedMotion ? 1.0 : Math.min(1.0, delta * 3.4);

    const targetHover = isHovered ? 1.0 : 0.0;
    s.hoverLerp += (targetHover - s.hoverLerp) * Math.min(1.0, delta * 4.0);

    const basePlatformScale = isMobile ? 0.72 : (isTablet ? 0.82 : 0.92);

    let initGrav = 1.0;

    // =========================================================
    // 7-STAGE INITIALIZATION TIMELINE (0.0s to 7.8s+)
    // =========================================================
    if (phase === 'initializing') {
      const dur = initDuration;
      const u = Math.min(1.0, s.elapsed / dur);
      s.initProgress = u;

      // Stage 1 (0.0 – 1.2s, u: 0.00 – 0.15): Boot / Darkness
      if (u < 0.15) {
        s.scale = 0.20 * basePlatformScale;
        s.lightIntensity = 0.05 + u * 0.40;
        s.latticeAlpha = 0;
        s.ringAlpha = 0;
        s.lineAlpha = 0;
        s.glowAlpha = 0.10 + u * 0.50;
        initGrav = 0.05;
      }
      // Stage 2 (1.2 – 2.8s, u: 0.15 – 0.36): First Nodes & Inner Nucleus Coalescence
      else if (u < 0.36) {
        const prog = (u - 0.15) / 0.21;
        s.scale = (0.20 + prog * 0.25) * basePlatformScale;
        s.lightIntensity = 0.15 + prog * 0.40;
        s.latticeAlpha = prog * 0.35;
        s.ringAlpha = 0;
        s.lineAlpha = prog * 0.15;
        s.glowAlpha = 0.20 + prog * 0.40;
        initGrav = prog * 0.50;
      }
      // Stage 3 (2.8 – 4.5s, u: 0.36 – 0.58): Connection Formation & Inner Octahedron
      else if (u < 0.58) {
        const prog = (u - 0.36) / 0.22;
        s.scale = (0.45 + prog * 0.25) * basePlatformScale;
        s.lightIntensity = 0.55 + prog * 0.25;
        s.latticeAlpha = 0.35 + prog * 0.35;
        s.ringAlpha = prog * 0.40;
        s.lineAlpha = 0.15 + prog * 0.45;
        s.glowAlpha = 0.60 + prog * 0.25;
        initGrav = 0.50 + prog * 0.50;
      }
      // Stage 4 (4.5 – 6.1s, u: 0.58 – 0.78): Network Expansion, Icosahedron & Orbital Rings
      else if (u < 0.78) {
        const prog = (u - 0.58) / 0.20;
        s.scale = (0.70 + prog * 0.20) * basePlatformScale;
        s.lightIntensity = 0.80 + prog * 0.15;
        s.latticeAlpha = 0.70 + prog * 0.22;
        s.ringAlpha = 0.40 + prog * 0.45;
        s.lineAlpha = 0.60 + prog * 0.30;
        s.glowAlpha = 0.85 + prog * 0.10;
        initGrav = 1.0;
      }
      // Stage 5 & 6 (6.1 – 7.8s, u: 0.78 – 1.00): Data Propagation, Outer Dodecahedron & Stabilization
      else {
        const prog = (u - 0.78) / 0.22;
        s.scale = (0.90 + prog * 0.10) * basePlatformScale;
        s.lightIntensity = 0.95 + prog * 0.05;
        s.latticeAlpha = 0.92 + prog * 0.08;
        s.ringAlpha = 0.85 + prog * 0.15;
        s.lineAlpha = 0.90 + prog * 0.10;
        s.glowAlpha = 0.95 + prog * 0.05;
        initGrav = 1.0;
      }
    }
    // =========================================================
    // SYSTEM READY: STABILIZED APPROVED COMPUTATIONAL ENVIRONMENT
    // =========================================================
    else if (phase === 'ready') {
      s.initProgress = 1.0;
      initGrav = 1.0;
      s.latticeAlpha += (1.0 - s.latticeAlpha) * damp;
      s.ringAlpha += (1.0 - s.ringAlpha) * damp;
      s.lineAlpha += (1.0 - s.lineAlpha) * damp;
      s.glowAlpha += (1.0 - s.glowAlpha) * damp;

      // Alive breathing oscillation with micro-pulses
      const primaryBreath = Math.sin(t * 1.7) * (0.02 + s.hoverLerp * 0.03);
      const microPulse = Math.sin(t * 4.2) * 0.006;
      const targetScale = (1.0 - s.hoverLerp * 0.05 + primaryBreath + microPulse) * basePlatformScale;
      s.scale += (targetScale - s.scale) * Math.min(1.0, delta * 3.5);

      s.lightIntensity = 1.0 + s.hoverLerp * 0.6 + Math.sin(t * 3.2) * 0.15;
    }
    // =========================================================
    // 14-BEAT CINEMATIC ENTER CASCADE & TRANSITION (0.0s – 2.8s)
    // =========================================================
    else if (phase === 'entering') {
      if (!isReducedMotion) {
        s.enterTime += delta;
        const et = s.enterTime;

        // 0.00 – 0.15s: Micro-anticipation / click compression
        if (et < 0.15) {
          s.scale += (0.95 * basePlatformScale - s.scale) * Math.min(1.0, delta * 8.0);
          s.lightIntensity = 1.25;
        }
        // 0.15 – 0.50s: Central computational light increases, core nodes & inner structure activate
        else if (et < 0.50) {
          s.scale += (1.00 * basePlatformScale - s.scale) * Math.min(1.0, delta * 5.0);
          s.lightIntensity += (2.20 - s.lightIntensity) * Math.min(1.0, delta * 8.0);
          s.latticeAlpha = 1.0;
          s.lineAlpha = 1.0;
          s.ringAlpha = 1.0;
        }
        // 0.50 – 1.05s: Left/right clusters & outer network ignite, data pulses accelerate
        else if (et < 1.05) {
          s.scale += (1.00 * basePlatformScale - s.scale) * Math.min(1.0, delta * 4.0);
          s.lightIntensity = 2.20;
          s.latticeAlpha = 1.0;
          s.lineAlpha = 1.0;
          s.ringAlpha = 1.0;
        }
        // 1.05 – 2.00s: Camera travels forward into outer neural network; nodes & connections resonate
        else if (et < 2.00) {
          s.scale += (1.00 * basePlatformScale - s.scale) * Math.min(1.0, delta * 3.0);
          s.lightIntensity = 2.20;
          s.latticeAlpha = 1.0;
          s.lineAlpha = 1.0;
          s.ringAlpha = 1.0;
        }
        // 2.00 – 2.50s: Camera approaches core crystal; core bloom expands into luminous threshold
        else if (et < 2.50) {
          const ap = (et - 2.00) / 0.50;
          s.lightIntensity = 2.20 + ap * 1.0; // reaches 3.20 at core threshold
          s.latticeAlpha = 1.0;
          s.lineAlpha = Math.max(0, 1.0 - ap * 0.40);
          s.ringAlpha = Math.max(0, 1.0 - ap * 0.50);
        }
        // 2.50 – 2.90s: Camera passes THROUGH the core crystal at Z = 0
        else if (et < 2.90) {
          const pass = (et - 2.50) / 0.40;
          s.lightIntensity = Math.max(0, 3.20 * (1.0 - pass * 0.85));
          s.latticeAlpha = Math.max(0, 1.0 - pass);
          s.lineAlpha = Math.max(0, 0.60 * (1.0 - pass));
          s.ringAlpha = Math.max(0, 0.50 * (1.0 - pass));
          s.glowAlpha = Math.max(0, 1.0 - pass * 0.85);
        }
        // 2.90 – 3.20s: Controlled darkness punctuation before Hero emerges at 3.20s
        else {
          s.latticeAlpha = Math.max(0, s.latticeAlpha - delta * 6.0);
          s.lineAlpha = 0;
          s.ringAlpha = 0;
          s.lightIntensity = Math.max(0, s.lightIntensity - delta * 6.0);
          s.glowAlpha = Math.max(0, s.glowAlpha - delta * 6.0);
        }
      } else {
        // Reduced motion: graceful fade
        s.latticeAlpha = Math.max(0, s.latticeAlpha - delta * 3.0);
        s.lineAlpha = 0;
        s.ringAlpha = 0;
        s.lightIntensity = Math.max(0, s.lightIntensity - delta * 3.0);
        s.glowAlpha = Math.max(0, s.glowAlpha - delta * 3.0);
      }
    }

    // Apply scale & forward translation
    rootGroupRef.current.scale.set(s.scale, s.scale, s.scale);
    rootGroupRef.current.position.z = s.burstZ;

    // Optical elevation: 0.25 on desktop, 0.45 on mobile
    const basePosY = isMobile ? 0.45 : 0.25;

    // --- INTERACTIVE MOUSE PARALLAX & TILT (DESKTOP) ---
    // Smoothly centered during entry flight so camera travels straight down optical core axis
    if (!isMobile && !isReducedMotion && mouseRef?.current && phase !== 'entering') {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const targetRotX = -my * 0.28;
      const targetRotY = mx * 0.38;
      const targetPosX = mx * 0.16;
      const targetPosY = basePosY + my * 0.12;

      rootGroupRef.current.rotation.x += (targetRotX - rootGroupRef.current.rotation.x) * damp;
      rootGroupRef.current.rotation.y += (targetRotY - rootGroupRef.current.rotation.y) * damp;
      rootGroupRef.current.position.x += (targetPosX - rootGroupRef.current.position.x) * damp;
      rootGroupRef.current.position.y += (targetPosY - rootGroupRef.current.position.y) * damp;
    } else {
      rootGroupRef.current.position.x += (0 - rootGroupRef.current.position.x) * damp;
      rootGroupRef.current.position.y += (basePosY - rootGroupRef.current.position.y) * damp;
      rootGroupRef.current.rotation.x += (0 - rootGroupRef.current.rotation.x) * damp;
      rootGroupRef.current.rotation.y += (0 - rootGroupRef.current.rotation.y) * damp;
    }

    // --- PROCEDURAL POLYHEDRAL ROTATIONS (ALIVE) ---
    const enterSpeedMult = phase === 'entering' ? (sim.current.enterTime > 0.35 ? 2.5 : 1.5) : 1.0;
    const baseSpeed = (0.24 + s.hoverLerp * 0.35) * enterSpeedMult;

    // 1. Outer Dodecahedron
    if (corePolyRef1.current) {
      corePolyRef1.current.rotation.y += delta * baseSpeed;
      corePolyRef1.current.rotation.x += delta * (baseSpeed * 0.55);
      if (corePolyRef1.current.material) {
        corePolyRef1.current.material.opacity = 0.38 * s.latticeAlpha;
      }
    }

    // 2. Middle Subdivided Icosahedron (Geodesic triangular facets)
    if (corePolyRef2.current) {
      corePolyRef2.current.rotation.y -= delta * (baseSpeed * 0.72);
      corePolyRef2.current.rotation.z += delta * (baseSpeed * 0.40);
      if (corePolyRef2.current.material) {
        corePolyRef2.current.material.opacity = 0.28 * s.latticeAlpha;
      }
    }

    // 3. Inner High-Density Octahedron
    if (corePolyRef3.current) {
      corePolyRef3.current.rotation.x -= delta * (baseSpeed * 0.60);
      corePolyRef3.current.rotation.y += delta * (baseSpeed * 0.45);
      if (corePolyRef3.current.material) {
        corePolyRef3.current.material.opacity = 0.45 * s.latticeAlpha;
      }
    }

    // --- CONCENTRIC ORBITAL DATA RINGS ---
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * (0.22 + s.hoverLerp * 0.20) * enterSpeedMult;
      if (ring1Ref.current.material) {
        ring1Ref.current.material.opacity = 0.35 * s.ringAlpha;
      }
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * (0.16 + s.hoverLerp * 0.15) * enterSpeedMult;
      if (ring2Ref.current.material) {
        ring2Ref.current.material.opacity = 0.25 * s.ringAlpha;
      }
    }
    if (distantRingRef.current) {
      distantRingRef.current.rotation.z += delta * 0.08;
      if (distantRingRef.current.material) {
        distantRingRef.current.material.opacity = 0.16 * s.ringAlpha;
      }
    }

    // --- VOLUMETRIC GLOW SPRITE & POINT LIGHT ---
    if (glowSpriteRef.current) {
      let glowScale = (1.45 + Math.sin(t * 2.4) * 0.12) * (1.0 + s.hoverLerp * 0.25);
      if (phase === 'entering' && !isReducedMotion) {
        const et = sim.current.enterTime;
        if (et >= 2.00 && et < 2.90) {
          const ap = (et - 2.00) / 0.90;
          glowScale = 1.45 + ap * 2.2; // expands into soft core aperture bloom
        }
      }
      glowSpriteRef.current.scale.set(glowScale, glowScale, 1);
      glowSpriteRef.current.material.opacity = 0.55 * s.glowAlpha;
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity = s.lightIntensity;
      if (!isMobile && mouseRef?.current && phase !== 'entering') {
        pointLightRef.current.position.x = mouseRef.current.x * 0.60;
        pointLightRef.current.position.y = mouseRef.current.y * 0.40;
      } else {
        pointLightRef.current.position.set(0, 0, 0);
      }
    }

    // --- LAYER A: FOREGROUND NEAR PARTICLES DRIFT ---
    if (nearPointsRef.current && !isReducedMotion) {
      const nPosAttr = nearPointsRef.current.geometry.attributes.position;
      const nArr = nPosAttr.array;
      for (let i = 0; i < nearCount; i++) {
        nArr[i * 3] += nearVelocities[i * 3];
        nArr[i * 3 + 1] += nearVelocities[i * 3 + 1];
        nArr[i * 3 + 2] += nearVelocities[i * 3 + 2];

        // Accelerate past camera during enter (from t = 0.5s onward)
        if (phase === 'entering' && sim.current.enterTime > 0.50) {
          nArr[i * 3 + 2] += delta * 3.5;
        }

        if (Math.abs(nArr[i * 3]) > 3.2) nearVelocities[i * 3] *= -1;
        if (Math.abs(nArr[i * 3 + 1]) > 2.6) nearVelocities[i * 3 + 1] *= -1;
        if (nArr[i * 3 + 2] > 3.6 || nArr[i * 3 + 2] < 1.1) nearVelocities[i * 3 + 2] *= -1;
      }
      nPosAttr.needsUpdate = true;
    }

    // --- FOREGROUND DATA CROSSHAIRS DRIFT ---
    if (fgCrosshairsRef.current && !isReducedMotion) {
      fgCrosshairsRef.current.position.y = Math.sin(t * 0.8) * 0.08;
      if (phase === 'entering' && sim.current.enterTime > 0.50) {
        fgCrosshairsRef.current.position.z += delta * 3.0;
      }
      if (fgCrosshairsRef.current.material) {
        const enterFade = phase === 'entering' ? Math.max(0, 1.0 - (sim.current.enterTime / 1.6)) : 1.0;
        fgCrosshairsRef.current.material.opacity = 0.32 * s.latticeAlpha * enterFade;
      }
    }

    // --- LAYER B: LIVING SYNAPSE FLOCKING, PROXIMITY LATTICE & NEURAL CASCADE ---
    if (midPointsRef.current && !isReducedMotion) {
      const mPosAttr = midPointsRef.current.geometry.attributes.position;
      const mArr = mPosAttr.array;

      for (let i = 0; i < midCount; i++) {
        const tx = targetPositions[i * 3];
        const ty = targetPositions[i * 3 + 1];
        const tz = targetPositions[i * 3 + 2];

        const fx = (tx - mArr[i * 3]) * (0.025 * initGrav);
        const fy = (ty - mArr[i * 3 + 1]) * (0.025 * initGrav);
        const fz = (tz - mArr[i * 3 + 2]) * (0.025 * initGrav);

        midVelocities[i * 3] += fx + (Math.random() - 0.5) * 0.001;
        midVelocities[i * 3 + 1] += fy + (Math.random() - 0.5) * 0.001;
        midVelocities[i * 3 + 2] += fz + (Math.random() - 0.5) * 0.001;

        midVelocities[i * 3] *= 0.94;
        midVelocities[i * 3 + 1] *= 0.94;
        midVelocities[i * 3 + 2] *= 0.94;

        mArr[i * 3] += midVelocities[i * 3];
        mArr[i * 3 + 1] += midVelocities[i * 3 + 1];
        mArr[i * 3 + 2] += midVelocities[i * 3 + 2];

        // Moderate forward pass-through translation during entry
        if (phase === 'entering' && sim.current.enterTime > 0.80) {
          mArr[i * 3 + 2] += delta * 1.6;
        }
      }
      mPosAttr.needsUpdate = true;

      // Dynamic cascade coloring for midPoint nodes (Requirements 3 & 4)
      const cAttr = midPointsRef.current.geometry.attributes.color;
      const cArr = cAttr?.array;
      if (cArr) {
        if (phase === 'entering' && !isReducedMotion) {
          const et = sim.current.enterTime;
          for (let i = 0; i < midCount; i++) {
            const actTime = nodeCascadeData[i];
            if (et < actTime) {
              // Pre-activation calm state (locked visual target color)
              cArr[i * 3] = 0.75;
              cArr[i * 3 + 1] = 0.88;
              cArr[i * 3 + 2] = 0.98;
            } else {
              // Signal reached this node: brief brightening flash followed by high-activity state
              const timeSinceAct = et - actTime;
              if (timeSinceAct < 0.22) {
                const flash = 1.0 - (timeSinceAct / 0.22);
                cArr[i * 3] = THREE.MathUtils.lerp(0.85, 1.0, flash);
                cArr[i * 3 + 1] = THREE.MathUtils.lerp(0.95, 1.0, flash);
                cArr[i * 3 + 2] = 1.0;
              } else {
                const pulseRate = 4.0 + Math.min(14.0, (et - 0.3) * 8.0);
                const pulse = Math.sin(t * pulseRate + i) * 0.15;
                cArr[i * 3] = Math.min(1.0, 0.82 + pulse);
                cArr[i * 3 + 1] = Math.min(1.0, 0.92 + pulse);
                cArr[i * 3 + 2] = 1.0;
              }
            }
          }
          cAttr.needsUpdate = true;
        } else if (phase === 'ready' && !isReducedMotion) {
          // Section 3: Ready state breathes with subtle cognitive activity
          for (let i = 0; i < midCount; i++) {
            const breath = Math.sin(t * 1.5 + i * 0.9) * 0.04;
            const microPulse = Math.sin(t * 3.4 + i * 2.3) > 0.94 ? 0.08 : 0;
            const boost = (breath + microPulse) * (1.0 + s.hoverLerp * 0.6);
            cArr[i * 3] = THREE.MathUtils.clamp(0.75 + boost, 0, 1);
            cArr[i * 3 + 1] = THREE.MathUtils.clamp(0.88 + boost, 0, 1);
            cArr[i * 3 + 2] = THREE.MathUtils.clamp(0.98 + boost * 0.5, 0, 1);
          }
          cAttr.needsUpdate = true;
        } else {
          let needsReset = false;
          if (cArr[0] !== 0.75) {
            for (let i = 0; i < midCount; i++) {
              cArr[i * 3] = 0.75;
              cArr[i * 3 + 1] = 0.88;
              cArr[i * 3 + 2] = 0.98;
            }
            needsReset = true;
          }
          if (needsReset) cAttr.needsUpdate = true;
        }
      }

      // Dynamic proximity connection lines (connectDistSq = 1.05 * 1.05)
      // Generates the intricate, organic/geometric neural network seen in reference screenshot
      if (linesRef.current && s.lineAlpha > 0.02) {
        let lineIdx = 0;
        const maxLines = midCount * 4;
        const connectDistSq = 1.05 * 1.05;
        const lcAttr = linesRef.current.geometry.attributes.color;
        const lcArr = lcAttr?.array;

        // Data acceleration factor (Requirement 5: slow cognitive activity -> progressively faster activity)
        const pulseSpeed = phase === 'entering' && !isReducedMotion
          ? 2.5 + Math.min(18.0, Math.max(0, sim.current.enterTime - 0.3) * 12.0)
          : (2.0 + s.hoverLerp * 1.5);

        for (let i = 0; i < midCount && lineIdx < maxLines; i++) {
          for (let j = i + 1; j < midCount && lineIdx < maxLines; j++) {
            const dx = mArr[i * 3] - mArr[j * 3];
            const dy = mArr[i * 3 + 1] - mArr[j * 3 + 1];
            const dz = mArr[i * 3 + 2] - mArr[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < connectDistSq) {
              const baseIdx = lineIdx * 6;
              linePositions[baseIdx] = mArr[i * 3];
              linePositions[baseIdx + 1] = mArr[i * 3 + 1];
              linePositions[baseIdx + 2] = mArr[i * 3 + 2];
              linePositions[baseIdx + 3] = mArr[j * 3];
              linePositions[baseIdx + 4] = mArr[j * 3 + 1];
              linePositions[baseIdx + 5] = mArr[j * 3 + 2];

              // Staged neural connection illumination (Requirements 4 & 5)
              if (lcArr) {
                if (phase === 'entering' && !isReducedMotion) {
                  const et = sim.current.enterTime;
                  const tStart = Math.min(nodeCascadeData[i], nodeCascadeData[j]);
                  const tEnd = Math.max(nodeCascadeData[i], nodeCascadeData[j]);
                  const wave = Math.sin(t * pulseSpeed - (i + j) * 0.45) * 0.5 + 0.5;

                  if (et < tStart) {
                    lcArr[baseIdx] = 0.45;
                    lcArr[baseIdx + 1] = 0.66;
                    lcArr[baseIdx + 2] = 0.82;
                    lcArr[baseIdx + 3] = 0.45;
                    lcArr[baseIdx + 4] = 0.66;
                    lcArr[baseIdx + 5] = 0.82;
                  } else if (et < tEnd) {
                    const pathProg = (et - tStart) / Math.max(0.08, tEnd - tStart);
                    const bright = 0.55 + pathProg * 0.45 + wave * 0.25;
                    lcArr[baseIdx] = Math.min(1.0, 0.55 * bright);
                    lcArr[baseIdx + 1] = Math.min(1.0, 0.78 * bright);
                    lcArr[baseIdx + 2] = Math.min(1.0, 0.95 * bright);
                    lcArr[baseIdx + 3] = Math.min(1.0, 0.45 + pathProg * 0.40);
                    lcArr[baseIdx + 4] = Math.min(1.0, 0.66 + pathProg * 0.25);
                    lcArr[baseIdx + 5] = Math.min(1.0, 0.82 + pathProg * 0.18);
                  } else {
                    const bright = 0.80 + wave * 0.35;
                    lcArr[baseIdx] = Math.min(1.0, 0.60 * bright);
                    lcArr[baseIdx + 1] = Math.min(1.0, 0.82 * bright);
                    lcArr[baseIdx + 2] = Math.min(1.0, 1.00 * bright);
                    lcArr[baseIdx + 3] = Math.min(1.0, 0.60 * bright);
                    lcArr[baseIdx + 4] = Math.min(1.0, 0.82 * bright);
                    lcArr[baseIdx + 5] = Math.min(1.0, 1.00 * bright);
                  }
                } else {
                  const baseR = isHovered ? 0.74 : 0.45;
                  const baseG = isHovered ? 0.90 : 0.66;
                  const baseB = isHovered ? 0.97 : 0.82;
                  const wave = Math.sin(t * pulseSpeed + (i + j) * 0.3) * 0.08;
                  lcArr[baseIdx] = THREE.MathUtils.clamp(baseR + wave, 0, 1);
                  lcArr[baseIdx + 1] = THREE.MathUtils.clamp(baseG + wave, 0, 1);
                  lcArr[baseIdx + 2] = THREE.MathUtils.clamp(baseB + wave, 0, 1);
                  lcArr[baseIdx + 3] = THREE.MathUtils.clamp(baseR + wave, 0, 1);
                  lcArr[baseIdx + 4] = THREE.MathUtils.clamp(baseG + wave, 0, 1);
                  lcArr[baseIdx + 5] = THREE.MathUtils.clamp(baseB + wave, 0, 1);
                }
              }

              lineIdx++;
            }
          }
        }

        for (let k = lineIdx * 6; k < linePositions.length; k++) {
          linePositions[k] = 0;
        }

        const lineAttr = linesRef.current.geometry.attributes.position;
        lineAttr.needsUpdate = true;
        if (lcAttr) lcAttr.needsUpdate = true;
        if (linesRef.current.material) {
          linesRef.current.material.opacity = 0.26 * s.lineAlpha;
        }
      }

      if (midPointsRef.current.material) {
        const enterFade = phase === 'entering' && sim.current.enterTime > 2.90
          ? Math.max(0, 1.0 - (sim.current.enterTime - 2.90) * 6.0)
          : 1.0;
        midPointsRef.current.material.opacity = 0.85 * (phase === 'initializing' ? Math.min(1.0, s.initProgress * 1.5) : 1.0) * enterFade;
      }
    }

    // --- LAYER D: DEEP FIELD PARTICLES DRIFT ---
    if (farPointsRef.current && !isReducedMotion) {
      const fPosAttr = farPointsRef.current.geometry.attributes.position;
      const fArr = fPosAttr.array;
      for (let i = 0; i < farCount; i++) {
        fArr[i * 3] += farVelocities[i * 3];
        fArr[i * 3 + 1] += farVelocities[i * 3 + 1];
        fArr[i * 3 + 2] += farVelocities[i * 3 + 2];

        if (phase === 'entering' && sim.current.enterTime > 0.70) {
          fArr[i * 3 + 2] += delta * 1.5;
        }
      }
      fPosAttr.needsUpdate = true;
    }
  });

  const coreCyan = isHovered ? '#bce5f8' : '#72a8d2';
  const innerColor = isHovered ? '#d0ecfc' : '#5b90be';
  const deepColor = '#3a6282';

  return (
    <group ref={rootGroupRef} position={[0, isMobile ? 0.45 : 0.25, 0]}>
      {/* Dynamic Central Point Light illuminating the spatial structure from within */}
      <pointLight
        ref={pointLightRef}
        color="#8ec2ea"
        intensity={1.0}
        distance={7.5}
        decay={2}
      />

      {/* Volumetric Soft Inner Glow Sprite (Zero hard edges, pure radiant core) */}
      <sprite ref={glowSpriteRef} scale={[1.45, 1.45, 1]}>
        <spriteMaterial
          map={volumetricGlowTexture}
          transparent={true}
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* ==============================================================
          LAYERED NESTED WIREFRAME COMPUTATIONAL CORE
          ============================================================== */}

      {/* 1. Procedural Algorithmic Lattice: Outer Dodecahedron */}
      <mesh ref={corePolyRef1}>
        <dodecahedronGeometry args={[1.20, 0]} />
        <meshBasicMaterial
          color={coreCyan}
          wireframe={true}
          transparent={true}
          opacity={0.38}
        />
      </mesh>

      {/* 2. Procedural Algorithmic Lattice: Middle Subdivided Icosahedron */}
      <mesh ref={corePolyRef2} scale={[0.82, 0.82, 0.82]}>
        <icosahedronGeometry args={[1.10, 1]} />
        <meshBasicMaterial
          color={innerColor}
          wireframe={true}
          transparent={true}
          opacity={0.28}
        />
      </mesh>

      {/* 3. Procedural Algorithmic Lattice: Inner High-Density Octahedron */}
      <mesh ref={corePolyRef3} scale={[0.52, 0.52, 0.52]}>
        <octahedronGeometry args={[1.0, 0]} />
        <meshBasicMaterial
          color="#a8d6f5"
          wireframe={true}
          transparent={true}
          opacity={0.45}
        />
      </mesh>

      {/* ==============================================================
          LARGE ORBITAL COORDINATE STRUCTURES & TRAJECTORIES
          ============================================================== */}

      {/* Orbital Spatial Ring 1 (Inclined plane) */}
      <group rotation={[0.68, 0.22, 0.45]}>
        <lineLoop ref={ring1Ref} geometry={ring1Geo}>
          <lineBasicMaterial
            color={coreCyan}
            transparent={true}
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      </group>

      {/* Orbital Spatial Ring 2 (Orthogonal counter-inclination) */}
      <group rotation={[-0.62, -0.35, -0.58]}>
        <lineLoop ref={ring2Ref} geometry={ring2Geo}>
          <lineBasicMaterial
            color={coreCyan}
            transparent={true}
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      </group>

      {/* Subtle Distant Atmospheric Geometry Ring (z = -2.8, gives deep architectural context) */}
      <group position={[0.4, -0.2, -2.8]} rotation={[0.3, 0.4, 0.15]}>
        <lineLoop ref={distantRingRef} geometry={distantRingGeo}>
          <lineBasicMaterial
            color={deepColor}
            transparent={true}
            opacity={0.16}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      </group>

      {/* ==============================================================
          PARTICLE LAYERS, RETICLES & SYNAPSE NETWORKS
          ============================================================== */}

      {/* LAYER A: Near-Camera Floating Particles (Luminous circular sprites with size attenuation) */}
      <points ref={nearPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nearPositions.length / 3}
            array={nearPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.08 : 0.13}
          map={particleTexture}
          color="#d2e9fb"
          transparent={true}
          opacity={0.80}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Foreground Reticle Crosshairs (Shallow depth cues) */}
      <lineSegments ref={fgCrosshairsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={fgReticlePositions.length / 3}
            array={fgReticlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#8ac4ea"
          transparent={true}
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* LAYER B: Living Synapse Data Nodes (Luminous circular sprites with vertex-colored cascade) */}
      <points ref={midPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={midPositions.length / 3}
            array={midPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={midColors.length / 3}
            array={midColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.075 : 0.095}
          map={particleTexture}
          vertexColors={true}
          color="#ffffff"
          transparent={true}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Proximity Synapse Lines connecting flocking nodes with vertex-colored signal propagation */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineColors.length / 3}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true}
          color="#ffffff"
          transparent={true}
          opacity={0.26}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* LAYER D: Deep Field Distant Space Nodes */}
      <points ref={farPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={farPositions.length / 3}
            array={farPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.055 : 0.07}
          map={particleTexture}
          color={deepColor}
          transparent={true}
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

