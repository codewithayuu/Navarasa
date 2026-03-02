// src/components/ui/SanskritText.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { typography, colors } from '../../theme/tokens';
import { fadeIn } from '../../theme/animations';

const SanskritText = ({
  children,
  size,
  color,
  align = 'center',
  glow = false,
  delay = 0,
  style = {},
}) => {
  const textStyle = {
    fontFamily: typography.fonts.sanskrit,
    fontSize: size || typography.sizes.h2,
    fontWeight: typography.weights.regular,
    color: color || colors.gold,
    textAlign: align,
    lineHeight: typography.lineHeights.normal,
    textShadow: glow ? `0 0 30px ${colors.goldGlow}` : 'none',
    margin: 0,
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

export default SanskritText;
