import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';
import TextReveal from './TextReveal';

export default function Contact({ contactData, onCursorChange }) {
  const emailAddress = contactData?.email || 'meshwar824@gmail.com';
  const linkedInUrl = 'https://www.linkedin.com/in/eshwar-m-90b86332a';
  const gitHubUrl = 'https://github.com/Eshwar06-CY';

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
        <span className="kicker">05 — CONNECT</span>
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
        Have an idea, opportunity, or problem worth solving?
      </motion.p>

      {/* Editorial Interactive Links (Native semantic mailto & external anchors) */}
      <motion.div
        className="contact-editorial-links-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, delay: 0.35 }}
      >
        {/* Email Direct - semantic mailto link */}
        <Magnetic strength={0.18}>
          <a
            href={`mailto:${emailAddress}?subject=Portfolio%20Inquiry`}
            className="contact-editorial-link contact-email-link"
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label={`Send email to ${emailAddress}`}
          >
            <span className="link-label">{emailAddress}</span>
            <ArrowUpRight size={15} className="link-arrow" aria-hidden="true" />
          </a>
        </Magnetic>

        {/* GitHub */}
        <Magnetic strength={0.18}>
          <a
            href={gitHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-editorial-link"
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Visit Eshwar M on GitHub (opens in a new tab)"
          >
            <span className="link-label">GITHUB</span>
            <ArrowUpRight size={15} className="link-arrow" aria-hidden="true" />
          </a>
        </Magnetic>

        {/* LinkedIn */}
        <Magnetic strength={0.18}>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-editorial-link"
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Visit Eshwar M on LinkedIn (opens in a new tab)"
          >
            <span className="link-label">LINKEDIN</span>
            <ArrowUpRight size={15} className="link-arrow" aria-hidden="true" />
          </a>
        </Magnetic>
      </motion.div>
    </section>
  );
}
