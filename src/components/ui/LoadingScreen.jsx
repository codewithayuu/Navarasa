import React from 'react';
import { motion } from 'framer-motion';
import { colors, typography, spacing } from '../../theme/tokens';

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bgDeep,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xl,
        zIndex: 9999,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.8, 0.3],
          boxShadow: [
            '0 0 10px rgba(218,165,32,0.1)',
            '0 0 40px rgba(218,165,32,0.3)',
            '0 0 10px rgba(218,165,32,0.1)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: colors.gold,
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.body,
          color: colors.textMuted,
          letterSpacing: typography.letterSpacing.wide,
        }}
      >
        Preparing the mirror...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
