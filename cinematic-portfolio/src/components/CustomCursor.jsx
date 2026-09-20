import React, { useEffect, useState, useRef } from 'react';

/**
 * Custom Desktop Cursor:
 * - Default: small minimal circular precision dot with subtle follower ring
 * - Over Project: ring expands and displays "VIEW"
 * - Over Link / Nav / Action: ring expands and displays "OPEN"
 * - Subtle lerping physics
 * - Automatically disabled on touch & tablet / mobile devices
 */
export default function CustomCursor({ cursorMode = 'default' }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const reqRef = useRef(null);

  // Detect desktop fine-pointer capability
  useEffect(() => {
    const checkCapability = () => {
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isWideEnough = window.innerWidth > 1024;
      setIsDesktop(hasFinePointer && isWideEnough);
    };

    checkCapability();
    window.addEventListener('resize', checkCapability);
    return () => window.removeEventListener('resize', checkCapability);
  }, []);

  // Track mouse coordinates
  useEffect(() => {
    if (!isDesktop) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isDesktop, visible]);

  // Smooth lerp follower loop
  useEffect(() => {
    if (!isDesktop) return;

    const lerpFactor = 0.24;
    const follow = () => {
      setTrail((prev) => ({
        x: prev.x + (position.x - prev.x) * lerpFactor,
        y: prev.y + (position.y - prev.y) * lerpFactor
      }));
      reqRef.current = requestAnimationFrame(follow);
    };

    reqRef.current = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(reqRef.current);
  }, [isDesktop, position]);

  if (!isDesktop || !visible) return null;

  const isProject = cursorMode === 'project' || cursorMode === 'image' || cursorMode === 'view';
  const isLink = cursorMode === 'link';
  const isHover = cursorMode === 'hover';

  const ringClasses = [
    'custom-cursor-lens',
    isProject ? 'lens-state-project' : '',
    isLink ? 'lens-state-link' : '',
    isHover ? 'lens-state-hover' : '',
    isPressed ? 'lens-state-pressed' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="custom-cursor-layer" aria-hidden="true">
      {/* Precision Focus Center Dot */}
      <div
        className="custom-cursor-dot"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transformOrigin: 'center center'
        }}
      />

      {/* Optical Camera Lens Follower Reticle */}
      <div
        className={ringClasses}
        style={{
          transform: `translate3d(${trail.x}px, ${trail.y}px, 0)`,
          transformOrigin: 'center center'
        }}
      >
        <span className="lens-corner-tl" />
        <span className="lens-corner-br" />
      </div>
    </div>
  );
}
