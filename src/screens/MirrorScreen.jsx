// src/screens/MirrorScreen.jsx

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Hand } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext';
import PageWrapper from '../components/layout/PageWrapper';
import MirrorFrame from '../components/mirror/MirrorFrame';
import CameraPreview from '../components/mirror/CameraPreview';
import GoldenButton from '../components/ui/GoldenButton';
import OrnamentalDivider from '../components/ui/OrnamentalDivider';
import GlowOrb from '../components/ui/GlowOrb';
import ParticleField from '../components/ui/ParticleField';
import { colors, typography, spacing, layout } from '../theme/tokens';
import { staggerContainer, staggerChild } from '../theme/animations';

const MirrorScreen = () => {
  const { actions } = useApp();
  const [phase, setPhase] = useState('intro'); // 'intro' | 'camera' | 'detecting' | 'denied'
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [videoElement, setVideoElement] = useState(null);

  const handleActivateCamera = () => {
    setPhase('camera');
    setCameraActive(true);
  };

  const handleStreamReady = useCallback((videoEl) => {
    setVideoElement(videoEl);
    setPhase('detecting');
    actions.setCameraActive(true);

    // Simulate detection progress (will be replaced with real detection in Phase 5)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      setDetectionProgress(Math.min(progress, 1));
      if (progress >= 1) {
        clearInterval(interval);
        // For now, simulate a detected emotion after progress completes
        // This will be replaced with real face-api.js detection
        setTimeout(() => {
          actions.setDetectedEmotion('sad', 0.78);
          actions.setSelectedRasa('karuna');
          actions.setScreen(SCREENS.RASA_REVEAL);
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [actions]);

  const handleStreamError = useCallback(() => {
    setPhase('denied');
    setCameraActive(false);
  }, []);

  const handleManualSelect = () => {
    actions.setScreen(SCREENS.MANUAL_SELECT);
  };

  const handleBack = () => {
    setCameraActive(false);
    actions.setScreen(SCREENS.LANDING);
  };

  return (
    <PageWrapper
      style={{
        background: `
          radial-gradient(ellipse at 50% 40%, rgba(218,165,32,0.03) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0f 0%, #0c0c18 50%, #0a0a0f 100%)
        `,
      }}
    >
      <ParticleField count={15} color="rgba(218, 165, 32, 0.06)" />
      <GlowOrb color="rgba(218,165,32,0.04)" size={500} x="50%" y="40%" blur={140} duration={12} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: spacing.lg,
          left: spacing.lg,
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${colors.borderSubtle}`,
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
        }}
      >
        <ChevronLeft size={14} />
        Back
      </motion.button>

      {/* Main content */}
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
        {/* Title area */}
        <motion.div variants={staggerChild}>
          <p
            style={{
              fontFamily: typography.fonts.body,
              fontSize: typography.sizes.overline,
              color: colors.textMuted,
              letterSpacing: typography.letterSpacing.ultra,
              textTransform: 'uppercase',
              marginBottom: spacing.sm,
            }}
          >
            The Mirror
          </p>
          <h2
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.displaySmall,
              color: colors.textPrimary,
              fontWeight: typography.weights.regular,
            }}
          >
            {phase === 'intro' && 'Prepare to See'}
            {phase === 'camera' && 'Opening Your Mirror'}
            {phase === 'detecting' && 'Reading Your Rasa'}
            {phase === 'denied' && 'Another Path'}
          </h2>
        </motion.div>

        <motion.div variants={staggerChild}>
          <OrnamentalDivider width={160} />
        </motion.div>

        {/* Mirror / Intro depending on phase */}
        {phase === 'intro' && (
          <motion.div
            variants={staggerChild}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.xl,
              maxWidth: '480px',
            }}
          >
            {/* Decorative mirror placeholder */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(218,165,32,0.08), inset 0 0 40px rgba(218,165,32,0.03)',
                  '0 0 50px rgba(218,165,32,0.15), inset 0 0 60px rgba(218,165,32,0.06)',
                  '0 0 30px rgba(218,165,32,0.08), inset 0 0 40px rgba(218,165,32,0.03)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${colors.bgElevated}, ${colors.bgDeep})`,
                border: `1px solid ${colors.borderMedium}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Hand size={40} color={colors.gold} strokeWidth={1} />
              </motion.div>
            </motion.div>

            <p
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.h4,
                color: colors.textSecondary,
                fontStyle: 'italic',
                lineHeight: typography.lineHeights.relaxed,
              }}
            >
              We would like to see your face — not to judge,
              but to understand. Your expression carries a Rasa.
            </p>

            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.body,
                color: colors.textMuted,
                lineHeight: typography.lineHeights.relaxed,
              }}
            >
              Simply be yourself. Don't pose. Don't smile unless you feel like it.
              Let your face speak its truth.
            </p>

            {/* Privacy assurance */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: layout.borderRadius.lg,
                background: 'rgba(218,165,32,0.04)',
                border: `1px solid ${colors.borderSubtle}`,
              }}
            >
              <Shield size={16} color={colors.gold} strokeWidth={1.5} style={{ opacity: 0.6 }} />
              <span
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.caption,
                  color: colors.textMuted,
                  lineHeight: typography.lineHeights.normal,
                }}
              >
                Your face is analyzed entirely on your device. No image is ever sent to any server.
              </span>
            </div>

            <GoldenButton onClick={handleActivateCamera}>
              Open the Mirror
            </GoldenButton>
          </motion.div>
        )}

        {/* Camera active phase */}
        {(phase === 'camera' || phase === 'detecting') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.lg,
            }}
          >
            <MirrorFrame
              size={300}
              progress={detectionProgress}
              isDetecting={phase === 'detecting'}
            >
              <CameraPreview
                isActive={cameraActive}
                onStreamReady={handleStreamReady}
                onStreamError={handleStreamError}
                size={300}
              />
            </MirrorFrame>

            {phase === 'detecting' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.sm,
                }}
              >
                <p
                  style={{
                    fontFamily: typography.fonts.heading,
                    fontSize: typography.sizes.bodyLarge,
                    color: colors.textSecondary,
                    fontStyle: 'italic',
                  }}
                >
                  Hold still... your mirror is reflecting...
                </p>
                <p
                  style={{
                    fontFamily: typography.fonts.body,
                    fontSize: typography.sizes.caption,
                    color: colors.textMuted,
                  }}
                >
                  {Math.round(detectionProgress * 100)}% — reading your expression
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Camera denied phase */}
        {phase === 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.lg,
              maxWidth: '420px',
            }}
          >
            <p
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.h4,
                color: colors.textSecondary,
                lineHeight: typography.lineHeights.relaxed,
                fontStyle: 'italic',
              }}
            >
              The mirror cannot open — but your journey need not end.
              You know your own heart better than any camera.
            </p>

            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.body,
                color: colors.textMuted,
                lineHeight: typography.lineHeights.relaxed,
              }}
            >
              Choose the Rasa that resonates with what you carry right now.
              Trust your own knowing.
            </p>

            <GoldenButton onClick={handleManualSelect}>
              Choose Your Rasa
            </GoldenButton>

            <motion.button
              onClick={handleActivateCamera}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.bodySmall,
                color: colors.textMuted,
                cursor: 'pointer',
                padding: spacing.sm,
              }}
              whileHover={{ color: colors.gold }}
            >
              Try camera again
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default MirrorScreen;
