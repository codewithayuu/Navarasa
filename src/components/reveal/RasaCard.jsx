// src/components/reveal/RasaCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { RasaIcon } from '../icons/RasaIcons';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import { colors, typography, spacing, layout } from '../../theme/tokens';

const RasaCard = ({ rasaConfig, delay = 0 }) => {
  const { id, nameEnglish, nameExpanded, nameSanskrit, nameTransliterated, deity, sthayibhava, description, colors: rasaClr } = rasaConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        maxWidth: '520px',
        width: '100%',
        background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: layout.borderRadius.xl,
        border: `1px solid ${rasaClr.primary}30`,
        padding: `${spacing['2xl']} ${spacing.xl}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `
          0 20px 60px rgba(0,0,0,0.3),
          0 0 40px ${rasaClr.glow},
          inset 0 1px 0 rgba(255,255,255,0.05)
        `,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${rasaClr.primary}80, transparent)`,
          borderRadius: '0 0 2px 2px',
        }}
      />

      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.3, type: 'spring', stiffness: 100, damping: 15 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${rasaClr.primary}25, ${rasaClr.primary}08)`,
          border: `1px solid ${rasaClr.primary}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          marginBottom: spacing.lg,
          boxShadow: `0 0 30px ${rasaClr.glow}`,
        }}
      >
        <RasaIcon rasaId={id} size={36} color={rasaClr.primary} animate />
      </motion.div>

      {/* Overline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.overline,
          color: colors.textMuted,
          letterSpacing: typography.letterSpacing.ultra,
          textTransform: 'uppercase',
          marginBottom: spacing.sm,
        }}
      >
        Your Mirror Reflects
      </motion.p>

      {/* Sanskrit name */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.5, duration: 0.8 }}
        style={{
          fontFamily: typography.fonts.sanskrit,
          fontSize: typography.sizes.displayMedium,
          color: rasaClr.primary,
          textShadow: `0 0 40px ${rasaClr.glow}`,
          marginBottom: spacing.xs,
          fontWeight: typography.weights.regular,
        }}
      >
        {nameSanskrit}
      </motion.h2>

      {/* Transliterated name */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6 }}
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.h2,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
          fontWeight: typography.weights.regular,
          letterSpacing: typography.letterSpacing.wide,
        }}
      >
        {nameTransliterated}
      </motion.h3>

      {/* English subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.7 }}
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.bodyLarge,
          color: colors.textSecondary,
          fontStyle: 'italic',
          marginBottom: spacing.lg,
        }}
      >
        {nameExpanded}
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
        style={{ margin: `0 auto ${spacing.lg}` }}
      >
        <OrnamentalDivider width={180} color={rasaClr.primary} />
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.9, duration: 0.8 }}
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.body,
          color: colors.textSecondary,
          lineHeight: typography.lineHeights.relaxed,
          maxWidth: '440px',
          margin: `0 auto ${spacing.lg}`,
          fontWeight: typography.weights.light,
        }}
      >
        {description}
      </motion.p>

      {/* Metadata row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.1 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: spacing.xl,
          flexWrap: 'wrap',
        }}
      >
        <MetaItem label="Deity" value={deity} color={rasaClr.primary} />
        <MetaItem label="Essence" value={sthayibhava} color={rasaClr.primary} />
        <MetaItem label="Raaga" value={rasaConfig.audio.raaga} color={rasaClr.primary} />
      </motion.div>
    </motion.div>
  );
};

const MetaItem = ({ label, value, color }) => (
  <div style={{ textAlign: 'center' }}>
    <p
      style={{
        fontFamily: typography.fonts.body,
        fontSize: '0.6rem',
        color: colors.textMuted,
        letterSpacing: typography.letterSpacing.extraWide,
        textTransform: 'uppercase',
        marginBottom: '2px',
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes.bodySmall,
        color: color || colors.textPrimary,
      }}
    >
      {value}
    </p>
  </div>
);

export default RasaCard;
