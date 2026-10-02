import React from 'react';
import { motion, useScroll } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import ProjectShowcase from '../components/ProjectShowcase';
import Expertise from '../components/Expertise';
import Experience from '../components/Experience';
import FinalStatement from '../components/FinalStatement';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home({
  portfolioData,
  onNavigate,
  onOpenCaseStudy,
  onCursorChange,
  hasEntered = true
}) {
  const { scrollYProgress } = useScroll();

  return (
    <main className="homepage-main" style={{ position: 'relative', zIndex: 2, width: '100%' }}>

      {/* Minimal Thin Scroll Progress Indicator (Only visible after entering) */}
      {hasEntered && (
        <motion.div
          className="global-scroll-progress-bar"
          style={{ scaleY: scrollYProgress }}
          aria-hidden="true"
        />
      )}

      {/* 1. HERO OPENING FRAME */}
      <Hero
        profile={portfolioData.profile}
        onScrollExplore={() => onNavigate('about')}
        onCursorChange={onCursorChange}
        hasEntered={hasEntered}
      />

      {/* 2. ABOUT: CINEMATIC PERSONAL INTRODUCTION */}
      <About
        aboutData={portfolioData.about}
        onCursorChange={onCursorChange}
      />

      {/* 3. SELECTED WORK */}
      <ProjectShowcase
        projects={portfolioData.projects}
        onOpenCaseStudy={onOpenCaseStudy}
        onCursorChange={onCursorChange}
      />

      {/* 4. EXPERIENCE & LEADERSHIP, ACHIEVEMENTS, EDUCATION */}
      <Experience
        experiences={portfolioData.experience}
        achievements={portfolioData.achievements}
        education={portfolioData.education}
        onCursorChange={onCursorChange}
      />

      {/* 5. SKILLS & TECHNOLOGIES */}
      <Expertise
        expertiseData={portfolioData.expertise}
        onCursorChange={onCursorChange}
      />

      {/* 6. FINAL STATEMENT */}
      <FinalStatement
        finalStatement={portfolioData.finalStatement}
      />

      {/* 7. CONTACT */}
      <Contact
        contactData={portfolioData.contact}
        onCursorChange={onCursorChange}
      />

      {/* 8. FOOTER */}
      <Footer
        profile={portfolioData.profile}
        onCursorChange={onCursorChange}
      />
    </main>
  );
}
