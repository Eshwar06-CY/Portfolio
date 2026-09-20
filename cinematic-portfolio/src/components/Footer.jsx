import React from 'react';

export default function Footer({ profile, onCursorChange }) {
  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="footer-left">
        <span className="footer-brand-name">{profile?.name || "ESHWAR M"}</span>
        <span className="footer-divider">•</span>
        <span className="footer-role">AI · PRODUCT · DATA</span>
      </div>

      <div className="footer-center">
        <span className="footer-location">{profile?.location || "KARNATAKA, INDIA"}</span>
      </div>

      <div className="footer-right">
        <span className="footer-copy">© 2026</span>
      </div>
    </footer>
  );
}
