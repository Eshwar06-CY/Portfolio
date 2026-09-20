import React from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

export default function FinalStatement({ finalStatement }) {
  const line1 = finalStatement?.line1 || "NOT JUST CODE.";
  const line2 = finalStatement?.line2 || "USEFUL PRODUCTS.";
  const subtext = finalStatement?.subtext || "Turning messy problems and raw data into intelligent, measurable digital experiences.";

  return (
    <section className="statement-section" aria-label="Philosophy Statement">
      <div className="statement-inner">
        <div className="statement-text-wrap">
          <TextReveal
            lines={[line1, <span key="dim" className="dim">{line2}</span>]}
            as="p"
            className="statement-text"
          />
          <p className="statement-subtext">
            {subtext}
          </p>
        </div>
      </div>
    </section>
  );
}
