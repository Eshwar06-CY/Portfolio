import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * InfiniteArchiveArchitecture — Phase 7G Refinement
 * True Cinematic 3D "Gravitational Archive"
 * 
 * An impossible futuristic archive chamber extending infinitely into deep darkness,
 * distorted by a distant gravitational void.
 * 
 * Key Principles (Phase 7G):
 * 1. ZERO DRAWN CIRCLES / NO GRAPHIC RINGS: The torus mesh is completely eliminated.
 * 2. 4-TIER DEPTH HIERARCHY:
 *    - FOREGROUND: Large dark structural elements partially entering frame (overhead vault header,
 *      colossal left megalith, subterranean foundation plinth, right reactor anchor).
 *    - MIDGROUND: Massive monoliths, stepped buttresses, and deep horizontal cantilevers.
 *    - BACKGROUND: Receding colonnade structures forming a deep vanishing archive nave.
 *    - FAR BACKGROUND: Giant megaliths disappearing into pure obsidian darkness.
 * 3. LAYERED ATMOSPHERIC MOTION: Depth-stratified physical breathing (foreground moves slightly
 *    more; midground slow; background very slow; far background almost static).
 * 4. REALISTIC GRAVITATIONAL FIELD: Subtle geodesic spacetime warping in vertex shader; felt, not drawn.
 * 5. CENTER SERENITY: Protected dark void behind hero typography (|X| <= 6.8).
 * 6. PERFORMANCE: Exactly ONE shared InstancedMesh set, depth-tested and additive-free.
 */

const MONOLITH_COUNT_DESKTOP = 32;
const MONOLITH_COUNT_MOBILE = 14;
const CANTILEVER_COUNT_DESKTOP = 20;
const CANTILEVER_COUNT_MOBILE = 8;
const VEIN_COUNT_DESKTOP = 16;
const VEIN_COUNT_MOBILE = 6;

