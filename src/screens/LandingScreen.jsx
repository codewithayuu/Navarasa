// src/screens/LandingScreen.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, SCREENS } from '../context/AppContext';
import PageWrapper from '../components/layout/PageWrapper';
import Mandala from '../components/landing/Mandala';
import NavrasaWheel from '../components/landing/NavrasaWheel';
import GoldenButton from '../components/ui/GoldenButton';
import GlowOrb from '../components/ui/GlowOrb';
import ParticleField from '../components/ui/ParticleField';
import OrnamentalDivider from '../components/ui/OrnamentalDivider';
import {
  colors,
  typography,
  spacing,
  layout,
} from '../theme/tokens';
import {
  staggerContainer,
  staggerChild,
  fadeIn,
  fadeInUp,
} from '../theme/animations';
import './LandingScreen.css';
import { useModelPreloader } from '../hooks/useModelPreloader';

const LandingScreen = () => {
  const { actions } = useApp();
  const [showWheel, setShowWheel] = useState(false);

  // Preload face detection models while user reads the landing page
  useModelPreloader();

  const handleBeginJourney = () => {
    actions.setScreen(SCREENS.MIRROR);
  };

  return (
    <PageWrapper
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(218, 165, 32, 0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(139, 0, 0, 0.02) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 70%, rgba(10, 110, 92, 0.02) 0%, transparent 40%),
          linear-gradient(180deg, #0a0a0f 0%, #161625 30%, #0a0a12 70%, #0a0a0f 100%)
        `,
      }}
    >
      {/* ===== AMBIENT BACKGROUND EFFECTS ===== */}
      <ParticleField count={25} color="rgba(218, 165, 32, 0.08)" />
      <GlowOrb
        color="rgba(218, 165, 32, 0.05)"
        size={600}
        x="50%"
        y="35%"
        blur={150}
        duration={10}
      />
      <GlowOrb
        color="rgba(139, 0, 0, 0.03)"
        size={300}
        x="20%"
        y="70%"
        blur={100}
        duration={12}
        delay={2}
      />
      <GlowOrb
        color="rgba(10, 110, 92, 0.03)"
        size={350}
        x="80%"
        y="60%"
        blur={100}
        duration={14}
        delay={4}
      />

      {/* ===== TOP DECORATIVE LINE ===== */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${colors.gold}33 50%, transparent 100%)`,
        }}
      />

      {/* ===== MAIN CONTENT ===== */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          position: 'relative',
          zIndex: layout.zIndex.content,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: `${spacing['3xl']} ${spacing.md}`,
          textAlign: 'center',
          gap: spacing.lg,
        }}
      >
        {/* ===== OVERLINE TEXT ===== */}
        <motion.span
          variants={staggerChild}
          style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.sizes.overline,
            fontWeight: typography.weights.medium,
            color: colors.textMuted,
            letterSpacing: typography.letterSpacing.ultra,
            textTransform: 'uppercase',
          }}
        >
          Rooted in the Natyashastra · circa 200 BCE
        </motion.span>

        {/* ===== MANDALA ===== */}
        <motion.div
          variants={staggerChild}
          style={{
            marginTop: spacing.md,
            marginBottom: spacing.md,
          }}
        >
          <Mandala size={280} />
        </motion.div>

        {/* ===== MAIN TITLE ===== */}
        <motion.div variants={staggerChild}>
          <h1
            className="title-shimmer"
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.displayLarge,
              fontWeight: typography.weights.regular,
              lineHeight: typography.lineHeights.tight,
              letterSpacing: typography.letterSpacing.wide,
              margin: 0,
            }}
          >
            Navarasa Mirror
          </h1>
        </motion.div>

        {/* ===== SANSKRIT SUBTITLE ===== */}
        <motion.div variants={staggerChild}>
          <p
            style={{
              fontFamily: typography.fonts.sanskrit,
              fontSize: typography.sizes.h3,
              color: colors.gold,
              margin: 0,
              textShadow: `0 0 40px ${colors.goldGlow}`,
            }}
          >
            नवरस दर्पण
          </p>
        </motion.div>

        {/* ===== DIVIDER ===== */}
        <motion.div variants={staggerChild} style={{ margin: `${spacing.sm} 0` }}>
          <OrnamentalDivider width={240} />
        </motion.div>

        {/* ===== TAGLINE ===== */}
        <motion.div variants={staggerChild}>
          <p
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.h4,
              fontWeight: typography.weights.regular,
              color: colors.textSecondary,
              lineHeight: typography.lineHeights.relaxed,
              maxWidth: '520px',
              margin: '0 auto',
              fontStyle: 'italic',
            }}
          >
            See your emotion. Journey through it. Arrive at peace.
          </p>
        </motion.div>

        {/* ===== DESCRIPTION ===== */}
        <motion.div variants={staggerChild}>
          <p
            style={{
              fontFamily: typography.fonts.body,
              fontSize: typography.sizes.body,
              fontWeight: typography.weights.light,
              color: colors.textMuted,
              lineHeight: typography.lineHeights.relaxed,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            An ancient framework of 9 emotional essences — brought to life through
            your webcam, classical Indian music, mythological storytelling, and breathwork.
          </p>
        </motion.div>

        {/* ===== CTA SECTION ===== */}
        <motion.div
          variants={staggerChild}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
            marginTop: spacing.lg,
          }}
        >
          <GoldenButton onClick={handleBeginJourney} size="large">
            Begin Your Journey
          </GoldenButton>

          <motion.button
            onClick={() => setShowWheel(true)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: typography.fonts.body,
              fontSize: typography.sizes.bodySmall,
              color: colors.textMuted,
              cursor: 'pointer',
              padding: spacing.sm,
              textDecoration: 'none',
              letterSpacing: typography.letterSpacing.wide,
              position: 'relative',
            }}
            whileHover={{
              color: colors.gold,
            }}
            transition={{ duration: 0.3 }}
          >
            What is this? ↗
            <motion.div
              style={{
                position: 'absolute',
                bottom: 2,
                left: '20%',
                right: '20%',
                height: '1px',
                background: colors.gold,
                transformOrigin: 'left',
              }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>

        {/* ===== BOTTOM QUOTE ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          style={{
            marginTop: spacing['2xl'],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.xs,
          }}
        >
          <p
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.bodySmall,
              color: colors.textMuted,
              fontStyle: 'italic',
              opacity: 0.6,
              maxWidth: '400px',
              textAlign: 'center',
              lineHeight: typography.lineHeights.relaxed,
            }}
          >
            "Vibhava-Anubhava-Vyabhichari-Samyogat Rasa Nishpattih"
          </p>
          <p
            style={{
              fontFamily: typography.fonts.body,
              fontSize: typography.sizes.caption,
              color: colors.textMuted,
              opacity: 0.4,
            }}
          >
            — Bharata Muni, Natyashastra
          </p>
        </motion.div>

        {/* ===== PRIVACY ASSURANCE ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            marginTop: spacing.md,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L2 3.5V6.5C2 9.55 4.15 12.37 7 13C9.85 12.37 12 9.55 12 6.5V3.5L7 1Z"
              stroke={colors.textMuted}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M5 7L6.5 8.5L9 5.5"
              stroke={colors.textMuted}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </svg>
          <span
            style={{
              fontFamily: typography.fonts.body,
              fontSize: typography.sizes.caption,
              color: colors.textMuted,
              opacity: 0.5,
            }}
          >
            Your face never leaves your device. 100% private.
          </span>
        </motion.div>
      </motion.div>

      {/* ===== BOTTOM DECORATIVE LINE ===== */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${colors.gold}22 50%, transparent 100%)`,
        }}
      />

      {/* ===== NAVARASA WHEEL MODAL ===== */}
      <NavrasaWheel isOpen={showWheel} onClose={() => setShowWheel(false)} />
    </PageWrapper>
  );
};

export default LandingScreen;
