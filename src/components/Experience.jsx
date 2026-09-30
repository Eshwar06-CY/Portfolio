import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function Experience({
  experiences = [],
  achievements = [],
  education,
  onCursorChange
}) {
  const sectionRootRef = useRef(null);

  useEffect(() => {
    const root = sectionRootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isDesktop = window.innerWidth >= 1025;

    const ctx = gsap.context(() => {
      // 1. Atmosphere shift on entering Experience
      ScrollTrigger.create({
        trigger: root,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'data' }));
          }
        },
        onEnterBack: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'data' }));
          }
        }
      });

      // 2. Choreographed Scroll Reveals for Experience Items
      const expItems = root.querySelectorAll('.editorial-timeline-item.role-item');
      expItems.forEach((item) => {
        const period = item.querySelector('.milestone-period-text');
        const org = item.querySelector('.milestone-org-text');
        const role = item.querySelector('.milestone-role-text');
        const desc = item.querySelector('.milestone-body-desc');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            end: 'top 55%',
            scrub: 0.5
          }
        });

        if (period) {
          tl.fromTo(period,
            { clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)', x: -8, autoAlpha: 0.8 },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', x: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.28 },
            0
          );
        }
        if (org) {
          tl.fromTo(org,
            { x: isDesktop ? -16 : -8, autoAlpha: 0.85 },
            { x: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.34 },
            0.05
          );
        }
        if (role) {
          tl.fromTo(role,
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.38 },
            0.10
          );
        }
        if (desc) {
          tl.fromTo(desc,
            { y: 8, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.35 },
            0.16
          );
        }
      });

      // 3. Staggered Reveals for Achievements from safe readable baseline
      const achItems = root.querySelectorAll('.editorial-timeline-item.achievement-item');
      achItems.forEach((item, idx) => {
        const badge = item.querySelector('.milestone-result-badge');
        const title = item.querySelector('.milestone-achievement-title');
        const desc = item.querySelector('.milestone-body-desc');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'top 65%',
            scrub: 0.5
          }
        });

        if (badge) {
          tl.fromTo(badge,
            { scale: 0.92, autoAlpha: 0.8 },
            { scale: 1.0, autoAlpha: 1, ease: 'power2.out', duration: 0.28 },
            0
          );
        }
        if (title) {
          tl.fromTo(title,
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.36 },
            0.06
          );
        }
        if (desc) {
          tl.fromTo(desc,
            { y: 6, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.32 },
            0.14
          );
        }
      });

      // 4. Quiet, Minimal Reveal for Education from safe readable baseline
      const eduItem = root.querySelector('.education-timeline-item');
      if (eduItem) {
        gsap.fromTo(eduItem,
          { autoAlpha: 0.85, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eduItem,
              start: 'top 90%',
              end: 'top 65%',
              scrub: 0.5
            }
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRootRef}
      className="cinematic-section experience-section"
      aria-label="Experience, Leadership, Achievements and Education"
    >
      {/* 1. EXPERIENCE & LEADERSHIP CHAPTER */}
      <motion.div
        initial={{ opacity: 0.85, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px' }}
      >
        <span className="kicker">03 — EXPERIENCE &amp; LEADERSHIP</span>
      </motion.div>

      <TextReveal
        lines={["EXPERIENCE &", "LEADERSHIP"]}
        as="h2"
        className="section-title"
      />

      {/* Editorial Timeline: Experience & Leadership */}
      <div className="editorial-timeline-stack">
        {experiences.map((item, idx) => (
          <div
            key={`${item.organization}-${item.role}-${idx}`}
            className="editorial-timeline-item role-item"
            onMouseEnter={() => onCursorChange?.('hover')}
            onMouseLeave={() => onCursorChange?.('default')}
          >
            <div className="milestone-year-col">
              <div className="milestone-node-indicator">
                <span className="milestone-pulse-dot" />
                <span className="milestone-order-tag">0{idx + 1}</span>
              </div>
              <span className="milestone-period-text">{item.period}</span>
            </div>

            <div className="milestone-content-col">
              <div className="milestone-header-row">
                <h3 className="milestone-org-text">{item.organization}</h3>
                {(item.isCurrent || item.status === 'active' || (item.period && item.period.toLowerCase().includes('present'))) ? (
                  <span className="milestone-progression-badge badge-active">ACTIVE_ROLE</span>
                ) : (
                  <span className="milestone-progression-badge badge-previous">PREVIOUS_ROLE</span>
                )}
              </div>
              <div className="timeline-role-mask">
                <div className="milestone-role-text">{item.role}</div>
              </div>
              <p className="milestone-body-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ACHIEVEMENTS CHAPTER */}
      {achievements && achievements.length > 0 && (
        <div className="experience-sub-block" style={{ marginTop: 'clamp(80px, 12vh, 140px)' }}>
          <motion.div
            initial={{ opacity: 0.85, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '20px' }}
          >
            <span className="kicker">RECOGNITION &amp; PARTICIPATION</span>
          </motion.div>

          <TextReveal
            lines={["ACHIEVEMENTS"]}
            as="h3"
            className="experience-subheading"
          />

          <div className="editorial-timeline-stack" style={{ marginTop: '40px' }}>
            {achievements.map((item, idx) => {
              const isHackathons = item.result?.includes('6+') || item.title?.toLowerCase().includes('hackathon');

              return (
                <div
                  key={`${item.title}-${idx}`}
                  className="editorial-timeline-item achievement-item"
                  onMouseEnter={() => onCursorChange?.('hover')}
                  onMouseLeave={() => onCursorChange?.('default')}
                >
                  <div className="milestone-year-col">
                    <span className={`milestone-result-badge ${isHackathons ? 'badge-hackathons-luminous' : ''}`}>
                      {item.result}
                    </span>
                  </div>

                  <div className="milestone-content-col">
                    <div className="milestone-title-row">
                      <div className="timeline-role-mask">
                        <h4 className="milestone-achievement-title">{item.title}</h4>
                      </div>
                    </div>
                    <p className="milestone-body-desc">{item.whatIDid}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. EDUCATION CHAPTER: CALM & MINIMAL */}
      {education && (
        <div className="experience-sub-block" style={{ marginTop: 'clamp(90px, 14vh, 160px)' }}>
          <motion.div
            initial={{ opacity: 0.85, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '20px' }}
          >
            <span className="kicker">ACADEMIC BACKGROUND</span>
          </motion.div>

          <TextReveal
            lines={["EDUCATION"]}
            as="h3"
            className="experience-subheading"
          />

          <div className="editorial-timeline-stack" style={{ marginTop: '40px' }}>
            <div
              className="editorial-timeline-item education-timeline-item"
              onMouseEnter={() => onCursorChange?.('hover')}
              onMouseLeave={() => onCursorChange?.('default')}
            >
              <div className="milestone-year-col">
                <span className="milestone-period-text">{education.period}</span>
              </div>

              <div className="milestone-content-col">
                <h4 className="milestone-org-text">{education.institution}</h4>
                <div className="milestone-role-text">{education.degree}</div>
                <p className="milestone-body-desc">{education.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
