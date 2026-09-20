import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TextReveal({
  lines,
  as: Component = 'h2',
  className = '',
  delay = 0.1,
  staggerDelay = 0.12,
  duration = 0.9
}) {
  const rootRef = useRef(null);
  const isInView = useInView(rootRef, { once: true, amount: 0.15 });
  const lineArray = Array.isArray(lines) ? lines : (typeof lines === 'string' ? lines.split('\n') : []);

  return (
    <Component ref={rootRef} className={`editorial-text-reveal-root ${className}`}>
      {lineArray.map((line, idx) => (
        <span key={idx} className="reveal-line-wrapper">
          <motion.span
            className="reveal-line-content"
            initial={{ y: '102%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '102%', opacity: 0 }}
            transition={{
              duration: duration,
              delay: delay + idx * staggerDelay,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
