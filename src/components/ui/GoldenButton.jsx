// src/components/ui/GoldenButton.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { colors, typography, spacing, layout } from '../../theme/tokens';

const GoldenButton = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'large',       // 'medium' | 'large'
  disabled = false,
  style = {},
  ...props
}) => {
  const sizeStyles = {
    medium: {
      padding: `${spacing.sm} ${spacing.xl}`,
      fontSize: typography.sizes.body,
      minWidth: '160px',
    },
    large: {
      padding: `${spacing.md} ${spacing['2xl']}`,
      fontSize: typography.sizes.bodyLarge,
      minWidth: '220px',
    },
  };

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
      color: '#0a0a0f',
      border: 'none',
      boxShadow: `0 4px 20px rgba(218, 165, 32, 0.3), 0 0 40px rgba(218, 165, 32, 0.1)`,
    },
    secondary: {
      background: 'transparent',
      color: colors.gold,
      border: `1px solid ${colors.borderMedium}`,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: colors.textSecondary,
      border: `1px solid ${colors.borderSubtle}`,
      boxShadow: 'none',
    },
  };

  const baseStyle = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    fontFamily: typography.fonts.heading,
    fontWeight: typography.weights.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
    borderRadius: layout.borderRadius.full,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  return (
    <motion.button
      style={baseStyle}
      onClick={disabled ? undefined : onClick}
      whileHover={
        !disabled
          ? {
              scale: 1.03,
              boxShadow:
                variant === 'primary'
                  ? '0 6px 30px rgba(218, 165, 32, 0.45), 0 0 60px rgba(218, 165, 32, 0.2)'
                  : '0 0 20px rgba(218, 165, 32, 0.15)',
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GoldenButton;
