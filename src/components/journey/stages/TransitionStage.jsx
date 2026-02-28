import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrnamentalDivider from '../../ui/OrnamentalDivider';
import { ShantaIcon } from '../../icons/RasaIcons';
import { RasaIcon } from '../../icons/RasaIcons';
import { colors, typography, spacing } from '../../../theme/tokens';

const TransitionStage = ({ rasaConfig, stageProgress, stageElapsedMs }) => {
  const { transitionWisdom } = rasaConfig;
  const rClr = rasaConfig.colors;
  const lines = transitionWisdom.lines;

  const visibleLineCount = Math.max(
    0,
    Math.min(
      lines.length,
      Math.ceil(stageProgress * (lines.length + 1))
    )
  );

  const mandalaProgress = stageProgress;

  const transitionColor = useMemo(() => {
    const t = stageProgress;
    return {
      primary: `color-mix(in srgb, ${rClr.primary} ${Math.round((1 - t) * 100)}%, #C0CDD8)`,
      glow: `color-mix(in srgb, ${rClr.primary} ${Math.round((1 - t * 0.7) * 100)}%, rgba(200, 210, 220, 0.3))`,
    };
  }, [rClr.primary, stageProgress]);

  const rasaIconOpacity = Math.max(0, 1 - stageProgress * 2);
  const shantaIconOpacity = Math.max(0, (stageProgress - 0.4) * 1.67);

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
      <div style={{ position: 'relative', width: 240, height: 240, marginBottom: spacing['2xl'] }}>
        {[0.92, 0.78, 0.64, 0.50, 0.36].map((radiusFactor, i) => {
          const ringProgress = Math.max(0, Math.min(1, (mandalaProgress - i * 0.1) * 3));
          const radius = 120 * radiusFactor;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: ringProgress * (0.15 + i * 0.05),
                scale: 0.8 + ringProgress * 0.2,
                rotate: i % 2 === 0 ? stageProgress * 30 : -stageProgress * 20,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: 120 - radius,
                top: 120 - radius,
                width: radius * 2,
                height: radius * 2,
                borderRadius: '50%',
                border: `${0.5 + i * 0.2}px solid`,
                borderColor: transitionColor.primary,
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ opacity: rasaIconOpacity }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
            }}
          >
            <RasaIcon rasaId={rasaConfig.id} size={48} color={rClr.primary} />
          </motion.div>

          <motion.div
            animate={{ opacity: shantaIconOpacity }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
            }}
          >
            <ShantaIcon size={48} color="#C0CDD8" />
          </motion.div>
        </div>

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 12;
          const dotProgress = Math.max(0, Math.min(1, (mandalaProgress - 0.2) * 2));
          const r = 100;
          const x = 120 + r * Math.cos(angle) - 2;
          const y = 120 + r * Math.sin(angle) - 2;

          return (
            <motion.div
              key={i}
              animate={{
                opacity: dotProgress * 0.4,
                scale: 0.5 + dotProgress * 0.5,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: transitionColor.primary,
              }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.md,
          maxWidth: '480px',
          minHeight: '180px',
        }}
      >
        <OrnamentalDivider width={100} color={transitionColor.primary} />

        <div style={{ marginTop: spacing.md }}>
          <AnimatePresence>
            {lines.map((line, i) => {
              if (i >= visibleLineCount) return null;
              const isLast = i === lines.length - 1;

              return (
                <motion.p
                  key={`tw-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    fontFamily: typography.fonts.heading,
                    fontSize: isLast ? typography.sizes.h3 : typography.sizes.bodyLarge,
                    fontWeight: typography.weights.regular,
                    color: isLast ? '#D0D8E0' : colors.textSecondary,
                    lineHeight: typography.lineHeights.loose,
                    fontStyle: 'italic',
                    textShadow: isLast
                      ? '0 0 30px rgba(200, 210, 220, 0.2)'
                      : 'none',
                    marginBottom: spacing.sm,
                  }}
                >
                  {line}
                </motion.p>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 3, duration: 2 }}
        style={{
          position: 'absolute',
          bottom: spacing['3xl'],
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
            style={{
              width: 4 + i,
              height: 4 + i,
              borderRadius: '50%',
              background: `color-mix(in srgb, ${rClr.primary} ${Math.round((1 - i * 0.2) * 100)}%, #D0D8E0)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default TransitionStage;
