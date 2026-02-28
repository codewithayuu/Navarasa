import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrnamentalDivider from '../../ui/OrnamentalDivider';
import { colors, typography, spacing, layout } from '../../../theme/tokens';

const StoryStage = ({ rasaConfig, stageProgress, stageElapsedMs }) => {
  const { story } = rasaConfig;
  const rClr = rasaConfig.colors;
  const panels = story.panels;
  const totalPanels = panels.length;

  const activePanelIndex = Math.min(
    Math.floor(stageProgress / (1 / totalPanels)),
    totalPanels - 1
  );
  const panelProgress = (stageProgress - activePanelIndex / totalPanels) / (1 / totalPanels);

  const [revealedPanels, setRevealedPanels] = useState(new Set([0]));

  useEffect(() => {
    setRevealedPanels((prev) => {
      const next = new Set(prev);
      next.add(activePanelIndex);
      return next;
    });
  }, [activePanelIndex]);

  const currentPanel = panels[activePanelIndex];

  const sentences = useMemo(() => {
    if (!currentPanel) return [];
    return currentPanel.text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
  }, [currentPanel]);

  const visibleSentenceCount = Math.max(
    1,
    Math.ceil(panelProgress * sentences.length)
  );

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
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          textAlign: 'center',
          marginBottom: spacing.xl,
        }}
      >
        <p
          style={{
            fontFamily: typography.fonts.body,
            fontSize: typography.sizes.overline,
            color: colors.textMuted,
            letterSpacing: typography.letterSpacing.ultra,
            textTransform: 'uppercase',
            marginBottom: spacing.xs,
          }}
        >
          {story.source}
        </p>
        <h3
          style={{
            fontFamily: typography.fonts.heading,
            fontSize: typography.sizes.h2,
            color: colors.textPrimary,
            fontWeight: typography.weights.regular,
            marginBottom: spacing.sm,
          }}
        >
          {story.title}
        </h3>
        <OrnamentalDivider width={140} color={rClr.primary} />
      </motion.div>

      <div
        style={{
          maxWidth: '580px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing['2xl'],
        }}
      >
        <motion.div
          key={`illust-${activePanelIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: layout.borderRadius.lg,
            background: `linear-gradient(145deg, ${rClr.primary}12, ${rClr.secondary}08)`,
            border: `1px solid ${rClr.primary}20`,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 0 60px ${rClr.primary}06`,
          }}
        >
          <FrameCorner position="top-left" color={rClr.primary} />
          <FrameCorner position="top-right" color={rClr.primary} />
          <FrameCorner position="bottom-left" color={rClr.primary} />
          <FrameCorner position="bottom-right" color={rClr.primary} />

          <div
            style={{
              position: 'absolute',
              inset: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '60%',
                height: '80%',
                borderRadius: '50% 50% 45% 45%',
                background: `radial-gradient(ellipse at 50% 40%, ${rClr.primary}15, transparent 70%)`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 12,
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.caption,
                color: rClr.primary,
                opacity: 0.3,
                letterSpacing: typography.letterSpacing.wide,
              }}
            >
              {activePanelIndex + 1} / {totalPanels}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activePanelIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
            }}
          >
            {sentences.map((sentence, i) => {
              const isVisible = i < visibleSentenceCount;
              return (
                <AnimatePresence key={`s-${activePanelIndex}-${i}`}>
                  {isVisible && (
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      style={{
                        fontFamily: typography.fonts.heading,
                        fontSize: typography.sizes.bodyLarge,
                        fontWeight: typography.weights.regular,
                        color: colors.textSecondary,
                        lineHeight: typography.lineHeights.loose,
                        textAlign: 'center',
                        fontStyle: 'italic',
                      }}
                    >
                      {sentence}
                    </motion.p>
                  )}
                </AnimatePresence>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          display: 'flex',
          gap: spacing.sm,
          marginTop: spacing['2xl'],
        }}
      >
        {panels.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activePanelIndex ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i <= activePanelIndex ? rClr.primary : `${rClr.primary}25`,
              transition: 'all 0.5s ease',
              opacity: i === activePanelIndex ? 0.8 : 0.4,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

const FrameCorner = ({ position, color }) => {
  const size = 20;
  const styles = {
    position: 'absolute',
    width: size,
    height: size,
    opacity: 0.25,
  };

  const posMap = {
    'top-left': { top: 8, left: 8, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    'top-right': { top: 8, right: 8, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
    'bottom-left': { bottom: 8, left: 8, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    'bottom-right': { bottom: 8, right: 8, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
  };

  return <div style={{ ...styles, ...posMap[position] }} />;
};

export default StoryStage;
