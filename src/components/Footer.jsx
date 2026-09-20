import React from 'react';

export default function Footer({ profile, onCursorChange }) {
  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="footer-left">
        <span className="footer-brand-name">{profile?.name || "Eshwar M"}</span>
        <span className="footer-divider">•</span>
        <span className="footer-role">Building at the intersection of AI, Product, Data &amp; Innovation.</span>
      </div>

      <div className="footer-right">
        <span className="footer-copy">© 2026 Eshwar M. All rights reserved.</span>
      </div>
    </footer>
  );
}
