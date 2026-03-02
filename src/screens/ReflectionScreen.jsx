// src/screens/ReflectionScreen.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Feather, Download, Sparkles, Brain, Volume2, VolumeX } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext';
import { getRasaById } from '../data/rasaConfig';
import { generateReflectionInsight, isGeminiReady } from '../services/llmService';
import { speak, stopSpeaking } from '../services/ttsService';
import { RasaIcon, ShantaIcon } from '../components/icons/RasaIcons';
import PageWrapper from '../components/layout/PageWrapper';
import OrnamentalDivider from '../components/ui/OrnamentalDivider';
import GoldenButton from '../components/ui/GoldenButton';
import GlowOrb from '../components/ui/GlowOrb';
import ParticleField from '../components/ui/ParticleField';
import { colors, typography, spacing, layout } from '../theme/tokens';

// ===== SHLOKA DATABASE =====
const SHLOKAS = {
  shringara: { sanskrit: 'रसानां प्रथमः श्रृङ्गारः', translation: 'Of all Rasas, Shringara is the first — for love is the origin of all feeling.' },
  hasya: { sanskrit: 'हास्यं प्रीतिकरं लोके', translation: 'Laughter brings delight to all the world.' },
  karuna: { sanskrit: 'करुणा धर्मस्य मूलम्', translation: 'Compassion is the root of all Dharma.' },
  raudra: { sanskrit: 'क्रोधो धर्मार्थकामानां सर्वेषां नाशकारणम्', translation: 'Anger, when understood, transforms from destroyer to illuminator.' },
  veera: { sanskrit: 'धर्मक्षेत्रे कुरुक्षेत्रे', translation: 'On the field of dharma, on the field of action — courage is born.' },
  bhayanaka: { sanskrit: 'भयं द्वितीयाभिनिवेशतः', translation: 'Fear arises from seeing oneself as separate. In unity, fear dissolves.' },
  bibhatsa: { sanskrit: 'विवेकचूडामणि', translation: 'The crest-jewel of discernment — seeing clearly what is real and what is not.' },
  adbhuta: { sanskrit: 'आश्चर्यवत् पश्यति कश्चिदेनम्', translation: 'Some see this Self as wondrous — this is the beginning of all understanding.' },
  shanta: { sanskrit: 'शान्ताकारं भुजगशयनं', translation: 'Serene in form, resting upon the cosmic waters — peace is the natural state.' },
};

