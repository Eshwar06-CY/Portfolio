import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Atmospheric Particles reacting to scroll, mouse, and interactive mode
 */
function GlobalAtmosphericParticles({
  count = 120,
  mouseRef,
  scrollRef,
  atmosphereMode = 'default',
  isReducedMotion,
  isProject = false
}) {
  const pointsRef = useRef();
  const materialRef = useRef();

  // Generate depth particles distributed along 3D space
  const [positions, speeds, baseSizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      spd[i] = Math.random() * 0.008 + 0.004;
      sz[i] = Math.random() * 0.04 + 0.07;
    }
    return [pos, spd, sz];
  }, [count]);

  // Soft circular dust particle texture
  const particleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(240, 248, 255, 0.95)');
    grad.addColorStop(0.3, 'rgba(210, 230, 255, 0.45)');
    grad.addColorStop(0.75, 'rgba(165, 195, 240, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || isReducedMotion) return;

    // Mode-specific subtle behavioral adjustments
    let driftMultiplier = 1.0;
    if (atmosphereMode === 'ai' || atmosphereMode === 'p3') driftMultiplier = 1.5;
    if (atmosphereMode === 'data' || atmosphereMode === 'p1') driftMultiplier = 0.7;
    if (atmosphereMode === 'dev' || atmosphereMode === 'p4') driftMultiplier = 1.2;
    if (atmosphereMode === 'p2') driftMultiplier = 1.35;
    if (atmosphereMode === 'p5') driftMultiplier = 0.55;

    // Ambient floating drift
    const baseSpeed = isProject ? 0.003 : 0.007;
    const speed = baseSpeed * driftMultiplier;
    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x += delta * (speed * 0.5);

    // Subtle scroll-reactive vertical movement
    const scrollProgress = scrollRef.current || 0;
    const targetScrollY = scrollProgress * (isProject ? -2.0 : -3.2);
    pointsRef.current.position.y += (targetScrollY - pointsRef.current.position.y) * 0.05;

    // Smooth response to normalized mouse coordinates
    const mouseSensitivity = isProject ? 0.08 : 0.18;
    const targetMouseX = mouseRef.current.x * mouseSensitivity;
    const targetMouseY = mouseRef.current.y * (mouseSensitivity * 0.7);
    pointsRef.current.position.x += (targetMouseX - pointsRef.current.position.x) * 0.03;

    // Lighting progression: as user approaches Contact, atmosphere becomes gently more prominent
    if (materialRef.current && !isProject) {
      const contactBoost = Math.max(0, (scrollProgress - 0.72) / 0.28) * 0.18;
      let targetOpacity = 0.26;
      if (atmosphereMode === 'ai' || atmosphereMode === 'p3') targetOpacity = 0.35;
      else if (atmosphereMode === 'data' || atmosphereMode === 'p1') targetOpacity = 0.32;
      else if (atmosphereMode === 'p2') targetOpacity = 0.28;
      else if (atmosphereMode === 'p4') targetOpacity = 0.30;
      else if (atmosphereMode === 'p5') targetOpacity = 0.22;
      materialRef.current.opacity += ((targetOpacity + contactBoost) - materialRef.current.opacity) * 0.05;
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
        size={isProject ? 0.08 : 0.095}
        map={particleTexture}
        transparent={true}
        opacity={isProject ? 0.16 : 0.26}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

/**
 * Spatial Camera Controller providing physical depth dolly, lateral tracking
 * through architectural spaces, and interactive category focus shifts.
 */
function SpatialCameraController({ mouseRef, scrollRef, cameraShiftRef, isReducedMotion }) {
  useFrame((state) => {
    if (isReducedMotion) return;

    const scrollProgress = scrollRef.current || 0;

    // 1. Forward depth dolly: pulls in from 5.0 to 4.15 as user travels into digital space
    const targetZ = 5.0 - scrollProgress * 0.85;

    // 2. Vertical elevation tracking: smooth descent with scroll
    const targetY = -scrollProgress * 1.5 + (cameraShiftRef.current?.y || 0);

    // 3. Lateral architectural camera tracking:
    // Subtly waves left and right through section transitions + interactive hover offsets
    const lateralArchitecturalWave = Math.sin(scrollProgress * Math.PI * 3.2) * 0.24;
    const targetX = lateralArchitecturalWave + (cameraShiftRef.current?.x || 0);

    state.camera.position.x += (targetX - state.camera.position.x) * 0.035;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.035;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.035;

    // 4. Subtle camera rotational tilt reacting to mouse position
    const rotX = -mouseRef.current.y * 0.022;
    const rotY = mouseRef.current.x * 0.030;
    state.camera.rotation.x += (rotX - state.camera.rotation.x) * 0.035;
    state.camera.rotation.y += (rotY - state.camera.rotation.y) * 0.035;
  });

  return null;
}

export default function GlobalCinematicScene({ isProject = false }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const cameraShiftRef = useRef({ x: 0, y: 0 });
  const [atmosphereMode, setAtmosphereMode] = useState('default');
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
      if (e.detail) {
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('atmosphere-mode', handleAtmosphereEvent);
    window.addEventListener('camera-shift', handleCameraShiftEvent);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('atmosphere-mode', handleAtmosphereEvent);
      window.removeEventListener('camera-shift', handleCameraShiftEvent);
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
      <Canvas
        camera={{ position: [0, 0, 5], fov: 48 }}
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
          isReducedMotion={isReducedMotion}
        />
        <GlobalAtmosphericParticles
          count={isMobile ? (isProject ? 18 : 34) : (isProject ? 48 : 105)}
          mouseRef={mouseRef}
          scrollRef={scrollRef}
          atmosphereMode={atmosphereMode}
          isReducedMotion={isReducedMotion}
          isProject={isProject}
        />
      </Canvas>
    </div>
  );
}
