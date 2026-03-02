import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';
import { colors, typography, spacing } from '../../../theme/tokens';

const BREATH_PHASES = {
  INHALE: 'inhale',
  HOLD_IN: 'hold_in',
  EXHALE: 'exhale',
  HOLD_OUT: 'hold_out',
};

const PHASE_LABELS = {
  [BREATH_PHASES.INHALE]: 'Breathe in',
  [BREATH_PHASES.HOLD_IN]: 'Hold gently',
  [BREATH_PHASES.EXHALE]: 'Release',
  [BREATH_PHASES.HOLD_OUT]: 'Rest',
};

function buildBreathCycle(breathing) {
  const phases = [];

  if (breathing.inhaleCount > 0) {
    phases.push({
      phase: BREATH_PHASES.INHALE,
      durationSec: breathing.inhaleCount,
      label: PHASE_LABELS[BREATH_PHASES.INHALE],
    });
  }
  if (breathing.holdCount > 0) {
    phases.push({
      phase: BREATH_PHASES.HOLD_IN,
      durationSec: breathing.holdCount,
      label: PHASE_LABELS[BREATH_PHASES.HOLD_IN],
    });
  }
  if (breathing.exhaleCount > 0) {
    phases.push({
      phase: BREATH_PHASES.EXHALE,
      durationSec: breathing.exhaleCount,
      label: PHASE_LABELS[BREATH_PHASES.EXHALE],
    });
  }

  if (breathing.pattern === '4-4-8-4') {
    phases.push({
      phase: BREATH_PHASES.HOLD_OUT,
      durationSec: 4,
      label: PHASE_LABELS[BREATH_PHASES.HOLD_OUT],
    });
  }

  return phases;
}

function isNaturalBreath(breathing) {
  return breathing.pattern === 'natural';
}

