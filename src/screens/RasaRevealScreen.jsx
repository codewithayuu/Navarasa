// src/screens/RasaRevealScreen.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext';
import { getRasaById } from '../data/rasaConfig';
import PageWrapper from '../components/layout/PageWrapper';
import RasaColorWash from '../components/reveal/RasaColorWash';
import RasaCard from '../components/reveal/RasaCard';
import EmotionInsight from '../components/reveal/EmotionInsight';
import JourneyPrompt from '../components/reveal/JourneyPrompt';
import ConfidenceIndicator from '../components/reveal/ConfidenceIndicator';
import ParticleField from '../components/ui/ParticleField';
import { colors, typography, spacing, layout } from '../theme/tokens';

const RasaRevealScreen = () => {
  const { state, actions } = useApp();
  const [showContent, setShowContent] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const rasaConfig = getRasaById(state.selectedRasa);

  // Orchestrate the reveal sequence
  useEffect(() => {
    // Initial dramatic pause
    const contentTimer = setTimeout(() => setShowContent(true), 600);
    const promptTimer = setTimeout(() => setShowPrompt(true), 3500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(promptTimer);
    };
  }, []);

  if (!rasaConfig) {
    // Fallback — shouldn't happen but safety net
    actions.setScreen(SCREENS.MIRROR);
    return null;
  }

  const isShanta = rasaConfig.id === 'shanta';

  const handleBeginJourney = () => {
    actions.startJourney();
  };

  const handleExploreOther = () => {
    actions.setScreen(SCREENS.MANUAL_SELECT);
  };

  const handleBack = () => {
    actions.setScreen(SCREENS.MIRROR);
  };

  return (
    <PageWrapper>
      {/* ===== IMMERSIVE COLOR BACKGROUND ===== */}
      <RasaColorWash colorConfig={rasaConfig.colors} />

      {/* Particles in Rasa's color */}
      <ParticleField count={20} color={`${rasaConfig.colors.primary}20`} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: spacing.lg,
          left: spacing.lg,
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: layout.borderRadius.full,
          padding: `${spacing.xs} ${spacing.md}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          color: colors.textMuted,
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.caption,
          cursor: 'pointer',
          zIndex: layout.zIndex.content,
          letterSpacing: typography.letterSpacing.wide,
          backdropFilter: 'blur(8px)',
        }}
      >
        <ChevronLeft size={14} />
        Mirror
      </motion.button>

      {/* ===== MAIN CONTENT ===== */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: layout.zIndex.content,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: `${spacing['4xl']} ${spacing.md} ${spacing['3xl']}`,
          gap: spacing.xl,
        }}
      >
        {/* ===== DRAMATIC ENTRANCE ===== */}
        {!showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            {/* Pulsing dot during reveal */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                boxShadow: [
                  `0 0 20px ${rasaConfig.colors.glow}`,
                  `0 0 60px ${rasaConfig.colors.glowStrong}`,
                  `0 0 20px ${rasaConfig.colors.glow}`,
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: rasaConfig.colors.primary,
              }}
            />
          </motion.div>
        )}

        {/* ===== REVEALED CONTENT ===== */}
        {showContent && (
          <>
            {/* Confidence indicator (top) */}
            {state.detectedConfidence > 0 && (
              <ConfidenceIndicator
                emotion={state.detectedEmotion}
                confidence={state.detectedConfidence}
                delay={0.2}
              />
            )}

            {/* Main Rasa Card */}
            <RasaCard rasaConfig={rasaConfig} delay={0.3} />

            {/* Compassionate insight */}
            <EmotionInsight rasaId={rasaConfig.id} delay={1.5} />

            {/* Journey prompt */}
            {showPrompt && (
              <JourneyPrompt
                rasaName={rasaConfig.nameTransliterated}
                isShanta={isShanta}
                onBeginJourney={handleBeginJourney}
                onExploreOther={handleExploreOther}
                delay={0}
              />
            )}
          </>
        )}
      </motion.div>

      {/* Bottom accent line in Rasa color */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${rasaConfig.colors.primary}50 50%, transparent 100%)`,
          zIndex: layout.zIndex.content,
        }}
      />
    </PageWrapper>
  );
};

export default RasaRevealScreen;
