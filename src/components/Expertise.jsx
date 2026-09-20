import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

export default function Expertise({ expertiseData, onCursorChange }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Exact 5 categorized skill groups from Source of Truth
  const fallbackCategories = [
    {
      number: "01",
      category: "AI & Emerging Technology",
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
      number: "02",
      category: "Product & Problem Solving",
      mode: "ai",
      skills: [
        "Product Thinking",
        "Requirements Analysis",
        "Problem Solving",
        "Product Development",
        "Innovation",
        "Entrepreneurship"
      ],
      description: "Understanding users, identifying meaningful operational problems, scoping clear requirements, and turning ideas into useful products."
    },
    {
      number: "03",
      category: "Data & Database",
      mode: "data",
      skills: [
        "Data Analytics",
        "SQL",
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "DBMS",
        "Database Design"
      ],
      description: "Working with data to uncover patterns, generate actionable insights, support decisions, and engineer structured relational schemas."
    },
    {
      number: "04",
      category: "Development",
      mode: "dev",
      skills: [
        "Python",
        "JavaScript",
        "TypeScript",
        "React.js",
        "FastAPI",
        "Flask",
        "API Development",
        "Back-End Development",
        "Web Services",
        "Object-Oriented Programming",
        "Data Structures",
        "Algorithms"
      ],
      description: "Architecting responsive, high-performance web applications and robust backend services with clean API contracts and solid engineering fundamentals."
    },
    {
      number: "05",
      category: "Tools",
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
    }
  ];

  const categories = (expertiseData && expertiseData.length > 0) ? expertiseData : fallbackCategories;

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
        <span className="kicker">04 — SKILLS &amp; TECHNOLOGIES</span>
      </motion.div>

      <TextReveal
        lines={["SKILLS &", "TECHNOLOGIES"]}
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

      {/* Editorial Large Typography List (No generic cards or tag walls) */}
      <div className="editorial-expertise-stack">
        {categories.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const formattedSkills = Array.isArray(item.skills) ? item.skills.join(' · ') : item.skills;
          const itemMode = item.mode || (idx === 0 ? 'ai' : idx === 2 ? 'data' : idx === 3 ? 'dev' : 'default');

          return (
            <motion.div
              key={item.category}
              className={`editorial-expertise-item ${isHovered ? 'item-active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                onCursorChange?.('hover');
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('atmosphere-mode', { detail: itemMode }));
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
                  <h3 className="item-title-text">{item.category.toUpperCase()}</h3>
                </div>

                <div className="item-skills-tag">
                  <span>{formattedSkills}</span>
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
