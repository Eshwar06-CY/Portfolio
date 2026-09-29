import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * ScrollScrubbedCinematicVideo — Phase 8 Hybrid Scroll-Directed Cinematic Playback System
 * 
 * Architecture:
 * - PRIMARY ENVIRONMENT: 40-second continuous cinematic video (/gemini_generated_video_9efe4bc0.mp4)
 * - SCROLL = selects and transitions between cinematic scene zones.
 * - VIDEO TIME = keeps the scene alive by continuously playing when stationary.
 * - SEAMLESS DISSOLVE LOOPING: When an active scene reaches its end boundary, an offscreen/overlay
 *   canvas captures the departing frame and cross-dissolves it over ~380ms into the loop-entry frame.
 *   Zero frame jump, zero black frames, zero camera snap.
 * 
 * Cinematic Scene Zone Map (40s footage):
 * - HERO:            1.0s –  8.0s (loop: 1.2s – 7.8s)  Deep monolithic void & floating particles
 * - ABOUT:           8.0s – 13.0s (loop: 8.2s – 12.8s) Forward tracking into architectural light
 * - EXPLORING:      13.0s – 18.0s (loop: 13.2s – 17.8s) Celestial halo & spatial perspective
 * - SELECTED WORK:  18.0s – 28.0s (loop: 18.5s – 27.8s) Gravitational light streams & portal
 * - EXPERIENCE:     28.0s – 33.0s (loop: 28.2s – 32.8s) Structured colonnade with suspended dust
 * - EXPERTISE:      33.0s – 36.0s (loop: 33.2s – 35.8s) Architectural monolithic pillars
 * - CONTACT:        36.0s – 39.8s (loop: 36.2s – 39.6s) Deep obsidian corridor & final destination
 */

export const VIDEO_ENVIRONMENT_STATES = {
  LOADING: 'VIDEO_LOADING',
  READY: 'VIDEO_READY',
  ERROR: 'VIDEO_ERROR',
  FALLBACK: 'FALLBACK'
};

export const CINEMATIC_SCENES = [
  { id: 'hero', name: 'HERO', start: 1.0, end: 8.0, loopStart: 1.2, loopEnd: 7.8 },
  { id: 'about', name: 'ABOUT', start: 8.0, end: 13.0, loopStart: 8.2, loopEnd: 12.8 },
  { id: 'exploring', name: 'EXPLORING', start: 13.0, end: 18.0, loopStart: 13.2, loopEnd: 17.8 },
  { id: 'work', name: 'SELECTED WORK', start: 18.0, end: 28.0, loopStart: 18.5, loopEnd: 27.8 },
  { id: 'experience', name: 'EXPERIENCE', start: 28.0, end: 33.0, loopStart: 28.2, loopEnd: 32.8 },
  { id: 'expertise', name: 'EXPERTISE', start: 33.0, end: 36.0, loopStart: 33.2, loopEnd: 35.8 },
  { id: 'contact', name: 'CONTACT', start: 36.0, end: 39.8, loopStart: 36.2, loopEnd: 39.6 }
];

/**
 * Measure DOM section top offsets robustly from the document.
 */
export function measureSceneOffsets() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return [0, 800, 1600, 2600, 5200, 6800, 8000, 9200];
  }

  const scrollY = window.scrollY || 0;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  const getTop = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return Math.max(0, rect.top + scrollY);
  };

  const yHero = 0;
  const yAboutRaw = getTop('about');
  const yExploringRaw = getTop('exploring');
  const yWorkRaw = getTop('work');
  const yExpRaw = getTop('experience');
  const ySkillRaw = getTop('expertise');
  const yContactRaw = getTop('contact');

  const yAbout = yAboutRaw ?? (maxScroll * 0.14);
  const yExploring = yExploringRaw ?? (maxScroll * 0.26);
  const yWork = yWorkRaw ?? (maxScroll * 0.38);
  const yExp = yExpRaw ?? (maxScroll * 0.66);
  const ySkill = ySkillRaw ?? (maxScroll * 0.78);
  const yContact = yContactRaw ?? (maxScroll * 0.89);

  const offsets = [yHero];
  offsets[1] = Math.max(offsets[0] + 10, yAbout);
  offsets[2] = Math.max(offsets[1] + 10, yExploring);
  offsets[3] = Math.max(offsets[2] + 10, yWork);
  offsets[4] = Math.max(offsets[3] + 10, yExp);
  offsets[5] = Math.max(offsets[4] + 10, ySkill);
  offsets[6] = Math.max(offsets[5] + 10, yContact);
  offsets[7] = Math.max(offsets[6] + 10, maxScroll);

  return offsets;
}

