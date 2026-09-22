import React from 'react';
import { motion } from 'framer-motion';

export default function ExperienceTimeline({ experiences, onCursorChange }) {
  return (
    <section id="experience" className="cinematic-section experience-section">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="kicker">04 — LEADERSHIP & EXPERIENCES</span>
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.1 }}
      >
        JOURNEY & IMPACT
      </motion.h2>

      <div className="timeline-container">
        <div className="timeline-spine" />

        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.role}
            className="timeline-milestone"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => onCursorChange?.('hover')}
            onMouseLeave={() => onCursorChange?.(null)}
          >
            <div className="timeline-node-marker">
              <div className="timeline-node-dot" />
            </div>

            <div className="milestone-header">
              <h3 className="milestone-role">{exp.role}</h3>
              <span className="milestone-timeline-badge">{exp.timeline}</span>
            </div>

            <p className="milestone-organization">{exp.organization}</p>
            <p className="milestone-desc">{exp.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