const BreathingStage = ({ rasaConfig, stageProgress, stageElapsedMs }) => {
  const { breathing } = rasaConfig;
  const rClr = rasaConfig.colors;
  const natural = isNaturalBreath(breathing);

  const cyclePhases = useMemo(() => buildBreathCycle(breathing), [breathing]);
  const cycleDurationSec = useMemo(
    () => cyclePhases.reduce((sum, p) => sum + p.durationSec, 0),
    [cyclePhases]
  );

  const [currentPhase, setCurrentPhase] = useState(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const getTargetScale = useCallback((phase) => {
    switch (phase) {
      case BREATH_PHASES.INHALE: return 1.35;
      case BREATH_PHASES.HOLD_IN: return 1.35;
      case BREATH_PHASES.EXHALE: return 0.85;
      case BREATH_PHASES.HOLD_OUT: return 0.85;
      default: return 1;
    }
  }, []);

  useEffect(() => {
    if (natural) return;
    if (cyclePhases.length === 0) return;

    if (stageElapsedMs < 3000) {
      setShowIntro(true);
      return;
    }

    setShowIntro(false);

    const breathingElapsedMs = stageElapsedMs - 3000;
    const breathingElapsedSec = breathingElapsedMs / 1000;

    const totalCycleSec = cycleDurationSec;
    const cycleIndex = Math.floor(breathingElapsedSec / totalCycleSec);
    const withinCycleSec = breathingElapsedSec % totalCycleSec;

    setCurrentCycle(cycleIndex);

    let accumulated = 0;
    for (const phaseData of cyclePhases) {
      if (withinCycleSec < accumulated + phaseData.durationSec) {
        setCurrentPhase(phaseData.phase);
        setCurrentCount(Math.ceil(phaseData.durationSec - (withinCycleSec - accumulated)));
        return;
      }
      accumulated += phaseData.durationSec;
    }

    setCurrentPhase(cyclePhases[0].phase);
    setCurrentCount(cyclePhases[0].durationSec);
  }, [stageElapsedMs, cyclePhases, cycleDurationSec, natural]);

  useEffect(() => {
    if (natural) {
      const timer = setTimeout(() => setShowIntro(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [natural]);

  const targetScale = currentPhase ? getTargetScale(currentPhase) : 1;
  const isExpanding = currentPhase === BREATH_PHASES.INHALE;
  const isContracting = currentPhase === BREATH_PHASES.EXHALE;

  const breathColor = useMemo(() => {
    const t = stageProgress;
    return `color-mix(in srgb, ${rClr.primary} ${Math.round((1 - t * 0.4) * 100)}%, #A0B0C0)`;
  }, [rClr.primary, stageProgress]);

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
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="breath-intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.md,
              maxWidth: '420px',
            }}
          >
            <Wind size={28} color={rClr.primary} strokeWidth={1} style={{ opacity: 0.6 }} />
            <p
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.h3,
                color: colors.textPrimary,
                fontWeight: typography.weights.regular,
              }}
            >
              Now, let your body join the journey.
            </p>
            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.body,
                color: colors.textMuted,
                lineHeight: typography.lineHeights.relaxed,
              }}
            >
              {breathing.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing['2xl'],
          }}
        >
          <div style={{ position: 'relative', width: 280, height: 280 }}>
            <motion.div
              animate={{
                scale: natural ? [1, 1.06, 1] : targetScale,
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={
                natural
                  ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: isExpanding ? breathing.inhaleCount : breathing.exhaleCount, ease: 'easeInOut' }
              }
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                border: `1px solid ${rClr.primary}20`,
                boxShadow: `0 0 40px ${rClr.glow}`,
              }}
            />

            <motion.div
              animate={{
                scale: natural ? [1, 1.08, 1] : targetScale,
              }}
              transition={
                natural
                  ? { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }
                  : { duration: isExpanding ? breathing.inhaleCount : breathing.exhaleCount, ease: 'easeInOut' }
              }
              style={{
                position: 'absolute',
                inset: 10,
                borderRadius: '50%',
                border: `1px solid ${rClr.primary}15`,
              }}
            />

            <motion.div
              animate={{
                scale: natural ? [1, 1.1, 1] : targetScale,
              }}
              transition={
                natural
                  ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: isExpanding ? breathing.inhaleCount : breathing.exhaleCount, ease: 'easeInOut' }
              }
              style={{
                position: 'absolute',
                inset: 30,
                borderRadius: '50%',
                background: `radial-gradient(circle at 40% 35%, ${rClr.primary}30, ${rClr.primary}08)`,
                border: `1.5px solid ${rClr.primary}35`,
                boxShadow: `
                  0 0 60px ${rClr.glow},
                  inset 0 0 40px ${rClr.primary}10
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                animate={{
                  scale: natural ? [0.9, 1.15, 0.9] : targetScale,
                  opacity: natural ? [0.3, 0.6, 0.3] : isExpanding ? [0.3, 0.7] : [0.7, 0.3],
                }}
                transition={
                  natural
                    ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: isExpanding ? breathing.inhaleCount : breathing.exhaleCount, ease: 'easeInOut' }
                }
                style={{
                  width: '55%',
                  height: '55%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${rClr.primary}40, transparent 70%)`,
                }}
              />
            </motion.div>

            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const orbRadius = 120;
              const x = 140 + orbRadius * Math.cos(rad) - 2;
              const y = 140 + orbRadius * Math.sin(rad) - 2;

              return (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, Math.cos(rad + Math.PI / 4) * 8, 0],
                    y: [0, Math.sin(rad + Math.PI / 4) * 8, 0],
                    opacity: [0.1, 0.35, 0.1],
                  }}
                  transition={{
                    duration: natural ? 6 : cycleDurationSec,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: rClr.primary,
                  }}
                />
              );
            })}
          </div>

          {!natural && currentPhase && (
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
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
                  fontSize: typography.sizes.h2,
                  color: colors.textPrimary,
                  fontWeight: typography.weights.regular,
                  fontStyle: 'italic',
                }}
              >
                {PHASE_LABELS[currentPhase]}
              </p>

              <motion.p
                key={`${currentPhase}-${currentCount}`}
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  fontFamily: typography.fonts.heading,
                  fontSize: typography.sizes.displaySmall,
                  color: rClr.primary,
                  fontWeight: typography.weights.light,
                  textShadow: `0 0 30px ${rClr.glow}`,
                  lineHeight: 1,
                }}
              >
                {currentCount}
              </motion.p>

              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.caption,
                  color: colors.textMuted,
                  opacity: 0.4,
                  letterSpacing: typography.letterSpacing.wide,
                }}
              >
                cycle {currentCycle + 1}
              </p>
            </motion.div>
          )}

          {natural && !showIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                maxWidth: '380px',
              }}
            >
              {breathing.instructions.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 2, duration: 1 }}
                  style={{
                    fontFamily: typography.fonts.heading,
                    fontSize: typography.sizes.bodyLarge,
                    fontWeight: typography.weights.regular,
                    color: colors.textSecondary,
                    lineHeight: typography.lineHeights.relaxed,
                    fontStyle: 'italic',
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}

          {!natural && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 5, duration: 2 }}
              style={{
                maxWidth: '360px',
              }}
            >
              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.caption,
                  color: colors.textMuted,
                  lineHeight: typography.lineHeights.relaxed,
                  textAlign: 'center',
                }}
              >
                {breathing.style}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BreathingStage;
