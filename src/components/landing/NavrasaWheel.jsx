// src/components/landing/NavrasaWheel.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, spacing, layout } from '../../theme/tokens';
import { rasaColors } from '../../theme/tokens';

const RASA_LIST = [
  { id: 'shringara', name: 'Shringara', sanskrit: 'शृंगार', english: 'Love', emoji: '💚' },
  { id: 'hasya', name: 'Hasya', sanskrit: 'हास्य', english: 'Joy', emoji: '😄' },
  { id: 'karuna', name: 'Karuna', sanskrit: 'करुण', english: 'Sorrow', emoji: '🩶' },
  { id: 'raudra', name: 'Raudra', sanskrit: 'रौद्र', english: 'Fury', emoji: '🔴' },
  { id: 'veera', name: 'Veera', sanskrit: 'वीर', english: 'Courage', emoji: '⚔️' },
  { id: 'bhayanaka', name: 'Bhayanaka', sanskrit: 'भयानक', english: 'Fear', emoji: '🌑' },
  { id: 'bibhatsa', name: 'Bibhatsa', sanskrit: 'बीभत्स', english: 'Disgust', emoji: '🔵' },
  { id: 'adbhuta', name: 'Adbhuta', sanskrit: 'अद्भुत', english: 'Wonder', emoji: '✨' },
  { id: 'shanta', name: 'Shanta', sanskrit: 'शान्त', english: 'Peace', emoji: '🤍' },
];

const NavrasaWheel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const wheelSize = 320;
  const center = wheelSize / 2;
  const radius = 120;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: layout.zIndex.modal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.md,
          }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 5, 10, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '520px',
              width: '100%',
              background: colors.bgSecondary,
              borderRadius: layout.borderRadius.xl,
              border: `1px solid ${colors.borderSubtle}`,
              padding: spacing['2xl'],
              textAlign: 'center',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: spacing.md,
                right: spacing.md,
                background: 'none',
                border: 'none',
                color: colors.textMuted,
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: spacing.xs,
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            {/* Title */}
            <h2
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.h2,
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              }}
            >
              The Nine Rasas
            </h2>

            <p
              style={{
                fontFamily: typography.fonts.sanskrit,
                fontSize: typography.sizes.h3,
                color: colors.gold,
                marginBottom: spacing.lg,
              }}
            >
              नवरस
            </p>

            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.bodySmall,
                color: colors.textSecondary,
                lineHeight: typography.lineHeights.relaxed,
                marginBottom: spacing.xl,
                maxWidth: '400px',
                margin: `0 auto ${spacing.xl}`,
              }}
            >
              From the Natyashastra (c. 200 BCE), the world's oldest treatise on human emotion.
              Every feeling you've ever had is one of these nine essential flavors of experience.
            </p>

            {/* Rasa Wheel */}
            <div style={{ position: 'relative', width: wheelSize, height: wheelSize, margin: '0 auto' }}>
              <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
                {/* Center circle */}
                <circle cx={center} cy={center} r={20} fill={colors.gold} fillOpacity={0.1} stroke={colors.gold} strokeWidth={0.5} strokeOpacity={0.3} />
                <text x={center} y={center + 4} textAnchor="middle" fill={colors.gold} fontSize="8" fontFamily={typography.fonts.body} opacity={0.6}>
                  RASA
                </text>

                {/* Connecting lines */}
                {RASA_LIST.map((rasa, i) => {
                  const angle = (Math.PI * 2 * i) / 9 - Math.PI / 2;
                  const x = center + radius * Math.cos(angle);
                  const y = center + radius * Math.sin(angle);
                  return (
                    <line
                      key={`line-${rasa.id}`}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke={colors.gold}
                      strokeWidth={0.3}
                      strokeOpacity={0.15}
                    />
                  );
                })}
              </svg>

              {/* Rasa nodes */}
              {RASA_LIST.map((rasa, i) => {
                const angle = (Math.PI * 2 * i) / 9 - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                const rasaPalette = rasaColors[rasa.id];

                return (
                  <motion.div
                    key={rasa.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 150, damping: 15 }}
                    style={{
                      position: 'absolute',
                      left: x - 32,
                      top: y - 32,
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${rasaPalette.primary}, ${rasaPalette.secondary})`,
                      border: `1.5px solid ${rasaPalette.primary}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 15px ${rasaPalette.glow}`,
                      cursor: 'default',
                    }}
                    title={`${rasa.name} — ${rasa.english}`}
                  >
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>{rasa.emoji}</span>
                    <span
                      style={{
                        fontSize: '7px',
                        color: rasa.id === 'shanta' || rasa.id === 'hasya' || rasa.id === 'adbhuta' ? '#333' : '#fff',
                        fontFamily: typography.fonts.body,
                        fontWeight: 500,
                        marginTop: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {rasa.english}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend below wheel */}
            <div style={{ marginTop: spacing.xl }}>
              {RASA_LIST.map((rasa) => (
                <div
                  key={rasa.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.xs} 0`,
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: rasaColors[rasa.id].primary,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: typography.fonts.heading,
                      fontSize: typography.sizes.bodySmall,
                      color: colors.textPrimary,
                      width: '80px',
                    }}
                  >
                    {rasa.name}
                  </span>
                  <span
                    style={{
                      fontFamily: typography.fonts.sanskrit,
                      fontSize: typography.sizes.bodySmall,
                      color: colors.gold,
                      width: '60px',
                    }}
                  >
                    {rasa.sanskrit}
                  </span>
                  <span
                    style={{
                      fontFamily: typography.fonts.body,
                      fontSize: typography.sizes.bodySmall,
                      color: colors.textMuted,
                    }}
                  >
                    {rasa.english}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.caption,
                color: colors.textMuted,
                marginTop: spacing.lg,
                fontStyle: 'italic',
              }}
            >
              "All human emotional experience can be distilled into 9 fundamental essences."
              <br />
              — Bharata Muni, Natyashastra (c. 200 BCE)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavrasaWheel;