const ReflectionScreen = () => {
  const { state, actions } = useApp();
  const rasaConfig = getRasaById(state.selectedRasa);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [aiInsight, setAiInsight] = useState(state.aiInsight || null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(isGeminiReady());
  const insightFetchedRef = useRef(false);
  const hasSpokenRef = useRef(false);

  const rClr = rasaConfig?.colors || { primary: '#daa520' };
  const shloka = SHLOKAS[rasaConfig?.id] || SHLOKAS.shanta;

  // Fetch AI insight on mount
  useEffect(() => {
    if (!rasaConfig || insightFetchedRef.current || aiInsight) return;
    insightFetchedRef.current = true;

    if (!isGeminiReady()) return;

    setIsLoadingInsight(true);

    generateReflectionInsight(rasaConfig.id, {
      emotionNuance: state.emotionNuance || '',
      journalEntry: state.journalEntry || '',
      therapistHighlights: state.therapistMessages
        ?.filter(m => m.role === 'therapist')
        ?.map(m => m.text)
        ?.slice(-3)
        ?.join('\n') || '',
    }).then((insight) => {
      if (insight) {
        setAiInsight(insight);
        actions.setAIInsight(insight);
      }
      setIsLoadingInsight(false);
    }).catch(() => {
      setIsLoadingInsight(false);
    });
  }, [rasaConfig, aiInsight, state.emotionNuance, state.journalEntry, state.therapistMessages, actions]);

  // Voice narration for insight
  useEffect(() => {
    if (aiInsight && isVoiceEnabled && !hasSpokenRef.current) {
      hasSpokenRef.current = true;
      speak(aiInsight, state.selectedRasa);
    }
  }, [aiInsight, isVoiceEnabled]);

  // Cleanup
  useEffect(() => () => stopSpeaking(), []);

  const handleSaveJournal = useCallback(() => {
    if (!rasaConfig || !journalText.trim()) return;
    actions.setJournalEntry(journalText);
    try {
      const existing = JSON.parse(localStorage.getItem('navarasa_journal') || '[]');
      existing.push({
        date: new Date().toISOString(),
        rasa: rasaConfig.id,
        rasaName: rasaConfig.nameTransliterated,
        entry: journalText,
        emotionNuance: state.emotionNuance || '',
      });
      localStorage.setItem('navarasa_journal', JSON.stringify(existing));
      setJournalSaved(true);
    } catch (e) { }
  }, [rasaConfig, journalText, actions, state.emotionNuance]);

  const handleDownloadCard = useCallback(() => {
    if (!rasaConfig) return;
    const cardContent = `
═══════════════════════════════
    NAVARASA MIRROR — Memory
═══════════════════════════════

  ${rasaConfig.nameSanskrit}  —  ${rasaConfig.nameTransliterated}
  ${rasaConfig.nameEnglish}

  → शान्त  —  Shānta (Peace)

  ${shloka.sanskrit}
  "${shloka.translation}"

  Raaga: ${rasaConfig.audio.raaga}
  Story: ${rasaConfig.story.title}
  Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

  ${state.emotionNuance ? `The mirror saw: "${state.emotionNuance}"` : ''}
  ${aiInsight ? `\n  Insight: "${aiInsight}"` : ''}
  ${journalText ? `\n  My reflection: "${journalText}"` : ''}

═══════════════════════════════
    navarasa-mirror
═══════════════════════════════
    `.trim();

    const blob = new Blob([cardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `navarasa-${rasaConfig.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rasaConfig, shloka, journalText, aiInsight, state.emotionNuance]);

  const handleRestart = useCallback(() => actions.reset(), [actions]);
  const handleExploreOther = useCallback(() => actions.setScreen(SCREENS.MANUAL_SELECT), [actions]);

  // Early return AFTER all hooks
  if (!rasaConfig) {
    actions.setScreen(SCREENS.LANDING);
    return null;
  }

  const dateString = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <PageWrapper
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(240,244,248,0.03) 0%, transparent 50%),
          linear-gradient(180deg, #0c0c14 0%, #0f0f1a 50%, #0a0a0f 100%)
        `,
      }}
    >
      <ParticleField count={12} color="rgba(200, 210, 220, 0.05)" />
      <GlowOrb color="rgba(240,244,248,0.02)" size={400} x="50%" y="30%" blur={120} />

      <div
        style={{
          position: 'relative',
          zIndex: layout.zIndex.content,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `${spacing['2xl']} ${spacing.md} ${spacing.xl}`,
          gap: spacing.md,
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{
            fontFamily: typography.fonts.body, fontSize: typography.sizes.overline,
            color: colors.textMuted, letterSpacing: typography.letterSpacing.ultra,
            textTransform: 'uppercase', marginBottom: spacing.xs,
          }}>
            Journey Complete
          </p>
          <h2 style={{
            fontFamily: typography.fonts.heading, fontSize: typography.sizes.h2,
            color: colors.textPrimary, fontWeight: typography.weights.regular,
          }}>
            Reflection
          </h2>
        </motion.div>

        <OrnamentalDivider width={120} />

        {/* Journey Path — Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            display: 'flex', alignItems: 'center', gap: spacing.md,
            padding: `${spacing.md} ${spacing.lg}`,
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: layout.borderRadius.xl,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `${rClr.primary}15`, border: `1px solid ${rClr.primary}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RasaIcon rasaId={rasaConfig.id} size={20} color={rClr.primary} />
            </div>
            <span style={{ fontFamily: typography.fonts.sanskrit, fontSize: '0.75rem', color: rClr.primary }}>
              {rasaConfig.nameSanskrit}
            </span>
          </div>

          <svg width="60" height="16" viewBox="0 0 60 16">
            <defs>
              <linearGradient id="fg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={rClr.primary} stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgba(200,210,220,0.5)" />
              </linearGradient>
            </defs>
            <path d="M 2 8 Q 15 3, 30 8 Q 45 13, 58 8" stroke="url(#fg)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 53 5.5 L 58 8 L 53 10.5" stroke="rgba(200,210,220,0.5)" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(240,244,248,0.05)', border: '1px solid rgba(240,244,248,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShantaIcon size={20} color="rgba(200,210,220,0.6)" />
            </div>
            <span style={{ fontFamily: typography.fonts.sanskrit, fontSize: '0.75rem', color: 'rgba(200,210,220,0.5)' }}>
              शान्त
            </span>
          </div>
        </motion.div>

        {/* ===== AI INSIGHT CARD ===== */}
        {(aiInsight || isLoadingInsight) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              maxWidth: '440px', width: '100%',
              padding: `${spacing.md} ${spacing.lg}`,
              background: `linear-gradient(135deg, ${rClr.primary}08, rgba(218,165,32,0.04))`,
              border: `1px solid ${rClr.primary}18`,
              borderRadius: layout.borderRadius.lg,
              position: 'relative',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: spacing.xs,
              marginBottom: spacing.sm,
            }}>
              <Brain size={14} color={colors.gold} style={{ opacity: 0.6 }} />
              <span style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.caption,
                color: colors.gold,
                opacity: 0.6,
                letterSpacing: typography.letterSpacing.wide,
              }}>
                AI Insight
              </span>
              <Sparkles size={10} color={colors.gold} style={{ opacity: 0.4 }} />

              <div style={{ marginLeft: 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (isVoiceEnabled) stopSpeaking();
                    setIsVoiceEnabled(!isVoiceEnabled);
                    if (!isVoiceEnabled && aiInsight) speak(aiInsight, state.selectedRasa);
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, display: 'flex', alignItems: 'center', opacity: 0.4
                  }}
                >
                  {isVoiceEnabled ? <Volume2 size={12} color={colors.gold} /> : <VolumeX size={12} color={colors.textMuted} />}
                </motion.button>
              </div>
            </div>

            {isLoadingInsight ? (
              <div style={{ display: 'flex', gap: spacing.xs, padding: spacing.sm }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: colors.gold,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.bodySmall,
                color: colors.textSecondary,
                lineHeight: typography.lineHeights.relaxed,
                fontStyle: 'italic',
                margin: 0,
              }}>
                {aiInsight}
              </p>
            )}
          </motion.div>
        )}

        {/* Shloka Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            maxWidth: '440px', width: '100%', textAlign: 'center',
            padding: `${spacing.md} ${spacing.lg}`,
            background: `linear-gradient(180deg, ${rClr.primary}06, transparent)`,
            border: `1px solid ${rClr.primary}15`,
            borderRadius: layout.borderRadius.lg,
          }}
        >
          <p style={{
            fontFamily: typography.fonts.sanskrit, fontSize: typography.sizes.body,
            color: rClr.primary, lineHeight: typography.lineHeights.relaxed,
            marginBottom: spacing.sm, opacity: 0.8,
          }}>
            {shloka.sanskrit}
          </p>
          <p style={{
            fontFamily: typography.fonts.heading, fontSize: typography.sizes.bodySmall,
            color: colors.textMuted, fontStyle: 'italic',
            lineHeight: typography.lineHeights.relaxed,
          }}>
            "{shloka.translation}"
          </p>
        </motion.div>

        {/* Journal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            maxWidth: '440px', width: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <Feather size={14} color={colors.textMuted} strokeWidth={1.5} style={{ opacity: 0.4 }} />
            <p style={{
              fontFamily: typography.fonts.body, fontSize: typography.sizes.bodySmall,
              color: colors.textMuted,
            }}>
              What did your {rasaConfig.nameTransliterated} want to tell you?
            </p>
          </div>

          {!journalSaved ? (
            <>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write here... (private, on your device only)"
                maxLength={500}
                rows={3}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.borderSubtle}`, borderRadius: layout.borderRadius.md,
                  padding: spacing.sm, color: colors.textPrimary,
                  fontFamily: typography.fonts.body, fontSize: typography.sizes.bodySmall,
                  lineHeight: typography.lineHeights.relaxed, resize: 'none', outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = `${colors.gold}40`; }}
                onBlur={(e) => { e.target.style.borderColor = colors.borderSubtle; }}
              />
              {journalText.trim().length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleSaveJournal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: 'rgba(218,165,32,0.08)', border: `1px solid ${colors.borderMedium}`,
                    borderRadius: layout.borderRadius.full, padding: `${spacing.xs} ${spacing.md}`,
                    color: colors.gold, fontFamily: typography.fonts.body, fontSize: typography.sizes.caption,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: spacing.xs,
                  }}
                >
                  <Download size={12} /> Save
                </motion.button>
              )}
            </>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontFamily: typography.fonts.body, fontSize: typography.sizes.caption, color: colors.gold, opacity: 0.6 }}>
              Saved to your private journal.
            </motion.p>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: spacing.sm, marginTop: spacing.sm,
          }}
        >
          <GoldenButton onClick={handleDownloadCard} size="medium" variant="secondary">
            <Sparkles size={15} />
            Save Rasa Memory
          </GoldenButton>

          <GoldenButton onClick={handleRestart} size="medium">
            <RefreshCw size={15} />
            Mirror Again
          </GoldenButton>

          <motion.button
            onClick={handleExploreOther}
            whileHover={{ color: colors.gold }}
            style={{
              background: 'none', border: 'none',
              fontFamily: typography.fonts.body, fontSize: typography.sizes.caption,
              color: colors.textMuted, cursor: 'pointer', padding: spacing.xs,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Explore other Rasas <ArrowRight size={12} />
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            fontFamily: typography.fonts.body, fontSize: '0.65rem',
            color: colors.textMuted, opacity: 0.3, marginTop: spacing.sm,
          }}
        >
          {dateString}
        </motion.p>
      </div>
    </PageWrapper>
  );
};

export default ReflectionScreen;
