import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function Expertise({ expertiseData, onCursorChange }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const sectionRef = useRef(null);

  // Exact 7 categorized skill groups matching Phase 1 Art Direction
  const fallbackCategories = [
    {
      number: "01",
      category: "Programming",
      mode: "dev",
      skills: [
        "Python",
        "JavaScript",
        "TypeScript",
        "C / C++",
        "Object-Oriented Programming"
      ],
      description: "Solid foundations in programming languages, algorithmic logic, object-oriented principles, and clean code architecture."
    },
    {
      number: "02",
      category: "AI / ML",
      mode: "ai",
      skills: [
        "Generative AI",
        "Large Language Models (LLMs)",
        "Prompt Engineering",
        "LLM Integration",
        "AI Application Development",
        "Google Gemini API"
      ],
      description: "Developing practical AI applications with modern LLM APIs, prompt engineering frameworks, intelligent workflows, and structured outputs."
    },
    {
      number: "03",
      category: "Web Development",
      mode: "dev",
      skills: [
        "React.js",
        "FastAPI",
        "Flask",
        "REST APIs",
        "Back-End Development",
        "Modern Frontend Architecture"
      ],
      description: "Architecting responsive, high-performance web applications and robust backend services with clean API contracts and solid engineering fundamentals."
    },
    {
      number: "04",
      category: "Data & Databases",
      mode: "data",
      skills: [
        "Data Analytics",
        "SQL",
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "DBMS",
        "Relational Schema Design"
      ],
      description: "Working with data to uncover patterns, generate actionable insights, support decisions, and engineer structured relational schemas."
    },
    {
      number: "05",
      category: "Tools & Platforms",
      mode: "default",
      skills: [
        "Git",
        "GitHub",
        "VS Code",
        "Vite",
        "SQLAlchemy",
        "Testing & Debugging"
      ],
      description: "Modern developer workflow tools, version control discipline, automated testing, and dependable development practices."
    },
    {
      number: "06",
      category: "Core CS",
      mode: "dev",
      skills: [
        "Data Structures",
        "Algorithms",
        "DBMS Concepts",
        "Operating Systems Fundamentals",
        "Computer Networks Basics"
      ],
      description: "Strong theoretical and practical grounding in algorithms, data structures, system architecture, and computational problem solving."
    },
    {
      number: "07",
      category: "Product & Startup",
      mode: "ai",
      skills: [
        "Product Thinking",
        "Requirements Analysis",
        "Problem Solving",
        "Product Development",
        "Innovation",
        "Entrepreneurship"
      ],
      description: "Understanding users, identifying meaningful operational problems, scoping clear requirements, and turning ideas into viable products."
    }
  ];

  const categories = (expertiseData && expertiseData.length > 0) ? expertiseData : fallbackCategories;

  const domainTags = [
    'CORE LANGUAGES',
    'APPLIED AI & LLMS',
    'FULL STACK SYSTEMS',
    'DATA & RELATIONAL SQL',
    'DEV TOOLCHAIN & VCS',
    'CS FOUNDATIONS',
    'PRODUCT & VENTURE'
  ];

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = root.querySelectorAll('.editorial-expertise-item');
      items.forEach((item, idx) => {
        const num = item.querySelector('.item-number');
        const code = item.querySelector('.item-domain-code');
        const title = item.querySelector('.item-title-text');
        const pills = item.querySelectorAll('.item-skill-pill');
        const detail = item.querySelector('.item-expanded-detail');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });

        if (num) {
          tl.fromTo(num,
            { clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)', x: -6, autoAlpha: 0 },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', x: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.3 },
            0.02
          );
        }
        if (code) {
          tl.fromTo(code,
            { autoAlpha: 0, x: -4 },
            { autoAlpha: 1, x: 0, ease: 'power1.out', duration: 0.25 },
            0.06
          );
        }
        if (title) {
          tl.fromTo(title,
            { yPercent: 105, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.38 },
            0.08
          );
        }
        if (pills.length) {
          tl.fromTo(pills,
            { autoAlpha: 0, y: 5 },
            { autoAlpha: 1, y: 0, stagger: 0.025, ease: 'power2.out', duration: 0.28 },
            0.14
          );
        }
        if (detail) {
          tl.fromTo(detail,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.3 },
            0.20
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, [categories]);

  return (
    <section id="expertise" ref={sectionRef} className="cinematic-section expertise-section" aria-label="Skills & Technologies">
      {/* Section Kicker with Capability Matrix Telemetry */}
      <motion.div
        className="capability-matrix-header-box"
        initial={{ opacity: 0.85, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px' }}
      >
        <div className="capability-matrix-kicker-row">
          <span className="kicker">04 — CAPABILITY MATRIX</span>
          <span className="matrix-sep">•</span>
          <span className="matrix-sub-tag">7 TECHNICAL &amp; PRODUCT DOMAINS</span>
        </div>
      </motion.div>

      <TextReveal
        lines={["CAPABILITY", "MATRIX"]}
        as="h2"
        className="section-title"
      />

      {/* Subtle Environmental Backdrop */}
      <div
        className="expertise-ambient-environment"
        style={{
          opacity: hoveredIdx !== null ? 0.45 : 0.15,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)'
        }}
        aria-hidden="true"
      />

      {/* Editorial Large Typography List (No generic cards or tag walls) */}
      <div className="editorial-expertise-stack">
        {categories.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const skillList = Array.isArray(item.skills) ? item.skills : (item.skills ? [item.skills] : []);
          const itemMode = item.mode || (idx === 1 ? 'ai' : idx === 3 ? 'data' : idx === 0 || idx === 2 || idx === 5 ? 'dev' : 'default');
          const domainTag = domainTags[idx] || 'CAPABILITY // SYSTEM';

          return (
            <div
              key={item.category}
              className={`editorial-expertise-item ${isHovered ? 'item-active' : ''}`}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                onCursorChange?.('hover');
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: itemMode }));
                  window.dispatchEvent(new CustomEvent('camera-shift', {
                    detail: { x: (idx - 3) * 0.08, y: (3 - idx) * 0.06 }
                  }));
                }
              }}
              onMouseLeave={() => {
                setHoveredIdx(null);
                onCursorChange?.('default');
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: 'default' }));
                  window.dispatchEvent(new CustomEvent('camera-shift', { detail: { x: 0, y: 0 } }));
                }
              }}
            >
              <div className="item-main-row">
                <div className="item-title-col">
                  <div className="item-meta-top">
                    <span className="item-number">{item.number}</span>
                    <span className="item-domain-code">{domainTag}</span>
                  </div>
                  <div className="expertise-title-mask">
                    <h3 className="item-title-text">{item.category.toUpperCase()}</h3>
                  </div>
                </div>

                <div className="item-skills-cluster">
                  {skillList.map((skill) => (
                    <span key={skill} className="item-skill-pill">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Supporting information revealed cleanly */}
              <div className="item-expanded-detail">
                <p className="item-description-text">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
