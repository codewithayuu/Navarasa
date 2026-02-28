// src/components/landing/ScrollIndicator.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { colors, typography } from '../../theme/tokens';

const ScrollIndicator = ({ text = 'Scroll to explore', onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <span
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.caption,
          color: colors.textMuted,
          letterSpacing: typography.letterSpacing.extraWide,
          textTransform: 'uppercase',
        }}
      >
        {text}
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M8 4 L8 18 M3 14 L8 19 L13 14"
            stroke={colors.textMuted}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