/**
 * Calculate the active scene index and target playback time from scroll offset.
 */
export function getSceneFromScroll(scrollY, offsets) {
  const maxOffset = offsets[7];
  if (scrollY <= 0) return { sceneIndex: 0, targetTime: CINEMATIC_SCENES[0].start };
  if (scrollY >= maxOffset) return { sceneIndex: 6, targetTime: CINEMATIC_SCENES[6].start };

  for (let i = 0; i < 7; i++) {
    const yA = offsets[i];
    const yB = offsets[i + 1];
    if (scrollY >= yA && scrollY <= yB) {
      const segT = (scrollY - yA) / Math.max(1, yB - yA);
      const tA = CINEMATIC_SCENES[i].start;
      const tNext = i < 6 ? CINEMATIC_SCENES[i + 1].start : CINEMATIC_SCENES[i].end;
      const targetTime = tA + segT * (tNext - tA);
      return { sceneIndex: segT > 0.55 && i < 6 ? i + 1 : i, targetTime };
    }
  }

  return { sceneIndex: 0, targetTime: CINEMATIC_SCENES[0].start };
}

/**
 * Calculates continuous normalized timeline progress (0.00 to 1.00) for fallback WebGL camera.
 */
export function calculateCinematicTimeline(scrollY, cachedOffsets) {
  const offsets = cachedOffsets || measureSceneOffsets();
  const maxOffset = offsets[7];
  if (scrollY <= 0) return 0.00;
  if (scrollY >= maxOffset) return 1.00;

  for (let i = 0; i < 7; i++) {
    const yA = offsets[i];
    const yB = offsets[i + 1];
    if (scrollY >= yA && scrollY <= yB) {
      const segT = (scrollY - yA) / Math.max(1, yB - yA);
      return (i + segT) / 7;
    }
  }

  return Math.max(0, Math.min(1, scrollY / maxOffset));
}

