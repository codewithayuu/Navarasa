import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RasaIcon } from '../../icons/RasaIcons';
import OrnamentalDivider from '../../ui/OrnamentalDivider';
import { colors, typography, spacing } from '../../../theme/tokens';

const acknowledgmentLines = [
  { key: 'line1', getText: (name) => `You are feeling ${name}.`, delay: 1000 },
  { key: 'line2', getText: () => 'In the ancient science of Rasa,', delay: 4000 },
  { key: 'line3', getText: () => 'this is not a problem to fix.', delay: 6500 },
  { key: 'line4', getText: () => 'It is an essential color', delay: 9500 },
  { key: 'line5', getText: () => 'in the painting of your inner life.', delay: 11500 },
  { key: 'line6', getText: () => 'Let us sit with it for a moment.', delay: 16000 },
];

const AcknowledgmentStage = ({ rasaConfig, stageProgress }) => {
  const [visibleLines, setVisibleLines] = useState(new Set());

  useEffect(() => {
    const timers = acknowledgmentLines.map((line) => {
      return setTimeout(() => {
        setVisibleLines((prev) => new Set([...prev, line.key]));
      }, line.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const { nameSanskrit, nameTransliterated, nameEnglish } = rasaConfig;
  const rClr = rasaConfig.colors;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: `${spacing['4xl']} ${spacing.md}`,
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ marginBottom: spacing.xl }}
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${rClr.primary}25, ${rClr.primary}08)`,
            border: `1px solid ${rClr.primary}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${rClr.glow}`,
          }}
        >
          <RasaIcon rasaId={rasaConfig.id} size={44} color={rClr.primary} />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{
          fontFamily: typography.fonts.sanskrit,
          fontSize: typography.sizes.displayMedium,
          color: rClr.primary,
          textShadow: `0 0 40px ${rClr.glow}`,
          marginBottom: spacing.xs,
        }}
      >
        {nameSanskrit}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.h3,
          color: colors.textPrimary,
          letterSpacing: typography.letterSpacing.wide,
          marginBottom: spacing.lg,
        }}
      >
        {nameTransliterated}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginBottom: spacing['2xl'] }}
      >
        <OrnamentalDivider width={120} color={rClr.primary} />
      </motion.div>

      <div
        style={{
          maxWidth: '500px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
        }}
      >
        <AnimatePresence>
          {acknowledgmentLines.map((line) => {
            if (!visibleLines.has(line.key)) return null;

            const text = line.getText(nameTransliterated);
            const isFirstLine = line.key === 'line1';

            return (
              <motion.p
                key={line.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  fontFamily: isFirstLine ? typography.fonts.heading : typography.fonts.body,
                  fontSize: isFirstLine ? typography.sizes.h3 : typography.sizes.bodyLarge,
                  fontWeight: isFirstLine ? typography.weights.regular : typography.weights.light,
                  fontStyle: isFirstLine ? 'normal' : 'normal',
                  color: isFirstLine ? colors.textPrimary : colors.textSecondary,
                  lineHeight: typography.lineHeights.relaxed,
                }}
              >
                {text}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 20, duration: 2 }}
        style={{
          position: 'absolute',
          bottom: spacing['3xl'],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.xs,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: rClr.primary,
          }}
        />
        <span
          style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.sizes.caption,
            color: colors.textMuted,
            opacity: 0.4,
            letterSpacing: typography.letterSpacing.wide,
          }}
        >
          breathe naturally
        </span>
      </motion.div>
    </div>
  );
};

export default AcknowledgmentStage;
