import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShantaIcon } from '../../icons/RasaIcons';
import { colors, typography, spacing } from '../../../theme/tokens';

const arrivalLines = [
  { text: 'शान्त', isSanskrit: true, delay: 1500 },
  { text: 'Shānta.', isSanskrit: false, delay: 3500 },
  { text: 'You have arrived.', isSanskrit: false, delay: 6000 },
  { text: 'Not by running from what you felt.', isSanskrit: false, delay: 10000 },
  { text: 'But by moving through it.', isSanskrit: false, delay: 13000 },
  { text: 'Stay as long as you wish.', isSanskrit: false, delay: 18000 },
];

const ShantaStage = ({ stageProgress, onContinue }) => {
  const [visibleLines, setVisibleLines] = useState(new Set());
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timers = arrivalLines.map((line, i) => {
      return setTimeout(() => {
        setVisibleLines((prev) => new Set([...prev, i]));
      }, line.delay);
    });

    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, 22000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(continueTimer);
    };
  }, []);

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
      <AuroraEffect progress={stageProgress} />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ marginBottom: spacing['2xl'] }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 40px rgba(240, 244, 248, 0.05)',
              '0 0 80px rgba(240, 244, 248, 0.12)',
              '0 0 40px rgba(240, 244, 248, 0.05)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, rgba(240,244,248,0.08), rgba(240,244,248,0.02))',
            border: '1px solid rgba(240, 244, 248, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShantaIcon size={52} color="rgba(220, 225, 230, 0.6)" />
        </motion.div>
      </motion.div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.lg,
          maxWidth: '460px',
          minHeight: '250px',
        }}
      >
        <AnimatePresence>
          {arrivalLines.map((line, i) => {
            if (!visibleLines.has(i)) return null;

            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  fontFamily: line.isSanskrit
                    ? typography.fonts.sanskrit
                    : i <= 2
                    ? typography.fonts.heading
                    : typography.fonts.body,
                  fontSize: line.isSanskrit
                    ? typography.sizes.displayLarge
                    : i <= 2
                    ? typography.sizes.h2
                    : typography.sizes.bodyLarge,
                  fontWeight: typography.weights.regular,
                  color: line.isSanskrit
                    ? 'rgba(220, 225, 230, 0.7)'
                    : i <= 2
                    ? 'rgba(220, 225, 230, 0.65)'
                    : 'rgba(180, 190, 200, 0.5)',
                  lineHeight: typography.lineHeights.relaxed,
                  fontStyle: i > 2 ? 'normal' : 'normal',
                  textShadow: line.isSanskrit
                    ? '0 0 40px rgba(240, 244, 248, 0.1)'
                    : 'none',
                  letterSpacing: line.isSanskrit
                    ? typography.letterSpacing.wide
                    : typography.letterSpacing.normal,
                }}
              >
                {line.text}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{
              position: 'absolute',
              bottom: spacing['3xl'],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(240, 244, 248, 0.06)',
                border: '1px solid rgba(240, 244, 248, 0.12)',
                borderRadius: '9999px',
                padding: `${spacing.sm} ${spacing.xl}`,
                color: 'rgba(200, 210, 220, 0.5)',
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.bodySmall,
                cursor: 'pointer',
                letterSpacing: typography.letterSpacing.wide,
                backdropFilter: 'blur(8px)',
              }}
            >
              Continue when ready
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AURORA_COLORS = [
  'rgba(10, 110, 92, 0.06)',
  'rgba(230, 180, 34, 0.05)',
  'rgba(112, 128, 144, 0.05)',
  'rgba(220, 20, 60, 0.04)',
  'rgba(218, 165, 32, 0.05)',
  'rgba(26, 26, 46, 0.06)',
  'rgba(27, 20, 100, 0.05)',
  'rgba(230, 168, 23, 0.05)',
  'rgba(240, 244, 248, 0.04)',
];

const AuroraEffect = ({ progress }) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6 + progress * 0.4,
      }}
    >
      {AURORA_COLORS.map((color, i) => {
        const angle = (360 / AURORA_COLORS.length) * i;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 45 * Math.cos(rad);
        const y = 50 + 45 * Math.sin(rad);

        return (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.cos(rad + Math.PI / 4) * 30, 0],
              y: [0, Math.sin(rad + Math.PI / 4) * 20, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: color,
              filter: 'blur(80px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};

export default ShantaStage;
