// src/components/reveal/JourneyPrompt.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';
import GoldenButton from '../ui/GoldenButton';
import { colors, typography, spacing } from '../../theme/tokens';

const JourneyPrompt = ({
  rasaName,
  isShanta,
  onBeginJourney,
  onExploreOther,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.lg,
        textAlign: 'center',
        maxWidth: '460px',
      }}
    >
      <p
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.h4,
          color: colors.textSecondary,
          fontStyle: 'italic',
          lineHeight: typography.lineHeights.relaxed,
        }}
      >
        {isShanta
          ? 'You are already in Shanta. Would you like to deepen your stillness?'
          : `Shall we begin your journey from ${rasaName} to Shanta?`}
      </p>

      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.bodySmall,
          color: colors.textMuted,
          lineHeight: typography.lineHeights.relaxed,
        }}
      >
        {isShanta
          ? 'A five-minute experience to settle even deeper into the peace you already carry.'
          : 'A five-minute guided experience through music, story, breath, and color — arriving at inner peace.'}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.md,
          marginTop: spacing.sm,
        }}
      >
        <GoldenButton onClick={onBeginJourney} size="large">
          {isShanta ? 'Deepen My Peace' : 'Guide Me'}
          <ArrowRight size={18} style={{ marginLeft: 4 }} />
        </GoldenButton>

        <motion.button
          onClick={onExploreOther}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: typography.fonts.body,
            fontSize: typography.sizes.bodySmall,
            color: colors.textMuted,
            cursor: 'pointer',
            padding: spacing.sm,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
          }}
          whileHover={{ color: colors.gold }}
          transition={{ duration: 0.2 }}
        >
          <Layers size={14} />
          Explore other Rasas instead
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JourneyPrompt;
