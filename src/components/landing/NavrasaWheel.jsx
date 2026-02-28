// src/components/landing/NavrasaWheel.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { colors, typography, spacing, layout } from '../../theme/tokens';
import { rasaColors } from '../../theme/tokens';
import RasaIcon from '../icons/RasaIcons';

const RASA_LIST = [
  { id: 'shringara', name: 'Shringara', sanskrit: 'शृंगार', english: 'Love' },
  { id: 'hasya', name: 'Hasya', sanskrit: 'हास्य', english: 'Joy' },
  { id: 'karuna', name: 'Karuna', sanskrit: 'करुण', english: 'Sorrow' },
  { id: 'raudra', name: 'Raudra', sanskrit: 'रौद्र', english: 'Fury' },
  { id: 'veera', name: 'Veera', sanskrit: 'वीर', english: 'Courage' },
  { id: 'bhayanaka', name: 'Bhayanaka', sanskrit: 'भयानक', english: 'Fear' },
  { id: 'bibhatsa', name: 'Bibhatsa', sanskrit: 'बीभत्स', english: 'Disgust' },
  { id: 'adbhuta', name: 'Adbhuta', sanskrit: 'अद्भुत', english: 'Wonder' },
  { id: 'shanta', name: 'Shanta', sanskrit: 'शान्त', english: 'Peace' },
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
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textMuted,
                cursor: 'pointer',
              }}
            >
              <X size={16} />
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
                    <RasaIcon
                      rasaId={rasa.id}
                      size={20}
                      color={
                        ['shanta', 'hasya', 'adbhuta'].includes(rasa.id)
                          ? 'rgba(30,30,30,0.8)'
                          : 'rgba(255,255,255,0.85)'
                      }
                    />
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
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${rasaColors[rasa.id].primary}, ${rasaColors[rasa.id].secondary})`,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RasaIcon
                      rasaId={rasa.id}
                      size={12}
                      color={
                        ['shanta', 'hasya', 'adbhuta'].includes(rasa.id)
                          ? 'rgba(30,30,30,0.7)'
                          : 'rgba(255,255,255,0.7)'
                      }
                    />
                  </div>
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
            <div
              style={{ marginTop: spacing.xl }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: colors.gold,
                  opacity: 0.2,
                  margin: `0 auto ${spacing.md}`,
                }}
              />
              <p
                style={{
                  fontFamily: typography.fonts.heading,
                  fontSize: typography.sizes.bodySmall,
                  color: colors.textMuted,
                  fontStyle: 'italic',
                  opacity: 0.5,
                  lineHeight: typography.lineHeights.relaxed,
                }}
              >
                "No Rasa is wrong. Fury is not a disorder. Fear is not weakness.
                They are all necessary movements of consciousness."
              </p>
              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.caption,
                  color: colors.textMuted,
                  opacity: 0.3,
                  marginTop: spacing.xs,
                }}
              >
                Natyashastra, circa 200 BCE
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavrasaWheel;
