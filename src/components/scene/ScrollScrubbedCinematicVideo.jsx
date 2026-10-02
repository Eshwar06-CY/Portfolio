import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * ScrollScrubbedCinematicVideo — Phase 9C Section-Based Continuous Cinematic Video Playback System
 * 
 * High-End Architecture:
 * 1. SECTION SCENE MAP:
 *    - HERO:       0.0s –  8.0s (loop: 1.5s – 7.6s,  dur: 6.1s)
 *    - ABOUT:      8.0s – 13.0s (loop: 8.5s – 12.8s, dur: 4.3s)
 *    - EXPLORING: 13.0s – 18.0s (loop: 13.4s – 17.8s, dur: 4.4s)
 *    - WORK:      18.0s – 28.0s (loop: 18.8s – 27.6s, dur: 8.8s)
 *    - EXPERIENCE:28.0s – 33.0s (loop: 28.4s – 32.8s, dur: 4.4s)
 *    - EXPERTISE: 33.0s – 36.0s (loop: 33.2s – 35.8s, dur: 2.6s)
 *    - CONTACT:   36.0s – 39.8s (loop: 36.2s – 39.6s, dur: 3.4s)
 * 
 * 2. DUAL-LAYER ASYMMETRIC SEAMLESS SEEDING:
 *    - Two native HTML5 video elements (Slot A & Slot B).
 *    - Only ONE video decodes/plays at any given time (95%+ of time).
 *    - Loop boundary triggers a subtle 200–250ms crossfade to pre-queued standby video.
 *    - Zero camera snap, zero lighting jump, zero black frames, zero decoder contention.
 * 
 * 3. FAST SCROLL VELOCITY DETECTION:
 *    - Fast scroll (flicking / rapid scroll across multiple sections) skips intermediate scene loops.
 *    - Settles and transitions directly toward the destination section.
 *    - Slow scroll (reading pace) transitions smoothly section by section.
 * 
 * 4. CONTINUOUS STATIONARY PLAYBACK:
 *    - When scrolling stops, the active scene continues playing forward seamlessly.
 *    - Zero pausing, zero frame freezes on scroll stop.
 * 
 * 5. STRICT LOADING ISOLATION:
 *    - While hasEntered === false, the entire video container has opacity 0, visibility hidden,
 *      and both videos are paused, guaranteeing a pure black neural loading experience.
 */

export const VIDEO_ENVIRONMENT_STATES = {
  LOADING: 'VIDEO_LOADING',
  READY: 'VIDEO_READY',
  ERROR: 'VIDEO_ERROR',
  FALLBACK: 'FALLBACK'
};

export const CINEMATIC_SCENES = {
  hero: {
    id: 'hero',
    start: 0.5,
    end: 8.0,
    loopStart: 1.5,
    loopEnd: 7.6
  },
  about: {
    id: 'about',
    start: 8.0,
    end: 13.0,
    loopStart: 8.5,
    loopEnd: 12.8
  },
  exploring: {
    id: 'exploring',
    start: 13.0,
    end: 18.0,
    loopStart: 13.4,
    loopEnd: 17.8
  },
  work: {
    id: 'work',
    start: 18.0,
    end: 28.0,
    loopStart: 18.8,
    loopEnd: 27.6
  },
  experience: {
    id: 'experience',
    start: 28.0,
    end: 33.0,
    loopStart: 28.4,
    loopEnd: 32.8
  },
  expertise: {
    id: 'expertise',
    start: 33.0,
    end: 36.0,
    loopStart: 33.2,
    loopEnd: 35.8
  },
  contact: {
    id: 'contact',
    start: 36.0,
    end: 39.8,
    loopStart: 36.2,
    loopEnd: 39.6
  }
};

export const SCENE_ORDER = ['hero', 'about', 'exploring', 'work', 'experience', 'expertise', 'contact'];

/**
 * Measure DOM section top offsets accurately.
 */
