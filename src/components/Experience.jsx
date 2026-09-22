import React from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

export default function Experience({
  experiences = [],
  achievements = [],
  education,
  onCursorChange
}) {
  return (
    <section id="experience" className="cinematic-section experience-section" aria-label="Experience, Leadership, Achievements and Education">
      {/* Section Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '24px' }}
      >
        <span className="kicker">03 — EXPERIENCE & LEADERSHIP</span>
      </motion.div>

      <TextReveal
        lines={["EXPERIENCE &", "LEADERSHIP"]}
        as="h2"
        className="section-title"
      />

      {/* Editorial Timeline: Experience & Leadership */}
      <div className="editorial-timeline-stack">
        {experiences.map((item, idx) => (
          <motion.div
            key={`${item.organization}-${item.role}-${idx}`}
            className="editorial-timeline-item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => onCursorChange?.('hover')}
            onMouseLeave={() => onCursorChange?.('default')}
          >
            <div className="milestone-year-col">
              <span className="milestone-period-text">{item.period}</span>
            </div>

            <div className="milestone-content-col">
              <h3 className="milestone-org-text">{item.organization}</h3>
              <div className="milestone-role-text">{item.role}</div>
              <p className="milestone-body-desc">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. ACHIEVEMENTS SUB-SECTION */}
      {achievements && achievements.length > 0 && (
        <div className="experience-sub-block" style={{ marginTop: 'clamp(80px, 12vh, 140px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '20px' }}
          >
            <span className="kicker">RECOGNITION & PARTICIPATION</span>
          </motion.div>

          <TextReveal
            lines={["ACHIEVEMENTS"]}
            as="h3"
            className="experience-subheading"
          />

          <div className="editorial-timeline-stack" style={{ marginTop: '40px' }}>
            {achievements.map((item, idx) => (
              <motion.div
                key={`${item.title}-${idx}`}
                className="editorial-timeline-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => onCursorChange?.('hover')}
                onMouseLeave={() => onCursorChange?.('default')}
              >
                <div className="milestone-year-col">
                  <span className="milestone-result-badge">{item.result}</span>
                </div>

                <div className="milestone-content-col">
                  <div className="milestone-title-row">
                    <h4 className="milestone-achievement-title">{item.title}</h4>
                  </div>
                  <p className="milestone-body-desc">{item.whatIDid}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EDUCATION SUB-SECTION */}
      {education && (
        <div className="experience-sub-block" style={{ marginTop: 'clamp(80px, 12vh, 140px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
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
            <motion.div
              className="editorial-timeline-item education-timeline-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