export default function ScrollScrubbedCinematicVideo({
  videoSrc = '/gemini_generated_video_9efe4bc0.mp4',
  atmosphereMode = 'hero',
  onStateChange,
  isReducedMotion = false
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isTransitioningLoopRef = useRef(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastSeekTimeRef = useRef(0);
  const cachedOffsetsRef = useRef(measureSceneOffsets());
  const activeSceneIndexRef = useRef(0);

  const [envState, setEnvState] = useState(VIDEO_ENVIRONMENT_STATES.LOADING);

  const updateState = useCallback((newState) => {
    setEnvState(newState);
    if (onStateChange) {
      onStateChange(newState);
    }
  }, [onStateChange]);

  // 1. Maintain cached chapter scroll offsets across resizes & DOM layout updates
  useEffect(() => {
    const refreshOffsets = () => {
      cachedOffsetsRef.current = measureSceneOffsets();
    };

    refreshOffsets();
    const t1 = setTimeout(refreshOffsets, 400);
    const t2 = setTimeout(refreshOffsets, 1500);

    window.addEventListener('resize', refreshOffsets, { passive: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', refreshOffsets);
    };
  }, []);

  // 2. Video Initialization & Autoplay Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    updateState(VIDEO_ENVIRONMENT_STATES.LOADING);

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        updateState(VIDEO_ENVIRONMENT_STATES.READY);
        const { sceneIndex, targetTime } = getSceneFromScroll(window.scrollY || 0, cachedOffsetsRef.current);
        activeSceneIndexRef.current = sceneIndex;
        video.currentTime = Math.max(1.0, targetTime);
        if (!isReducedMotion) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Browser may require user gesture on first interaction; handled when user clicks ENTER
            });
          }
        }
      }
    };

    const handleError = () => {
      updateState(VIDEO_ENVIRONMENT_STATES.ERROR);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    if (video.readyState >= 1 && video.duration > 0) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc, isReducedMotion, updateState]);

  // 3. Invisible Cross-Dissolve Looping Function
  const triggerInvisibleLoop = useCallback((targetTime, duration = 380) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || isTransitioningLoopRef.current) return;

    isTransitioningLoopRef.current = true;

    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.opacity = '1';
        canvas.style.transition = 'none';

        // Seek video underneath to loop start
        video.currentTime = targetTime;

        // Ensure playback continues smoothly
        if (video.paused) {
          video.play().catch(() => {});
        }

        // Cross-dissolve canvas snapshot out to reveal seamlessly continuing video
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            canvas.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
            canvas.style.opacity = '0';
            setTimeout(() => {
              isTransitioningLoopRef.current = false;
            }, duration + 50);
          });
        });
      } else {
        video.currentTime = targetTime;
        isTransitioningLoopRef.current = false;
      }
    } catch {
      video.currentTime = targetTime;
      isTransitioningLoopRef.current = false;
    }
  }, []);

  // 4. Hybrid Playback & Scroll Coordination Loop
  useEffect(() => {
    if (envState !== VIDEO_ENVIRONMENT_STATES.READY) return;
    const video = videoRef.current;
    if (!video) return;

    let isRunning = true;

    const playbackLoop = () => {
      if (!isRunning) return;

      const currentScene = CINEMATIC_SCENES[activeSceneIndexRef.current] || CINEMATIC_SCENES[0];
      const curTime = video.currentTime || 0;

      if (!isScrollingRef.current) {
        // --- STATIONARY MODE: VIDEO KEEPS PLAYING & LOOPS INVISIBLY ---
        if (!isReducedMotion && video.paused) {
          video.play().catch(() => {});
        }

        // Loop check: if approaching or exceeding active scene boundary
        if (!isTransitioningLoopRef.current && curTime >= currentScene.loopEnd) {
          triggerInvisibleLoop(currentScene.loopStart, 420);
        }
      } else {
        // --- SCROLLING MODE: SMOOTHLY SCRUB / TRANSITION BETWEEN SCENES ---
        const scrollY = window.scrollY || 0;
        const { sceneIndex, targetTime } = getSceneFromScroll(scrollY, cachedOffsetsRef.current);
        activeSceneIndexRef.current = sceneIndex;

        const timeDiff = targetTime - curTime;
        const now = performance.now();

        // Only scrub if there is a noticeable delta (> 0.09s) and rate-limit seeks to ~32ms
        if (Math.abs(timeDiff) > 0.09 && (now - lastSeekTimeRef.current > 32)) {
          lastSeekTimeRef.current = now;
          if (typeof video.fastSeek === 'function') {
            try {
              video.fastSeek(targetTime);
            } catch {
              video.currentTime = targetTime;
            }
          } else {
            video.currentTime = targetTime;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(playbackLoop);
    };

    rafIdRef.current = requestAnimationFrame(playbackLoop);

    // Scroll Listener with Debounced Settle into Continuous Playback
    const handleScroll = () => {
      isScrollingRef.current = true;

      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        if (!isRunning || !video) return;

        // Settle active scene
        const scrollY = window.scrollY || 0;
        const { sceneIndex } = getSceneFromScroll(scrollY, cachedOffsetsRef.current);
        activeSceneIndexRef.current = sceneIndex;
        const scene = CINEMATIC_SCENES[sceneIndex];

        // If current time is outside the active scene window, align smoothly
        const cTime = video.currentTime || 0;
        if (cTime < scene.start - 0.2 || cTime > scene.end + 0.2) {
          video.currentTime = scene.start;
        }

        // Continue playing forward immediately!
        if (!isReducedMotion) {
          video.play().catch(() => {});
        }
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      isRunning = false;
      clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [envState, isReducedMotion, triggerInvisibleLoop]);

  // 5. Subtle Project Atmosphere Tint
  const atmosphereGradient = useMemo(() => {
    switch (atmosphereMode) {
      case 'p1': // SPECra: Cool navy / technical blue
        return 'radial-gradient(circle at 65% 45%, rgba(14, 28, 56, 0.18) 0%, rgba(2, 6, 14, 0.02) 60%, transparent 100%)';
      case 'p2': // ExpenseFlowAI: Restrained emerald / warm slate
        return 'radial-gradient(circle at 35% 55%, rgba(12, 34, 22, 0.16) 0%, rgba(2, 8, 4, 0.02) 60%, transparent 100%)';
      case 'p3': // AI UG Academic Planner: Deep violet / obsidian structured light
        return 'radial-gradient(circle at 50% 50%, rgba(32, 16, 48, 0.17) 0%, rgba(6, 2, 10, 0.02) 60%, transparent 100%)';
      case 'p4': // CAPACITYX: Restrained monochrome tungsten & architectural scale
        return 'radial-gradient(circle at 40% 40%, rgba(36, 38, 42, 0.16) 0%, rgba(8, 8, 10, 0.02) 60%, transparent 100%)';
      case 'about': // About: Neutral cold slate opening up
        return 'radial-gradient(circle at 45% 45%, rgba(18, 24, 34, 0.12) 0%, rgba(4, 6, 10, 0.02) 65%, transparent 100%)';
      case 'exploring': // Exploring: Spatial depth & subtle distant illumination
        return 'radial-gradient(circle at 50% 50%, rgba(22, 30, 46, 0.14) 0%, rgba(6, 8, 14, 0.02) 65%, transparent 100%)';
      case 'data': // Experience & Expertise: Quieter archive corridor
        return 'radial-gradient(circle at 50% 50%, rgba(16, 18, 24, 0.12) 0%, rgba(4, 4, 6, 0.02) 70%, transparent 100%)';
      case 'connect': // Contact: Deep darkness, restrained final frame
        return 'radial-gradient(circle at 50% 45%, rgba(10, 10, 16, 0.18) 0%, rgba(2, 2, 4, 0.04) 65%, transparent 100%)';
      default: // Hero / Arrival: Dark near-black obsidian void
        return 'radial-gradient(circle at 65% 45%, rgba(10, 16, 28, 0.08) 0%, transparent 70%)';
    }
  }, [atmosphereMode]);

  const isReady = envState === VIDEO_ENVIRONMENT_STATES.READY;

  return (
    <div
      className="scroll-scrubbed-video-layer"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: isReady ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      aria-hidden="true"
    >
      {/* 1. Primary Native HTML5 Video Element with Subtle Corner Concealment Scale */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: 'scale(1.025)',
          transformOrigin: '50% 50%'
        }}
      />

      {/* 2. Invisible Cross-Dissolve Looping Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
          opacity: 0,
          transform: 'scale(1.025)',
          transformOrigin: '50% 50%',
          zIndex: 2
        }}
      />

      {/* 3. Subtle Project-Specific Atmosphere Tint */}
      <div
        className="video-project-atmosphere-tint"
        style={{
          position: 'absolute',
          inset: 0,
          background: atmosphereGradient,
          pointerEvents: 'none',
          zIndex: 3,
          transition: 'background 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* 4. Subtle Filmic Vignette & Reading Zone Contrast Shield */}
      <div
        className="video-cinematic-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(2, 4, 7, 0.08) 0%, rgba(2, 4, 7, 0.32) 70%, rgba(1, 2, 4, 0.68) 100%)',
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* 5. Left Typography Protection Shield */}
      <div
        className="video-reading-zone-shield"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(2, 4, 7, 0.42) 0%, rgba(2, 4, 7, 0.16) 45%, rgba(2, 4, 7, 0.0) 70%)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* 6. Part C: Subtle Bottom-Right Corner Softening Shield (Conceals any faint corner artifacts) */}
      <div
        className="video-corner-shield"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '280px',
          height: '160px',
          background: 'radial-gradient(circle at 100% 100%, rgba(2, 4, 7, 0.88) 0%, rgba(2, 4, 7, 0.35) 45%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 6
        }}
      />
    </div>
  );
}
