import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About({ aboutData, onCursorChange }) {
  const aboutRootRef = useRef(null);
  const aboutHeroBlockRef = useRef(null);
  const openingHairlineRef = useRef(null);
  const eyebrowRailRef = useRef(null);
  const statementRef = useRef(null);
  const heroLeadRef = useRef(null);
  const subMetaRef = useRef(null);

  const whoIAmMomentRef = useRef(null);
  const exploringMomentRef = useRef(null);
  const closingTrackRef = useRef(null);
  const closingLineRef = useRef(null);

  useEffect(() => {
    const root = aboutRootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isDesktop = window.innerWidth >= 1025;

    const ctx = gsap.context(() => {
      // ====================================================================
      // 0. ABOUT ENTRY CINEMATIC ARRIVAL (HERO → ABOUT OVERLAPPING HAND-OFF)
      // ====================================================================
      const heroBlock = aboutHeroBlockRef.current;
      const openingHairline = openingHairlineRef.current;
      const eyebrowRail = eyebrowRailRef.current;
      const statement = statementRef.current;
      const heroLead = heroLeadRef.current;
      const subMeta = subMetaRef.current;

      if (heroBlock) {
        const entryTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroBlock,
            start: 'top 92%',
            end: 'top 40%',
            scrub: 0.6
          }
        });

        if (openingHairline) {
          entryTl.fromTo(openingHairline,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', duration: 0.35 },
            0
          );
        }

        if (eyebrowRail) {
          entryTl.fromTo(eyebrowRail,
            { y: isDesktop ? 12 : 6, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.25 },
            0.05
          );
        }

        // Statement Rows: Minh Pham line mask reveal with staggered entry
        if (statement) {
          const row1 = statement.querySelector('.row-1');
          const row2 = statement.querySelector('.row-2');
          const row3 = statement.querySelector('.row-3');

          if (row1) {
            entryTl.fromTo(row1,
              { yPercent: isDesktop ? 105 : 70, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.42 },
              0.08
            );
          }

          if (row2) {
            entryTl.fromTo(row2,
              { yPercent: isDesktop ? 105 : 70, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.46 },
              0.14
            );
          }

          if (row3) {
            entryTl.fromTo(row3,
              { yPercent: isDesktop ? 105 : 70, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.50 },
              0.20
            );
          }
        }

        // 4-Pillar Intersection Matrix chips entrance
        const chips = heroBlock.querySelectorAll('.pillar-chip');
        if (chips.length) {
          entryTl.fromTo(chips,
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'power2.out', duration: 0.35 },
            0.22
          );
        }

        if (heroLead) {
          entryTl.fromTo(heroLead,
            { y: isDesktop ? 12 : 6, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.3 },
            0.20
          );
        }

        if (subMeta) {
          entryTl.fromTo(subMeta,
            { y: isDesktop ? 10 : 4, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.28 },
            0.24
          );
        }

        // Environmental Parallax Drift across Statement Rows as user scrolls through
        if (statement && isDesktop) {
          const row1 = statement.querySelector('.row-1');
          const row2 = statement.querySelector('.row-2');
          const row3 = statement.querySelector('.row-3');

          const driftTl = gsap.timeline({
            scrollTrigger: {
              trigger: statement,
              start: 'top 50%',
              end: 'bottom top',
              scrub: 1.2
            }
          });

          if (row1) driftTl.to(row1, { x: -14, ease: 'none' }, 0);
          if (row2) driftTl.to(row2, { x: 16, ease: 'none' }, 0);
          if (row3) driftTl.to(row3, { x: -10, ease: 'none' }, 0);
        }
      }

      // ====================================================================
      // 1. WHO I AM: Restrained Editorial Entrance (Fail-safe visibility & drift)
      // ====================================================================
      const whoBlock = whoIAmMomentRef.current;
      if (whoBlock) {
        const label = whoBlock.querySelector('.story-label');
        const lead = whoBlock.querySelector('.story-body-lead');
        const paragraphs = whoBlock.querySelectorAll('.story-body-text');
        const tags = whoBlock.querySelector('.story-context-tags');

        const whoTl = gsap.timeline({
          scrollTrigger: {
            trigger: whoBlock,
            start: 'top 88%',
            end: 'top 45%',
            scrub: 0.6
          }
        });

        if (label) {
          whoTl.fromTo(label,
            { y: isDesktop ? 10 : 4, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.25 },
            0
          );
        }

        if (lead) {
          whoTl.fromTo(lead,
            {
              x: isDesktop ? -10 : -3,
              autoAlpha: 0.9
            },
            {
              x: 0,
              autoAlpha: 1,
              ease: 'power2.out',
              duration: 0.38
            },
            0.06
          );
        }

        if (paragraphs.length) {
          whoTl.fromTo(paragraphs,
            { x: isDesktop ? -8 : -2, autoAlpha: 0.85 },
            { x: 0, autoAlpha: 1, stagger: 0.08, ease: 'power1.out', duration: 0.35 },
            0.14
          );
        }

        if (tags) {
          whoTl.fromTo(tags,
            { y: 6, autoAlpha: 0.85 },
            { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.24 },
            0.28
          );
        }
      }

      // ====================================================================
      // 2. WHAT I'M EXPLORING: Progressive Scroll Activation & Hover Feedback
      // ====================================================================
      const exploringItems = exploringMomentRef.current?.querySelectorAll('.exploring-item') || [];
      exploringItems.forEach((item) => {
        const num = item.querySelector('.exploring-num');
        const title = item.querySelector('.exploring-title');
        const desc = item.querySelector('.exploring-desc');
        const divider = item.querySelector('.exploring-divider');

        // Entrance Reveal from safe readable baseline
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            end: 'top 65%',
            scrub: 0.5,
          }
        });

        if (divider) {
          entranceTl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.4 }, 0);
        }
        if (num) {
          entranceTl.fromTo(num, { y: 8, autoAlpha: 0.8 }, { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.3 }, 0.04);
        }
        if (title) {
          entranceTl.fromTo(title, { x: isDesktop ? -8 : -3, y: 4, autoAlpha: 0.85 }, { x: 0, y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.35 }, 0.08);
        }
        if (desc) {
          entranceTl.fromTo(desc, { y: 4, autoAlpha: 0.85 }, { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.35 }, 0.12);
        }

        // Active Row Emphasis (Closest to visual center of viewport)
        ScrollTrigger.create({
          trigger: item,
          start: 'top 62%',
          end: 'bottom 38%',
          onEnter: () => {
            if (title) gsap.to(title, { color: '#ffffff', x: isDesktop ? 6 : 2, autoAlpha: 1, duration: 0.28 });
            if (num) gsap.to(num, { color: '#ffffff', x: isDesktop ? 4 : 0, autoAlpha: 1, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#e0e0ec', autoAlpha: 1, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.28)', duration: 0.28 });
          },
          onLeave: () => {
            if (title) gsap.to(title, { color: '#d0d0dc', x: 0, autoAlpha: 0.85, duration: 0.28 });
            if (num) gsap.to(num, { color: 'var(--text-secondary)', x: 0, autoAlpha: 0.75, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#a0a0b0', autoAlpha: 0.85, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.10)', duration: 0.28 });
          },
          onEnterBack: () => {
            if (title) gsap.to(title, { color: '#ffffff', x: isDesktop ? 6 : 2, autoAlpha: 1, duration: 0.28 });
            if (num) gsap.to(num, { color: '#ffffff', x: isDesktop ? 4 : 0, autoAlpha: 1, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#e0e0ec', autoAlpha: 1, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.28)', duration: 0.28 });
          },
          onLeaveBack: () => {
            if (title) gsap.to(title, { color: '#d0d0dc', x: 0, autoAlpha: 0.85, duration: 0.28 });
            if (num) gsap.to(num, { color: 'var(--text-secondary)', x: 0, autoAlpha: 0.75, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#a0a0b0', autoAlpha: 0.85, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.10)', duration: 0.28 });
          }
        });

        // Fine cursor hover interaction with sibling dimming (Minh Pham & Benjamin Simon interactive focus)
        if (isDesktop) {
          const itemMode = item.getAttribute('data-mode') || 'exploring';
          item.addEventListener('mouseenter', () => {
            exploringItems.forEach(other => {
              if (other !== item) {
                gsap.to(other, { opacity: 0.38, duration: 0.25 });
              }
            });
            if (title) gsap.to(title, { x: 8, color: '#ffffff', duration: 0.25 });
            if (num) gsap.to(num, { x: 4, color: '#ffffff', duration: 0.25 });
            onCursorChange?.('hover');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: itemMode }));
            }
          });
          item.addEventListener('mouseleave', () => {
            exploringItems.forEach(other => {
              gsap.to(other, { opacity: 1, duration: 0.25 });
            });
            const isActive = item.classList.contains('active-center');
            if (title) gsap.to(title, { x: 0, color: isActive ? '#ffffff' : '#d0d0dc', duration: 0.25 });
            if (num) gsap.to(num, { x: 0, color: isActive ? '#ffffff' : 'var(--text-secondary)', duration: 0.25 });
            onCursorChange?.('default');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'exploring' }));
            }
          });
        }
      });

      // ====================================================================
      // 3. ABOUT → SELECTED WORK: Closing Line Bridge
      // ====================================================================
      const closingLine = closingLineRef.current;
      const closingTrack = closingTrackRef.current;
      if (closingLine && closingTrack) {
        gsap.fromTo(closingLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: closingTrack,
              start: 'top 88%',
              end: 'top 50%',
              scrub: 0.5
            }
          }
        );
      }

      // ====================================================================
      // 4. PARALLAX DEPTH ACROSS EDITORIAL LABELS (PRESERVED ON ALL VIEWPORTS)
      // ====================================================================
      const labels = root.querySelectorAll('.story-label, .about-eyebrow-rail');
      labels.forEach(lbl => {
        gsap.to(lbl, {
          scrollTrigger: {
            trigger: lbl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          },
          y: isDesktop ? -14 : -6,
          ease: 'none'
        });
      });

      // ====================================================================
      // 5. WEBGL ATMOSPHERIC MODE SHIFTS: ABOUT & EXPLORING
      // ====================================================================
      ScrollTrigger.create({
        trigger: root,
        start: 'top 70%',
        end: 'bottom 25%',
        onEnter: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'about' }));
          }
        },
        onEnterBack: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'about' }));
          }
        }
      });

      const exploringBlock = exploringMomentRef.current;
      if (exploringBlock) {
        ScrollTrigger.create({
          trigger: exploringBlock,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'exploring' }));
            }
          },
          onLeaveBack: () => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'about' }));
            }
          }
        });
      }
    }, root);

    return () => ctx.revert();
  }, [onCursorChange]);

  return (
    <section id="about" ref={aboutRootRef} className="about-cinematic-page" aria-label="About Eshwar M">

      {/* ====================================================================
          1. ABOUT HERO: MONUMENTAL ASYMMETRIC EDITORIAL STATEMENT
          ==================================================================== */}
      <div ref={aboutHeroBlockRef} className="about-hero-block">
        <div className="about-opening-hairline-track">
          <div ref={openingHairlineRef} className="about-opening-hairline-fill" />
        </div>

        <div ref={eyebrowRailRef} className="about-eyebrow-rail">
          <span className="editorial-eyebrow">ABOUT / 01</span>
          <span className="eyebrow-sep">•</span>
          <span className="eyebrow-sub">INTRODUCTION & PHILOSOPHY</span>
        </div>

        <div className="about-hero-statement-col">
          <h1 ref={statementRef} className="asymmetric-statement" aria-label="I BUILD THINGS THAT SOLVE PROBLEMS.">
            <div className="statement-line-mask mask-row-1">
              <span className="statement-row row-1">I BUILD THINGS</span>
            </div>
            <div className="statement-line-mask mask-row-2">
              <span className="statement-row row-2">THAT SOLVE</span>
            </div>
            <div className="statement-line-mask mask-row-3">
              <span className="statement-row row-3">PROBLEMS.</span>
            </div>
          </h1>

          {/* Architectural 4-Pillar Intersection Matrix */}
          <div className="about-intersection-matrix">
            <span className="intersection-kicker">BUILDING AT THE INTERSECTION OF</span>
            <div className="intersection-pillars-row">
              <div className="pillar-chip" data-domain="ai">
                <span className="pillar-num">01</span>
                <span className="pillar-title">AI</span>
                <span className="pillar-sep">/</span>
                <span className="pillar-sub">INTELLIGENCE</span>
              </div>
              <div className="pillar-chip" data-domain="product">
                <span className="pillar-num">02</span>
                <span className="pillar-title">PRODUCT</span>
                <span className="pillar-sep">/</span>
                <span className="pillar-sub">UTILITY</span>
              </div>
              <div className="pillar-chip" data-domain="data">
                <span className="pillar-num">03</span>
                <span className="pillar-title">DATA</span>
                <span className="pillar-sep">/</span>
                <span className="pillar-sub">EVIDENCE</span>
              </div>
              <div className="pillar-chip" data-domain="innovation">
                <span className="pillar-num">04</span>
                <span className="pillar-title">INNOVATION</span>
                <span className="pillar-sep">/</span>
                <span className="pillar-sub">VENTURE</span>
              </div>
            </div>
          </div>

          <div className="about-hero-lead-row">
            <p ref={heroLeadRef} className="about-hero-lead">
              Turning complex problems into practical technology solutions, with a focus on real-world impact beyond the code itself.
            </p>

            <div ref={subMetaRef} className="about-hero-sub-meta">
              <div className="sub-meta-item">
                <span className="meta-kicker">DISCIPLINE</span>
                <span className="meta-val">AI · PRODUCT · DATA</span>
              </div>
              <div className="sub-meta-item">
                <span className="meta-kicker">LOCATION</span>
                <span className="meta-val">MYSURU, KARNATAKA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. WHO I AM: EDITORIAL PERSONALITY REVEAL (AUTHENTIC NARRATIVE)
          ==================================================================== */}
      <div ref={whoIAmMomentRef} className="about-story-moment who-i-am-moment">
        <div className="story-label-col">
          <span className="story-label">WHO I AM</span>
        </div>
        <div className="story-content-col">
          <p className="story-body-lead">
            I’m a Computer Science and Engineering student exploring the intersection of AI, Product, Data and Innovation.
          </p>

          <div className="story-editorial-split-grid">
            <div className="story-split-col">
              <span className="split-kicker">PHILOSOPHY &amp; PURPOSE</span>
              <p className="story-body-text">
                I enjoy turning real-world problems into practical technology solutions, experimenting with new ideas, and building products that are useful beyond the code itself.
              </p>
            </div>
            <div className="story-split-col">
              <span className="split-kicker">SCOPE &amp; PERSPECTIVE</span>
              <p className="story-body-text">
                My interests span Generative AI, product development, data analytics and entrepreneurship. I enjoy understanding problems, designing solutions, and bringing ideas from concept to implementation.
              </p>
            </div>
          </div>

          <div className="story-objective-banner">
            <span className="objective-label">LOOKING AHEAD</span>
            <p className="objective-text">
              Looking for opportunities to learn, build, collaborate and gain real-world experience across AI, product, data and business-oriented technology.
            </p>
          </div>

          <div className="story-context-tags">
            <span className="context-tag">MYSURU, KARNATAKA</span>
            <span className="context-sep">•</span>
            <span className="context-tag">VVCE CSE</span>
            <span className="context-sep">•</span>
            <span className="context-tag">GRADUATING 2028</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. WHAT I'M EXPLORING: INTERACTIVE CAPABILITY FIELD
          ==================================================================== */}
      <div ref={exploringMomentRef} className="about-story-moment exploring-moment">
        <div className="story-label-col">
          <span className="story-label">WHAT I'M EXPLORING</span>
          <span className="story-sub-tag">FOCUS DOMAINS</span>
        </div>
        <div className="story-content-col">
          <div className="exploring-typo-list">
            
            <div className="exploring-item" data-mode="p1">
              <div className="exploring-meta-col">
                <span className="exploring-num">01</span>
                <span className="exploring-micro-tag">APPLIED AI</span>
              </div>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">GENERATIVE AI</h3>
                <p className="exploring-desc">
                  Exploring how LLMs and AI can be used to build practical applications, automate workflows, and create intelligent user experiences.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

            <div className="exploring-item" data-mode="p2">
              <div className="exploring-meta-col">
                <span className="exploring-num">02</span>
                <span className="exploring-micro-tag">PRODUCT DESIGN</span>
              </div>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">PRODUCT</h3>
                <p className="exploring-desc">
                  Interested in understanding users, identifying meaningful problems, defining solutions, and turning ideas into useful products.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

            <div className="exploring-item" data-mode="data">
              <div className="exploring-meta-col">
                <span className="exploring-num">03</span>
                <span className="exploring-micro-tag">DATA SYSTEMS</span>
              </div>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">DATA</h3>
                <p className="exploring-desc">
                  Working with data to uncover patterns, generate insights, support decisions, and understand real-world outcomes.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

            <div className="exploring-item" data-mode="p4">
              <div className="exploring-meta-col">
                <span className="exploring-num">04</span>
                <span className="exploring-micro-tag">VENTURE &amp; IMPACT</span>
              </div>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">ENTREPRENEURSHIP</h3>
                <p className="exploring-desc">
                  Exploring startup ideas, innovation, business models, and how technology can be transformed into solutions for real-world problems.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

          </div>
        </div>
      </div>

      {/* Subtle Hairline to conclude Section 01 */}
      <div ref={closingTrackRef} className="about-section-closing-track">
        <div ref={closingLineRef} className="about-section-closing-line" />
      </div>

    </section>
  );
}