export function measureSceneOffsets() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return [0, 800, 1600, 2600, 5200, 6800, 8000, 9200];
  }

  const scrollY = window.scrollY || 0;
  const vh = window.innerHeight || 800;
  const maxScroll = Math.max(vh * 5, document.documentElement.scrollHeight - vh);

  const getTop = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    return top > 0 ? top : null;
  };

  const yHero = 0;
  const yAbout = getTop('about') ?? vh;
  const yExploring = getTop('exploring') ?? (yAbout + vh * 1.4);
  const yWork = getTop('work') ?? (yExploring + vh * 1.2);
  const yExp = getTop('experience') ?? (yWork + vh * 2.5);
  const ySkill = getTop('expertise') ?? (yExp + vh * 1.5);
  const yContact = getTop('contact') ?? (ySkill + vh * 1.2);

  const offsets = [yHero];
  offsets[1] = Math.max(offsets[0] + 50, yAbout);
  offsets[2] = Math.max(offsets[1] + 50, yExploring);
  offsets[3] = Math.max(offsets[2] + 50, yWork);
  offsets[4] = Math.max(offsets[3] + 50, yExp);
  offsets[5] = Math.max(offsets[4] + 50, ySkill);
  offsets[6] = Math.max(offsets[5] + 50, yContact);
  offsets[7] = Math.max(offsets[6] + 50, maxScroll);

  return offsets;
}

/**
 * Calculate active section from scroll position using comfortable viewport reading trigger.
 */
export function getActiveSectionId(scrollY, offsets) {
  const triggerY = scrollY + (typeof window !== 'undefined' ? window.innerHeight * 0.40 : 400);

  if (triggerY >= offsets[6]) return 'contact';
  if (triggerY >= offsets[5]) return 'expertise';
  if (triggerY >= offsets[4]) return 'experience';
  if (triggerY >= offsets[3]) return 'work';
  if (triggerY >= offsets[2]) return 'exploring';
  if (triggerY >= offsets[1]) return 'about';
  return 'hero';
}

