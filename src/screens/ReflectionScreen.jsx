import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Feather, Download } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext';
import { getRasaById } from '../data/rasaConfig';
import { RasaIcon, ShantaIcon } from '../components/icons/RasaIcons';
import PageWrapper from '../components/layout/PageWrapper';
import OrnamentalDivider from '../components/ui/OrnamentalDivider';
import GoldenButton from '../components/ui/GoldenButton';
import GlowOrb from '../components/ui/GlowOrb';
import ParticleField from '../components/ui/ParticleField';
import { colors, typography, spacing, layout } from '../theme/tokens';
import { staggerContainer, staggerChild } from '../theme/animations';

const ReflectionScreen = () => {
  const { state, actions } = useApp();
  const rasaConfig = getRasaById(state.selectedRasa);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  if (!rasaConfig) {
    actions.setScreen(SCREENS.LANDING);
    return null;
  }

  const rClr = rasaConfig.colors;

  const handleSaveJournal = () => {
    if (journalText.trim()) {
      actions.setJournalEntry(journalText);
      try {
        const existing = JSON.parse(localStorage.getItem('navarasa_journal') || '[]');
        existing.push({
          date: new Date().toISOString(),
          rasa: rasaConfig.id,
          rasaName: rasaConfig.nameTransliterated,
          entry: journalText,
        });
        localStorage.setItem('navarasa_journal', JSON.stringify(existing));
        setJournalSaved(true);
      } catch (e) {
        console.error('Failed to save journal:', e);
      }
    }
  };

  const handleRestart = () => {
    actions.reset();
  };

  const handleExploreOther = () => {
    actions.setScreen(SCREENS.MANUAL_SELECT);
  };

  return (
    <PageWrapper
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(240,244,248,0.03) 0%, transparent 50%),
          linear-gradient(180deg, #0c0c14 0%, #0f0f1a 50%, #0a0a0f 100%)
        `,
      }}
    >
      <ParticleField count={15} color="rgba(200, 210, 220, 0.06)" />
      <GlowOrb color="rgba(240,244,248,0.03)" size={500} x="50%" y="35%" blur={140} />

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
          padding: `${spacing['4xl']} ${spacing.md} ${spacing['3xl']}`,
          gap: spacing.xl,
          minHeight: '100vh',
        }}
      >
        <motion.div variants={staggerChild} style={{ textAlign: 'center' }}>
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
            Your Journey
          </p>
          <h2
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.displaySmall,
              color: colors.textPrimary,
              fontWeight: typography.weights.regular,
            }}
          >
            Reflection
          </h2>
        </motion.div>

        <motion.div variants={staggerChild}>
          <OrnamentalDivider width={160} />
        </motion.div>

        <motion.div
          variants={staggerChild}
          style={{
            maxWidth: '460px',
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: layout.borderRadius.xl,
            padding: `${spacing['2xl']} ${spacing.xl}`,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 16px 50px rgba(0,0,0,0.3)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${rClr.primary}25, ${rClr.primary}08)`,
                  border: `1px solid ${rClr.primary}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${rClr.glow}`,
                }}
              >
                <RasaIcon rasaId={rasaConfig.id} size={28} color={rClr.primary} />
              </div>
              <span
                style={{
                  fontFamily: typography.fonts.sanskrit,
                  fontSize: typography.sizes.body,
                  color: rClr.primary,
                }}
              >
                {rasaConfig.nameSanskrit}
              </span>
              <span
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.caption,
                  color: colors.textMuted,
                }}
              >
                {rasaConfig.nameEnglish}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <svg width="80" height="20" viewBox="0 0 80 20">
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={rClr.primary} stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgba(200,210,220,0.5)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 5 10 Q 20 4, 40 10 Q 60 16, 75 10"
                  stroke="url(#flowGrad)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 70 7 L 76 10 L 70 13"
                  stroke="rgba(200,210,220,0.5)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: '0.6rem',
                  color: colors.textMuted,
                  opacity: 0.4,
                  letterSpacing: typography.letterSpacing.wide,
                }}
              >
                5 MINUTES
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, rgba(240,244,248,0.08), rgba(240,244,248,0.02))',
                  border: '1px solid rgba(240, 244, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(240, 244, 248, 0.05)',
                }}
              >
                <ShantaIcon size={28} color="rgba(200, 210, 220, 0.6)" />
              </div>
              <span
                style={{
                  fontFamily: typography.fonts.sanskrit,
                  fontSize: typography.sizes.body,
                  color: 'rgba(200, 210, 220, 0.6)',
                }}
              >
                शान्त
              </span>
              <span
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.caption,
                  color: colors.textMuted,
                }}
              >
                Peace
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              paddingTop: spacing.md,
              borderTop: `1px solid ${colors.borderSubtle}`,
            }}
          >
            <DetailItem label="Raaga" value={rasaConfig.audio.raaga} />
            <DetailItem label="Story" value={rasaConfig.story.character} />
            <DetailItem label="Breath" value={rasaConfig.breathing.name} />
          </div>
        </motion.div>

        <motion.div
          variants={staggerChild}
          style={{
            maxWidth: '460px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <Feather size={16} color={colors.textMuted} strokeWidth={1.5} style={{ opacity: 0.5 }} />
            <p
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.body,
                color: colors.textSecondary,
                fontStyle: 'italic',
              }}
            >
              In one line, what did your {rasaConfig.nameTransliterated} want to tell you?
            </p>
          </div>

          {!journalSaved ? (
            <>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write here... (saved only on your device)"
                maxLength={280}
                style={{
                  width: '100%',
                  minHeight: 80,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: layout.borderRadius.lg,
                  padding: spacing.md,
                  color: colors.textPrimary,
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.body,
                  lineHeight: typography.lineHeights.relaxed,
                  resize: 'none',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = `${colors.gold}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.borderSubtle;
                }}
              />
              {journalText.trim().length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSaveJournal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: 'rgba(218,165,32,0.1)',
                    border: `1px solid ${colors.borderMedium}`,
                    borderRadius: layout.borderRadius.full,
                    padding: `${spacing.xs} ${spacing.lg}`,
                    color: colors.gold,
                    fontFamily: typography.fonts.body,
                    fontSize: typography.sizes.bodySmall,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}
                >
                  <Download size={14} />
                  Save to journal
                </motion.button>
              )}
            </>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.bodySmall,
                color: colors.gold,
                opacity: 0.6,
              }}
            >
              Saved to your private journal.
            </motion.p>
          )}
        </motion.div>

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
          <GoldenButton onClick={handleRestart}>
            <RefreshCw size={16} />
            Mirror Again
          </GoldenButton>

          <motion.button
            onClick={handleExploreOther}
            whileHover={{ color: colors.gold }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: typography.fonts.body,
              fontSize: typography.sizes.bodySmall,
              color: colors.textMuted,
              cursor: 'pointer',
              padding: spacing.sm,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            Explore other Rasas
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        <motion.div
          variants={staggerChild}
          style={{
            marginTop: spacing.xl,
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: colors.gold,
              opacity: 0.15,
              margin: `0 auto ${spacing.md}`,
            }}
          />
          <p
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.bodySmall,
              color: colors.textMuted,
              fontStyle: 'italic',
              opacity: 0.4,
              lineHeight: typography.lineHeights.relaxed,
            }}
          >
            "Peace is not the absence of all other Rasas — it is their fulfillment."
          </p>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

const DetailItem = ({ label, value }) => (
  <div style={{ textAlign: 'center' }}>
    <p
      style={{
        fontFamily: typography.fonts.body,
        fontSize: '0.6rem',
        color: colors.textMuted,
        letterSpacing: typography.letterSpacing.extraWide,
        textTransform: 'uppercase',
        marginBottom: 2,
        opacity: 0.5,
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes.bodySmall,
        color: colors.textSecondary,
      }}
    >
      {value}
    </p>
  </div>
);

export default ReflectionScreen;
