import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PHASE 6C: Cinematic Computational Core & Transition
 * 
 * Aesthetic: AI Neural Computation × Particle Intelligence × Procedural Geometry
 * 
 * Architecture:
 * - 3 Real Depth Layers:
 *   1. FOREGROUND (z in [+1.4, +3.2]): large luminous particles & drifting data crosshairs close to camera
 *   2. MIDGROUND (z in [-1.5, +1.5]): living neural lattice, flocking nodes, dynamic proximity synapse links,
 *      nested counter-rotating polyhedra (dodecahedron, icosahedron, octahedron) & volumetric breathing light core
 *   3. BACKGROUND (z in [-3.2, -8.0]): faint distant space particles & faint orbital coordinate guide
 * 
 * Continuous Alive Motion:
 * - Slow orbital rotation & internal particle drift
 * - Dynamic proximity connections that attach & detach organically
 * - Breathing light pulse with micro-harmonic flickers
 * - Subtle mouse parallax & internal light shifting
 * 
 * Cinematic ENTER Sequence (0.0s – 1.8s):
 * - 0.00 – 0.20s: Button compresses, core micro-anticipation
 * - 0.20 – 0.35s: Core contracts, rotation accelerates
 * - 0.35 – 0.70s: Central light intensifies & blooms
 * - 0.70 – 1.20s: Particles accelerate toward viewer
 * - 1.20 – 1.60s: Camera passes through; particles streak past; neural lines stretch
 * - 1.60 – 1.80s: Environment collapses into controlled darkness -> Hero emerges
 */