/**
 * Normalized timeline progress (0.00 to 1.00) for fallback WebGL camera.
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
  isReducedMotion = false,
  hasEntered = false
}) {
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const activeSlotRef = useRef('A'); // 'A' | 'B'
  const isTransitioningRef = useRef(false);
  const pendingTargetTimeRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const activeSectionRef = useRef('hero');
  const cachedOffsetsRef = useRef(measureSceneOffsets());

  // Velocity tracking for fast-scroll skipping
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const fastScrollTimerRef = useRef(null);
  const slowScrollTimerRef = useRef(null);

  const rafIdRef = useRef(null);
  const [envState, setEnvState] = useState(VIDEO_ENVIRONMENT_STATES.LOADING);

  const updateState = useCallback((newState) => {
    setEnvState(newState);
    if (onStateChange) {
      onStateChange(newState);
    }
  }, [onStateChange]);

  // 1. Maintain cached chapter scroll offsets across resizes, DOM updates & enter transition
  useEffect(() => {
    const refreshOffsets = () => {
      cachedOffsetsRef.current = measureSceneOffsets();
    };

    refreshOffsets();
    const t1 = setTimeout(refreshOffsets, 150);
    const t2 = setTimeout(refreshOffsets, 600);
    const t3 = setTimeout(refreshOffsets, 1500);

    window.addEventListener('resize', refreshOffsets, { passive: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', refreshOffsets);
    };
  }, [hasEntered]);

  // 2. Video Preload & Metadata initialization (Rock-solid dual-slot readiness tracking)
  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    vA.muted = true;
    vB.muted = true;

    let aReady = vA.readyState >= 1;
    let bReady = vB.readyState >= 1;

    const handleReady = () => {
      if (vA.readyState >= 1) aReady = true;
      if (vB.readyState >= 1) bReady = true;

      // If primary slot A is ready, video system is ready to render
      if (aReady) {
        updateState(VIDEO_ENVIRONMENT_STATES.READY);
        if (vA.currentTime === 0 || vA.currentTime < CINEMATIC_SCENES.hero.start) {
          vA.currentTime = CINEMATIC_SCENES.hero.start;
        }
      }
      if (bReady) {
        if (vB.currentTime === 0 || vB.currentTime < CINEMATIC_SCENES.hero.start) {
          vB.currentTime = CINEMATIC_SCENES.hero.start;
        }
      }
    };

    const handleError = (e) => {
      console.warn('Cinematic video error, falling back to WebGL:', e);
      updateState(VIDEO_ENVIRONMENT_STATES.ERROR);
    };

    vA.addEventListener('loadedmetadata', handleReady);
    vB.addEventListener('loadedmetadata', handleReady);
    vA.addEventListener('canplay', handleReady);
    vB.addEventListener('canplay', handleReady);
    vA.addEventListener('error', handleError);
    vB.addEventListener('error', handleError);

    if (vA.readyState >= 1 || vB.readyState >= 1) {
      handleReady();
    }

    return () => {
      vA.removeEventListener('loadedmetadata', handleReady);
      vB.removeEventListener('loadedmetadata', handleReady);
      vA.removeEventListener('canplay', handleReady);
      vB.removeEventListener('canplay', handleReady);
      vA.removeEventListener('error', handleError);
      vB.removeEventListener('error', handleError);
    };
  }, [videoSrc, updateState]);

  // 3. Playback Start on ENTER
  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    if (hasEntered && envState === VIDEO_ENVIRONMENT_STATES.READY) {
      if (!isReducedMotion) {
        const activeVid = activeSlotRef.current === 'A' ? vA : vB;
        if (activeVid.paused) {
          activeVid.play().catch((err) => {
            console.warn('Cinematic video play prevented:', err);
          });
        }
      }
    } else if (!hasEntered) {
      vA.pause();
      vB.pause();
    }
  }, [hasEntered, envState, isReducedMotion]);

  // 4. Dual-Video Crossfade Transition Helper (Temporal Seamless Handoff)
  const executeDualTransition = useCallback((targetTime, durationMs = 260) => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    if (isTransitioningRef.current) {
      pendingTargetTimeRef.current = targetTime;
      return;
    }

    isTransitioningRef.current = true;
    pendingTargetTimeRef.current = null;
    clearTimeout(transitionTimeoutRef.current);

    const isCurrentA = activeSlotRef.current === 'A';
    const activeVid = isCurrentA ? vA : vB;
    const standbyVid = isCurrentA ? vB : vA;

    // 1. Prepare standby video at target timestamp
    standbyVid.currentTime = targetTime;

    // 2. Start standby video decoding/playback
    if (!isReducedMotion) {
      standbyVid.play().catch(() => {});
    }

    // 3. Perform seamless temporal crossfade
    standbyVid.style.transition = `opacity ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    activeVid.style.transition = `opacity ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;

    standbyVid.style.opacity = '1';
    activeVid.style.opacity = '0';

    // 4. Once crossfade finishes, pause previous video and swap slot roles
    transitionTimeoutRef.current = setTimeout(() => {
      activeVid.pause();
      activeSlotRef.current = isCurrentA ? 'B' : 'A';
      isTransitioningRef.current = false;

      // Handle queued pending transition if section switched during crossfade
      if (pendingTargetTimeRef.current !== null) {
        const nextTime = pendingTargetTimeRef.current;
        pendingTargetTimeRef.current = null;
        executeDualTransition(nextTime, durationMs);
      }
    }, durationMs + 20);
  }, [isReducedMotion]);

  // 5. Fast-Scroll Aware Section Transition Controller
  const handleSectionSwitch = useCallback((newSectionId, isDirectSettle = false) => {
    const targetScene = CINEMATIC_SCENES[newSectionId] || CINEMATIC_SCENES.hero;

    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    const activeVid = activeSlotRef.current === 'A' ? vA : vB;
    const curTime = activeVid.currentTime || 0;

    const isAlreadyWithinRange = curTime >= targetScene.start && curTime <= targetScene.end;

    if (newSectionId === activeSectionRef.current && isAlreadyWithinRange && !isDirectSettle) {
      return;
    }

    activeSectionRef.current = newSectionId;

    // If current video is already within the section's active range, let it continue naturally!
    if (isAlreadyWithinRange) {
      return;
    }

    // Otherwise, transition smoothly directly to the target scene
    executeDualTransition(targetScene.start, 320);
  }, [executeDualTransition]);

  // 5b. Dual-trigger synchronization: When atmosphereMode shifts to 'about', activate About scene
  useEffect(() => {
    if (!hasEntered || envState !== VIDEO_ENVIRONMENT_STATES.READY) return;
    if (atmosphereMode === 'about') {
      handleSectionSwitch('about', false);
    }
  }, [atmosphereMode, hasEntered, envState, handleSectionSwitch]);

  // 6. Scroll Listener with Velocity-Aware Fast Scroll Skipping
  useEffect(() => {
    if (!hasEntered || envState !== VIDEO_ENVIRONMENT_STATES.READY) return;

    const handleScroll = () => {
      const now = Date.now();
      const dt = Math.max(1, now - lastScrollTimeRef.current);
      const sy = window.scrollY || 0;
      const dy = Math.abs(sy - lastScrollYRef.current);
      const velocity = dy / dt; // pixels per millisecond

      lastScrollYRef.current = sy;
      lastScrollTimeRef.current = now;

      const detectedSection = getActiveSectionId(sy, cachedOffsetsRef.current);

      if (velocity > 0.85) {
        // --- FAST SCROLL DETECTED ---
        // Do NOT trigger intermediate scene handoffs!
        // Wait until scroll settles, then switch directly to the final destination section.
        clearTimeout(fastScrollTimerRef.current);
        clearTimeout(slowScrollTimerRef.current);

        fastScrollTimerRef.current = setTimeout(() => {
          const finalY = window.scrollY || 0;
          const finalSection = getActiveSectionId(finalY, cachedOffsetsRef.current);
          handleSectionSwitch(finalSection, true);
        }, 110);
      } else {
        // --- SLOW / NORMAL READING SCROLL ---
        clearTimeout(slowScrollTimerRef.current);
        slowScrollTimerRef.current = setTimeout(() => {
          handleSectionSwitch(detectedSection, false);
        }, 70);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(fastScrollTimerRef.current);
      clearTimeout(slowScrollTimerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasEntered, envState, handleSectionSwitch]);

  // 7. Continuous Playback Monitor & Invisible Seamless Boundary Looping
  useEffect(() => {
    if (!hasEntered || envState !== VIDEO_ENVIRONMENT_STATES.READY) return;
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    let isRunning = true;

    const loopMonitor = () => {
      if (!isRunning) return;

      const isCurrentA = activeSlotRef.current === 'A';
      const activeVid = isCurrentA ? vA : vB;
      const curTime = activeVid.currentTime || 0;
      const currentScene = CINEMATIC_SCENES[activeSectionRef.current] || CINEMATIC_SCENES.hero;

      // Rule: When scrolling stops, video MUST continue playing forward!
      if (!isReducedMotion && activeVid.paused && !isTransitioningRef.current) {
        activeVid.play().catch(() => {});
      }

      // Seamless Loop Boundary Detection & Out-of-Bounds Recovery:
      if (!isTransitioningRef.current) {
        if (curTime >= (currentScene.loopEnd - 0.22)) {
          executeDualTransition(currentScene.loopStart, 240);
        } else if (activeSectionRef.current === 'about' && (curTime < (currentScene.start - 0.25) || curTime > (currentScene.end + 0.4))) {
          executeDualTransition(currentScene.start, 260);
        }
      }

      rafIdRef.current = requestAnimationFrame(loopMonitor);
    };

    rafIdRef.current = requestAnimationFrame(loopMonitor);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [hasEntered, envState, isReducedMotion, executeDualTransition]);

  // 8. Subtle Project Atmosphere Tint
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
  const isVisible = hasEntered && isReady;

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
        zIndex: hasEntered ? 1 : -1,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 1.2s'
      }}
      aria-hidden="true"
    >
      {/* Video Layer A (Active by default) */}
      <video
        ref={videoARef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: 1,
          transform: 'scale(1.025)',
          transformOrigin: '50% 50%',
          zIndex: 1
        }}
      />

      {/* Video Layer B (Standby for invisible crossfade looping & direct handoff) */}
      <video
        ref={videoBRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
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

      {/* 6. Subtle Bottom-Right Corner Softening Shield */}
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
