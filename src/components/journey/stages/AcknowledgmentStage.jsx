// src/components/journey/stages/AcknowledgmentStage.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RasaIcon } from '../../icons/RasaIcons';
import OrnamentalDivider from '../../ui/OrnamentalDivider';
import { colors, typography, spacing } from '../../../theme/tokens';

const acknowledgmentLines = [
  { key: 'line1', getText: (name) => `You are feeling ${name}.`, delay: 1500 },
  { key: 'line2', getText: () => 'In the ancient science of Rasa,', delay: 4500 },
  { key: 'line3', getText: () => 'this is not a problem to fix.', delay: 7000 },
  { key: 'line4', getText: () => 'It is an essential color', delay: 10000 },
  { key: 'line5', getText: () => 'in the painting of your inner life.', delay: 12500 },
  { key: 'line6', getText: () => 'Let us sit with it for a moment.', delay: 17000 },
];

const AcknowledgmentStage = ({ rasaConfig, stageProgress }) => {
  const [visibleLines, setVisibleLines] = useState(new Set());

  useEffect(() => {
    const timers = acknowledgmentLines.map((line) =>
      setTimeout(() => setVisibleLines((prev) => new Set([...prev, line.key])), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        padding: `${spacing.xl} ${spacing.md}`,
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ marginBottom: spacing.lg }}
      >
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.5, 0.75, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${rClr.primary}25, ${rClr.primary}08)`,
            border: `1px solid ${rClr.primary}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${rClr.glow}`,
          }}
        >
          <RasaIcon rasaId={rasaConfig.id} size={36} color={rClr.primary} />
        </motion.div>
      </motion.div>

      {/* Sanskrit */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
        style={{
          fontFamily: typography.fonts.sanskrit,
          fontSize: typography.sizes.displaySmall,
          color: rClr.primary,
          textShadow: `0 0 30px ${rClr.glow}`,
          marginBottom: spacing.xs,
        }}
      >
        {rasaConfig.nameSanskrit}
      </motion.p>

      {/* Name */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.h3,
          color: colors.textPrimary,
          letterSpacing: typography.letterSpacing.wide,
          marginBottom: spacing.md,
        }}
      >
        {rasaConfig.nameTransliterated}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{ marginBottom: spacing.xl }}
      >
        <OrnamentalDivider width={100} color={rClr.primary} />
      </motion.div>

      {/* Lines */}
      <div
        style={{
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
          minHeight: '160px',
        }}
      >
        {acknowledgmentLines.map((line) => {
          if (!visibleLines.has(line.key)) return null;
          const text = line.getText(rasaConfig.nameTransliterated);
          const isFirst = line.key === 'line1';

          return (
            <motion.p
              key={line.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: isFirst ? typography.fonts.heading : typography.fonts.body,
                fontSize: isFirst ? 'clamp(1.6rem, 3.5vw, 2.2rem)' : 'clamp(1.3rem, 2.5vw, 1.7rem)',
                fontWeight: isFirst ? typography.weights.semibold : typography.weights.regular,
                color: isFirst ? '#f0e6d3' : '#ddd0b8',
                lineHeight: 1.6,
                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }}
            >
              {text}
            </motion.p>
          );
        })}
      </div>
    </div>
  );
};

export default AcknowledgmentStage;
