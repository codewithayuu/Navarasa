// src/components/journey/stages/StoryStage.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrnamentalDivider from '../../ui/OrnamentalDivider';
import { colors, typography, spacing, layout } from '../../../theme/tokens';
import { generateRasaImage, getRasaImagePrompt, generateRasaStory } from '../../../services/llmService';
import { speak, stopSpeaking } from '../../../services/ttsService';

const StoryStage = ({ rasaConfig, stageProgress, stageElapsedMs, aiStoryText }) => {
  const { story } = rasaConfig;
  const rClr = rasaConfig.colors;

  const [aiGeneratedParagraphs, setAiGeneratedParagraphs] = useState(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(true);

  useEffect(() => {
    let active = true;
    if (aiStoryText) {
      setAiGeneratedParagraphs(aiStoryText.split('\n\n').filter(p => p.trim().length > 20));
      setIsGeneratingStory(false);
      return;
    }

    setIsGeneratingStory(true);
    generateRasaStory(rasaConfig.id, 'a deep emotional resonance').then(paragraphs => {
      if (active) {
        if (paragraphs && paragraphs.length > 0) {
          setAiGeneratedParagraphs(paragraphs);
        }
        setIsGeneratingStory(false);
      }
    }).catch(() => {
      if (active) setIsGeneratingStory(false);
    });

    return () => { active = false; };
  }, [rasaConfig.id, aiStoryText]);

  const paragraphs = useMemo(() => {
    if (isGeneratingStory) {
      return ['✨ कालचक्र से आपकी गाथा उत्पन्न हो रही है... ध्यान की गहराई में उतरें...'];
    }
    if (aiGeneratedParagraphs && aiGeneratedParagraphs.length > 0) {
      return aiGeneratedParagraphs;
    }
    return story.panels.map(p => p.text);
  }, [aiGeneratedParagraphs, isGeneratingStory, story.panels]);

  const totalPanels = paragraphs.length;
  const panelDuration = 1 / totalPanels;
  const activePanelIndex = Math.min(
    Math.floor(stageProgress / panelDuration),
    totalPanels - 1
  );

  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const lastSpokenPanelRef = useRef(-1);
  const textContainerRef = useRef(null);

  // Image prompt for Nano Banana
  const imagePrompt = useMemo(() => getRasaImagePrompt(rasaConfig.id), [rasaConfig.id]);

  // Generate image + TTS
  useEffect(() => {
    if (activePanelIndex === 0 && !generatedImage && !isGeneratingImage) {
      setIsGeneratingImage(true);
      setImageError(false);
      generateRasaImage(imagePrompt).then(img => {
        if (img) setGeneratedImage(img);
        setIsGeneratingImage(false);
      }).catch(() => {
        setIsGeneratingImage(false);
        setImageError(true);
      });
    }

    if (activePanelIndex !== lastSpokenPanelRef.current) {
      lastSpokenPanelRef.current = activePanelIndex;
      speak(paragraphs[activePanelIndex], rasaConfig.id);
    }
  }, [activePanelIndex, generatedImage, isGeneratingImage, imagePrompt, paragraphs, rasaConfig.id]);

  // Auto-scroll text container when panel changes
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePanelIndex]);

  useEffect(() => () => stopSpeaking(), []);

  const currentText = paragraphs[activePanelIndex];

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        padding: `90px ${spacing.lg} ${spacing.lg}`,
      }}
    >
      {/* Header — compact */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', marginBottom: spacing.sm, flexShrink: 0 }}
      >
        <p
          style={{
            fontFamily: typography.fonts.body,
            fontSize: '0.75rem',
            color: colors.textMuted,
            letterSpacing: typography.letterSpacing.ultra,
            textTransform: 'uppercase',
            marginBottom: '4px',
            opacity: 0.5,
          }}
        >
          {aiStoryText || aiGeneratedParagraphs ? 'रस दर्पण गाथा' : story.source}
        </p>
        <h3
          style={{
            fontFamily: typography.fonts.heading,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: '#f0e6d3',
            fontWeight: typography.weights.regular,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            margin: 0,
          }}
        >
          {aiStoryText || aiGeneratedParagraphs ? `${rasaConfig.nameSanskrit} यात्रा` : story.title}
        </h3>
      </motion.div>

      <OrnamentalDivider width={80} color={rClr.primary} />

      {/* Illustration frame — smaller to leave room for text */}
      <motion.div
        key={`illust-${activePanelIndex}`}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '16/9',
          borderRadius: layout.borderRadius.lg,
          background: `linear-gradient(145deg, ${rClr.primary}15, ${rClr.secondary}08)`,
          border: `1px solid ${rClr.primary}25`,
          overflow: 'hidden',
          position: 'relative',
          margin: `${spacing.sm} 0`,
          flexShrink: 0,
        }}
      >
        {/* Corner ornaments */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
          <FrameCorner key={pos} position={pos} color={rClr.primary} />
        ))}

        {/* Image / Visualizer */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {generatedImage && !imageError ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1.5 }}
              src={generatedImage}
              alt="Rasa Illustration"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <motion.div
              style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative'
              }}
            >
              {/* Abstract animated particle/wave fallback */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  animate={{
                    scale: [1, 1.5 + (i * 0.2), 1],
                    opacity: [0.1, 0.3, 0.1],
                    rotate: [0, 90 + (i * 10), 180]
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.5, 1]
                  }}
                  style={{
                    position: 'absolute',
                    width: `${60 + i * 15}%`,
                    height: `${60 + i * 15}%`,
                    borderRadius: i % 2 === 0 ? '40% 60% 60% 40%' : '50%',
                    border: `1px solid ${rClr.primary}40`,
                    background: `linear-gradient(${45 * i}deg, ${rClr.primary}20, transparent)`,
                  }}
                />
              ))}
              <motion.div
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '30%', height: '30%', borderRadius: '50%',
                  background: `radial-gradient(circle, ${rClr.primary}80 0%, transparent 70%)`,
                  filter: 'blur(10px)'
                }}
              />
            </motion.div>
          )}

          {(isGeneratingImage && !generatedImage) && (
            <motion.div
              style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                color: rClr.primary || colors.gold, fontSize: '0.85rem',
                fontFamily: typography.fonts.accent, letterSpacing: '0.05em',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Invoking the ancient brush...
            </motion.div>
          )}

          {/* Panel number */}
          <span
            style={{
              position: 'absolute', bottom: 6, right: 10,
              fontFamily: typography.fonts.body, fontSize: '0.7rem',
              color: '#ffffff', opacity: 0.4,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {activePanelIndex + 1} / {totalPanels}
          </span>
        </div>
      </motion.div>

      {/* Story Text — scrollable, high contrast */}
      <div
        ref={textContainerRef}
        style={{
          flex: 1,
          maxWidth: '600px',
          width: '100%',
          overflowY: 'auto',
          padding: `${spacing.md} ${spacing.sm}`,
          scrollbarWidth: 'thin',
          scrollbarColor: `${rClr.primary}30 transparent`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activePanelIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
            }}
          >
            <p
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                fontWeight: typography.weights.regular,
                color: '#f0e6d3',
                lineHeight: 1.9,
                textAlign: 'center',
                fontStyle: 'italic',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                padding: `0 ${spacing.sm}`,
              }}
            >
              {currentText}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Panel dots */}
      <div style={{ display: 'flex', gap: spacing.sm, padding: `${spacing.sm} 0`, flexShrink: 0 }}>
        {Array.from({ length: totalPanels }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activePanelIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i <= activePanelIndex ? (rClr.primary || colors.gold) : `${rClr.primary || colors.gold}30`,
              transition: 'all 0.6s ease',
              opacity: i === activePanelIndex ? 0.9 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const FrameCorner = ({ position, color }) => {
  const size = 16;
  const base = { position: 'absolute', width: size, height: size, opacity: 0.3 };
  const posMap = {
    'top-left': { top: 6, left: 6, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    'top-right': { top: 6, right: 6, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
    'bottom-left': { bottom: 6, left: 6, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    'bottom-right': { bottom: 6, right: 6, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
  };
  return <div style={{ ...base, ...posMap[position] }} />;
};

export default StoryStage;
