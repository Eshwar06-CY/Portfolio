import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import Magnetic from './Magnetic';

export default function ProjectCard({
  project,
  index,
  totalProjects,
  onOpenCaseStudy,
  onCursorChange
}) {
  const sceneRef = useRef(null);

  // Scroll-linked cinematic animation for the scene
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start']
  });

  // Slow, cinematic visual transforms
  const imageY = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.05, 1.01]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [30, 0]);

  const variant = project.variant || 'asymmetric';

  return (
    <section
      ref={sceneRef}
      id={`project-${project.id}`}
      className={`project-cinematic-scene scene-${variant}`}
      onMouseEnter={() => onCursorChange?.('project')}
      onMouseLeave={() => onCursorChange?.('default')}
      aria-label={`Project Scene: ${project.title}`}
    >
      <div className="scene-inner-container">
        {/* Project Number Header Badge (Sticky briefly during scene progression) */}
        <div className="scene-number-rail">
          <div className="scene-number-box">
            <span className="number-eyebrow">PROJECT</span>
            <span className="number-main">{project.number}</span>
            <span className="number-total">/ 0{totalProjects}</span>
          </div>
        </div>

        {/* Dynamic Composition Variant Grid */}
        <div className={`scene-content-layout layout-${variant}`}>
          {/* Visual Container (Occupies most of the viewport scene) */}
          <div
            className="scene-visual-frame"
            onClick={() => onOpenCaseStudy(project)}
            onMouseEnter={(e) => {
              e.stopPropagation();
              onCursorChange?.('image');
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              onCursorChange?.('project');
            }}
            role="button"
            tabIndex={0}
            aria-label={`Open Case Study for ${project.title}`}
          >
            <motion.div
              className="scene-visual-parallax-box"
              style={{ y: imageY, scale: imageScale }}
            >
              <img
                src={project.image}
                alt={`${project.title} Interface Visual`}
                className="scene-img"
                loading="lazy"
                decoding="async"
              />
              <div className="scene-visual-gradient" />
              <div className="scene-category-pill">
                <span>{project.category}</span>
              </div>
            </motion.div>
          </div>

          {/* Project Editorial Narrative & Actions */}
          <motion.div
            className="scene-details-col"
            style={{ y: textY }}
          >
            <div className="scene-meta-kicker">
              <span className="scene-tagline">{project.tagline}</span>
            </div>

            <h3
              className="scene-title"
              onClick={() => onOpenCaseStudy(project)}
              onMouseEnter={(e) => {
                e.stopPropagation();
                onCursorChange?.('project');
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onCursorChange?.('project');
              }}
              role="button"
              tabIndex={0}
            >
              <span className="project-title-text">{project.title}</span>
            </h3>

            <p className="scene-description">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="scene-tech-row">
              <span className="tech-label">STACK:</span>
              <div className="tech-badges-wrap">
                {project.tags.map((tag) => (
                  <span key={tag} className="tech-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: VIEW CASE STUDY → */}
            <div className="scene-actions-row">
              <Magnetic strength={0.24}>
                <button
                  className="btn-case-study scene-btn-primary"
                  onClick={() => onOpenCaseStudy(project)}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    onCursorChange?.('view');
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    onCursorChange?.('project');
                  }}
                >
                  <span className="btn-text">
                    {project.hasDedicatedCaseStudy ? 'EXPLORE CASE STUDY' : 'VIEW CASE STUDY'}
                  </span>
                  <ArrowUpRight size={16} className="btn-icon" />
                </button>
              </Magnetic>

              {project.githubUrl && (
                <Magnetic strength={0.2}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-project-secondary scene-btn-secondary"
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      onCursorChange?.('link');
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      onCursorChange?.('project');
                    }}
                  >
                    <Github size={14} className="btn-icon" />
                    <span className="btn-text">CODEBASE</span>
                  </a>
                </Magnetic>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
