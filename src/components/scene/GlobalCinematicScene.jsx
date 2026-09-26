import React, { useRef, useMemo, useEffect, useState, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ComputationalCore3D from './ComputationalCore3D';

/**
 * Atmospheric color and intensity presets by section mode
 * Colors are restrained, cinematic film tones (desaturated slate, amber, iris, tungsten)
 * NEVER garish, cyberpunk, or gaming neon.
 */
const ATMOSPHERE_MODES = {
  intro: {
    baseColor: [0.003, 0.004, 0.007],       // near-black void
    glowColor: [0.45, 0.65, 0.95],          // electric cyan-steel
    glowIntensity: 0.70,
    particleOpacity: 0.35,
    particleSpeed: 0.85
  },
  hero: {
    baseColor: [0.010, 0.012, 0.018],       // deep studio charcoal
    glowColor: [0.72, 0.80, 0.94],          // cool studio key light
    glowIntensity: 0.85,
    particleOpacity: 0.30,
    particleSpeed: 1.15
  },
  about: {
    baseColor: [0.008, 0.009, 0.014],       // subdued, calmer
    glowColor: [0.64, 0.68, 0.76],          // neutral slate
    glowIntensity: 0.58,
    particleOpacity: 0.20,
    particleSpeed: 0.72
  },
  exploring: {
    baseColor: [0.010, 0.012, 0.020],       // spatial movement
    glowColor: [0.68, 0.74, 0.85],
    glowIntensity: 0.70,
    particleOpacity: 0.26,
    particleSpeed: 0.88
  },
  work: {
    baseColor: [0.009, 0.011, 0.016],       // focused studio stage
    glowColor: [0.74, 0.78, 0.88],
    glowIntensity: 0.78,
    particleOpacity: 0.28,
    particleSpeed: 0.85
  },
  p1: { // 01 SPECra (Precision AI Analytics / Architecture)
    baseColor: [0.008, 0.016, 0.024],       // cool cyan-slate tint
    glowColor: [0.55, 0.74, 0.90],
    glowIntensity: 0.92,
    particleOpacity: 0.34,
    particleSpeed: 0.85
  },
  p2: { // 02 ExpenseFlowAI (Dynamic Fintech Flow)
    baseColor: [0.018, 0.014, 0.009],       // warm champagne-amber tint
    glowColor: [0.86, 0.75, 0.58],
    glowIntensity: 0.90,
    particleOpacity: 0.34,
    particleSpeed: 1.10
  },
  p3: { // 03 AI UG Academic Planner (Neural Graphs / Knowledge)
    baseColor: [0.015, 0.011, 0.022],       // muted iris/violet tint
    glowColor: [0.68, 0.65, 0.90],
    glowIntensity: 0.88,
    particleOpacity: 0.32,
    particleSpeed: 0.88
  },
  p4: { // 04 CAPACITYX (Tungsten Systems Architecture)
    baseColor: [0.012, 0.013, 0.016],       // crisp monochrome tungsten
    glowColor: [0.80, 0.82, 0.86],
    glowIntensity: 0.85,
    particleOpacity: 0.28,
    particleSpeed: 0.95
  },
  data: { // Experience & Leadership
    baseColor: [0.009, 0.011, 0.016],
    glowColor: [0.64, 0.68, 0.76],
    glowIntensity: 0.66,
    particleOpacity: 0.24,
    particleSpeed: 0.72
  },
  connect: { // 05 Connect / Final Statement
    baseColor: [0.014, 0.012, 0.010],       // soft warm fade
    glowColor: [0.80, 0.76, 0.70],
    glowIntensity: 0.55,
    particleOpacity: 0.18,
    particleSpeed: 0.58
  },
  default: {
    baseColor: [0.010, 0.012, 0.018],
    glowColor: [0.70, 0.74, 0.84],
    glowIntensity: 0.75,
    particleOpacity: 0.26,
    particleSpeed: 0.90
  }
};

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
 * Far Atmospheric Backdrop Plane (z = -9.2)
 * Renders a smooth dark studio illumination falloff that tracks the smoothed key light.
 * Includes subtle filmic dithering to prevent 8-bit banding on dark gradients.
 */
function AtmosphericBackdropPlane({ mouseRef, scrollRef, atmosphereMode = 'default', isReducedMotion }) {
  const meshRef = useRef();
  const { viewport } = useThree();

  // Lerped state containers to avoid re-renders
  const currentBaseColor = useRef(new THREE.Color(...ATMOSPHERE_MODES.default.baseColor));
  const targetBaseColor = useRef(new THREE.Color(...ATMOSPHERE_MODES.default.baseColor));
  const currentGlowColor = useRef(new THREE.Color(...ATMOSPHERE_MODES.default.glowColor));
  const targetGlowColor = useRef(new THREE.Color(...ATMOSPHERE_MODES.default.glowColor));
  const currentGlowIntensity = useRef(ATMOSPHERE_MODES.default.glowIntensity);
  const targetGlowIntensity = useRef(ATMOSPHERE_MODES.default.glowIntensity);
  const currentLightPos = useRef(new THREE.Vector2(0, 0));

  const shaderUniforms = useMemo(() => ({
    uBaseColor: { value: new THREE.Color(...ATMOSPHERE_MODES.default.baseColor) },
    uGlowColor: { value: new THREE.Color(...ATMOSPHERE_MODES.default.glowColor) },
    uGlowIntensity: { value: ATMOSPHERE_MODES.default.glowIntensity },
    uLightPos: { value: new THREE.Vector2(0, 0) },
    uAspect: { value: viewport.aspect },
    uTime: { value: 0 }
  }), []);

  useEffect(() => {
    const config = ATMOSPHERE_MODES[atmosphereMode] || ATMOSPHERE_MODES.default;
    targetBaseColor.current.setRGB(...config.baseColor);
    targetGlowColor.current.setRGB(...config.glowColor);
    targetGlowIntensity.current = config.glowIntensity;
  }, [atmosphereMode]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Damping factor for smooth 60 FPS transitions
    const dampFactor = isReducedMotion ? 1.0 : Math.min(1.0, delta * 3.2);

    currentBaseColor.current.lerp(targetBaseColor.current, dampFactor);
    currentGlowColor.current.lerp(targetGlowColor.current, dampFactor);
    currentGlowIntensity.current += (targetGlowIntensity.current - currentGlowIntensity.current) * dampFactor;

    // Smoothly track normalized mouse coordinates for key light illumination
    const targetX = mouseRef.current.x * 0.45;
    const targetY = mouseRef.current.y * 0.38 - (scrollRef.current || 0) * 0.15;
    currentLightPos.current.x += (targetX - currentLightPos.current.x) * dampFactor;
    currentLightPos.current.y += (targetY - currentLightPos.current.y) * dampFactor;

    const uniforms = meshRef.current.material.uniforms;
    uniforms.uBaseColor.value.copy(currentBaseColor.current);
    uniforms.uGlowColor.value.copy(currentGlowColor.current);
    uniforms.uGlowIntensity.value = currentGlowIntensity.current;
    uniforms.uLightPos.value.copy(currentLightPos.current);
    uniforms.uAspect.value = state.viewport.aspect;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uGlowColor;
    uniform float uGlowIntensity;
    uniform vec2 uLightPos;
    uniform float uAspect;
    uniform float uTime;
    varying vec2 vUv;

    // High quality pseudo-random dither
    float ditherNoise(vec2 coord) {
      return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uAspect;

      vec2 light = uLightPos;
      light.x *= uAspect;

      // Distance to moving studio key light
      float dist = length(uv - light);

      // Studio key light falloff: broad, restrained, soft
      float glow = exp(-dist * 1.15) * uGlowIntensity;

      // Dark edge vignette to preserve deep black borders
      float vignette = smoothstep(2.0, 0.45, length(uv * vec2(0.9, 1.15)));

      // Subtle blend from almost-black base into soft key illumination
      vec3 finalColor = mix(uBaseColor, uGlowColor, glow * 0.42);
      finalColor *= vignette;

      // Filmic dither prevents 8-bit color banding
      float dither = (ditherNoise(vUv * 800.0 + fract(uTime)) - 0.5) * (1.2 / 255.0);
      finalColor += dither;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Sized to comfortably fill the camera frustum at z = -9.2
  return (
    <mesh ref={meshRef} position={[0, 0, -9.2]}>
      <planeGeometry args={[26, 20]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={shaderUniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/**
 * Stratified Multi-Plane Suspended Atmospheric Particles
 * Stratified into far, mid, and near layers for palpable 3D depth and parallax.
 * Uses procedural soft radial dust texture generated on canvas.
 */
function StratifiedAtmosphericParticles({
  count = 90,
  mouseRef,
  scrollRef,
  atmosphereMode = 'default',
  introPhase = 'done',
  isReducedMotion,
  isMobile,
  isProject = false
}) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const currentOpacity = useRef(0.26);
  const lastScrollProgress = useRef(0);
  const scrollVelocity = useRef(0);

  // Generate particle buffer data stratified across 3 depth planes
  const [positions, speeds, baseSizes, layerWeights] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const sz = new Float32Array(count);
    const layers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const layerRand = Math.random();
      let zPos, size, weight;

      if (layerRand < 0.40) {
        // Far layer: z in [-7.5, -4.0], smaller size, slow drift
        zPos = -4.0 - Math.random() * 3.5;
        size = 0.055 + Math.random() * 0.025;
        weight = 0.25;
      } else if (layerRand < 0.80) {
        // Mid layer: z in [-4.0, -1.0], medium size, balanced drift
        zPos = -1.0 - Math.random() * 3.0;
        size = 0.080 + Math.random() * 0.035;
        weight = 0.60;
      } else {
        // Foreground detail: z in [-1.0, +1.2], larger size, pronounced parallax
        zPos = -1.0 + Math.random() * 2.2;
        size = 0.105 + Math.random() * 0.045;
        weight = 1.00;
      }

      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = zPos;

      spd[i] = 0.003 + Math.random() * 0.006;
      sz[i] = size;
      layers[i] = weight;
    }
    return [pos, spd, sz, layers];
  }, [count]);

  // Procedural soft circular dust particle texture with gentle radial falloff
  const particleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(242, 248, 255, 0.95)');
    grad.addColorStop(0.28, 'rgba(215, 232, 255, 0.42)');
    grad.addColorStop(0.72, 'rgba(170, 198, 240, 0.07)');
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
    const targetVelocity = deltaScroll * 60;
    scrollVelocity.current += (targetVelocity - scrollVelocity.current) * 0.12;
    const velocityMultiplier = Math.min(2.2, 1.0 + scrollVelocity.current * 1.4);

    // Slow ambient rotation drift with velocity multiplier
    const baseSpeed = isProject ? 0.003 : 0.006;
    const speed = baseSpeed * driftMultiplier * velocityMultiplier;
    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x += delta * (speed * 0.45);

    // Subtle scroll-reactive vertical descent
    const targetScrollY = scrollProgress * (isProject ? -1.8 : -2.8);
    pointsRef.current.position.y += (targetScrollY - pointsRef.current.position.y) * 0.05;

    // Hyperjump particle acceleration on ENTER transition
    if (introPhase === 'entering' && !isReducedMotion) {
      pointsRef.current.position.z += delta * 6.5;
    }

    // Smooth response to normalized mouse coordinates (clamped on mobile)
    if (!isMobile) {
      const mouseSensitivity = isProject ? 0.07 : 0.16;
      const targetMouseX = mouseRef.current.x * mouseSensitivity;
      const targetMouseY = mouseRef.current.y * (mouseSensitivity * 0.7);
      pointsRef.current.position.x += (targetMouseX - pointsRef.current.position.x) * 0.035;
    }

    // Smooth opacity adjustment reacting to mode
    if (materialRef.current) {
      const targetOpacity = config.particleOpacity || 0.26;
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
        size={isMobile ? 0.075 : (isProject ? 0.08 : 0.095)}
        map={particleTexture}
        transparent={true}
        opacity={isProject ? 0.18 : 0.26}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

/**
 * Spatial Camera Controller
 * Provides restrained cinematic dolly, elevation descent, subtle architectural lateral wave,
 * and smoothed mouse rotational tilt.
 */
function SpatialCameraController({ mouseRef, scrollRef, cameraShiftRef, introPhase = 'done', isReducedMotion, isMobile }) {
  const enterDollyRef = useRef(0);
  const targetFovRef = useRef(46);
  const enterTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (isReducedMotion) return;

    if (introPhase === 'entering') {
      enterTimeRef.current += delta;
      const et = enterTimeRef.current;

      // 0.00 – 0.70s: Anticipation holding, subtle preparation
      if (et < 0.70) {
        enterDollyRef.current += delta * 0.35;
        targetFovRef.current = 46;
      }
      // 0.70 – 1.00s: Camera begins moving toward the core
      else if (et < 1.00) {
        enterDollyRef.current += delta * 4.5;
        targetFovRef.current = 49;
      }
      // 1.00 – 1.60s: Camera enters & passes THROUGH the computational core
      else if (et < 1.60) {
        enterDollyRef.current += delta * (isMobile ? 6.0 : 8.5);
        targetFovRef.current = isMobile ? 50 : 54;
      }
      // 1.60 – 1.80s: Beyond the core into controlled darkness
      else {
        enterDollyRef.current += delta * 2.5;
        targetFovRef.current = 46;
      }
    } else if (introPhase === 'done') {
      enterDollyRef.current = Math.max(0, enterDollyRef.current - delta * 4.5);
      targetFovRef.current = 46;
      enterTimeRef.current = 0;
    } else {
      enterDollyRef.current = 0;
      targetFovRef.current = 46;
      enterTimeRef.current = 0;
    }

    // Dynamic FOV distortion during camera push-through
    if (Math.abs(state.camera.fov - targetFovRef.current) > 0.05) {
      state.camera.fov += (targetFovRef.current - state.camera.fov) * Math.min(1.0, delta * 3.5);
      state.camera.updateProjectionMatrix();
    }

    const scrollProgress = scrollRef.current || 0;
    const damp = Math.min(1.0, delta * 3.5);

    // 1. Forward depth dolly: passes through the core on enter, settling gracefully on hero
    const targetZ = 5.0 - scrollProgress * 0.75 - enterDollyRef.current;

    // 2. Vertical elevation tracking: gradual descent with scroll
    const targetY = -scrollProgress * 1.35 + (cameraShiftRef.current?.y || 0);

    // 3. Lateral architectural wave: subtle breathing wave through section transitions
    const lateralArchitecturalWave = Math.sin(scrollProgress * Math.PI * 3.0) * 0.20;
    const targetX = lateralArchitecturalWave + (cameraShiftRef.current?.x || 0);

    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp;

    // 4. Subtle camera rotational tilt reacting to mouse position (disabled on mobile)
    if (!isMobile) {
      const rotX = -mouseRef.current.y * 0.018;
      const rotY = mouseRef.current.x * 0.024;
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
  const cameraShiftRef = useRef({ x: 0, y: 0 });
  const [atmosphereMode, setAtmosphereMode] = useState('intro');
  const [introPhase, setIntroPhase] = useState('initializing');
  const [isCoreHovered, setIsCoreHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollRef.current = window.scrollY / totalScroll;
      }
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
          y: e.detail.y || 0
        };
      }
    };

    const handleIntroEvent = (e) => {
      if (e.detail) {
        if (e.detail.phase) setIntroPhase(e.detail.phase);
        if (typeof e.detail.isHovered === 'boolean') setIsCoreHovered(e.detail.isHovered);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('atmosphere-mode', handleAtmosphereEvent);
    window.addEventListener('camera-shift', handleCameraShiftEvent);
    window.addEventListener('intro-state', handleIntroEvent);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('atmosphere-mode', handleAtmosphereEvent);
      window.removeEventListener('camera-shift', handleCameraShiftEvent);
      window.removeEventListener('intro-state', handleIntroEvent);
    };
  }, []);

  return (
    <div
      className="global-cinematic-webgl-canvas"
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
          <SpatialCameraController
            mouseRef={mouseRef}
            scrollRef={scrollRef}
            cameraShiftRef={cameraShiftRef}
            introPhase={introPhase}
            isReducedMotion={isReducedMotion}
            isMobile={isMobile}
          />
          <AtmosphericBackdropPlane
            mouseRef={mouseRef}
            scrollRef={scrollRef}
            atmosphereMode={atmosphereMode}
            isReducedMotion={isReducedMotion}
          />
          <StratifiedAtmosphericParticles
            count={isMobile ? (isProject ? 18 : 28) : (isProject ? 42 : 88)}
            mouseRef={mouseRef}
            scrollRef={scrollRef}
            atmosphereMode={atmosphereMode}
            introPhase={introPhase}
            isReducedMotion={isReducedMotion}
            isMobile={isMobile}
            isProject={isProject}
          />
          {introPhase !== 'done' && (
            <ComputationalCore3D
              phase={introPhase}
              isHovered={isCoreHovered}
              mouseRef={mouseRef}
              isReducedMotion={isReducedMotion}
              isMobile={isMobile}
            />
          )}
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

