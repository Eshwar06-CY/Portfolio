import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';
import { triggerCinematicCut } from './CinematicTransitionVeil';
import { trackEmailClick, trackContactClick } from '../utils/analytics';

export default function Navbar({ profile, onNavigate, onCursorChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { label: 'ABOUT', id: 'about', num: '01' },
    { label: 'WORK', id: 'work', num: '02' },
    { label: 'EXPERIENCE', id: 'experience', num: '03' },
    { label: 'CONTACT', id: 'contact', num: '04' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = ['contact', 'experience', 'work', 'about', 'hero'];
      const scrollPos = window.scrollY + 240;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId, label) => {
    setMobileMenuOpen(false);
    triggerCinematicCut(label || sectionId, () => {
      onNavigate(sectionId);
    });
  };

  return (
    <>
      <header
        className={`site-header ${scrolled ? 'header-scrolled' : ''}`}
        role="banner"
      >
        {/* Brand identity: logo-tb asset */}
        <Magnetic strength={0.12} maxOffset={3.5}>
          <button
            className="brand-wrapper"
            onClick={() => handleNavClick('hero', 'HOME')}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Return to top"
          >
            <img
              src="/logo-tb.png"
              alt="Eshwar M Logo"
              className="brand-logo-mark"
              width="38"
              height="38"
            />
          </button>
        </Magnetic>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Magnetic key={item.id} strength={0.12} maxOffset={3.5}>
                <button
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={() => handleNavClick(item.id, item.label)}
                  onMouseEnter={() => onCursorChange?.('link')}
                  onMouseLeave={() => onCursorChange?.('default')}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="nav-link-inner">
                    <span className="nav-num-signature">{item.num}</span>
                    <span className="nav-link-text">{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="nav-active-line"
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </Magnetic>
            );
          })}
        </nav>

        {/* Mobile Menu Minimal Trigger */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="mobile-toggle-text">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          <span className={`mobile-toggle-icon ${mobileMenuOpen ? 'open' : ''}`} aria-hidden="true">
            <span className="bar bar-1" />
            <span className="bar bar-2" />
          </span>
        </button>
      </header>

      {/* Editorial Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-editorial-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="mobile-editorial-header">
              <div className="mobile-brand-identity">
                <img
                  src="/logo-tb.png"
                  alt="Eshwar M Logo"
                  className="mobile-brand-logo-mark"
                  width="36"
                  height="36"
                />
              </div>
            </div>

            <div className="mobile-editorial-list">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  className={`mobile-editorial-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id, item.label)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.04 * idx, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mobile-item-num">{item.num}</span>
                  <span className="mobile-item-label">{item.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="mobile-editorial-footer">
              <span className="mobile-footer-tag">MYSURU, KARNATAKA</span>
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="mobile-footer-email"
                  onClick={() => {
                    trackEmailClick('mobile_menu');
                    trackContactClick('email', 'mobile_menu');
                  }}
                >
                  {profile.email}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
