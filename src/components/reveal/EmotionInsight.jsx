// src/components/reveal/EmotionInsight.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { colors, typography, spacing } from '../../theme/tokens';

// Compassionate framing for each detected emotion
const insightTexts = {
  shringara: {
    line: 'Your face carries the warmth of connection.',
    affirm: 'This tenderness is not fragility — it is your heart at its most open.',
  },
  hasya: {
    line: 'Your face radiates the light of joy.',
    affirm: 'This brightness is not naiveté — it is the soul celebrating simply being alive.',
  },
  karuna: {
    line: 'Your face holds the weight of something that matters.',
    affirm: 'This depth is not weakness — it is the mark of a heart that has truly loved.',
  },
  raudra: {
    line: 'Your face carries a fire that demands expression.',
    affirm: 'This intensity is not destruction — it is the force that moves mountains and corrects injustice.',
  },
  veera: {
    line: 'Your face shows a quiet, unwavering resolve.',
    affirm: 'This determination is not rigidity — it is the pillar that holds steady when the world shakes.',
  },
  bhayanaka: {
    line: 'Your face reflects an encounter with the vast unknown.',
    affirm: 'This trembling is not cowardice — it is consciousness recognizing something larger than itself.',
  },
  bibhatsa: {
    line: 'Your face carries a refusal to accept what feels wrong.',
    affirm: 'This aversion is not bitterness — it is discernment, the soul knowing its own boundaries.',
  },
  adbhuta: {
    line: 'Your face carries the wide openness of discovery.',
    affirm: 'This astonishment is not confusion — it is the mind expanding beyond its own edges.',
  },
  shanta: {
    line: 'Your face rests in a rare quiet.',
    affirm: 'You are already in the space that others are journeying toward.',
  },
};

const EmotionInsight = ({ rasaId, delay = 0 }) => {
  const insight = insightTexts[rasaId];
  if (!insight) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{
        maxWidth: '480px',
        textAlign: 'center',
        padding: `${spacing.lg} ${spacing.md}`,
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.8 }}
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.bodyLarge,
          color: colors.textSecondary,
          fontStyle: 'italic',
          lineHeight: typography.lineHeights.relaxed,
          marginBottom: spacing.md,
        }}
      >
        {insight.line}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.6, duration: 0.8 }}
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.body,
          color: colors.textMuted,
          lineHeight: typography.lineHeights.relaxed,
          fontWeight: typography.weights.light,
        }}
      >
        {insight.affirm}
      </motion.p>
    </motion.div>
  );
};

export default EmotionInsight;
