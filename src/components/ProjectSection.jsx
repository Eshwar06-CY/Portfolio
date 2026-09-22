import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

export default function ProjectSection({ projects, onOpenCaseStudy, onCursorChange }) {
  return (
    <section id="work" className="work-showcase-section" aria-label="Selected Work Showcase">
      {/* Section Header */}
      <div className="work-header-wrap">
        <motion.div
          className="work-kicker-box"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <span className="kicker">02 — SELECTED WORK</span>
          <span className="work-curated-badge">5 CORE ARCHITECTED SYSTEMS</span>
        </motion.div>

        <div className="work-headline-row">
          <motion.h2
            className="work-monumental-title"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            SELECTED WORK
          </motion.h2>

          <motion.p
            className="work-header-narrative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            Each project is built around real operational friction: eliminating guesswork in campus placements, turning freight deadhead into revenue, and synthesizing complex schedules.
          </motion.p>
        </div>
      </div>

      {/* Full-Viewport Cinematic Scenes (80–100vh per project) */}
      <div className="project-scenes-stack">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            totalProjects={projects.length}
            onOpenCaseStudy={onOpenCaseStudy}
            onCursorChange={onCursorChange}
          />
        ))}
      </div>
    </section>
  );
}
