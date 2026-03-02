// src/components/ui/BodyText.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { typography, colors, spacing } from '../../theme/tokens';
import { fadeIn } from '../../theme/animations';

const BodyText = ({
  children,
  size,
  color,
  align = 'center',
  maxWidth,
  delay = 0,
  style = {},
}) => {
  const textStyle = {
    fontFamily: typography.fonts.body,
    fontSize: size || typography.sizes.bodyLarge,
    fontWeight: typography.weights.light,
    color: color || colors.textSecondary,
    textAlign: align,
    lineHeight: typography.lineHeights.relaxed,
    maxWidth: maxWidth || '600px',
    margin: '0 auto',
    padding: `0 ${spacing.md}`,
    ...style,
  };

  return (
    <motion.p
      style={textStyle}
      variants={fadeIn}
      initial="initial"
      animate="animate"
      transition={{ delay }}
    >
      {children}
    </motion.p>
  );
};

export default BodyText;
