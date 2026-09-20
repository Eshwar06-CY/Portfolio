import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import About from '../components/About';
import Footer from '../components/Footer';
import Magnetic from '../components/Magnetic';
import { triggerCinematicCut } from '../components/CinematicTransitionVeil';

export default function AboutPage({ onCursorChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackHome = () => {
    triggerCinematicCut('PORTFOLIO', () => {
      navigate('/');
    });
  };

  return (
    <main className="about-standalone-page">
      {/* Minimal Top Return Bar */}
      <div className="about-standalone-topbar">
        <Magnetic strength={0.12} maxOffset={3.5}>
          <button
            className="about-back-btn"
            onClick={handleBackHome}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            aria-label="Back to Portfolio Home"
          >
            <ArrowLeft size={15} />
            <span>PORTFOLIO HOME</span>
          </button>
        </Magnetic>

        <span className="about-standalone-crumb">ESHWAR M / ABOUT</span>
      </div>

      {/* Cinematic About Content */}
      <div className="about-standalone-body">
        <About aboutData={portfolioData.about} onCursorChange={onCursorChange} />
      </div>

      {/* Footer */}
      <Footer profile={portfolioData.profile} onCursorChange={onCursorChange} />
    </main>
  );
}
