import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import Magnetic from './Magnetic';
import TextReveal from './TextReveal';

export default function Contact({ contactData, onCursorChange }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactData.email || 'eshwarm@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section id="contact" className="cinematic-section contact-editorial-section" aria-label="Contact Section">
      {/* Subtle Ambient Portrait Watermark: Completing the Visual Loop */}
      <div className="contact-portrait-watermark" aria-hidden="true">
        <img
          src="/portrait.png"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/images/portrait.png";
          }}
          alt=""
          className="contact-watermark-img"
          loading="lazy"
        />
        <div className="contact-watermark-veil" />
      </div>

      {/* Section Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px', position: 'relative', zIndex: 10 }}
      >
        <span className="kicker">05 — CONTACT</span>
      </motion.div>

      {/* Monumental Headline */}
      <TextReveal
        lines={["LET'S BUILD", <em key="em" className="headline-emphasis">SOMETHING.</em>]}
        as="h2"
        className="contact-monumental-headline"
      />

      <motion.p
        className="contact-subline-text"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, delay: 0.2 }}
      >
        Have an idea, problem, or engineering opportunity worth exploring? Reach out directly.
      </motion.p>

      {/* Editorial Interactive Links (Underline hover animations, subtle magnetic movement) */}
      <motion.div
        className="contact-editorial-links-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, delay: 0.35 }}
      >
        {/* Email Direct */}
        <Magnetic strength={0.18}>
          <a
            href={`mailto:${contactData.email || 'eshwarm@example.com'}`}
            className="contact-editorial-link"
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
          >
            <span className="link-label">EMAIL</span>
            <ArrowUpRight size={14} className="link-arrow" />
          </a>
        </Magnetic>

        {/* LinkedIn */}
        <Magnetic strength={0.18}>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-editorial-link"
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
          >
            <span className="link-label">LINKEDIN</span>
            <ArrowUpRight size={14} className="link-arrow" />
          </a>
        </Magnetic>

        {/* GitHub */}
        <Magnetic strength={0.18}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-editorial-link"
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
          >
            <span className="link-label">GITHUB</span>
            <ArrowUpRight size={14} className="link-arrow" />
          </a>
        </Magnetic>

        {/* Copy Email Quick Option */}
        <Magnetic strength={0.18}>
          <button
            className="contact-copy-link"
            onClick={handleCopyEmail}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            title="Copy email to clipboard"
          >
            {copied ? (
              <Check size={14} style={{ color: 'var(--status-green)' }} />
            ) : (
              <Copy size={14} />
            )}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY EMAIL'}</span>
          </button>
        </Magnetic>
      </motion.div>

      {/* Subtle Closing Signature: Full-Circle Return to Identity */}
      <motion.div
        className="contact-closing-signature"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        <span className="sig-name">ESHWAR M</span>
        <span className="sig-sep">—</span>
        <span className="sig-role">INTELLIGENT SYSTEMS · SCALED DATA · DIGITAL CRAFT</span>
      </motion.div>
    </section>
  );
}
