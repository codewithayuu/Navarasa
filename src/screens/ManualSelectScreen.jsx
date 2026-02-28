// src/screens/ManualSelectScreen.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useApp, SCREENS } from '../context/AppContext';
import { getAllRasas } from '../data/rasaConfig';
import { RasaIcon } from '../components/icons/RasaIcons';
import PageWrapper from '../components/layout/PageWrapper';
import OrnamentalDivider from '../components/ui/OrnamentalDivider';
import GlowOrb from '../components/ui/GlowOrb';
import ParticleField from '../components/ui/ParticleField';
import { colors, typography, spacing, layout } from '../theme/tokens';
import { staggerContainer } from '../theme/animations';

const ManualSelectScreen = () => {
  const { actions } = useApp();
  const allRasas = getAllRasas();

  const handleSelectRasa = (rasaId) => {
    actions.setDetectedEmotion('manual', 1);
    actions.setSelectedRasa(rasaId);
    actions.setScreen(SCREENS.RASA_REVEAL);
  };

  const handleBack = () => {
    actions.setScreen(SCREENS.MIRROR);
  };

  return (
    <PageWrapper
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(218,165,32,0.03) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)
        `,
      }}
    >
      <ParticleField count={18} color="rgba(218, 165, 32, 0.06)" />
      <GlowOrb color="rgba(218,165,32,0.03)" size={500} x="50%" y="30%" blur={140} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
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
          gap: spacing.lg,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <motion.div variants={staggerContainer} style={{ textAlign: 'center' }}>
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
            Trust Your Knowing
          </p>
          <h2
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: typography.sizes.displaySmall,
              color: colors.textPrimary,
              fontWeight: typography.weights.regular,
              marginBottom: spacing.sm,
            }}
          >
            Choose Your Rasa
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer}>
          <OrnamentalDivider width={180} />
        </motion.div>

        <motion.p
          variants={staggerContainer}
          style={{
            fontFamily: typography.fonts.heading,
            fontSize: typography.sizes.h4,
            color: colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '480px',
            lineHeight: typography.lineHeights.relaxed,
          }}
        >
          Which of these essences resonates with what you carry right now?
        </motion.p>

        {/* Rasa Grid */}
        <motion.div
          variants={staggerContainer}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: spacing.md,
            maxWidth: '560px',
            width: '100%',
            marginTop: spacing.lg,
          }}
        >
          {allRasas.map((rasa) => (
            <RasaSelectCard
              key={rasa.id}
              rasa={rasa}
              onClick={() => handleSelectRasa(rasa.id)}
            />
          ))}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

// ─── Individual Selection Card ───
const RasaSelectCard = ({ rasa, onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      onClick={onClick}
      whileHover={{
        scale: 1.04,
        y: -4,
        boxShadow: `0 12px 40px ${rasa.colors.glow}, 0 0 20px ${rasa.colors.glow}`,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: `linear-gradient(145deg, ${rasa.colors.primary}18, ${rasa.colors.secondary}10)`,
        border: `1px solid ${rasa.colors.primary}30`,
        borderRadius: layout.borderRadius.lg,
        padding: `${spacing.lg} ${spacing.md}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.sm,
        cursor: 'pointer',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${rasa.colors.primary}08, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${rasa.colors.primary}30, ${rasa.colors.primary}10)`,
          border: `1px solid ${rasa.colors.primary}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RasaIcon rasaId={rasa.id} size={22} color={rasa.colors.primary} />
      </div>

      <span
        style={{
          fontFamily: typography.fonts.sanskrit,
          fontSize: typography.sizes.bodyLarge,
          color: rasa.colors.primary,
        }}
      >
        {rasa.nameSanskrit}
      </span>

      <span
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.bodySmall,
          color: colors.textPrimary,
          fontWeight: typography.weights.regular,
        }}
      >
        {rasa.nameTransliterated}
      </span>

      <span
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.caption,
          color: colors.textMuted,
        }}
      >
        {rasa.nameEnglish}
      </span>
    </motion.button>
  );
};

export default ManualSelectScreen;
