import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ contactData, onCursorChange }) {
  const contactRootRef = useRef(null);
  const emailAddress = contactData?.email || 'meshwar824@gmail.com';
  const linkedInUrl = 'https://www.linkedin.com/in/eshwar-m-90b86332a';
  const gitHubUrl = 'https://github.com/Eshwar06-CY';

  useEffect(() => {
    const el = contactRootRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      onEnter: () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'connect' }));
        }
      },
      onLeaveBack: () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'data' }));
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section id="contact" ref={contactRootRef} className="cinematic-section contact-editorial-section" aria-label="Contact Section">

      {/* Section Kicker & Closing Session Telemetry */}
      <motion.div
        initial={{ opacity: 0.85, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px', position: 'relative', zIndex: 10 }}
      >
        <div className="contact-session-telemetry-row">
          <span className="kicker">05 — CONNECT</span>
          <span className="telemetry-sep">•</span>
          <span className="telemetry-sub-tag">OPEN TO COLLABORATION &amp; OPPORTUNITIES</span>
        </div>
      </motion.div>

      {/* Choreographed Monumental Headline with Fail-Safe Visibility */}
      <h2 className="contact-monumental-headline">
        <motion.span
          className="contact-headline-line line-1"
          style={{ display: 'block' }}
          initial={{ opacity: 0.85, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          LET'S BUILD
        </motion.span>
        <motion.span
          className="contact-headline-line line-2"
          style={{ display: 'block' }}
          initial={{ opacity: 0.85, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <em className="headline-emphasis">SOMETHING.</em>
        </motion.span>
      </h2>

      <motion.p
        className="contact-subline-text"
        initial={{ opacity: 0.85, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.75, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
      >
        Have an idea, opportunity, or problem worth solving?
      </motion.p>

      {/* Editorial Interactive Links (Native semantic mailto & external anchors) */}
      <motion.div
        className="contact-editorial-links-row"
        initial={{ opacity: 0.85, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
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
