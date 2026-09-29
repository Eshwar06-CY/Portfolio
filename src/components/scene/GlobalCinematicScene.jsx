import React, { useRef, useMemo, useEffect, useState, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ComputationalCore3D from './ComputationalCore3D';
import InfiniteArchiveArchitecture from './InfiniteArchiveArchitecture';
import GravitationalVoidBackdrop from './GravitationalVoidBackdrop';
import ScrollScrubbedCinematicVideo, { VIDEO_ENVIRONMENT_STATES, calculateCinematicTimeline } from './ScrollScrubbedCinematicVideo';

/**
 * PHASE 7D: Gravitational Archive
 * High-End Cinematic Motion Environment
 * 
 * Coherent cinematic universe: The Infinite Archive exists inside a Gravitational Field.
 * Base Environment: 90–95% dark near-black/charcoal/cold steel with selective light.
 * Gravitational Void: Invisible mass behind right-side Hero causing geodesic lensing and curved light streams.
 * Infinite Archive: Monolithic architectural slabs & lintels extending into depth (-4.5 to -30 Z).
 * Camera: Cinema camera with slow drift, forward depth progression on scroll, and 1-2% subtle mouse parallax.
 * Strictly ZERO mouse-following grey spotlights or radial blobs.
 */

const ATMOSPHERE_MODES = {
  intro: {
    baseColor: [0.003, 0.004, 0.007],       // Near-black void
    glowColor: [0.38, 0.52, 0.75],          // Electric cyan-steel
    glowIntensity: 0.55,
    particleOpacity: 0.30,
    particleSpeed: 0.85
  },
  hero: {
    baseColor: [0.003, 0.005, 0.008],       // Deep obsidian void
    glowColor: [0.34, 0.42, 0.54],          // Restrained cold slate / steel
    glowIntensity: 0.32,                     // Keeps portrait photographic and contrast-rich
    particleOpacity: 0.18,
    particleSpeed: 0.42
  },
  about: {
    baseColor: [0.006, 0.008, 0.012],       // Slightly more architectural rim light
    glowColor: [0.46, 0.54, 0.66],          // Neutral cold slate
    glowIntensity: 0.44,
    particleOpacity: 0.20,
    particleSpeed: 0.70
  },
  exploring: {
    baseColor: [0.007, 0.009, 0.015],       // Spatial depth movement
    glowColor: [0.50, 0.58, 0.72],
    glowIntensity: 0.48,
    particleOpacity: 0.24,
    particleSpeed: 0.80
  },
  work: {
    baseColor: [0.005, 0.007, 0.012],       // Deep perspective into the archive colonnade
    glowColor: [0.46, 0.56, 0.72],
    glowIntensity: 0.50,
    particleOpacity: 0.24,
    particleSpeed: 0.65
  },
  p1: { // 01 SPECra (Precision AI Analytics / Architecture - Cool Navy & Blue)
    baseColor: [0.005, 0.009, 0.018],       // Cool dark navy tint
    glowColor: [0.36, 0.58, 0.82],          // Cool blue illumination
    glowIntensity: 0.54,
    particleOpacity: 0.22,
    particleSpeed: 0.38                     // Calmed for project focus moment
  },
  p2: { // 02 ExpenseFlowAI (Deep Graphite & Restrained Emerald / Warm Highlights)
    baseColor: [0.007, 0.011, 0.009],       // Deep graphite
    glowColor: [0.42, 0.64, 0.50],          // Restrained emerald / warm highlights
    glowIntensity: 0.50,
    particleOpacity: 0.26,                  // Slightly denser atmospheric depth
    particleSpeed: 0.40
  },
  p3: { // 03 AI UG Academic Planner (Deep Violet / Obsidian & Structured Light)
    baseColor: [0.009, 0.007, 0.016],       // Deep violet/obsidian
    glowColor: [0.55, 0.48, 0.74],          // Structured violet light
    glowIntensity: 0.48,
    particleOpacity: 0.22,
    particleSpeed: 0.38
  },
  p4: { // 04 CAPACITYX (Restrained Monochrome Tungsten & Architectural Scale)
    baseColor: [0.006, 0.007, 0.009],       // Monochrome black / graphite
    glowColor: [0.65, 0.67, 0.72],          // Subtle silver / tungsten
    glowIntensity: 0.46,
    particleOpacity: 0.20,
    particleSpeed: 0.36
  },
  data: { // Experience & Leadership
    baseColor: [0.006, 0.008, 0.012],
    glowColor: [0.46, 0.52, 0.64],
    glowIntensity: 0.42,
    particleOpacity: 0.20,
    particleSpeed: 0.65
  },
  connect: { // 05 Connect / Final Statement
    baseColor: [0.008, 0.007, 0.006],       // Soft warm settling
    glowColor: [0.55, 0.50, 0.44],
    glowIntensity: 0.36,
    particleOpacity: 0.16,
    particleSpeed: 0.50
  },
  default: {
    baseColor: [0.006, 0.008, 0.012],
    glowColor: [0.46, 0.54, 0.66],
    glowIntensity: 0.42,
    particleOpacity: 0.22,
    particleSpeed: 0.75
  }
};

/**
 * Continuous Gravitational Center Coordinates across Portfolio Chambers
 */
const VOID_POSITIONS_BY_MODE = {
  intro: { world: [2.8, 0.5, -24.0], screen: [0.35, 0.08] },
  hero: { world: [2.8, 0.5, -24.0], screen: [0.35, 0.08] },
  about: { world: [2.2, 0.3, -25.0], screen: [0.28, 0.05] },
  exploring: { world: [1.2, 0.4, -25.5], screen: [0.15, 0.06] },
  work: { world: [0.0, 0.8, -26.0], screen: [0.00, 0.12] },       // Centered behind "SELECTED WORK"
  p1: { world: [3.0, 0.3, -23.5], screen: [0.38, 0.05] },         // SPECra: offset right
  p2: { world: [-2.6, -0.4, -22.5], screen: [-0.34, -0.06] },     // ExpenseFlowAI: offset left
  p3: { world: [0.0, -0.8, -25.0], screen: [0.00, -0.12] },       // Academic Planner: centered lower
  p4: { world: [-2.8, 0.5, -21.5], screen: [-0.36, 0.08] },       // CAPACITYX: monolithic left
  data: { world: [1.8, 0.2, -24.0], screen: [0.22, 0.03] },
  connect: { world: [0.0, -0.2, -25.0], screen: [0.00, -0.03] },
  default: { world: [2.8, 0.5, -24.0], screen: [0.35, 0.08] }
};

/**
 * Frame-driven Gravitational Center Synchronizer:
 * Smoothly shifts gravitational void center between chambers, seamlessly driving
 * geodesic bending in the architecture and backdrop lensing.
 */
function GravitationalCenterSync({ atmosphereMode, voidWorldPosRef, voidScreenPosRef, isReducedMotion }) {
  const targetWorld = useRef(new THREE.Vector3(2.8, 0.5, -24.0));
  const targetScreen = useRef(new THREE.Vector2(0.35, 0.08));

  useEffect(() => {
    const config = VOID_POSITIONS_BY_MODE[atmosphereMode] || VOID_POSITIONS_BY_MODE.default;
    targetWorld.current.set(...config.world);
    targetScreen.current.set(...config.screen);
  }, [atmosphereMode]);

  useFrame((state, delta) => {
    const damp = isReducedMotion ? 1.0 : Math.min(1.0, delta * 2.5);
    if (voidWorldPosRef?.current) {
      voidWorldPosRef.current.lerp(targetWorld.current, damp);
    }
    if (voidScreenPosRef?.current) {
      voidScreenPosRef.current.lerp(targetScreen.current, damp);
    }
  });

  return null;
}

/**
 * WebGL Error Boundary: Guarantees DOM portfolio stays 100% visible and functional
 * if WebGL is unsupported, crashes, or loses context.
 */
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn('[GlobalCinematicScene] WebGL fallback active:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

/**
 * GravitationalAtmosphericParticles
 * Stratified into foreground (sparse soft dust), midground, and deep background.
 * Particles follow subtle orbital geodesic paths curving around the gravitational void.
 */
function GravitationalAtmosphericParticles({
  count = 72,
  mouseRef,
  scrollRef,
  atmosphereMode = 'hero',
  introPhase = 'done',
  isReducedMotion = false,
  isMobile = false,
  isProject = false,
  projectorPulseRef,
  voidWorldPosRef
}) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const currentOpacity = useRef(0.22);
  const lastScrollProgress = useRef(0);
  const scrollVelocity = useRef(0);

  // Generate stratified particle data across 3 depth strata
  const [positions, initialPositions, speeds, layerWeights] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const layers = new Float32Array(count);

    const seedRandom = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      const r1 = seedRandom(i * 1.618 + 0.1);
      const r2 = seedRandom(i * 2.718 + 0.2);
      const r3 = seedRandom(i * 3.141 + 0.3);

      let zPos, weight;
      if (r1 < 0.45) {
        // Deep background layer: z in [-18.0, -5.0], tiny particles, slow orbital curvature
        zPos = -5.0 - r2 * 13.0;
        weight = 0.25;
      } else if (r1 < 0.85) {
        // Midground layer: z in [-5.0, -1.2], medium particles
        zPos = -1.2 - r2 * 3.8;
        weight = 0.60;
      } else {
        // Foreground detail: z in [-1.2, +1.0], few sparse soft specks
        zPos = -1.2 + r2 * 2.2;
        weight = 1.00;
      }

      const xPos = (r3 - 0.5) * 20.0;
      const yPos = (seedRandom(i * 4.2 + 0.4) - 0.5) * 15.0;

      pos[i * 3] = xPos;
      pos[i * 3 + 1] = yPos;
      pos[i * 3 + 2] = zPos;

      initPos[i * 3] = xPos;
      initPos[i * 3 + 1] = yPos;
      initPos[i * 3 + 2] = zPos;

      spd[i] = 0.002 + r2 * 0.005;
      layers[i] = weight;
    }
    return [pos, initPos, spd, layers];
  }, [count]);

  // Procedural soft circular dust particle texture with gentle radial falloff
  const particleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(240, 246, 255, 0.95)');
    grad.addColorStop(0.28, 'rgba(205, 225, 255, 0.40)');
    grad.addColorStop(0.72, 'rgba(160, 190, 235, 0.06)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || isReducedMotion) return;

    const config = ATMOSPHERE_MODES[atmosphereMode] || ATMOSPHERE_MODES.default;
    const driftMultiplier = config.particleSpeed || 1.0;

    // Active Theory: Particles subtly respond to scroll velocity during transitions
    const scrollProgress = scrollRef.current || 0;
    const deltaScroll = Math.abs(scrollProgress - lastScrollProgress.current);
    lastScrollProgress.current = scrollProgress;
    const targetVelocity = deltaScroll * 50;
    scrollVelocity.current += (targetVelocity - scrollVelocity.current) * 0.12;
    const velocityMultiplier = Math.min(2.0, 1.0 + scrollVelocity.current * 1.2);

    // Continuous slow depth-stratified curved drift
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const arr = positionsAttr.array;
    const t = state.clock.elapsedTime;
    const voidPos = voidWorldPosRef?.current || { x: 2.8, y: 0.5, z: -24.0 };

    for (let i = 0; i < count; i++) {
      const weight = layerWeights[i];
      const spd = speeds[i] * driftMultiplier * velocityMultiplier;
      const prog = t * spd;

      // Depth-stratified organic drifting
      const ix = initialPositions[i * 3];
      const iy = initialPositions[i * 3 + 1];
      const iz = initialPositions[i * 3 + 2];

      const dx = Math.sin(prog * 0.85 + iy * 0.18) * (0.9 * weight);
      const dy = Math.cos(prog * 0.65 + ix * 0.15) * (0.6 * weight);

      // Subtle gravitational orbital curvature around the void center
      const rx = ix - voidPos.x;
      const ry = iy - voidPos.y;
      const rDist = Math.sqrt(rx * rx + ry * ry) + 0.1;
      const curveForce = (0.28 * weight) / (rDist * 0.35 + 1.0);
      const tangentX = (-ry / rDist) * Math.sin(prog * 0.45) * curveForce;
      const tangentY = (rx / rDist) * Math.sin(prog * 0.45) * curveForce;

      arr[i * 3] = ix + dx + tangentX;
      arr[i * 3 + 1] = iy + dy + tangentY;
      arr[i * 3 + 2] = iz;
    }
    positionsAttr.needsUpdate = true;

    // Subtle scroll-reactive vertical descent
    const targetScrollY = scrollProgress * (isProject ? -1.6 : -2.4);
    pointsRef.current.position.y += (targetScrollY - pointsRef.current.position.y) * 0.05;

    // Hyperjump particle acceleration on ENTER transition
    if (introPhase === 'entering') {
      pointsRef.current.position.z += delta * 6.5;
    }

    // Subtly clamped mouse parallax (1-2% visual movement, no large swings)
    if (!isMobile) {
      const mouseSens = isProject ? 0.04 : 0.06;
      const targetMouseX = mouseRef.current.x * mouseSens;
      const targetMouseY = mouseRef.current.y * (mouseSens * 0.7);
      pointsRef.current.position.x += (targetMouseX - pointsRef.current.position.x) * 0.03;
    }

    // Geodesic orbital perturbation when projector pulses
    const pulse = projectorPulseRef?.current || 0;
    if (pulse > 0.02) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const arr = positionsAttr.array;
      const voidPos = voidWorldPosRef?.current || { x: 2.2, y: 0.4, z: -14.0 };

      // Micro disturbance wave expanding through particles
      const waveRadius = 0.5 + (1.0 - pulse) * 7.0;
      for (let i = 0; i < count; i += 3) {
        const px = arr[i * 3];
        const py = arr[i * 3 + 1];
        const pz = arr[i * 3 + 2];
        const dx = px - voidPos.x;
        const dy = py - voidPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const waveDist = Math.abs(dist - waveRadius);
        if (waveDist < 2.0) {
          const force = (1.0 - waveDist / 2.0) * pulse * 0.015;
          arr[i * 3] += (dx / (dist + 0.1)) * force;
          arr[i * 3 + 1] += (dy / (dist + 0.1)) * force;
        }
      }
      positionsAttr.needsUpdate = true;
    }

    // Smooth opacity adjustment reacting to mode
    if (materialRef.current) {
      const targetOpacity = config.particleOpacity || 0.22;
      currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.05;
      materialRef.current.opacity = currentOpacity.current;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={isMobile ? 0.065 : (isProject ? 0.075 : 0.09)}
        map={particleTexture}
        transparent={true}
        opacity={isProject ? 0.16 : 0.22}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

/**
 * SpatialCameraController
 * Cinema camera inside the environment:
 * - Extremely slow organic camera breathing drift
 * - Continuous forward depth progression on scroll into the archive
 * - Strictly clamped 1-2% mouse rotational parallax (no large swings)
 * - Fluid cinematic pass-through during intro entry sequence
 */
function SpatialCameraController({
  mouseRef,
  scrollRef,
  cameraShiftRef,
  introPhase = 'done',
  isReducedMotion,
  isMobile,
  isTablet
}) {
  const enterDollyRef = useRef(0);
  const targetFovRef = useRef(46);
  const enterTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (isReducedMotion) return;

    if (introPhase === 'entering') {
      enterTimeRef.current += delta;
      const et = enterTimeRef.current;
      const timingScale = isMobile ? 0.80 : (isTablet ? 0.90 : 1.0);
      const travelScale = isMobile ? 0.78 : (isTablet ? 0.88 : 1.0);

      const easeInOut = (p) => p * p * (3 - 2 * p);
      const easeOut = (p) => p * (2 - p);

      if (et < 0.50 * timingScale) {
        enterDollyRef.current = 0;
        targetFovRef.current = 46;
      } else if (et < 1.00 * timingScale) {
        const prog = (et - 0.50 * timingScale) / (0.50 * timingScale);
        const eased = easeInOut(prog);
        enterDollyRef.current = (eased * 1.0) * travelScale;
        targetFovRef.current = 46 + eased * 1.0;
      } else if (et < 1.50 * timingScale) {
        const prog = (et - 1.00 * timingScale) / (0.50 * timingScale);
        enterDollyRef.current = (1.0 + prog * 1.4) * travelScale;
        targetFovRef.current = 47 + prog * 2.0;
      } else if (et < 2.00 * timingScale) {
        const prog = (et - 1.50 * timingScale) / (0.50 * timingScale);
        enterDollyRef.current = (2.4 + prog * 1.2) * travelScale;
        targetFovRef.current = 49 + prog * 2.0;
      } else if (et < 2.50 * timingScale) {
        const prog = (et - 2.00 * timingScale) / (0.50 * timingScale);
        const surge = prog * prog * 0.35 + prog * 0.65;
        enterDollyRef.current = (3.6 + surge * 1.05) * travelScale;
        targetFovRef.current = isMobile ? (49 + prog * 2.0) : (51 + prog * 2.0);
      } else if (et < 2.90 * timingScale) {
        const prog = (et - 2.50 * timingScale) / (0.40 * timingScale);
        enterDollyRef.current = (4.65 + prog * 1.0) * travelScale;
        targetFovRef.current = (isMobile ? 51 : 53) - prog * 5.0;
      } else if (et < 3.20 * timingScale) {
        const prog = (et - 2.90 * timingScale) / (0.30 * timingScale);
        const decel = easeOut(prog);
        enterDollyRef.current = (5.65 + decel * 0.45) * travelScale;
        targetFovRef.current = 48 - decel * 2.0;
      } else {
        enterDollyRef.current = 6.10 * travelScale;
        targetFovRef.current = 46;
      }
    } else if (introPhase === 'done') {
      enterDollyRef.current = Math.max(0, enterDollyRef.current - delta * 5.0);
      targetFovRef.current = 46;
      enterTimeRef.current = 0;
    } else {
      enterDollyRef.current = 0;
      targetFovRef.current = 46;
      enterTimeRef.current = 0;
    }

    if (Math.abs(state.camera.fov - targetFovRef.current) > 0.05) {
      state.camera.fov += (targetFovRef.current - state.camera.fov) * Math.min(1.0, delta * 4.0);
      state.camera.updateProjectionMatrix();
    }

    const scrollProgress = scrollRef.current || 0;
    const damp = introPhase === 'entering' ? Math.min(1.0, delta * 14.0) : Math.min(1.0, delta * 3.5);

    // Slow organic camera breathing (cinema camera feel)
    const t = state.clock.elapsedTime;
    const isIntro = introPhase === 'initializing' || introPhase === 'ready';
    const isEntering = introPhase === 'entering';
    const organicDriftX = !isMobile ? Math.sin(t * 0.12) * 0.08 : 0;
    const organicDriftY = !isMobile ? Math.cos(t * 0.09) * 0.06 : 0;

    const enterElevation = isEntering ? (isMobile ? 0.45 : 0.25) : 0;

    // 1. Forward depth dolly into archive colonnade with scroll (Z from 5.0 down towards 2.0)
    const targetZ = 5.0 - scrollProgress * 3.0 - enterDollyRef.current + (cameraShiftRef.current?.z || 0);

    // 2. Vertical elevation tracking: gentle descent with scroll
    const targetY = isEntering ? enterElevation : (-scrollProgress * 1.25 + (cameraShiftRef.current?.y || 0) + organicDriftY);

    // 3. Subtle lateral sway on scroll
    const lateralSway = Math.sin(scrollProgress * Math.PI * 2.5) * 0.16;
    const targetX = isEntering ? 0 : (lateralSway + (cameraShiftRef.current?.x || 0) + organicDriftX);

    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp;

    // 4. Subtle camera rotational tilt: CLAMPED to 1–2% visual movement
    if (!isMobile) {
      const rotX = isEntering ? 0 : (-mouseRef.current.y * 0.010);
      const rotY = isEntering ? 0 : (mouseRef.current.x * 0.014);
      state.camera.rotation.x += (rotX - state.camera.rotation.x) * damp;
      state.camera.rotation.y += (rotY - state.camera.rotation.y) * damp;
    }
  });

  return null;
}

