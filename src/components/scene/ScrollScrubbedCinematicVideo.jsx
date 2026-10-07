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

/**
 * Centralized media timestamp clamp (Fix 5).
 * Prevents seeking beyond physical duration (40.0s) and keeps video within safe playable bounds.
 */
export function safeMediaTime(targetTime, duration) {
  const maxSafe = (duration && duration > 1) ? Math.min(39.2, duration - 0.6) : 39.2;
  return Math.max(0.5, Math.min(maxSafe, Number.isFinite(targetTime) ? targetTime : 0.5));
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
  const transitionSafetyTimerRef = useRef(null);
  const transitionStartTimeRef = useRef(0);
  const standbyDecodeTimerRef = useRef(null);
  const standbySeekedHandlerRef = useRef(null);

  // Per-slot recovery tracking (Fix 1)
  const retryCountRef = useRef({ A: 0, B: 0 });

  const activeSectionRef = useRef('hero');
  const cachedOffsetsRef = useRef(measureSceneOffsets());

  // Velocity tracking for adaptive catch-up and scrolling
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(performance.now());
  const settleTimerRef = useRef(null);

  // Single persistent temporal transition controller
  const temporalTransitionRef = useRef(null); // { startTime, targetTime, duration, startTimestamp, lastSeekTime, pendingSeekTime }
  const temporalRafRef = useRef(null);

  const rafIdRef = useRef(null);
  const [envState, setEnvState] = useState(VIDEO_ENVIRONMENT_STATES.LOADING);

  const updateState = useCallback((newState) => {
    setEnvState(newState);
    if (onStateChange) {
      onStateChange(newState);
    }
  }, [onStateChange]);

  // Centralized playback enforcer (Fix 4 & 5)
  const ensureVideoPlaying = useCallback((vid) => {
    if (!vid || isReducedMotion) return;
    if (vid.paused || vid.ended) {
      if (vid.ended) {
        const currentScene = CINEMATIC_SCENES[activeSectionRef.current] || CINEMATIC_SCENES.hero;
        vid.currentTime = safeMediaTime(currentScene.loopStart, vid.duration);
      }
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Handled gracefully (e.g. AbortError on rapid seek/pause)
        });
      }
    }
  }, [isReducedMotion]);

  // Asynchronously recovers and resets an errored video slot (Fix 1)
  const recoverVideoSlot = useCallback((slotId) => {
    const isA = slotId === 'A';
    const vid = isA ? videoARef.current : videoBRef.current;
    if (!vid) return;

    const currentScene = CINEMATIC_SCENES[activeSectionRef.current] || CINEMATIC_SCENES.hero;
    const safeTime = safeMediaTime(currentScene.loopStart, vid.duration);

    try {
      vid.pause();
      vid.currentTime = safeTime;
      if (vid.error) {
        vid.load(); // Reset media decoder pipeline
      }
      if (activeSlotRef.current === slotId) {
        ensureVideoPlaying(vid);
      }
    } catch (_) {}
  }, [ensureVideoPlaying]);

  // Resilient Error Recovery with Auto-Healing (Fix 1)
  const handleVideoError = useCallback((e) => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    const failedSlot = e.target === vA ? 'A' : 'B';
    const healthySlot = failedSlot === 'A' ? 'B' : 'A';
    const failedVid = failedSlot === 'A' ? vA : vB;
    const healthyVid = failedSlot === 'A' ? vB : vA;

    retryCountRef.current[failedSlot] = (retryCountRef.current[failedSlot] || 0) + 1;
    const retries = retryCountRef.current[failedSlot];

    console.warn(`Cinematic video slot ${failedSlot} error (retry ${retries}/3):`, failedVid.error);

    const isHealthyVidUsable = healthyVid && healthyVid.readyState >= 1 && !healthyVid.error;

    if (isHealthyVidUsable) {
      // Promote the healthy video slot immediately
      activeSlotRef.current = healthySlot;
      healthyVid.style.transition = 'opacity 0.25s ease';
      healthyVid.style.opacity = '1';
      healthyVid.style.zIndex = '2';
      failedVid.style.opacity = '0';
      failedVid.style.zIndex = '1';

      ensureVideoPlaying(healthyVid);

      // Asynchronously recover failed slot
      setTimeout(() => {
        recoverVideoSlot(failedSlot);
      }, 150);
      return;
    }

    // Only enter WebGL fallback if BOTH video slots repeatedly fail
    if (retryCountRef.current.A >= 3 && retryCountRef.current.B >= 3) {
      console.warn('Both video slots failed repeatedly. Falling back to WebGL.');
      updateState(VIDEO_ENVIRONMENT_STATES.ERROR);
    } else {
      recoverVideoSlot(failedSlot);
    }
  }, [ensureVideoPlaying, recoverVideoSlot, updateState]);

  // Hard media EOF protection (Fix 5)
  const handleVideoEnded = useCallback((e) => {
    const vid = e.target;
    const currentScene = CINEMATIC_SCENES[activeSectionRef.current] || CINEMATIC_SCENES.hero;
    vid.currentTime = safeMediaTime(currentScene.loopStart, vid.duration);
    ensureVideoPlaying(vid);
  }, [ensureVideoPlaying]);

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

      // If either slot is ready, video system is ready to render
      if (aReady || bReady) {
        updateState(VIDEO_ENVIRONMENT_STATES.READY);
        if (vA.currentTime === 0 || vA.currentTime < CINEMATIC_SCENES.hero.start) {
          vA.currentTime = safeMediaTime(CINEMATIC_SCENES.hero.start, vA.duration);
        }
      }
      if (bReady) {
        if (vB.currentTime === 0 || vB.currentTime < CINEMATIC_SCENES.hero.start) {
          vB.currentTime = safeMediaTime(CINEMATIC_SCENES.hero.start, vB.duration);
        }
      }
    };

    const handlePlayingA = () => { retryCountRef.current.A = 0; };
    const handlePlayingB = () => { retryCountRef.current.B = 0; };

    vA.addEventListener('loadedmetadata', handleReady);
    vB.addEventListener('loadedmetadata', handleReady);
    vA.addEventListener('canplay', handleReady);
    vB.addEventListener('canplay', handleReady);
    vA.addEventListener('playing', handlePlayingA);
    vB.addEventListener('playing', handlePlayingB);
    vA.addEventListener('error', handleVideoError);
    vB.addEventListener('error', handleVideoError);
    vA.addEventListener('ended', handleVideoEnded);
    vB.addEventListener('ended', handleVideoEnded);

    if (vA.readyState >= 1 || vB.readyState >= 1) {
      handleReady();
    }

    return () => {
      vA.removeEventListener('loadedmetadata', handleReady);
      vB.removeEventListener('loadedmetadata', handleReady);
      vA.removeEventListener('canplay', handleReady);
      vB.removeEventListener('canplay', handleReady);
      vA.removeEventListener('playing', handlePlayingA);
      vB.removeEventListener('playing', handlePlayingB);
      vA.removeEventListener('error', handleVideoError);
      vB.removeEventListener('error', handleVideoError);
      vA.removeEventListener('ended', handleVideoEnded);
      vB.removeEventListener('ended', handleVideoEnded);
    };
  }, [videoSrc, updateState, handleVideoError, handleVideoEnded]);

  // 3. Playback Start on ENTER
  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    if (hasEntered && envState === VIDEO_ENVIRONMENT_STATES.READY) {
      if (!isReducedMotion) {
        const activeVid = activeSlotRef.current === 'A' ? vA : vB;
        ensureVideoPlaying(activeVid);
      }
    } else if (!hasEntered) {
      vA.pause();
      vB.pause();
    }
  }, [hasEntered, envState, isReducedMotion, ensureVideoPlaying]);

  // 4a. Hard Deadlock Safety Settle (Fix 4)
  const settleTransition = useCallback((forcedSlot = null) => {
    clearTimeout(transitionTimeoutRef.current);
    clearTimeout(transitionSafetyTimerRef.current);
    clearTimeout(standbyDecodeTimerRef.current);

    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) {
      isTransitioningRef.current = false;
      return;
    }

    if (standbySeekedHandlerRef.current) {
      vA.removeEventListener('seeked', standbySeekedHandlerRef.current);
      vA.removeEventListener('canplay', standbySeekedHandlerRef.current);
      vB.removeEventListener('seeked', standbySeekedHandlerRef.current);
      vB.removeEventListener('canplay', standbySeekedHandlerRef.current);
      standbySeekedHandlerRef.current = null;
    }

    let targetSlot = forcedSlot;
    if (!targetSlot) {
      // Pick healthiest slot (readyState >= 2, no error)
      if (activeSlotRef.current === 'B' && vB.readyState >= 2 && !vB.error) {
        targetSlot = 'B';
      } else if (vA.readyState >= 2 && !vA.error) {
        targetSlot = 'A';
      } else {
        targetSlot = activeSlotRef.current;
      }
    }

    activeSlotRef.current = targetSlot;
    isTransitioningRef.current = false;
    pendingTargetTimeRef.current = null;

    const activeVid = targetSlot === 'A' ? vA : vB;
    const standbyVid = targetSlot === 'A' ? vB : vA;

    activeVid.style.transition = 'opacity 0.2s ease';
    standbyVid.style.transition = 'opacity 0.2s ease';
    activeVid.style.opacity = '1';
    activeVid.style.zIndex = '2';
    standbyVid.style.opacity = '0';
    standbyVid.style.zIndex = '1';

    standbyVid.pause();
    ensureVideoPlaying(activeVid);
  }, [ensureVideoPlaying]);

  // Emergency cancel for dual-slot loop crossfade if user initiates scroll travel
  const cancelDualTransitionIfActive = useCallback(() => {
    if (!isTransitioningRef.current) return;
    settleTransition(activeSlotRef.current);
  }, [settleTransition]);

  // 4b. Decode-Gated Dual-Video Crossfade Transition Helper (Fix 3 & 4)
  const executeDualTransition = useCallback((targetTime, durationMs = 240) => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    const safeTarget = safeMediaTime(targetTime, vA.duration || vB.duration);

    if (isTransitioningRef.current) {
      pendingTargetTimeRef.current = safeTarget;
      return;
    }

    isTransitioningRef.current = true;
    transitionStartTimeRef.current = performance.now();
    pendingTargetTimeRef.current = null;
    clearTimeout(transitionTimeoutRef.current);
    clearTimeout(transitionSafetyTimerRef.current);
    clearTimeout(standbyDecodeTimerRef.current);

    const isCurrentA = activeSlotRef.current === 'A';
    const activeVid = isCurrentA ? vA : vB;
    const standbyVid = isCurrentA ? vB : vA;
    const standbySlot = isCurrentA ? 'B' : 'A';

    // Hard safety timeout: if anything stalls or drops frame decode, settle within 600ms (Fix 4)
    transitionSafetyTimerRef.current = setTimeout(() => {
      console.warn('Dual-slot crossfade reached 600ms safety limit. Auto-settling.');
      settleTransition(standbySlot);
    }, 600);

    // 1. Prepare standby video at target timestamp
    standbyVid.currentTime = safeTarget;
    ensureVideoPlaying(standbyVid);

    // 2. Decode-Gate (Fix 3): Only start fading out activeVid once standbyVid has decoded its frame
    let crossfadeInitiated = false;
    const initiateCrossfade = () => {
      if (crossfadeInitiated || !isTransitioningRef.current) return;
      crossfadeInitiated = true;
      clearTimeout(standbyDecodeTimerRef.current);

      // Bring standby to front and crossfade
      standbyVid.style.zIndex = '2';
      activeVid.style.zIndex = '1';
      standbyVid.style.transition = `opacity ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      activeVid.style.transition = `opacity ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;

      standbyVid.style.opacity = '1';
      activeVid.style.opacity = '0';

      transitionTimeoutRef.current = setTimeout(() => {
        clearTimeout(transitionSafetyTimerRef.current);
        activeVid.pause();
        activeSlotRef.current = standbySlot;
        isTransitioningRef.current = false;

        // Handle queued pending transition if section switched during crossfade
        if (pendingTargetTimeRef.current !== null) {
          const nextTime = pendingTargetTimeRef.current;
          pendingTargetTimeRef.current = null;
          executeDualTransition(nextTime, durationMs);
        }
      }, durationMs + 20);
    };

    // If standby already has decoded frame ready, crossfade immediately
    if (!standbyVid.seeking && standbyVid.readyState >= 2) {
      initiateCrossfade();
    } else {
      const onSeeked = () => {
        standbyVid.removeEventListener('seeked', onSeeked);
        standbyVid.removeEventListener('canplay', onSeeked);
        standbySeekedHandlerRef.current = null;
        initiateCrossfade();
      };
      standbySeekedHandlerRef.current = onSeeked;
      standbyVid.addEventListener('seeked', onSeeked, { once: true });
      standbyVid.addEventListener('canplay', onSeeked, { once: true });

      // Bounded decode readiness timeout: 280ms (Fix 3 Requirement 5)
      // If standby fails to become ready within timeout: ABORT crossfade, recover standby, keep active slot visible!
      standbyDecodeTimerRef.current = setTimeout(() => {
        standbyVid.removeEventListener('seeked', onSeeked);
        standbyVid.removeEventListener('canplay', onSeeked);
        standbySeekedHandlerRef.current = null;
        if (crossfadeInitiated || !isTransitioningRef.current) return;

        console.warn(`Standby slot ${standbySlot} decode timeout (280ms). Aborting transition to keep active slot visible.`);
        clearTimeout(transitionSafetyTimerRef.current);
        isTransitioningRef.current = false;

        // Invariant: AT LEAST ONE HEALTHY VIDEO SLOT MUST REMAIN VISIBLE AT ALL TIMES
        activeVid.style.opacity = '1';
        activeVid.style.zIndex = '2';
        standbyVid.style.opacity = '0';
        standbyVid.style.zIndex = '1';

        recoverVideoSlot(standbySlot);
        ensureVideoPlaying(activeVid);
      }, 280);
    }
  }, [ensureVideoPlaying, recoverVideoSlot, settleTransition]);

  // 4c. Single Persistent Temporal Interpolation Controller with Seek Gate (Fix 2 & 5)
  const convergeToTemporalTarget = useCallback((targetTime, isFast = false) => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    // Settle any active dual-layer loop crossfade so active slot is 100% visible
    cancelDualTransitionIfActive();

    const activeVid = activeSlotRef.current === 'A' ? vA : vB;
    const safeTarget = safeMediaTime(targetTime, activeVid.duration);
    const curTime = activeVid.currentTime || 0;

    // Accessibility: Reduced motion jumps immediately without temporal interpolation
    if (isReducedMotion) {
      if (temporalRafRef.current) {
        cancelAnimationFrame(temporalRafRef.current);
        temporalRafRef.current = null;
      }
      temporalTransitionRef.current = null;
      activeVid.currentTime = safeTarget;
      ensureVideoPlaying(activeVid);
      return;
    }

    const delta = Math.abs(safeTarget - curTime);
    // Minimal movement: already at desired point
    if (delta < 0.25) {
      ensureVideoPlaying(activeVid);
      return;
    }

    // Adaptive catch-up window:
    // Fast scrolling: ~160ms - 340ms
    // Normal scrolling: ~280ms - 520ms
    const duration = isFast
      ? Math.max(160, Math.min(340, 150 + delta * 10))
      : Math.max(280, Math.min(520, 260 + delta * 18));

    const now = performance.now();

    // If a transition is already in progress, redirect flight path mid-transition (Latest target wins)
    if (temporalTransitionRef.current) {
      temporalTransitionRef.current.startTime = curTime;
      temporalTransitionRef.current.targetTime = safeTarget;
      temporalTransitionRef.current.duration = duration;
      temporalTransitionRef.current.startTimestamp = now;
      temporalTransitionRef.current.lastSeekTime = 0;
      temporalTransitionRef.current.pendingSeekTime = safeTarget;
      return;
    }

    // Initialize the single active temporal transition controller
    temporalTransitionRef.current = {
      startTime: curTime,
      targetTime: safeTarget,
      duration,
      startTimestamp: now,
      lastSeekTime: 0,
      pendingSeekTime: safeTarget
    };

    ensureVideoPlaying(activeVid);

    const step = (frameTimestamp) => {
      const trans = temporalTransitionRef.current;
      if (!trans) return;

      const elapsed = frameTimestamp - trans.startTimestamp;
      const progress = Math.min(1, Math.max(0, elapsed / trans.duration));

      // Cubic ease-out: responsive initial flight, organic deceleration into target chapter
      const ease = 1 - Math.pow(1 - progress, 3);
      const interpolatedTime = safeMediaTime(
        trans.startTime + (trans.targetTime - trans.startTime) * ease,
        activeVid.duration
      );

      trans.pendingSeekTime = progress >= 1 ? trans.targetTime : interpolatedTime;

      // SEEK GATE (Fix 2): If hardware decoder is currently seeking, DO NOT queue another seek!
      // Only assign currentTime when !activeVid.seeking and paced at least ~32ms (~30fps)
      const canSeek = !activeVid.seeking && (progress >= 1 || (frameTimestamp - trans.lastSeekTime) >= 32);

      if (canSeek) {
        trans.lastSeekTime = frameTimestamp;
        try {
          activeVid.currentTime = trans.pendingSeekTime;
        } catch (_) {}
      }

      const isPastDuration = elapsed >= trans.duration;
      const isSafetyTimeout = elapsed >= (trans.duration + 450);

      if (progress < 1 || (activeVid.seeking && !isSafetyTimeout)) {
        temporalRafRef.current = requestAnimationFrame(step);
      } else {
        // Transition complete: apply final destination target if needed
        if (Math.abs(activeVid.currentTime - trans.targetTime) > 0.08 && !activeVid.seeking) {
          try {
            activeVid.currentTime = trans.targetTime;
          } catch (_) {}
        }
        temporalTransitionRef.current = null;
        temporalRafRef.current = null;
        ensureVideoPlaying(activeVid);
      }
    };

    temporalRafRef.current = requestAnimationFrame(step);
  }, [cancelDualTransitionIfActive, ensureVideoPlaying, isReducedMotion]);

  // 5. Logical Section Switch Handler
  const handleSectionSwitch = useCallback((newSectionId, isFast = false) => {
    const targetScene = CINEMATIC_SCENES[newSectionId] || CINEMATIC_SCENES.hero;

    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    const activeVid = activeSlotRef.current === 'A' ? vA : vB;
    const curTime = activeVid.currentTime || 0;

    const isAlreadyWithinRange = curTime >= targetScene.start && curTime <= targetScene.end;

    if (newSectionId === activeSectionRef.current && isAlreadyWithinRange) {
      return;
    }

    activeSectionRef.current = newSectionId;

    // If current video is already within the section's active range, let it continue naturally!
    if (isAlreadyWithinRange) {
      return;
    }

    // Smoothly converge camera through the continuous world to the target section's anchor
    convergeToTemporalTarget(targetScene.loopStart, isFast);
  }, [convergeToTemporalTarget]);

  // 5b. Dual-trigger synchronization: When atmosphereMode shifts to 'about', activate About scene
  useEffect(() => {
    if (!hasEntered || envState !== VIDEO_ENVIRONMENT_STATES.READY) return;
    if (atmosphereMode === 'about' && activeSectionRef.current !== 'about') {
      handleSectionSwitch('about', false);
    }
  }, [atmosphereMode, hasEntered, envState, handleSectionSwitch]);

  // 6. Scroll Listener with Velocity-Aware Real-Time Chapter Tracking
  useEffect(() => {
    if (!hasEntered || envState !== VIDEO_ENVIRONMENT_STATES.READY) return;

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTimeRef.current);
      const sy = window.scrollY || 0;
      const dy = Math.abs(sy - lastScrollYRef.current);
      const velocity = dy / dt; // pixels per millisecond

      lastScrollYRef.current = sy;
      lastScrollTimeRef.current = now;

      const isFast = velocity > 0.85;
      const detectedSection = getActiveSectionId(sy, cachedOffsetsRef.current);

      if (detectedSection !== activeSectionRef.current) {
        handleSectionSwitch(detectedSection, isFast);
      }

      // Rest verification: ensure final settled section is accurately aligned once scrolling ends
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        const finalY = window.scrollY || 0;
        const finalSection = getActiveSectionId(finalY, cachedOffsetsRef.current);
        if (finalSection !== activeSectionRef.current) {
          handleSectionSwitch(finalSection, false);
        }
      }, 90);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(settleTimerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasEntered, envState, handleSectionSwitch]);

  // 7. Continuous Playback Monitor & Invisible Seamless Boundary Looping (Fix 4 & 5)
  useEffect(() => {
    if (!hasEntered || envState !== VIDEO_ENVIRONMENT_STATES.READY) return;
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    let isRunning = true;

    const loopMonitor = () => {
      if (!isRunning) return;

      // Watchdog 1: Check if transition stuck > 600ms (Fix 4)
      if (isTransitioningRef.current && (performance.now() - transitionStartTimeRef.current) > 600) {
        settleTransition();
      }

      const isCurrentA = activeSlotRef.current === 'A';
      const activeVid = isCurrentA ? vA : vB;
      const curTime = activeVid.currentTime || 0;
      const currentScene = CINEMATIC_SCENES[activeSectionRef.current] || CINEMATIC_SCENES.hero;

      const isTemporalActive = temporalTransitionRef.current !== null;

      // Watchdog 2: Continuous playback while stationary
      if (!isReducedMotion && (activeVid.paused || activeVid.ended) && !isTemporalActive && !isTransitioningRef.current) {
        ensureVideoPlaying(activeVid);
      }

      // Seamless Loop Boundary Detection:
      if (!isTemporalActive && !isTransitioningRef.current) {
        const safeEnd = (activeVid.duration && activeVid.duration > 1)
          ? Math.min(currentScene.loopEnd, activeVid.duration - 0.8)
          : Math.min(currentScene.loopEnd, 39.2);
        const loopThreshold = safeEnd - 0.22;
        const maxBoundary = safeMediaTime(currentScene.end + 0.4, activeVid.duration);
        if (curTime >= loopThreshold && curTime <= maxBoundary) {
          executeDualTransition(currentScene.loopStart, 240);
        } else if (curTime < (currentScene.start - 0.4) || curTime > maxBoundary) {
          convergeToTemporalTarget(currentScene.loopStart, false);
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
      if (temporalRafRef.current) {
        cancelAnimationFrame(temporalRafRef.current);
        temporalRafRef.current = null;
      }
      clearTimeout(transitionTimeoutRef.current);
      clearTimeout(transitionSafetyTimerRef.current);
      clearTimeout(standbyDecodeTimerRef.current);
      temporalTransitionRef.current = null;
    };
  }, [hasEntered, envState, isReducedMotion, executeDualTransition, convergeToTemporalTarget, ensureVideoPlaying, settleTransition]);

  // 7b. Window Visibility & Tab Backgrounding Safety (Fix 4)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const vA = videoARef.current;
        const vB = videoBRef.current;
        if (!vA || !vB) return;

        // If a transition was suspended during tab backgrounding, auto-settle immediately
        if (isTransitioningRef.current) {
          settleTransition();
        }

        const activeVid = activeSlotRef.current === 'A' ? vA : vB;
        ensureVideoPlaying(activeVid);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [ensureVideoPlaying, settleTransition]);

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
          zIndex: 1
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
