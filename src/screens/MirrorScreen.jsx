// src/screens/MirrorScreen.jsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronLeft, Eye, RefreshCw } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext';
import { useEmotionDetection, DETECTION_STATUS } from '../hooks/useEmotionDetection';
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
  const [phase, setPhase] = useState('intro');
  const [cameraActive, setCameraActive] = useState(false);

  // Guards to prevent double execution
  const detectionStartedRef = useRef(false);
  const transitionFiredRef = useRef(false);
  const videoElementRef = useRef(null);

  const {
    status: detectionStatus,
    progress,
    result,
    modelsReady,
    preloadModels,
    startDetection,
    reset: resetDetection,
  } = useEmotionDetection();

  // Preload models on mount
  useEffect(() => {
    preloadModels();
  }, [preloadModels]);

  // Handle detection completion — transition to reveal
  useEffect(() => {
    if (detectionStatus === DETECTION_STATUS.COMPLETE && result && result.rasa) {
      if (transitionFiredRef.current) return;
      transitionFiredRef.current = true;

      const timer = setTimeout(() => {
        actions.setDetectedEmotion(result.emotion, result.confidence);
        actions.setSelectedRasa(result.rasa.id);
        actions.setScreen(SCREENS.RASA_REVEAL);
      }, 800);

      return () => clearTimeout(timer);
    }

    if (detectionStatus === DETECTION_STATUS.NO_FACE) {
      setPhase('noface');
      detectionStartedRef.current = false;
    }
  }, [detectionStatus, result, actions]);

  // Camera button click
  const handleActivateCamera = useCallback(() => {
    setPhase('camera');
    setCameraActive(true);
    detectionStartedRef.current = false;
    transitionFiredRef.current = false;
  }, []);

  const waitForVideoReady = (videoEl, timeoutMs = 2000) =>
    new Promise((resolve, reject) => {
      const start = performance.now();

      const tick = () => {
        const ok =
          videoEl &&
          videoEl.isConnected &&
          videoEl.readyState >= 3 &&          // HAVE_FUTURE_DATA
          videoEl.videoWidth > 0 &&
          videoEl.videoHeight > 0 &&
          videoEl.srcObject;

        if (ok) return resolve();

        if (performance.now() - start > timeoutMs) {
          return reject(new Error('Video not ready (no frames)'));
        }
        requestAnimationFrame(tick);
      };

      tick();
    });

  // Camera stream ready — start detection ONCE
  const handleStreamReady = useCallback(
    async (videoEl) => {
      // If the element changed, allow restarting detection
      if (videoElementRef.current && videoElementRef.current !== videoEl) {
        console.log('[MirrorScreen] Video element changed — restarting detection.');
        detectionStartedRef.current = false;
      }

      // If we already started AND it's the same element, ignore
      if (detectionStartedRef.current && videoElementRef.current === videoEl) {
        console.log('[MirrorScreen] Detection already started, skipping duplicate.');
        return;
      }

      try {
        // IMPORTANT: don’t "lock" until video is actually producing frames
        await waitForVideoReady(videoEl);

        videoElementRef.current = videoEl;
        detectionStartedRef.current = true;

        setPhase('detecting');
        actions.setCameraActive(true);

        console.log('[MirrorScreen] Starting detection...');
        startDetection(() => videoElementRef.current);
      } catch (e) {
        console.warn('[MirrorScreen] Stream ready fired but video not ready yet:', e.message);
        // do NOT lock; allow next onStreamReady to try again
        detectionStartedRef.current = false;
      }
    },
    [actions, startDetection]
  );

  // Camera error
  const handleStreamError = useCallback(() => {
    setPhase('denied');
    setCameraActive(false);
    detectionStartedRef.current = false;
  }, []);

  // Retry detection
  const handleRetryDetection = useCallback(() => {
    detectionStartedRef.current = false;
    transitionFiredRef.current = false;
    resetDetection();

    if (videoElementRef.current) {
      setPhase('detecting');
      detectionStartedRef.current = true;
      startDetection(videoElementRef.current);
    } else {
      // Re-activate camera from scratch
      setCameraActive(false);
      setTimeout(() => {
        setCameraActive(true);
        setPhase('camera');
      }, 200);
    }
  }, [resetDetection, startDetection]);

  // Manual select
  const handleManualSelect = useCallback(() => {
    setCameraActive(false);
    actions.setScreen(SCREENS.MANUAL_SELECT);
  }, [actions]);

  // Back
  const handleBack = useCallback(() => {
    setCameraActive(false);
    resetDetection();
    detectionStartedRef.current = false;
    transitionFiredRef.current = false;
    actions.setScreen(SCREENS.LANDING);
  }, [actions, resetDetection]);

  // Status text
  const getStatusText = () => {
    if (detectionStatus === DETECTION_STATUS.LOADING_MODELS) {
      return { main: 'Preparing the ancient mirror...', sub: 'Loading perception' };
    }
    if (detectionStatus === DETECTION_STATUS.DETECTING) {
      const pct = Math.round(progress * 100);
      if (pct < 25) return { main: 'Gazing into your reflection...', sub: `${pct}%` };
      if (pct < 50) return { main: 'Reading the subtle expressions...', sub: `${pct}%` };
      if (pct < 75) return { main: 'The Rasa is emerging...', sub: `${pct}%` };
      return { main: 'Almost there...', sub: `${pct}%` };
    }
    if (detectionStatus === DETECTION_STATUS.COMPLETE) {
      return { main: 'Your Rasa has been revealed.', sub: '' };
    }
    return { main: 'Hold still... your mirror is reflecting...', sub: '' };
  };

  const statusText = getStatusText();

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
        {/* Title */}
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
            {phase === 'detecting' ? 'दर्पण — The Mirror' : 'The Mirror'}
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
            {phase === 'noface' && 'The Mirror is Still'}
            {phase === 'denied' && 'Another Path'}
          </h2>
        </motion.div>

        <motion.div variants={staggerChild}>
          <OrnamentalDivider width={160} />
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ===== INTRO ===== */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
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
                  <Eye size={40} color={colors.gold} strokeWidth={1} />
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

              {/* Privacy */}
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
                <Shield size={16} color={colors.gold} strokeWidth={1.5} style={{ opacity: 0.6, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: typography.fonts.body,
                    fontSize: typography.sizes.caption,
                    color: colors.textMuted,
                    lineHeight: typography.lineHeights.normal,
                    textAlign: 'left',
                  }}
                >
                  Your face is analyzed entirely on your device. No image is ever sent anywhere.
                </span>
              </div>

              {/* Model loading indicator */}
              {!modelsReady && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontFamily: typography.fonts.body,
                    fontSize: typography.sizes.caption,
                    color: colors.textMuted,
                    opacity: 0.5,
                  }}
                >
                  Preparing perception engine...
                </motion.p>
              )}

              <GoldenButton onClick={handleActivateCamera}>
                Open the Mirror
              </GoldenButton>
            </motion.div>
          )}

          {/* ===== CAMERA + DETECTING ===== */}
          {(phase === 'camera' || phase === 'detecting') && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
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
                progress={progress}
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
                  transition={{ delay: 0.3 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.sm,
                    maxWidth: '360px',
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
                    {statusText.main}
                  </p>
                  {statusText.sub && (
                    <p
                      style={{
                        fontFamily: typography.fonts.body,
                        fontSize: typography.sizes.caption,
                        color: colors.textMuted,
                        letterSpacing: typography.letterSpacing.wide,
                      }}
                    >
                      {statusText.sub}
                    </p>
                  )}

                  {/* Live expression readout (subtle) */}
                  {detectionStatus === DETECTION_STATUS.DETECTING && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      style={{
                        marginTop: spacing.sm,
                        display: 'flex',
                        gap: spacing.xs,
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            opacity: [0.2, 0.6, 0.2],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: 'easeInOut',
                          }}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: colors.gold,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ===== NO FACE ===== */}
          {phase === 'noface' && (
            <motion.div
              key="noface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.lg,
                maxWidth: '420px',
              }}
            >
              <motion.div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: `1px solid ${colors.borderMedium}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(218,165,32,0.03)',
                }}
              >
                <Eye size={32} color={colors.textMuted} strokeWidth={1} style={{ opacity: 0.4 }} />
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
                The mirror could not find your reflection clearly.
              </p>

              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.body,
                  color: colors.textMuted,
                  lineHeight: typography.lineHeights.relaxed,
                }}
              >
                Try adjusting your lighting, or move closer so your face is fully visible.
              </p>

              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap', justifyContent: 'center' }}>
                <GoldenButton onClick={handleRetryDetection} size="medium">
                  <RefreshCw size={16} />
                  Try Again
                </GoldenButton>

                <GoldenButton onClick={handleManualSelect} variant="secondary" size="medium">
                  Choose Manually
                </GoldenButton>
              </div>
            </motion.div>
          )}

          {/* ===== DENIED ===== */}
          {phase === 'denied' && (
            <motion.div
              key="denied"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
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
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
};

export default MirrorScreen;