/**
 * Global Cinematic Scene: Exactly ONE WebGL world mounted fixed across the portfolio
 * Strictly respects pointer-events: none and handles graceful fallback.
 */
export default function GlobalCinematicScene({ isProject = false }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const cameraShiftRef = useRef({ x: 0, y: 0, z: 0 });
  const [atmosphereMode, setAtmosphereMode] = useState('intro');
  const [introPhase, setIntroPhase] = useState('initializing');
  const [isCoreHovered, setIsCoreHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [videoEnvState, setVideoEnvState] = useState(VIDEO_ENVIRONMENT_STATES.LOADING);

  // Gravitational Void World Coordinates: Located in deep space behind right installation
  const voidWorldPosRef = useRef(new THREE.Vector3(2.8, 0.5, -24.0));
  const voidScreenPosRef = useRef(new THREE.Vector2(0.35, 0.08));

  // Projector Activation Pulse (0.0 to 1.0)
  const projectorPulseRef = useRef(0.0);
  const targetProjectorPulse = useRef(0.0);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const checkDevice = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollRef.current = calculateCinematicTimeline(window.scrollY);
    };

    const handleAtmosphereEvent = (e) => {
      if (e.detail && typeof e.detail === 'string') {
        setAtmosphereMode(e.detail);
      }
    };

    const handleCameraShiftEvent = (e) => {
      if (e.detail) {
        cameraShiftRef.current = {
          x: e.detail.x || 0,
          y: e.detail.y || 0,
          z: e.detail.z || 0
        };
      }
    };

    const handleIntroEvent = (e) => {
      if (e.detail) {
        if (e.detail.phase) setIntroPhase(e.detail.phase);
        if (typeof e.detail.isHovered === 'boolean') setIsCoreHovered(e.detail.isHovered);
      }
    };

    // Requirement 14: Listen to projector-state activation sequence
    const handleProjectorState = (e) => {
      if (!e.detail) return;
      const { isProjected, phase } = e.detail;
      if (isProjected) {
        if (phase === 'waking' || phase === 'energy-build') {
          targetProjectorPulse.current = 0.40;
        } else if (phase === 'emerging') {
          targetProjectorPulse.current = 0.75;
        } else if (phase === 'projected') {
          targetProjectorPulse.current = 0.35;
        } else if (phase === 'settling') {
          targetProjectorPulse.current = 0.12;
        } else if (phase === 'active') {
          targetProjectorPulse.current = 0.0;
        }
      } else {
        targetProjectorPulse.current = 0.0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('atmosphere-mode', handleAtmosphereEvent);
    window.addEventListener('camera-shift', handleCameraShiftEvent);
    window.addEventListener('intro-state', handleIntroEvent);
    window.addEventListener('projector-state', handleProjectorState);

    // Pulse damping interval
    const pulseInterval = setInterval(() => {
      projectorPulseRef.current += (targetProjectorPulse.current - projectorPulseRef.current) * 0.15;
    }, 32);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('atmosphere-mode', handleAtmosphereEvent);
      window.removeEventListener('camera-shift', handleCameraShiftEvent);
      window.removeEventListener('intro-state', handleIntroEvent);
      window.removeEventListener('projector-state', handleProjectorState);
      clearInterval(pulseInterval);
    };
  }, []);

  const currentAtmosphere = ATMOSPHERE_MODES[atmosphereMode] || ATMOSPHERE_MODES.default;

  return (
    <div
      className="global-cinematic-environment-root"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {/* 1. Primary Environment: Native Scroll-Scrubbed HTML5 Cinematic Video */}
      <ScrollScrubbedCinematicVideo
        videoSrc="/gemini_generated_video_9efe4bc0.mp4"
        atmosphereMode={atmosphereMode}
        onStateChange={setVideoEnvState}
        isReducedMotion={isReducedMotion}
      />

      {/* 2. Visually Coherent WebGL Archive Fallback: Active immediately, fades to 0 when video is ready */}
      <div
        className="global-cinematic-webgl-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: videoEnvState === VIDEO_ENVIRONMENT_STATES.READY ? 0 : 1.0,
          visibility: videoEnvState === VIDEO_ENVIRONMENT_STATES.READY ? 'hidden' : 'visible',
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 1.2s'
        }}
      >
        <WebGLErrorBoundary fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 46 }}
            dpr={[1, isMobile ? 1 : 1.5]}
            gl={{
              antialias: false,
              powerPreference: 'high-performance',
              alpha: true,
              stencil: false,
              depth: false
            }}
          >
            {/* 1. Cinematic Camera with Mass, Drift & Clamped Mouse Tilt */}
            <SpatialCameraController
              mouseRef={mouseRef}
              scrollRef={scrollRef}
              cameraShiftRef={cameraShiftRef}
              introPhase={introPhase}
              isReducedMotion={isReducedMotion}
              isMobile={isMobile}
              isTablet={isTablet}
            />

            {/* 1b. Gravitational Center Synchronizer: Seamless geodesic and lensing shift across chambers */}
            <GravitationalCenterSync
              atmosphereMode={atmosphereMode}
              voidWorldPosRef={voidWorldPosRef}
              voidScreenPosRef={voidScreenPosRef}
              isReducedMotion={isReducedMotion}
            />

            {/* 2. Gravitational Void Deep Space Backdrop with Lensing & Curved Light (NO mouse spotlight) */}
            <GravitationalVoidBackdrop
              atmosphereConfig={currentAtmosphere}
              isReducedMotion={isReducedMotion}
              isMobile={isMobile}
              projectorPulseRef={projectorPulseRef}
              voidScreenPosRef={voidScreenPosRef}
            />

            {/* 3. Infinite Archive Monolithic Architecture in Depth (-4.5 to -30 Z) */}
            <InfiniteArchiveArchitecture
              atmosphereMode={atmosphereMode}
              scrollRef={scrollRef}
              isMobile={isMobile}
              isTablet={isTablet}
              isReducedMotion={isReducedMotion}
              projectorPulseRef={projectorPulseRef}
              voidWorldPosRef={voidWorldPosRef}
            />

            {/* 4. Stratified Suspended Atmospheric Particles with Geodesic Deflection */}
            <GravitationalAtmosphericParticles
              count={isMobile ? (isProject ? 16 : 24) : (isProject ? 36 : 72)}
              mouseRef={mouseRef}
              scrollRef={scrollRef}
              atmosphereMode={atmosphereMode}
              introPhase={introPhase}
              isReducedMotion={isReducedMotion}
              isMobile={isMobile}
              isProject={isProject}
              projectorPulseRef={projectorPulseRef}
              voidWorldPosRef={voidWorldPosRef}
            />

            {/* 5. Computational Core during Intro (Unmounted once entered) */}
            {introPhase !== 'done' && (
              <ComputationalCore3D
                phase={introPhase}
                isHovered={isCoreHovered}
                mouseRef={mouseRef}
                isReducedMotion={isReducedMotion}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}
          </Canvas>
        </WebGLErrorBoundary>
      </div>
    </div>
  );
}
