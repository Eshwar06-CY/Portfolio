import React from 'react';
import { motion } from 'framer-motion';

/**
 * Fast, film-cut page transition wrapper:
 * - 160ms exit fade
 * - 200ms entry reveal
 * - Total duration ~360ms: instant, cinematic, zero loading lag.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
