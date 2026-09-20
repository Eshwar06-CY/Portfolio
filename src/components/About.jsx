import React from 'react';
import { motion } from 'framer-motion';

export default function About({ aboutData, onCursorChange }) {
  return (
    <section id="about" className="about-cinematic-page" aria-label="About Eshwar M">

      {/* ====================================================================
          1. ABOUT HERO: ASYMMETRIC OPENING STATEMENT + CINEMATIC PORTRAIT
          ==================================================================== */}
      <div className="about-hero-block">
        <div className="about-eyebrow-rail">
          <span className="editorial-eyebrow">ABOUT / 01</span>
          <span className="eyebrow-sep">•</span>
          <span className="eyebrow-sub">INTRODUCTION & PHILOSOPHY</span>
        </div>

        <div className="about-hero-grid">
          {/* Monumental Asymmetric Typography */}
          <div className="about-hero-statement-col">
            <h1 className="asymmetric-statement">
              <span className="statement-row row-1">I BUILD THINGS</span>
              <span className="statement-row row-2">THAT SOLVE</span>
              <span className="statement-row row-3">PROBLEMS.</span>
            </h1>

            <p className="about-hero-lead">
              A Computer Science student exploring the intersection of AI, product thinking,
              and data-driven engineering.
            </p>
          </div>

          {/* Portrait Emerging from Dark Environment */}
          <div className="about-hero-portrait-col">
            <div className="about-portrait-ambient-glow" aria-hidden="true" />
            <div className="about-portrait-frame">
              <img
                src="/portrait.png"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/portrait.png";
                }}
                alt="Eshwar M — Editorial Portrait"
                className="about-portrait-img"
                loading="eager"
                decoding="async"
              />
              <div className="about-portrait-fade-overlay" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. WHO I AM: DIRECT, PERSONAL INTRODUCTION (NO RESUME CLICHÉS)
          ==================================================================== */}
      <div className="about-story-moment who-i-am-moment">
        <div className="story-label-col">
          <span className="story-label">WHO I AM</span>
        </div>
        <div className="story-content-col">
          <p className="story-body-lead">
            I am a Computer Science and Engineering undergraduate based in Mysore, India.
            My work centers around designing and deploying software systems that bridge algorithmic
            models with real-world usability.
          </p>
          <p className="story-body-text">
            Rather than accumulating technologies for their own sake, I am drawn to the
            practical mechanics of software: understanding user friction, architecting
            resilient data pipelines, and turning raw ideas into tangible products that
            people can actually use.
          </p>
          <div className="story-context-tags">
            <span className="context-tag">MYSORE, KARNATAKA</span>
            <span className="context-sep">•</span>
            <span className="context-tag">CSE UNDERGRADUATE</span>
            <span className="context-sep">•</span>
            <span className="context-tag">PRODUCT & DATA FOCUS</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. WHAT I BUILD: SPATIALLY DISTRIBUTED TYPOGRAPHY (NO CARDS / PILLS)
          ==================================================================== */}
      <div className="about-story-moment what-i-build-moment">
        <div className="story-label-col">
          <span className="story-label">WHAT I BUILD</span>
        </div>
        <div className="story-content-col">
          <div className="spatial-words-stack">
            
            <div className="spatial-word-row row-left">
              <span className="spatial-word">AI</span>
              <span className="spatial-word-desc">
                Intelligent agents, autonomous workflows, and LLM-powered applications that automate complex manual tasks.
              </span>
            </div>

            <div className="spatial-word-row row-center">
              <span className="spatial-word">PRODUCT</span>
              <span className="spatial-word-desc">
                Scoped systems designed from user needs backward, emphasizing clarity, reduced friction, and fast feedback loops.
              </span>
            </div>

            <div className="spatial-word-row row-right">
              <span className="spatial-word">DATA</span>
              <span className="spatial-word-desc">
                ETL pipelines, tabular EDA, schema modeling in PostgreSQL, and analytics that surface clear decision metrics.
              </span>
            </div>

            <div className="spatial-word-row row-offset">
              <span className="spatial-word">SOFTWARE</span>
              <span className="spatial-word-desc">
                High-performance web applications, robust backend microservices, and maintainable production codebases.
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ====================================================================
          4. HOW I THINK: QUIET EDITORIAL PHILOSOPHY
          ==================================================================== */}
      <div className="about-story-moment how-i-think-moment">
        <div className="story-label-col">
          <span className="story-label">HOW I THINK</span>
        </div>
        <div className="story-content-col">
          <blockquote className="editorial-quote">
            “I like understanding the problem first, then figuring out what technology actually needs to be there.”
          </blockquote>
          <p className="story-body-text">
            Complexity is easy to add and difficult to remove. The goal is always to build the
            simplest architecture that completely solves the problem—nothing more, nothing less.
            When a system is designed well, the engineering becomes invisible, and the utility feels effortless.
          </p>
        </div>
      </div>

      {/* ====================================================================
          5. WHAT I'M EXPLORING: PURE TYPOGRAPHIC DOMAINS
          ==================================================================== */}
      <div className="about-story-moment exploring-moment">
        <div className="story-label-col">
          <span className="story-label">WHAT I'M EXPLORING</span>
        </div>
        <div className="story-content-col">
          <div className="exploring-typo-list">
            
            <div className="exploring-item">
              <span className="exploring-num">01</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">GENERATIVE AI & AGENTIC WORKFLOWS</h3>
                <p className="exploring-desc">
                  Structured outputs, function calling with Gemini/OpenAI APIs, autonomous agent loops, and evaluation harnesses.
                </p>
              </div>
            </div>

            <div className="exploring-item">
              <span className="exploring-num">02</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">PRODUCT ARCHITECTURE & SCOPING</h3>
                <p className="exploring-desc">
                  Translating ambiguous operational friction into concise technical PRDs, user journey ergonomics, and edge-case handling.
                </p>
              </div>
            </div>

            <div className="exploring-item">
              <span className="exploring-num">03</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">DATA ANALYTICS & PIPELINES</h3>
                <p className="exploring-desc">
                  Tabular preprocessing with Pandas, SQL relational modeling, exploratory analysis, and automated KPI generation.
                </p>
              </div>
            </div>

            <div className="exploring-item">
              <span className="exploring-num">04</span>
              <div className="exploring-text-wrap">
                <h3 className="exploring-title">INTELLIGENT SYSTEM INTEGRATION</h3>
                <p className="exploring-desc">
                  Connecting probabilistic AI models into deterministic web apps with instant reactivity, resilient fallbacks, and craft.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ====================================================================
          6. TRANSITION TOWARD SELECTED WORK
          ==================================================================== */}
      <div className="about-transition-to-work">
        <div className="trans-hairline" />
        <div className="trans-content">
          <div className="trans-kicker-box">
            <span className="trans-kicker">02 / SELECTED WORK</span>
            <span className="trans-sep">•</span>
            <span className="trans-sub">5 ARCHITECTED PLATFORMS</span>
          </div>
          <p className="trans-lead">
            The ideas in action: explore production builds spanning AI automation,
            high-scale database planning, and predictive analytics.
          </p>
          <span className="trans-cue">SCROLL DOWN TO ADVANCE THE PROJECT REEL ↓</span>
        </div>
      </div>

    </section>
  );
}
