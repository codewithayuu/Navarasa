// src/components/reveal/ConfidenceIndicator.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { colors, typography, spacing, layout } from '../../theme/tokens';

const ConfidenceIndicator = ({ emotion, confidence, delay = 0 }) => {
  const percentage = Math.round(confidence * 100);

  const getLabel = () => {
    if (percentage >= 80) return 'Strong reading';
    if (percentage >= 65) return 'Clear reading';
    if (percentage >= 50) return 'Gentle reading';
    return 'Subtle reading';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        borderRadius: layout.borderRadius.full,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${colors.borderSubtle}`,
      }}
    >
      <Activity size={12} color={colors.textMuted} style={{ opacity: 0.5 }} />
      <span
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.caption,
          color: colors.textMuted,
          letterSpacing: typography.letterSpacing.wide,
        }}
      >
        {getLabel()} — {percentage}% confidence
      </span>
    </motion.div>
  );
};

export default ConfidenceIndicator;
