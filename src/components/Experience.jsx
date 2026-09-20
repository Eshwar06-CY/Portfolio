import React from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

export default function Experience({ experiences, onCursorChange }) {
  const editorialMilestones = [
    {
      year: "2024",
      org: "VVCE E-CELL ASPERA",
      role: "Entrepreneurship & Innovation Lead",
      desc: "Driving campus entrepreneurial culture, organizing startup summits and student innovation sprints, and fostering interdisciplinary engineering teams."
    },
    {
      year: "2025",
      org: "VVCE SHIKSHA",
      role: "Joint Secretary",
      desc: "Leading student-driven educational initiatives, coordinating departmental academic peer-mentorship workshops, and managing student community operations."
    },
    {
      year: "HACKATHONS",
      org: "6+ PARTICIPATIONS & SPRINT BUILDS",
      role: "Rapid Prototyping & AI Hackathons",
      desc: "Building rapid full-stack MVPs under strict 24–36 hour constraints, synthesizing real-world data pipelines and LLM-assisted decision tools."
    }
  ];

  return (
    <section id="experience" className="cinematic-section experience-section" aria-label="Experience and Leadership">
      {/* Section Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px' }}
      >
        <span className="kicker">04 — EXPERIENCE</span>
      </motion.div>

      <TextReveal
        lines={["EXPERIENCE & LEADERSHIP"]}
        as="h2"
        className="section-title"
      />

      {/* Editorial Timeline (Thin lines, large spacing, zero cards) */}
      <div className="editorial-timeline-stack">
        {editorialMilestones.map((item, idx) => (
          <motion.div
            key={item.org}
            className="editorial-timeline-item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => onCursorChange?.('hover')}
            onMouseLeave={() => onCursorChange?.('default')}
          >
            <div className="milestone-year-col">
              <span className="milestone-year-text">{item.year}</span>
            </div>

            <div className="milestone-content-col">
              <div className="milestone-title-row">
                <h3 className="milestone-org-text">{item.org}</h3>
                <span className="milestone-role-badge">{item.role}</span>
              </div>
              <p className="milestone-body-desc">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
