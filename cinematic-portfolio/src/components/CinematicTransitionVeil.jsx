import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Global helper to trigger a cinematic film-cut transition from anywhere.
 * @param {string} label - The editorial label to display briefly (e.g. "ABOUT", "WORK", "SPECRA")
 * @param {Function} [action] - Callback executed at transition midpoint (navigation, scroll, etc.)
 */
export function triggerCinematicCut(label, action) {
  let executed = false;
  const safeAction = () => {
    if (!executed && action) {
      executed = true;
      try {
        action();
      } catch (err) {
        console.error('Error in transition action callback:', err);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cinematic-cut', {
        detail: { label: label?.toUpperCase() || '', action: safeAction }
      })
    );
    // Reliable fallback timeout to guarantee navigation even if animation callback is interrupted
    setTimeout(safeAction, 240);
  } else if (action) {
    action();
  }
}

/**
 * Minimal, high-precision cinematic transition veil:
 * - Near-black overlay (#050507)
 * - Restrained editorial label
 * - Ultra-fast film cut feel: ~360ms total
 * - Automatically falls back to instantaneous transition on prefers-reduced-motion
 */
export default function CinematicTransitionVeil() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleCut = (e) => {
      const { label: nextLabel, action } = e.detail || {};
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        if (action) action();
        return;
      }

      setLabel(nextLabel || '');
      setActive(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Midpoint: execute navigation or scroll action while veil is fully opaque
      timeoutRef.current = setTimeout(() => {
        if (action) action();

        // Hold briefly, then lift the veil
        timeoutRef.current = setTimeout(() => {
          setActive(false);
        }, 120);
      }, 150);
    };

    window.addEventListener('cinematic-cut', handleCut);
    return () => {
      window.removeEventListener('cinematic-cut', handleCut);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="cinematic-transition-veil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {label && (
            <motion.div
              className="veil-editorial-label-box"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <span className="veil-label-num">SCENE</span>
              <span className="veil-label-text">{label}</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
