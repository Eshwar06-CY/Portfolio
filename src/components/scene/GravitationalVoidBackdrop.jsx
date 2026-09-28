import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GravitationalVoidBackdrop — Phase 7G Refinement
 * 
 * Deep Space Cinematic Gravitational Distortion & Volumetric Atmosphere.
 * 
 * Key Principles (Phase 7G):
 * 1. ZERO DRAWN CIRCLES / NO GRAPHIC RINGS: Gravitational field is felt through
 *    curved light, space deflection, and atmospheric warping, NOT drawn as an arc.
 * 2. CINEMATIC DARK FOG: Charcoal, blue-black, and graphite volumetric haze that
 *    drifts continuously with heavy, majestic motion.
 * 3. DISTANT ENVIRONMENTAL LIGHT: Subdued, architectural light leaks moving across
 *    distant surfaces at extremely low brightness.
 * 4. CENTER SERENITY: Protected dark void behind hero typography.
 * 5. HIGH-FIDELITY DITHERING: Eliminates banding on deep 95% dark gradients.
 */

export default function GravitationalVoidBackdrop({
  atmosphereConfig,
  isReducedMotion = false,
  isMobile = false,
  projectorPulseRef,
  voidScreenPosRef
}) {
  const meshRef = useRef();
  const { viewport } = useThree();

  const currentBaseColor = useRef(new THREE.Color(0.002, 0.004, 0.007));
  const targetBaseColor = useRef(new THREE.Color(0.002, 0.004, 0.007));
  const currentGlowColor = useRef(new THREE.Color(0.32, 0.42, 0.54));
  const targetGlowColor = useRef(new THREE.Color(0.32, 0.42, 0.54));
  const currentGlowIntensity = useRef(0.32);
  const targetGlowIntensity = useRef(0.32);

  // Void center in normalized coordinates: deep space behind right installation
  const voidCenter = useRef(new THREE.Vector2(0.35, 0.08));

  const shaderUniforms = useMemo(() => ({
    uBaseColor: { value: new THREE.Color(0.002, 0.004, 0.007) },
    uGlowColor: { value: new THREE.Color(0.32, 0.42, 0.54) },
    uGlowIntensity: { value: 0.32 },
    uVoidCenter: { value: new THREE.Vector2(0.35, 0.08) },
    uGravityStrength: { value: isReducedMotion ? 0.0 : (isMobile ? 0.045 : 0.075) },
    uProjectorPulse: { value: 0.0 },
    uAspect: { value: viewport.aspect },
    uTime: { value: 0 }
  }), [isReducedMotion, isMobile]);

  useEffect(() => {
    if (atmosphereConfig) {
      targetBaseColor.current.setRGB(...atmosphereConfig.baseColor);
      targetGlowColor.current.setRGB(...atmosphereConfig.glowColor);
      targetGlowIntensity.current = atmosphereConfig.glowIntensity * 0.65;
    }
  }, [atmosphereConfig]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const damp = isReducedMotion ? 1.0 : Math.min(1.0, delta * 3.0);

    currentBaseColor.current.lerp(targetBaseColor.current, damp);
    currentGlowColor.current.lerp(targetGlowColor.current, damp);
    currentGlowIntensity.current += (targetGlowIntensity.current - currentGlowIntensity.current) * damp;

    if (voidScreenPosRef && voidScreenPosRef.current) {
      voidCenter.current.lerp(voidScreenPosRef.current, damp * 0.6);
    }

    const mat = meshRef.current.material;
    const u = mat.uniforms;
    u.uBaseColor.value.copy(currentBaseColor.current);
    u.uGlowColor.value.copy(currentGlowColor.current);
    u.uGlowIntensity.value = currentGlowIntensity.current;
    u.uVoidCenter.value.copy(voidCenter.current);
    u.uAspect.value = state.viewport.aspect;
    u.uTime.value = state.clock.elapsedTime;

    if (projectorPulseRef) {
      u.uProjectorPulse.value = projectorPulseRef.current || 0;
    }
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
    uniform vec2 uVoidCenter;
    uniform float uGravityStrength;
    uniform float uProjectorPulse;
    uniform float uAspect;
    uniform float uTime;
    varying vec2 vUv;

    // High quality pseudo-random dither
    float ditherNoise(vec2 coord) {
      return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      // Aspect-corrected normalized coordinates
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uAspect;

      vec2 center = uVoidCenter;
      center.x *= uAspect;

      vec2 delta = uv - center;
      float dist = length(delta);

      // 1. Relativistic Spacetime Lensing (Felt, Not Drawn):
      // Smooth coordinate deflection around the gravitational singularity
      // No drawn circle/ring: light paths and atmosphere gently bend
      float pulseMult = 1.0 + uProjectorPulse * 0.45;
      float lens = (uGravityStrength * pulseMult) / (pow(dist, 1.35) + 0.38);
      vec2 warpedUv = uv - normalize(delta) * lens * 0.18;

      // 2. Cinematic Volumetric Atmospheric Fog (Charcoal / Blue-black / Graphite):
      // Extremely slow, majestic drifting haze that reveals spatial depth
      float t = uTime * 0.014;
      float fog1 = sin(warpedUv.x * 0.48 + warpedUv.y * 0.72 + t);
      float fog2 = cos(warpedUv.x * 0.82 - warpedUv.y * 0.38 - t * 0.75);
      float fog3 = sin((warpedUv.x + warpedUv.y) * 0.65 + t * 0.45);
      float fogField = smoothstep(-0.35, 0.85, fog1 * fog2 + fog3 * 0.30);
      float fogDensity = fogField * 0.12 * uGlowIntensity;

      // Charcoal / deep steel fog tint
      vec3 fogTone = mix(vec3(0.002, 0.004, 0.008), uGlowColor * 0.30, fogDensity);

      // 3. Distant Architectural Light Leaks:
      // Very faint, occasional light grazing distant surfaces; never looks like UI
      float leak1 = smoothstep(0.92, 0.995, sin(warpedUv.x * 0.35 + warpedUv.y * 0.18 - t * 0.6));
      float leak2 = smoothstep(0.90, 0.992, cos(warpedUv.x * 0.25 - warpedUv.y * 0.45 + t * 0.4));
      float distantLight = (leak1 * 0.038 + leak2 * 0.026) * exp(-dist * 0.75) * uGlowIntensity;

      // 4. Subtle Gravitational Concentration (Pure Soft Falloff - Absolutely NO ring or hard edge):
      // Soft, diffuse presence in deep space
      float diffuseVoidGlow = exp(-dist * 1.5) * 0.055 * uGlowIntensity;

      // 5. Transient Projector Activation Response:
      // Organic dissipation wave in the atmosphere when VIEW PORTRAIT triggers
      float pulseResponse = 0.0;
      if (uProjectorPulse > 0.01) {
        float waveRadius = 0.40 + (1.0 - uProjectorPulse) * 1.8;
        float waveDist = abs(dist - waveRadius);
        pulseResponse = exp(-waveDist * 8.0) * uProjectorPulse * 0.08;
      }

      // 6. Deep Space Color Synthesis (90-95% dark, cold steel/cyan accents)
      vec3 bg = uBaseColor;
      vec3 lightTint = mix(uGlowColor, vec3(0.70, 0.82, 0.95), 0.25);
      vec3 finalColor = bg + fogTone * fogDensity + lightTint * (distantLight + diffuseVoidGlow + pulseResponse);

      // 7. Center & Left Typography Protection (Keep Center Calm):
      // Preserve deep contrast and pitch black behind typography and hero layout
      float centerQuiet = smoothstep(-0.35, 0.65, uv.x); // darker on left where text sits
      finalColor = mix(bg * 0.85, finalColor, mix(0.45, 1.0, centerQuiet));

      // 8. Deep Vignette to preserve pure black boundaries
      float vignette = smoothstep(2.5, 0.45, length(uv * vec2(0.85, 1.15)));
      finalColor *= vignette;

      // 9. Filmic Dithering to eliminate dark banding
      float dither = (ditherNoise(vUv * 800.0 + fract(uTime)) - 0.5) * (1.2 / 255.0);
      finalColor += dither;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 0, -28.0]}>
      <planeGeometry args={[75, 55]} />
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
