import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Hero({ profile, onScrollExplore, onCursorChange }) {
  const { scrollY } = useScroll();

  // Scroll parallax & physical typography transformation:
  // ESHWAR M behaves as a monumental architectural mass moving horizontally & receding upward
  const mastheadX = useTransform(scrollY, [0, 600], [0, -40]);
  const mastheadY = useTransform(scrollY, [0, 600], [0, -80]);
  const mastheadScale = useTransform(scrollY, [0, 600], [1, 0.96]);
  const mastheadOpacity = useTransform(scrollY, [0, 480], [1, 0.15]);

  // Ambient lighting shifts as user scrolls
  const ambientOpacity = useTransform(scrollY, [0, 380], [1, 0.15]);
  const ambientScale = useTransform(scrollY, [0, 500], [1, 1.08]);

  // Portrait recedes deeper into background darkness rather than simply vanishing
  const portraitY = useTransform(scrollY, [0, 600], [0, 45]);
  const portraitScale = useTransform(scrollY, [0, 600], [1, 0.91]);
  const portraitBrightness = useTransform(scrollY, [0, 480], [1, 0.18]);
  const portraitOpacity = useTransform(scrollY, [0, 550], [1, 0.08]);

  // Bottom scroll indicator fades out as soon as exploration begins
  const bottomBarOpacity = useTransform(scrollY, [0, 140], [1, 0]);
  const bottomBarY = useTransform(scrollY, [0, 140], [0, 16]);

  return (
    <section id="hero" className="hero-container" aria-label="Hero Opening Sequence">
      {/* 0–0.8s Opening Black Screen Veil */}
      <motion.div
        className="cinematic-blackout-veil"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.85, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      {/* Atmospheric Soft Light Behind Subject */}
      <motion.div
        className="hero-subject-ambient-glow"
        style={{ opacity: ambientOpacity, scale: ambientScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      {/* LEFT: Physical Monolithic Typography & Narrative Statement */}
      <motion.div
        className="hero-content"
        style={{
          x: mastheadX,
          y: mastheadY,
          scale: mastheadScale,
          opacity: mastheadOpacity
        }}
      >
        {/* ESHWAR M monumental title */}
        <div className="hero-masthead-mask-wrapper">
          <motion.h1
            className="hero-title"
            aria-label={profile.name || "ESHWAR M"}
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -15 }}
            animate={{ clipPath: 'inset(0 -25% 0 0)', opacity: 1, x: 0 }}
            transition={{
              duration: 0.95,
              delay: 1.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {profile.name || "ESHWAR M"}
          </motion.h1>

          {/* Delicate hairline accent */}
          <motion.div
            className="hero-hairline-reveal"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.8,
              ease: [0.16, 1, 0.3, 1]
            }}
          />
        </div>

        {/* Supporting Role */}
        <motion.div
          className="hero-role"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="role-term">AI</span>
          <span className="role-divider">/</span>
          <span className="role-term">PRODUCT</span>
          <span className="role-divider">/</span>
          <span className="role-term">DATA</span>
        </motion.div>

        {/* Guiding Statement */}
        <motion.p
          className="hero-supporting-line"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {profile.heroStatement || "BUILDING IDEAS INTO INTELLIGENT PRODUCTS."}
        </motion.p>
      </motion.div>

      {/* RIGHT: Hero Portrait Emerging from Darkness & Receding on Scroll */}
      <motion.div
        className="hero-portrait-stage"
        style={{
          y: portraitY,
          scale: portraitScale,
          opacity: portraitOpacity
        }}
        initial={{ opacity: 0, filter: 'contrast(1.08) brightness(0.2)' }}
        animate={{ opacity: 1, filter: 'contrast(1.04) brightness(0.98)' }}
        transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Subtle organic ambient float */}
        <motion.div
          className="hero-portrait-float"
          animate={{
            y: [0, -6, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 8.0,
            ease: 'easeInOut',
            delay: 3.0
          }}
        >
          <div className="hero-portrait-mask-layer">
            <img
              src="/portrait.png"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/images/portrait.png";
              }}
              alt={`${profile.name} — Editorial Portrait`}
              className="hero-portrait-img"
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM BAR: Quiet Minimal Scroll Cue */}
      <motion.div
        className="hero-bottom-bar"
        style={{ opacity: bottomBarOpacity, y: bottomBarY }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Magnetic strength={0.2}>
          <button
            className="scroll-indicator-button"
            onClick={onScrollExplore}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Scroll to explore"
          >
            <span className="scroll-arrow-box" aria-hidden="true">
              <span className="scroll-pulsing-dot" />
            </span>
            <span className="btn-text">EXPLORE</span>
            <ArrowDown size={13} className="btn-down-icon" />
          </button>
        </Magnetic>

        <div className="hero-meta-details">
          <span>{profile.location || 'KARNATAKA, INDIA'}</span>
          <span className="meta-sep">•</span>
          <span>{profile.status || 'OPEN FOR COLLABORATION'}</span>
        </div>
      </motion.div>
    </section>
  );
}