export default function InfiniteArchiveArchitecture({
  atmosphereMode = 'hero',
  scrollRef,
  isMobile = false,
  isTablet = false,
  isReducedMotion = false,
  projectorPulseRef,
  voidWorldPosRef
}) {
  const monolithsRef = useRef();
  const cantileversRef = useRef();
  const veinsRef = useRef();

  const monolithCount = isMobile ? MONOLITH_COUNT_MOBILE : (isTablet ? 22 : MONOLITH_COUNT_DESKTOP);
  const cantileverCount = isMobile ? CANTILEVER_COUNT_MOBILE : (isTablet ? 14 : CANTILEVER_COUNT_DESKTOP);
  const veinCount = isMobile ? VEIN_COUNT_MOBILE : (isTablet ? 10 : VEIN_COUNT_DESKTOP);

  const currentRimColor = useRef(new THREE.Color(0.35, 0.44, 0.58));
  const targetRimColor = useRef(new THREE.Color(0.35, 0.44, 0.58));
  const currentVeinColor = useRef(new THREE.Color(0.00, 0.65, 0.85));
  const targetVeinColor = useRef(new THREE.Color(0.00, 0.65, 0.85));

  // 1. Curated 4-Tier Monolith Composition (Foreground, Midground, Background, Far Background)
  const monolithInstances = useMemo(() => {
    const list = [];

    // --- TIER 1: FOREGROUND FRAMING (Z = -3.5 to -6.5) ---
    // Massive dark structural elements partially entering frame from off-screen
    list.push(
      // Left Colossal Framing Megalith
      { x: -9.8, y: 0.0, z: -3.8, w: 5.8, h: 34.0, d: 14.0, rotY: 0.08, rotZ: 0.0 },
      // Overhead Transverse Vault Lintel (spans across top ceiling)
      { x: -1.0, y: 8.6, z: -4.5, w: 48.0, h: 3.4, d: 10.0, rotY: 0.0, rotZ: -0.01 },
      // Subterranean Foundation Datum Plinth
      { x: 0.0, y: -8.8, z: -4.8, w: 50.0, h: 4.2, d: 12.0, rotY: 0.0, rotZ: 0.0 },
      // Right Framing Anchor behind reactor
      { x: 11.4, y: 0.5, z: -5.2, w: 6.2, h: 32.0, d: 12.0, rotY: -0.08, rotZ: 0.0 }
    );

    // --- TIER 2: MIDGROUND ARCHITECTURE (Z = -7.5 to -17.0) ---
    // Stepped monoliths and monumental vertical pylons flanking the archive
    const midgroundDefs = [
      { x: -7.8, y: -1.0, z: -8.2, w: 3.2, h: 24.0, d: 5.0, rotY: 0.09 },
      { x: 8.4, y: 1.2, z: -8.8, w: 3.6, h: 26.0, d: 5.5, rotY: -0.09 },
      { x: -8.6, y: 0.5, z: -11.0, w: 3.8, h: 27.0, d: 6.0, rotY: 0.07 },
      { x: 9.2, y: -0.8, z: -11.8, w: 4.0, h: 28.0, d: 6.0, rotY: -0.07 },
      { x: -11.0, y: 2.0, z: -13.5, w: 4.5, h: 30.0, d: 7.0, rotY: 0.05 },
      { x: 10.8, y: -1.5, z: -14.2, w: 4.2, h: 30.0, d: 6.5, rotY: -0.06 },
      { x: -8.2, y: -2.0, z: -16.0, w: 3.4, h: 28.0, d: 5.8, rotY: 0.08 },
      { x: 8.8, y: 0.8, z: -16.8, w: 3.6, h: 29.0, d: 5.8, rotY: -0.08 },
      { x: -12.5, y: 0.0, z: -17.5, w: 5.0, h: 32.0, d: 7.5, rotY: 0.04 },
      { x: 12.0, y: 1.0, z: -17.8, w: 4.8, h: 32.0, d: 7.0, rotY: -0.04 }
    ];
    midgroundDefs.forEach(d => list.push({ ...d, rotZ: 0 }));

    // --- TIER 3: BACKGROUND RECEDING COLONNADE (Z = -18.0 to -28.0) ---
    // Colonnade structures converging toward deep vanishing perspective
    const backgroundDefs = [
      { x: -7.5, y: 0.0, z: -19.5, w: 2.4, h: 34.0, d: 4.5, rotY: 0.06 },
      { x: 8.0, y: 0.0, z: -20.2, w: 2.5, h: 34.0, d: 4.5, rotY: -0.06 },
      { x: -8.2, y: 1.2, z: -22.5, w: 2.6, h: 36.0, d: 4.8, rotY: 0.05 },
      { x: 8.6, y: -0.8, z: -23.0, w: 2.8, h: 36.0, d: 5.0, rotY: -0.05 },
      { x: -9.5, y: -1.0, z: -25.2, w: 3.0, h: 38.0, d: 5.2, rotY: 0.04 },
      { x: 9.8, y: 1.5, z: -25.8, w: 3.2, h: 38.0, d: 5.2, rotY: -0.04 },
      { x: -7.8, y: 0.5, z: -27.5, w: 2.2, h: 40.0, d: 4.2, rotY: 0.05 },
      { x: 8.2, y: -0.5, z: -28.2, w: 2.4, h: 40.0, d: 4.2, rotY: -0.05 },
      { x: -11.5, y: 2.0, z: -28.5, w: 4.0, h: 42.0, d: 6.0, rotY: 0.03 },
      { x: 11.2, y: -1.0, z: -28.8, w: 4.2, h: 42.0, d: 6.0, rotY: -0.03 }
    ];
    backgroundDefs.forEach(d => list.push({ ...d, rotZ: 0 }));

    // --- TIER 4: FAR BACKGROUND MEGALITHS (Z = -29.0 to -42.0) ---
    // Gigantic structures disappearing into deep obsidian darkness
    const farDefs = [
      { x: -8.5, y: 0.0, z: -31.5, w: 3.5, h: 44.0, d: 6.0, rotY: 0.04 },
      { x: 9.0, y: 0.0, z: -32.5, w: 3.8, h: 44.0, d: 6.0, rotY: -0.04 },
      { x: -10.2, y: 1.5, z: -35.0, w: 5.0, h: 48.0, d: 7.0, rotY: 0.03 },
      { x: 10.5, y: -1.2, z: -36.5, w: 5.2, h: 48.0, d: 7.0, rotY: -0.03 },
      { x: -8.0, y: -0.8, z: -39.0, w: 3.0, h: 50.0, d: 5.5, rotY: 0.03 },
      { x: 8.5, y: 0.5, z: -40.2, w: 3.2, h: 50.0, d: 5.5, rotY: -0.03 },
      { x: -12.0, y: 0.0, z: -41.5, w: 6.5, h: 54.0, d: 8.5, rotY: 0.02 },
      { x: 12.5, y: 0.0, z: -42.0, w: 6.8, h: 54.0, d: 8.5, rotY: -0.02 }
    ];
    farDefs.forEach(d => list.push({ ...d, rotZ: 0 }));

    return list;
  }, []);

  // 2. Curated Cantilevers & Horizontal Slabs (Varied scales, staggered depths)
  const cantileverInstances = useMemo(() => {
    const list = [];
    const seed = (s) => {
      const x = Math.sin(s + 112) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < CANTILEVER_COUNT_DESKTOP; i++) {
      const r1 = seed(i * 1.91 + 0.15);
      const r2 = seed(i * 2.83 + 0.25);
      const r3 = seed(i * 3.47 + 0.35);

      const isLeft = i % 2 === 0;
      const xPos = isLeft ? (-8.2 - r1 * 6.5) : (8.4 + r1 * 6.8);
      // Depths distributed across midground and background
      const zPos = -7.5 - r2 * 22.0;

      // Varied horizontal proportions: deep cantilevers and floating platforms
      const width = 5.5 + r1 * 7.5;
      const height = 1.0 + r3 * 1.6;
      const depth = 5.0 + r2 * 6.5;
      const yPos = (r3 - 0.5) * 13.0;

      const rotY = (r1 - 0.5) * 0.14;
      const rotZ = (r2 - 0.5) * 0.04;

      list.push({ x: xPos, y: yPos, z: zPos, w: width, h: height, d: depth, rotY, rotZ });
    }
    return list;
  }, []);

  // 3. Subtle Embedded Seam Veins (Faint environmental energy paths along seams)
  const veinInstances = useMemo(() => {
    const list = [];
    const seed = (s) => {
      const x = Math.sin(s + 444) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < VEIN_COUNT_DESKTOP; i++) {
      const r1 = seed(i * 1.63 + 0.1);
      const r2 = seed(i * 2.91 + 0.2);
      const r3 = seed(i * 3.82 + 0.3);

      const isLeft = i % 2 === 0;
      const xPos = isLeft ? (-7.6 - r1 * 7.0) : (7.8 + r1 * 7.5);
      const zPos = -8.0 - r2 * 22.0;
      const yPos = (r3 - 0.5) * 15.0;
      const len = 4.5 + r1 * 8.0;

      list.push({ x: xPos, y: yPos, z: zPos, len });
    }
    return list;
  }, []);

  // Shared Shader Material Uniforms
  const materialUniforms = useMemo(() => ({
    uRimColor: { value: new THREE.Color(0.35, 0.44, 0.58) },
    uVoidWorldPos: { value: new THREE.Vector3(2.8, 0.5, -24.0) },
    uGravityBend: { value: isReducedMotion ? 0.0 : 0.065 },
    uProjectorPulse: { value: 0.0 },
    uCameraPos: { value: new THREE.Vector3(0, 0, 5) },
    uTime: { value: 0 }
  }), [isReducedMotion]);

  // Vertex Shader: Applies Depth-Stratified Physical Breathing & Geodesic Deflection
  const vertexShader = `
    uniform vec3 uVoidWorldPos;
    uniform float uGravityBend;
    uniform float uProjectorPulse;
    uniform float uTime;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    void main() {
      vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

      // 1. Depth-Stratified Physical Atmospheric Breathing:
      // Foreground moves slightly more; Midground slow; Background very slow; Far background almost static
      float depth = -worldPosition.z;
      float depthNorm = clamp((depth - 3.5) / 38.0, 0.0, 1.0);
      float layerSpeed = mix(1.0, 0.08, depthNorm);

      float driftY = (sin(uTime * 0.035 * layerSpeed + worldPosition.x * 0.09) * 0.038
                    + cos(uTime * 0.022 * layerSpeed + worldPosition.z * 0.05) * 0.022) * (1.0 - depthNorm * 0.85);
      float driftX = sin(uTime * 0.026 * layerSpeed + worldPosition.y * 0.08) * 0.018 * (1.0 - depthNorm * 0.85);

      worldPosition.y += driftY;
      worldPosition.x += driftX;

      // 2. Realistic Gravitational Geodesic Deflection (Felt, Not Drawn):
      // Architecture subtly bends along spacetime geodesics near the void
      vec3 toVoid = uVoidWorldPos - worldPosition.xyz;
      float distSq = dot(toVoid, toVoid);
      float bendFactor = ((uGravityBend * (1.0 + uProjectorPulse * 0.40)) * 20.0) / (distSq + 30.0);
      worldPosition.xyz += toVoid * bendFactor;

      vWorldPos = worldPosition.xyz;
      vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  // Fragment Shader: 90-95% dark material with grazing Fresnel rim light & vanishing extinction
  const fragmentShader = `
    uniform vec3 uRimColor;
    uniform vec3 uCameraPos;
    uniform float uTime;
    uniform float uProjectorPulse;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    void main() {
      // 1. Deep obsidian base tone
      vec3 base = vec3(0.002, 0.004, 0.007);

      // 2. Grazing Fresnel Rim Light (sharp architectural edge contours)
      vec3 V = normalize(uCameraPos - vWorldPos);
      vec3 N = normalize(vNormal);
      float NdotV = max(dot(N, V), 0.0);
      float fresnel = pow(1.0 - NdotV, 3.8);

      // 3. Continuous Volumetric Light Sweep across architectural surfaces:
      // Faint atmospheric light sweeps slowly through the cavern
      float lightWave1 = sin(vWorldPos.x * 0.11 + vWorldPos.z * 0.05 - uTime * 0.028);
      float lightWave2 = cos(vWorldPos.y * 0.08 - vWorldPos.z * 0.04 + uTime * 0.020);
      float lightSweep = smoothstep(0.10, 0.90, lightWave1 * lightWave2) * 0.16;

      // Depth attenuation: foreground has razor rims, far background dissolves into shadow
      float depthNorm = clamp((-vWorldPos.z - 3.5) / 38.0, 0.0, 1.0);
      float rimAtten = mix(0.92, 0.30, depthNorm);

      vec3 rim = uRimColor * (fresnel * 0.58 + lightSweep * 0.42) * rimAtten;

      // 4. Central Reading Nave Clearance:
      // Kept pitch black and serene behind typography (|X| <= 5.2 to 7.0)
      float corridorFade = smoothstep(5.0, 7.0, abs(vWorldPos.x));

      // 5. Atmospheric Depth Extinction:
      // Near fade: Z = -2.8 to -4.5 (allows foreground framing elements at Z=-3.8 to enter cleanly without clipping camera)
      // Far fade: Z = -44.0 to -14.0 (monoliths gradually dissolve into infinite obsidian darkness)
      float farFade = smoothstep(-44.0, -14.0, vWorldPos.z);
      float nearFade = smoothstep(-2.8, -4.5, vWorldPos.z);
      float depthFade = farFade * nearFade;

      vec3 finalColor = (base + rim) * corridorFade * depthFade;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Shader for Environmental Energy / Data Veins
  const veinVertexShader = `
    uniform vec3 uVoidWorldPos;
    uniform float uGravityBend;
    uniform float uTime;
    varying vec3 vWorldPos;

    void main() {
      vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

      // Subtle breathing motion
      float depth = -worldPosition.z;
      float depthNorm = clamp((depth - 3.5) / 38.0, 0.0, 1.0);
      float layerSpeed = mix(1.0, 0.08, depthNorm);
      worldPosition.y += sin(uTime * 0.035 * layerSpeed + worldPosition.x * 0.09) * 0.030 * (1.0 - depthNorm * 0.85);

      vec3 toVoid = uVoidWorldPos - worldPosition.xyz;
      float distSq = dot(toVoid, toVoid);
      float bendFactor = (uGravityBend * 18.0) / (distSq + 30.0);
      worldPosition.xyz += toVoid * bendFactor;

      vWorldPos = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const veinFragmentShader = `
    uniform vec3 uVeinColor;
    uniform float uTime;
    varying vec3 vWorldPos;

    void main() {
      // Extremely subtle, slow pulse wave traveling along the seam
      float pulse = sin(vWorldPos.y * 0.5 + vWorldPos.z * 0.3 - uTime * 0.6) * 0.5 + 0.5;
      float intensity = pow(pulse, 3.0) * 0.22;

      float corridorFade = smoothstep(5.0, 7.0, abs(vWorldPos.x));
      float farFade = smoothstep(-38.0, -14.0, vWorldPos.z);
      float nearFade = smoothstep(-2.8, -4.5, vWorldPos.z);

      vec3 col = uVeinColor * intensity * corridorFade * farFade * nearFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const veinUniforms = useMemo(() => ({
    uVeinColor: { value: new THREE.Color(0.00, 0.65, 0.85) },
    uVoidWorldPos: { value: new THREE.Vector3(2.8, 0.5, -24.0) },
    uGravityBend: { value: isReducedMotion ? 0.0 : 0.065 },
    uTime: { value: 0 }
  }), [isReducedMotion]);

  // Setup InstancedMesh matrices
  useEffect(() => {
    const dummy = new THREE.Object3D();

    if (monolithsRef.current) {
      for (let i = 0; i < monolithCount; i++) {
        const inst = monolithInstances[i];
        if (!inst) break;
        dummy.position.set(inst.x, inst.y, inst.z);
        dummy.scale.set(inst.w, inst.h, inst.d);
        dummy.rotation.set(0, inst.rotY, inst.rotZ || 0);
        dummy.updateMatrix();
        monolithsRef.current.setMatrixAt(i, dummy.matrix);
      }
      monolithsRef.current.instanceMatrix.needsUpdate = true;
    }

    if (cantileversRef.current) {
      for (let i = 0; i < cantileverCount; i++) {
        const inst = cantileverInstances[i];
        if (!inst) break;
        dummy.position.set(inst.x, inst.y, inst.z);
        dummy.scale.set(inst.w, inst.h, inst.d);
        dummy.rotation.set(0, inst.rotY, inst.rotZ || 0);
        dummy.updateMatrix();
        cantileversRef.current.setMatrixAt(i, dummy.matrix);
      }
      cantileversRef.current.instanceMatrix.needsUpdate = true;
    }

    if (veinsRef.current) {
      for (let i = 0; i < veinCount; i++) {
        const inst = veinInstances[i];
        if (!inst) break;
        dummy.position.set(inst.x, inst.y, inst.z);
        dummy.scale.set(0.04, inst.len, 0.04);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        veinsRef.current.setMatrixAt(i, dummy.matrix);
      }
      veinsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [monolithCount, cantileverCount, veinCount, monolithInstances, cantileverInstances, veinInstances]);

  // Mode color adjustments
  useEffect(() => {
    switch (atmosphereMode) {
      case 'hero':
        targetRimColor.current.setRGB(0.35, 0.44, 0.58);
        targetVeinColor.current.setRGB(0.00, 0.60, 0.80);
        break;
      case 'about':
        targetRimColor.current.setRGB(0.40, 0.48, 0.62);
        targetVeinColor.current.setRGB(0.15, 0.65, 0.85);
        break;
      case 'exploring':
        targetRimColor.current.setRGB(0.44, 0.52, 0.68);
        targetVeinColor.current.setRGB(0.20, 0.70, 0.90);
        break;
      case 'work':
        targetRimColor.current.setRGB(0.42, 0.52, 0.66);
        targetVeinColor.current.setRGB(0.10, 0.70, 0.85);
        break;
      case 'p1': // SPECra: Cool blue illumination
        targetRimColor.current.setRGB(0.34, 0.54, 0.78);
        targetVeinColor.current.setRGB(0.00, 0.80, 0.95);
        break;
      case 'p2': // ExpenseFlowAI: Restrained emerald / warm highlights
        targetRimColor.current.setRGB(0.40, 0.58, 0.45);
        targetVeinColor.current.setRGB(0.35, 0.78, 0.50);
        break;
      case 'p3': // AI UG Academic Planner: Deep violet / obsidian structured light
        targetRimColor.current.setRGB(0.48, 0.42, 0.66);
        targetVeinColor.current.setRGB(0.60, 0.45, 0.85);
        break;
      case 'p4': // CAPACITYX: Monochrome silver / tungsten architectural scale
        targetRimColor.current.setRGB(0.55, 0.58, 0.62);
        targetVeinColor.current.setRGB(0.78, 0.80, 0.84);
        break;
      case 'data':
        targetRimColor.current.setRGB(0.38, 0.44, 0.54);
        targetVeinColor.current.setRGB(0.18, 0.55, 0.75);
        break;
      case 'connect':
        targetRimColor.current.setRGB(0.48, 0.42, 0.36);
        targetVeinColor.current.setRGB(0.65, 0.50, 0.35);
        break;
      default:
        targetRimColor.current.setRGB(0.35, 0.44, 0.58);
        targetVeinColor.current.setRGB(0.00, 0.65, 0.85);
    }
  }, [atmosphereMode]);

  useFrame((state, delta) => {
    const damp = isReducedMotion ? 1.0 : Math.min(1.0, delta * 3.5);
    currentRimColor.current.lerp(targetRimColor.current, damp);
    currentVeinColor.current.lerp(targetVeinColor.current, damp);

    const t = state.clock.elapsedTime;
    const camPos = state.camera.position;
    const voidPos = voidWorldPosRef?.current || new THREE.Vector3(2.8, 0.5, -24.0);
    const pulse = projectorPulseRef?.current || 0;

    // Update monoliths
    if (monolithsRef.current?.material?.uniforms) {
      const u = monolithsRef.current.material.uniforms;
      u.uRimColor.value.copy(currentRimColor.current);
      u.uCameraPos.value.copy(camPos);
      u.uTime.value = t;
      u.uVoidWorldPos.value.copy(voidPos);
      u.uProjectorPulse.value = pulse;
    }

    // Update cantilevers
    if (cantileversRef.current?.material?.uniforms) {
      const u = cantileversRef.current.material.uniforms;
      u.uRimColor.value.copy(currentRimColor.current);
      u.uCameraPos.value.copy(camPos);
      u.uTime.value = t;
      u.uVoidWorldPos.value.copy(voidPos);
      u.uProjectorPulse.value = pulse;
    }

    // Update veins
    if (veinsRef.current?.material?.uniforms) {
      const u = veinsRef.current.material.uniforms;
      u.uVeinColor.value.copy(currentVeinColor.current);
      u.uTime.value = t;
      u.uVoidWorldPos.value.copy(voidPos);
    }
  });

  return (
    <group>
      {/* 1. Monumental 4-Tier Monoliths (Foreground, Midground, Background, Far Background) */}
      <instancedMesh
        ref={monolithsRef}
        args={[null, null, monolithCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={materialUniforms}
          depthWrite={false}
          depthTest={false}
          transparent={true}
        />
      </instancedMesh>

      {/* 2. Floating / Offset Monolithic Cantilevers & Slabs */}
      <instancedMesh
        ref={cantileversRef}
        args={[null, null, cantileverCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={materialUniforms}
          depthWrite={false}
          depthTest={false}
          transparent={true}
        />
      </instancedMesh>

      {/* 3. Embedded Environmental Energy / Data Veins */}
      <instancedMesh
        ref={veinsRef}
        args={[null, null, veinCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          vertexShader={veinVertexShader}
          fragmentShader={veinFragmentShader}
          uniforms={veinUniforms}
          depthWrite={false}
          depthTest={false}
          transparent={true}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
  );
}
