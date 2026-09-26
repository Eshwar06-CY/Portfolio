import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { portfolioData } from './data/portfolioData';
import { useLenis } from './hooks/useLenis';
import GlobalCinematicScene from './components/scene/GlobalCinematicScene';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import CinematicTransitionVeil from './components/CinematicTransitionVeil';
import CinematicIntro from './components/CinematicIntro';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import AboutPage from './pages/AboutPage';

gsap.registerPlugin(ScrollTrigger);

function MainApp() {
  const [cursorMode, setCursorMode] = useState('default');
  const navigate = useNavigate();
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const isProjectRoute =
    location.pathname.startsWith('/project/') || location.pathname.startsWith('/projects/');

  const [hasEntered, setHasEntered] = useState(!isHomeRoute);
  const { lenis, scrollTo, resetScroll } = useLenis();
  const savedHomeScrollRef = useRef(0);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Lock scroll while in intro environment
  useEffect(() => {
    if (isHomeRoute && !hasEntered) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [hasEntered, isHomeRoute, lenis]);

  // Ensure scroll starts at top on fresh visit
  // Ensure scroll starts at top on fresh visit & ensure ScrollTrigger refreshes accurately after layout settles
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    resetScroll();

    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleWindowLoad);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearTimeout(refreshTimer);
    };
  }, []);

  // Handle route changes and exact scroll restoration
  useEffect(() => {
    if (isHomeRoute && location.state?.returnTo === 'work') {
      const target = savedHomeScrollRef.current || 0;
      if (target > 0) {
        window.scrollTo(0, target);
        if (lenis) lenis.scrollTo(target, { immediate: true });
      } else {
        scrollTo('#work', { immediate: true, offset: 0 });
      }
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
      return () => clearTimeout(timer);
    } else if (isHomeRoute && location.state?.scrollToSection) {
      const targetSec = location.state.scrollToSection;
      const timer = setTimeout(() => {
        scrollTo(`#${targetSec}`);
      }, 80);
      return () => clearTimeout(timer);
    } else {
      resetScroll();
      const timer = setTimeout(() => {
        resetScroll();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.state]);

  // Handle opening case study from Home
  const handleOpenCaseStudy = (proj) => {
    setCursorMode('default');
    savedHomeScrollRef.current = window.scrollY;
    const targetSlug = proj.slug || proj.id;
    navigate(`/projects/${targetSlug}`);
  };

  // Handle closing case study and returning to Work section
  const handleCloseProject = () => {
    setCursorMode('default');
    navigate('/', { state: { returnTo: 'work' } });
  };

  // Smooth section navigation
  const handleNavigate = (sectionId) => {
    if (!isHomeRoute) {
      navigate('/', { state: { scrollToSection: sectionId } });
    } else {
      scrollTo(`#${sectionId}`);
    }
  };

  return (
    <div className="site-wrapper">
      {/* Cinematic Jump Cut Transition Veil */}
      <CinematicTransitionVeil />

      {/* Global Persistent Single WebGL Canvas for 3D Atmosphere */}
      <GlobalCinematicScene isProject={isProjectRoute} />

      {/* Film Grain & Vignette for Cinematic Atmosphere */}
      <div className="grain-overlay" />
      <div className="vignette-overlay" />

      {/* Anonymous Cinematic AI / Cyber / Creative Developer Entry Experience */}
      {isHomeRoute && !hasEntered && (
        <CinematicIntro
          onEnter={() => {
            setHasEntered(true);
            if (lenis) lenis.start();
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 120);
          }}
          onCursorChange={setCursorMode}
        />
      )}

      {/* Progress Line on Homepage (Only visible after entering) */}
      {isHomeRoute && hasEntered && (
        <motion.div className="scroll-progress-bar" style={{ scaleX }} />
      )}

      {/* Interactive Lerped Custom Cursor (Automatically disabled on touch/tablet) */}
      <CustomCursor cursorMode={cursorMode} />

      {/* Navigation (Only revealed after entering portfolio) */}
      {isHomeRoute && hasEntered && (
        <Navbar
          profile={portfolioData.profile}
          onNavigate={handleNavigate}
          onCursorChange={setCursorMode}
        />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                {hasEntered ? (
                  <Home
                    portfolioData={portfolioData}
                    onNavigate={handleNavigate}
                    onOpenCaseStudy={handleOpenCaseStudy}
                    onCursorChange={setCursorMode}
                    hasEntered={hasEntered}
                  />
                ) : (
                  <div
                    className="portfolio-pre-enter-placeholder"
                    style={{ minHeight: '100vh', width: '100%', backgroundColor: 'transparent' }}
                    aria-hidden="true"
                  />
                )}
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage
                  onCursorChange={setCursorMode}
                />
              </PageTransition>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PageTransition>
                <ProjectDetails
                  onClose={handleCloseProject}
                  onCursorChange={setCursorMode}
                  scrollTo={scrollTo}
                />
              </PageTransition>
            }
          />
          <Route
            path="/project/:id"
            element={
              <PageTransition>
                <ProjectDetails
                  onClose={handleCloseProject}
                  onCursorChange={setCursorMode}
                  scrollTo={scrollTo}
                />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
