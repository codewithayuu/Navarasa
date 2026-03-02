import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ExternalLink } from 'lucide-react';
import { colors, typography, spacing, layout } from '../../theme/tokens';

const HELPLINES = [
  { country: 'India', name: 'iCall', number: '9152987821' },
  { country: 'India', name: 'Vandrevala Foundation', number: '9999666555' },
  { country: 'USA', name: 'Crisis Text Line', number: 'Text HOME to 741741' },
  { country: 'UK', name: 'Samaritans', number: '116 123' },
  { country: 'International', name: 'Befrienders Worldwide', number: 'befrienders.org' },
];

const CrisisDisclaimer = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: layout.zIndex.modal + 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.md,
          }}
          onClick={onClose}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
            }}
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 440,
              width: '100%',
              background: colors.bgSecondary,
              borderRadius: layout.borderRadius.xl,
              border: `1px solid rgba(220, 20, 60, 0.15)`,
              padding: spacing['2xl'],
            }}
          >
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              style={{
                position: 'absolute',
                top: spacing.md,
                right: spacing.md,
                background: 'none',
                border: 'none',
                color: colors.textMuted,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={16} />
            </motion.button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(220, 20, 60, 0.08)',
                  border: '1px solid rgba(220, 20, 60, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={22} color="rgba(220, 20, 60, 0.6)" strokeWidth={1.5} />
              </div>

              <h3
                style={{
                  fontFamily: typography.fonts.heading,
                  fontSize: typography.sizes.h3,
                  color: colors.textPrimary,
                }}
              >
                Important
              </h3>

              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.body,
                  color: colors.textSecondary,
                  lineHeight: typography.lineHeights.relaxed,
                }}
              >
                Navarasa Mirror is designed for gentle emotional exploration and contemplation.
                It is <strong style={{ color: colors.textPrimary }}>not a substitute for professional mental health support</strong>.
              </p>

              <p
                style={{
                  fontFamily: typography.fonts.body,
                  fontSize: typography.sizes.bodySmall,
                  color: colors.textMuted,
                  lineHeight: typography.lineHeights.relaxed,
                }}
              >
                If you are experiencing a mental health crisis or having thoughts of self-harm,
                please reach out to a professional:
              </p>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.xs,
                  marginTop: spacing.sm,
                }}
              >
                {HELPLINES.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: layout.borderRadius.md,
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${colors.borderSubtle}`,
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <p style={{
                        fontFamily: typography.fonts.body,
                        fontSize: typography.sizes.caption,
                        color: colors.textMuted,
                        marginBottom: 1,
                      }}>
                        {h.country}
                      </p>
                      <p style={{
                        fontFamily: typography.fonts.body,
                        fontSize: typography.sizes.bodySmall,
                        color: colors.textPrimary,
                      }}>
                        {h.name}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: typography.fonts.body,
                      fontSize: typography.sizes.bodySmall,
                      color: colors.gold,
                    }}>
                      {h.number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CrisisDisclaimer;
