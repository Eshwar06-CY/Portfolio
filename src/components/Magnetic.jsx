import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * High-Performance Clamped Magnetic interaction component.
 * - Restrained to subtle 3-4px maximum movement.
 * - Driven directly via GSAP quickTo (zero React state updates / re-renders on mousemove).
 * - Completely disabled on touch devices and when prefers-reduced-motion is active.
 */
export default function Magnetic({
  children,
  strength = 0.12,
  maxOffset = 3.5,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}) {
  const containerRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const isEnabled = useRef(false);

  useEffect(() => {
    // Check desktop fine-pointer and reduced motion
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isEnabled.current = finePointer && !reducedMotion && window.innerWidth > 1024;

    if (isEnabled.current && containerRef.current) {
      xTo.current = gsap.quickTo(containerRef.current, 'x', {
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      yTo.current = gsap.quickTo(containerRef.current, 'y', {
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    const handleResize = () => {
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const red = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      isEnabled.current = fine && !red && window.innerWidth > 1024;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (!isEnabled.current || !containerRef.current || !xTo.current || !yTo.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rawDx = (e.clientX - centerX) * strength;
    const rawDy = (e.clientY - centerY) * strength;

    // Strict clamp to avoid excessive movement
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, rawDx));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, rawDy));

    xTo.current(clampedX);
    yTo.current(clampedY);
  };

  const handleMouseLeave = (e) => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(0);
    }
    onMouseLeave?.(e);
  };

  const handleMouseEnter = (e) => {
    onMouseEnter?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`magnetic-wrap ${className}`}
      style={{ display: 'inline-block', willChange: 'transform', ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
