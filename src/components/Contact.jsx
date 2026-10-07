import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';
import { trackEmailClick, trackContactClick, trackGithubClick, trackLinkedinClick } from '../utils/analytics';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ contactData, onCursorChange }) {
  const contactRootRef = useRef(null);
  const emailAddress = contactData?.email || 'meshwar824@gmail.com';
  const linkedInUrl = 'https://www.linkedin.com/in/eshwar-m-90b86332a';
  const gitHubUrl = 'https://github.com/Eshwar06-CY';

  useEffect(() => {
    const el = contactRootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Atmosphere mode trigger
      ScrollTrigger.create({
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

      // 2. Part 10 — Cinematic Quiet Masked Reveal for Contact Section
      const kicker = el.querySelector('.contact-session-telemetry-row');
      const line1 = el.querySelector('.contact-headline-line.line-1');
      const line2 = el.querySelector('.contact-headline-line.line-2');
      const subline = el.querySelector('.contact-subline-text');
      const links = el.querySelector('.contact-editorial-links-row');

      const tl = gsap.timeline({
        paused: true
      });

      if (kicker) {
        tl.fromTo(kicker,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          0
        );
      }

      if (line1 && line2) {
        tl.fromTo(line1,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
          0.05
        )
        .fromTo(line2,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.95, ease: 'power3.out' },
          0.2
        );
      }

      if (subline) {
        tl.fromTo(subline,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
          0.38
        );
      }

      if (links) {
        tl.fromTo(links,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          0.48
        );
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'bottom 10%',
        onEnter: () => tl.restart(),
        onLeave: () => tl.pause(0),
        onEnterBack: () => tl.restart(),
        onLeaveBack: () => tl.pause(0)
      });
    }, contactRootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="contact" ref={contactRootRef} className="cinematic-section contact-editorial-section" aria-label="Contact Section">

      {/* Section Kicker & Closing Session Telemetry */}
      <div style={{ marginBottom: '24px', position: 'relative', zIndex: 10 }}>
        <div className="contact-session-telemetry-row">
          <span className="kicker">05 — CONNECT</span>
          <span className="telemetry-sep">•</span>
          <span className="telemetry-sub-tag">OPEN TO COLLABORATION &amp; OPPORTUNITIES</span>
        </div>
      </div>

      {/* Choreographed Monumental Headline with Slow Masked Reveal */}
      <h2 className="contact-monumental-headline">
        <div className="cinematic-title-mask">
          <span
            className="contact-headline-line line-1"
            style={{ display: 'block' }}
          >
            LET'S BUILD
          </span>
        </div>
        <div className="cinematic-title-mask">
          <span
            className="contact-headline-line line-2"
            style={{ display: 'block' }}
          >
            <em className="headline-emphasis">SOMETHING.</em>
          </span>
        </div>
      </h2>

      <p className="contact-subline-text">
        Have an idea, opportunity, or problem worth solving?
      </p>

      {/* Editorial Interactive Links (Native semantic mailto & external anchors) */}
      <div className="contact-editorial-links-row">
        {/* Email Direct - semantic mailto link */}
        <Magnetic strength={0.18}>
          <a
            href={`mailto:${emailAddress}?subject=Portfolio%20Inquiry`}
            className="contact-editorial-link contact-email-link"
            onClick={() => {
              trackEmailClick('contact');
              trackContactClick('email', 'contact');
            }}
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
            onClick={() => {
              trackGithubClick('contact');
              trackContactClick('github', 'contact');
            }}
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
            onClick={() => {
              trackLinkedinClick('contact');
              trackContactClick('linkedin', 'contact');
            }}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Visit Eshwar M on LinkedIn (opens in a new tab)"
          >
            <span className="link-label">LINKEDIN</span>
            <ArrowUpRight size={15} className="link-arrow" aria-hidden="true" />
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