export default function ComputationalCore3D({
  phase = 'initializing',
  isHovered = false,
  mouseRef,
  isReducedMotion = false,
  isMobile = false
}) {
  const rootGroupRef = useRef();
  const corePolyRef1 = useRef();
  const corePolyRef2 = useRef();
  const corePolyRef3 = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const distantRingRef = useRef();
  const glowSpriteRef = useRef();
  const pointLightRef = useRef();
  const nearPointsRef = useRef();
  const midPointsRef = useRef();
  const farPointsRef = useRef();
  const linesRef = useRef();
  const fgCrosshairsRef = useRef();

  // Internal animation state container
  const sim = useRef({
    elapsed: 0,
    initProgress: 0,
    scale: 0.1,
    burstZ: 0,
    lightIntensity: 0.1,
    latticeAlpha: 0,
    lineAlpha: 0,
    hoverLerp: 0,
    enterTime: 0
  });

  // -------------------------------------------------------------
  // 1. PROCEDURAL SOFT LUMINOUS PARTICLE TEXTURES
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
  // 2. DATA BUFFERS: Foreground, Core Synapses, Deep Field & FG Reticles
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
    // 3 small spatial crosshairs in foreground
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
      // Golden spiral distribution with 3D ellipsoidal depth
      const phi = Math.acos(1 - (2 * (i + 0.5)) / midCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = 1.15 + (i % 3) * 0.32 + Math.random() * 0.28;

      const tx = r * Math.sin(phi) * Math.cos(theta);
      const ty = r * Math.sin(phi) * Math.sin(theta);
      // Give expanded Z depth for real 3D volume
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
  // 3. PROCEDURAL ORBITAL COORDINATE RINGS
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
      pts.push(Math.cos(a) * 4.2, Math.sin(a) * 4.2, 0);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  // -------------------------------------------------------------
  // 4. FRAME LOOP & GENERATIVE EMERGENCE
  // -------------------------------------------------------------
  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;
    const s = sim.current;
    s.elapsed += delta;
    const t = state.clock.elapsedTime;
    const damp = isReducedMotion ? 1.0 : Math.min(1.0, delta * 3.4);

    const targetHover = isHovered ? 1.0 : 0.0;
    s.hoverLerp += (targetHover - s.hoverLerp) * Math.min(1.0, delta * 4.0);

    const basePlatformScale = isMobile ? 0.72 : 0.92;

    // --- PHASE 1: GENERATIVE ASSEMBLY (during 'initializing') ---
    if (phase === 'initializing') {
      s.initProgress = Math.min(1.0, s.initProgress + delta * 0.65);
      const p = s.initProgress;
      const easeP = p * p * (3 - 2 * p);

      s.scale = (0.2 + easeP * 0.8) * basePlatformScale;
      s.latticeAlpha = Math.max(0, (p - 0.35) * 1.54);
      s.lineAlpha = Math.max(0, (p - 0.42) * 1.7);
      s.lightIntensity = 0.2 + easeP * 0.9;
    }
    // --- PHASE 2: SYSTEM READY (STABILIZED & LIVING) ---
    else if (phase === 'ready') {
      s.initProgress = 1.0;
      s.latticeAlpha += (0.55 - s.latticeAlpha) * damp;
      s.lineAlpha += (0.32 - s.lineAlpha) * damp;

      // Alive breathing oscillation with micro-pulses
      const primaryBreath = Math.sin(t * 1.7) * (0.02 + s.hoverLerp * 0.03);
      const microPulse = Math.sin(t * 4.2) * 0.006;
      const targetScale = (1.0 - s.hoverLerp * 0.05 + primaryBreath + microPulse) * basePlatformScale;
      s.scale += (targetScale - s.scale) * Math.min(1.0, delta * 3.5);

      s.lightIntensity = 1.0 + s.hoverLerp * 0.6 + Math.sin(t * 3.2) * 0.15;
    }
    // --- PHASE 3: CINEMATIC ENTER CHOREOGRAPHY (0.0s – 1.8s) ---
    else if (phase === 'entering') {
      if (!isReducedMotion) {
        s.enterTime += delta;
        const et = s.enterTime;

        // 0.00 – 0.20s: Initial compression & micro-anticipation
        if (et < 0.20) {
          s.scale += (0.88 * basePlatformScale - s.scale) * Math.min(1.0, delta * 6.0);
          s.lightIntensity = 1.2;
        }
        // 0.20 – 0.35s: Central light flares
        else if (et < 0.35) {
          s.scale += (0.86 * basePlatformScale - s.scale) * Math.min(1.0, delta * 5.0);
          s.lightIntensity += (2.6 - s.lightIntensity) * Math.min(1.0, delta * 8.0);
        }
        // 0.35 – 0.70s: Expansion begins, particles accelerate
        else if (et < 0.70) {
          s.scale += (1.6 * basePlatformScale - s.scale) * Math.min(1.0, delta * 3.0);
          s.burstZ += delta * 3.5;
        }
        // 0.70 – 1.60s: Hyperjump camera enters & pierces core
        else if (et < 1.60) {
          s.scale += (7.5 * basePlatformScale - s.scale) * Math.min(1.0, delta * 3.8);
          s.burstZ += delta * 11.5;
          s.latticeAlpha = Math.max(0, 0.55 - (et - 0.70) * 0.65);
          s.lineAlpha = Math.max(0, 0.35 - (et - 0.70) * 0.75);
        }
        // 1.60 – 1.80s: Controlled darkness handoff
        else {
          s.latticeAlpha = Math.max(0, s.latticeAlpha - delta * 4.0);
          s.lineAlpha = 0;
          s.lightIntensity = Math.max(0, s.lightIntensity - delta * 5.0);
        }
      } else {
        s.latticeAlpha = Math.max(0, s.latticeAlpha - delta * 3.0);
        s.lineAlpha = 0;
      }
    }

    // Apply scale & forward translation
    rootGroupRef.current.scale.set(s.scale, s.scale, s.scale);
    rootGroupRef.current.position.z = s.burstZ;

    // Center offset: elevated on desktop (y = 0.25), higher on mobile (y = 0.45)
    const basePosY = isMobile ? 0.45 : 0.25;

    // --- INTERACTIVE MOUSE PARALLAX & TILT (DESKTOP) ---
    if (!isMobile && !isReducedMotion && mouseRef?.current) {
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
      rootGroupRef.current.position.y = basePosY;
    }

    // --- PROCEDURAL POLYHEDRAL ROTATIONS (ALIVE) ---
    const enterSpeedMult = phase === 'entering' ? (sim.current.enterTime > 0.35 ? 2.5 : 1.5) : 1.0;
    const baseSpeed = (0.24 + s.hoverLerp * 0.35) * enterSpeedMult;

    if (corePolyRef1.current) {
      corePolyRef1.current.rotation.y += delta * baseSpeed;
      corePolyRef1.current.rotation.x += delta * (baseSpeed * 0.55);
    }
    if (corePolyRef2.current) {
      corePolyRef2.current.rotation.y -= delta * (baseSpeed * 0.72);
      corePolyRef2.current.rotation.z += delta * (baseSpeed * 0.40);
    }
    if (corePolyRef3.current) {
      corePolyRef3.current.rotation.x -= delta * (baseSpeed * 0.6);
      corePolyRef3.current.rotation.y += delta * (baseSpeed * 0.45);
    }

    // --- CONCENTRIC ORBITAL DATA RINGS ---
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * (0.22 + s.hoverLerp * 0.2) * enterSpeedMult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * (0.16 + s.hoverLerp * 0.15) * enterSpeedMult;
    }
    if (distantRingRef.current) {
      distantRingRef.current.rotation.z += delta * 0.08;
    }

    // --- VOLUMETRIC GLOW SPRITE & LIGHT ---
    if (glowSpriteRef.current) {
      const glowScale = (1.45 + Math.sin(t * 2.4) * 0.12) * (1.0 + s.hoverLerp * 0.25);
      glowSpriteRef.current.scale.set(glowScale, glowScale, 1);
      glowSpriteRef.current.material.opacity = (0.55 * s.initProgress) * (phase === 'entering' ? Math.max(0, 1.0 - (sim.current.enterTime / 1.7)) : 1.0);
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = s.lightIntensity;
      // Mouse moves the light inside the core for dynamic real-time specular highlights
      if (!isMobile && mouseRef?.current) {
        pointLightRef.current.position.x = mouseRef.current.x * 0.6;
        pointLightRef.current.position.y = mouseRef.current.y * 0.4;
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
        if (phase === 'entering' && sim.current.enterTime > 0.5) {
          nArr[i * 3 + 2] += delta * 18.0;
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
      if (phase === 'entering' && sim.current.enterTime > 0.5) {
        fgCrosshairsRef.current.position.z += delta * 14.0;
      }
    }

    // --- LAYER B: LIVING SYNAPSE FLOCKING & PROXIMITY LATTICE ---
    if (midPointsRef.current && !isReducedMotion) {
      const mPosAttr = midPointsRef.current.geometry.attributes.position;
      const mArr = mPosAttr.array;

      for (let i = 0; i < midCount; i++) {
        const initGrav = Math.min(1.0, s.initProgress * 1.4);
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

        // Accelerate forward during enter
        if (phase === 'entering' && sim.current.enterTime > 0.7) {
          mArr[i * 3 + 2] += delta * 15.0;
        }
      }
      mPosAttr.needsUpdate = true;

      // Dynamic proximity connection lines
      if (linesRef.current && s.lineAlpha > 0.02) {
        let lineIdx = 0;
        const maxLines = midCount * 4;
        const connectDistSq = 1.05 * 1.05;

        for (let i = 0; i < midCount && lineIdx < maxLines; i++) {
          for (let j = i + 1; j < midCount && lineIdx < maxLines; j++) {
            const dx = mArr[i * 3] - mArr[j * 3];
            const dy = mArr[i * 3 + 1] - mArr[j * 3 + 1];
            const dz = mArr[i * 3 + 2] - mArr[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < connectDistSq) {
              linePositions[lineIdx * 6] = mArr[i * 3];
              linePositions[lineIdx * 6 + 1] = mArr[i * 3 + 1];
              linePositions[lineIdx * 6 + 2] = mArr[i * 3 + 2];
              linePositions[lineIdx * 6 + 3] = mArr[j * 3];
              linePositions[lineIdx * 6 + 4] = mArr[j * 3 + 1];
              linePositions[lineIdx * 6 + 5] = mArr[j * 3 + 2];
              lineIdx++;
            }
          }
        }

        for (let k = lineIdx * 6; k < linePositions.length; k++) {
          linePositions[k] = 0;
        }

        const lineAttr = linesRef.current.geometry.attributes.position;
        lineAttr.needsUpdate = true;
        if (linesRef.current.material) {
          linesRef.current.material.opacity = s.lineAlpha;
        }
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

        if (phase === 'entering' && sim.current.enterTime > 0.7) {
          fArr[i * 3 + 2] += delta * 10.0;
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

      {/* Procedural Algorithmic Lattice: Outer Dodecahedron */}
      <mesh ref={corePolyRef1}>
        <dodecahedronGeometry args={[1.20, 0]} />
        <meshBasicMaterial
          color={coreCyan}
          wireframe={true}
          transparent={true}
          opacity={0.38}
        />
      </mesh>

      {/* Procedural Algorithmic Lattice: Middle Icosahedron */}
      <mesh ref={corePolyRef2} scale={[0.82, 0.82, 0.82]}>
        <icosahedronGeometry args={[1.10, 1]} />
        <meshBasicMaterial
          color={innerColor}
          wireframe={true}
          transparent={true}
          opacity={0.28}
        />
      </mesh>

      {/* Procedural Algorithmic Lattice: Inner High-Density Octahedron */}
      <mesh ref={corePolyRef3} scale={[0.52, 0.52, 0.52]}>
        <octahedronGeometry args={[1.0, 0]} />
        <meshBasicMaterial
          color="#a8d6f5"
          wireframe={true}
          transparent={true}
          opacity={0.45}
        />
      </mesh>

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

      {/* LAYER B: Living Synapse Data Nodes (Luminous circular sprites) */}
      <points ref={midPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={midPositions.length / 3}
            array={midPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.075 : 0.095}
          map={particleTexture}
          color="#bfe1fa"
          transparent={true}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Proximity Synapse Lines connecting flocking nodes */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={coreCyan}
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
