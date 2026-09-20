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

  const exploringMomentRef = useRef(null);

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
            end: 'top 45%',
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
            { y: isDesktop ? 14 : 8, autoAlpha: 0.35 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.25 },
            0.06
          );
        }

        if (statement) {
          entryTl.fromTo(statement,
            { y: isDesktop ? 18 : 10, scale: 0.985, autoAlpha: 0.35 },
            { y: 0, scale: 1.00, autoAlpha: 1, ease: 'power2.out', duration: 0.35 },
            0.10
          );
        }

        if (heroLead) {
          entryTl.fromTo(heroLead,
            { y: isDesktop ? 14 : 8, autoAlpha: 0.3 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.3 },
            0.16
          );
        }

        if (subMeta) {
          entryTl.fromTo(subMeta,
            { y: isDesktop ? 12 : 6, autoAlpha: 0.3 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.28 },
            0.20
          );
        }
      }

      // ====================================================================
      // 1. WHAT I'M EXPLORING: Restrained scroll reveal & active row emphasis
      // ====================================================================
      const exploringItems = exploringMomentRef.current?.querySelectorAll('.exploring-item') || [];
      exploringItems.forEach((item) => {
        const num = item.querySelector('.exploring-num');
        const title = item.querySelector('.exploring-title');
        const desc = item.querySelector('.exploring-desc');
        const divider = item.querySelector('.exploring-divider');

        // Restrained Entrance Reveal
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
          entranceTl.fromTo(num, { y: 10, autoAlpha: 0.35 }, { y: 0, autoAlpha: 0.75, ease: 'power1.out', duration: 0.3 }, 0.04);
        }
        if (title) {
          entranceTl.fromTo(title, { x: isDesktop ? -10 : -4, y: 6, autoAlpha: 0.45 }, { x: 0, y: 0, autoAlpha: 0.85, ease: 'power2.out', duration: 0.35 }, 0.08);
        }
        if (desc) {
          entranceTl.fromTo(desc, { y: 6, autoAlpha: 0.4 }, { y: 0, autoAlpha: 0.75, ease: 'power1.out', duration: 0.35 }, 0.12);
        }

        // Active Row Emphasis (Closest to visual center of viewport)
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            if (title) gsap.to(title, { color: '#ffffff', autoAlpha: 1, duration: 0.28 });
            if (num) gsap.to(num, { color: '#ffffff', autoAlpha: 1, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#cfd0dc', autoAlpha: 0.95, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.22)', duration: 0.28 });
          },
          onLeave: () => {
            if (title) gsap.to(title, { color: '#e0e0ea', autoAlpha: 0.75, duration: 0.28 });
            if (num) gsap.to(num, { color: 'var(--text-muted)', autoAlpha: 0.65, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#9898a8', autoAlpha: 0.7, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.08)', duration: 0.28 });
          },
          onEnterBack: () => {
            if (title) gsap.to(title, { color: '#ffffff', autoAlpha: 1, duration: 0.28 });
            if (num) gsap.to(num, { color: '#ffffff', autoAlpha: 1, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#cfd0dc', autoAlpha: 0.95, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.22)', duration: 0.28 });
          },
          onLeaveBack: () => {
            if (title) gsap.to(title, { color: '#e0e0ea', autoAlpha: 0.85, duration: 0.28 });
            if (num) gsap.to(num, { color: 'var(--text-muted)', autoAlpha: 0.75, duration: 0.28 });
            if (desc) gsap.to(desc, { color: '#9898a8', autoAlpha: 0.75, duration: 0.28 });
            if (divider) gsap.to(divider, { backgroundColor: 'rgba(255, 255, 255, 0.08)', duration: 0.28 });
          }
        });
      });

      // ====================================================================
      // 2. PARALLAX DEPTH ACROSS EDITORIAL LABELS (PRESERVED ON ALL VIEWPORTS)
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
    }, root);

    return () => ctx.revert();
  }, []);

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
          <h1 ref={statementRef} className="asymmetric-statement">
            <span className="statement-row row-1">I BUILD THINGS</span>
            <span className="statement-row row-2">THAT SOLVE</span>
            <span className="statement-row row-3">PROBLEMS.</span>
          </h1>

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
          2. WHO I AM: DIRECT, PERSONAL INTRODUCTION (SOURCE OF TRUTH BLOCKS)
          ==================================================================== */}
      <div className="about-story-moment who-i-am-moment">
        <div className="story-label-col">
          <span className="story-label">WHO I AM</span>
        </div>
        <div className="story-content-col">
          <p className="story-body-lead">
            I’m a Computer Science and Engineering student exploring the intersection of AI, Product, Data and Innovation.
          </p>
          <p className="story-body-text">
            I enjoy turning real-world problems into practical technology solutions, experimenting with new ideas, and building products that are useful beyond the code itself.
          </p>
          <p className="story-body-text">
            My interests span Generative AI, product development, data analytics and entrepreneurship. I enjoy understanding problems, designing solutions, and bringing ideas from concept to implementation.
          </p>
          <p className="story-body-text">
            I’m currently looking for opportunities to learn, build, collaborate and gain real-world experience across AI, product, data and business-oriented technology.
          </p>
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
          2. WHAT I'M EXPLORING: PURE TYPOGRAPHIC DOMAINS (SOURCE OF TRUTH)
          ==================================================================== */}
      <div ref={exploringMomentRef} className="about-story-moment exploring-moment">
        <div className="story-label-col">
          <span className="story-label">WHAT I'M EXPLORING</span>
        </div>
        <div className="story-content-col">
          <div className="exploring-typo-list">
            
            <div className="exploring-item">
              <span className="exploring-num">01</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">GENERATIVE AI</h3>
                <p className="exploring-desc">
                  Exploring how LLMs and AI can be used to build practical applications, automate workflows, and create intelligent user experiences.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

            <div className="exploring-item">
              <span className="exploring-num">02</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">PRODUCT</h3>
                <p className="exploring-desc">
                  Interested in understanding users, identifying meaningful problems, defining solutions, and turning ideas into useful products.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

            <div className="exploring-item">
              <span className="exploring-num">03</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">DATA</h3>
                <p className="exploring-desc">
                  Working with data to uncover patterns, generate insights, support decisions, and understand real-world outcomes.
                </p>
              </div>
              <div className="exploring-divider" />
            </div>

            <div className="exploring-item">
              <span className="exploring-num">04</span>
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
      <div className="about-section-closing-track">
        <div className="about-section-closing-line" />
      </div>

    </section>
  );
}
