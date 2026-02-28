import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, SkipForward, X, Volume2, VolumeX } from 'lucide-react';
import { JOURNEY_STAGES } from '../../context/AppContext';
import { colors, typography, spacing, layout } from '../../theme/tokens';

const STAGE_LABELS = {
  [JOURNEY_STAGES.ACKNOWLEDGMENT]: 'Acknowledgment',
  [JOURNEY_STAGES.STORY]: 'Story',
  [JOURNEY_STAGES.BREATHING]: 'Breath',
  [JOURNEY_STAGES.TRANSITION]: 'Transition',
  [JOURNEY_STAGES.SHANTA]: 'Shānta',
};

const JourneyShell = ({
  children,
  currentStage,
  stageProgress,
  totalProgress,
  currentStageIndex,
  isRunning,
  totalRemainingSeconds,
  onPause,
  onResume,
  onSkip,
  onExit,
  isAudioEnabled,
  onToggleAudio,
  rasaColors: rColors,
  stageOrder,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [confirmExit, setConfirmExit] = useState(false);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showControls ? 1 : 0.15, y: 0 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setShowControls(true)}
        onTouchStart={() => setShowControls(true)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: layout.zIndex.overlay,
          padding: `${spacing.md} ${spacing.lg}`,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <motion.button
            onClick={() => setConfirmExit(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </motion.button>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.caption,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: typography.letterSpacing.extraWide,
                textTransform: 'uppercase',
              }}
            >
              {STAGE_LABELS[currentStage]}
            </p>
            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.caption,
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              {formatTime(totalRemainingSeconds)} remaining
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing.xs }}>
            <motion.button
              onClick={onToggleAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            >
              {isAudioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </motion.button>

            <motion.button
              onClick={isRunning ? onPause : onResume}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
            </motion.button>

            <motion.button
              onClick={onSkip}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            >
              <SkipForward size={14} />
            </motion.button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
          }}
        >
          {stageOrder.map((stage, i) => {
            const isActive = i === currentStageIndex;
            const isCompleted = i < currentStageIndex;
            const stageProg = isActive ? stageProgress : isCompleted ? 1 : 0;

            return (
              <div
                key={stage}
                style={{
                  position: 'relative',
                  height: 3,
                  flex: 1,
                  maxWidth: 60,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{ width: `${stageProg * 100}%` }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    borderRadius: 2,
                    background: isActive
                      ? `linear-gradient(90deg, ${rColors.primary}, ${rColors.primary}CC)` 
                      : isCompleted
                      ? `${rColors.primary}60` 
                      : 'transparent',
                  }}
                />
              </div>
            );
          })}
        </div>
      </motion.div>

      {children}

      <AnimatePresence>
        {confirmExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: layout.zIndex.modal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing.md,
            }}
            onClick={() => setConfirmExit(false)}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: 380,
                width: '100%',
                background: colors.bgSecondary,
                borderRadius: layout.borderRadius.xl,
                border: `1px solid ${colors.borderSubtle}`,
                padding: spacing['2xl'],
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontFamily: typography.fonts.heading,
                  fontSize: typography.sizes.h3,
                  color: colors.textPrimary,
                  marginBottom: spacing.md,
                }}
              >
                Leave the journey?
              </h3>
              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.body,
                  color: colors.textMuted,
                  marginBottom: spacing.xl,
                  lineHeight: typography.lineHeights.relaxed,
                }}
              >
                Your journey is still unfolding. You can always return.
              </p>
              <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
                <motion.button
                  onClick={() => setConfirmExit(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: `${spacing.sm} ${spacing.xl}`,
                    borderRadius: layout.borderRadius.full,
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${colors.borderSubtle}`,
                    color: colors.textSecondary,
                    fontFamily: typography.fonts.body,
                    fontSize: typography.sizes.bodySmall,
                    cursor: 'pointer',
                  }}
                >
                  Stay
                </motion.button>
                <motion.button
                  onClick={() => { setConfirmExit(false); onExit(); }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: `${spacing.sm} ${spacing.xl}`,
                    borderRadius: layout.borderRadius.full,
                    background: 'rgba(220,20,60,0.15)',
                    border: `1px solid rgba(220,20,60,0.3)`,
                    color: '#E08080',
                    fontFamily: typography.fonts.body,
                    fontSize: typography.sizes.bodySmall,
                    cursor: 'pointer',
                  }}
                >
                  Leave
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AutoHideControls
        isRunning={isRunning}
        onHide={() => setShowControls(false)}
        onShow={() => setShowControls(true)}
      />
    </div>
  );
};

const AutoHideControls = ({ isRunning, onHide, onShow }) => {
  React.useEffect(() => {
    if (!isRunning) {
      onShow();
      return;
    }

    const timer = setTimeout(onHide, 5000);

    const handleInteraction = () => {
      onShow();
      clearTimeout(timer);
    };

    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isRunning, onHide, onShow]);

  return null;
};

export default JourneyShell;
