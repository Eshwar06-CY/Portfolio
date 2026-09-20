import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

export default function Expertise({ expertiseData, onCursorChange }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Normalize category names to match canonical typography
  const canonicalCategories = [
    {
      number: "01",
      title: "AI & GENERATIVE AI",
      mode: "ai",
      skills: "LLMs · Generative AI · Prompt Engineering · Gemini API · Vector Workflows",
      description: "Developing practical AI applications with modern LLM APIs, prompt engineering frameworks, and intelligent autonomous workflows."
    },
    {
      number: "02",
      title: "DATA & ANALYTICS",
      mode: "data",
      skills: "Python · Pandas · SQL · PostgreSQL · EDA · Data Visualization",
      description: "Cleaning multi-year tabular datasets, schema modeling in PostgreSQL, and deriving actionable metric decision layers."
    },
    {
      number: "03",
      title: "PRODUCT",
      mode: "ai",
      skills: "Product Strategy · User Journey Scoping · System Design · KPI Metrics",
      description: "Deconstructing operational friction into structured technical PRDs, balancing algorithmic complexity against human usability."
    },
    {
      number: "04",
      title: "DEVELOPMENT",
      mode: "dev",
      skills: "React · JavaScript · FastAPI · Flask · REST APIs · High-Perf UI",
      description: "Architecting responsive, high-performance web applications and resilient backend microservices with clear contracts."
    },
    {
      number: "05",
      title: "TOOLS",
      mode: "default",
      skills: "Git · GitHub · Linux Shell · VS Code · AI Development Ecosystem",
      description: "Modern production developer workflows, version control discipline, and state-of-the-art agentic pairing."
    }
  ];

  return (
    <section id="expertise" className="cinematic-section expertise-section" aria-label="Expertise and Competencies">
      {/* Section Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px' }}
      >
        <span className="kicker">03 — EXPERTISE</span>
      </motion.div>

      <TextReveal
        lines={["WHAT I WORK WITH"]}
        as="h2"
        className="section-title"
      />

      {/* Dynamic Environmental Glow reacting to active category */}
      <div
        className="expertise-ambient-environment"
        style={{
          opacity: hoveredIdx !== null ? 0.85 : 0.25,
          background: hoveredIdx !== null
            ? `radial-gradient(circle at 50% ${20 + hoveredIdx * 16}%, rgba(30, 45, 75, 0.25) 0%, transparent 65%)`
            : 'radial-gradient(circle at 50% 50%, rgba(20, 20, 28, 0.18) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />

      {/* Editorial Large Typography List (No generic cards) */}
      <div className="editorial-expertise-stack">
        {canonicalCategories.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <motion.div
              key={item.title}
              className={`editorial-expertise-item ${isHovered ? 'item-active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                onCursorChange?.('hover');
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: item.mode }));
                  window.dispatchEvent(new CustomEvent('camera-shift', {
                    detail: { x: (idx - 2) * 0.12, y: (2 - idx) * 0.08 }
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
                  <span className="item-number">{item.number}</span>
                  <h3 className="item-title-text">{item.title}</h3>
                </div>

                <div className="item-skills-tag">
                  <span>{item.skills}</span>
                </div>
              </div>

              {/* Supporting information revealed smoothly on hover */}
              <div className="item-expanded-detail">
                <p>{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
