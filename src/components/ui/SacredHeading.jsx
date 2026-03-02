// src/components/ui/SacredHeading.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { typography, colors } from '../../theme/tokens';
import { fadeInUp } from '../../theme/animations';

const SacredHeading = ({
  children,
  level = 1,
  color,
  align = 'center',
  size,
  delay = 0,
  style = {},
}) => {
  const Tag = `h${level}`;

  const sizeMap = {
    1: typography.sizes.displayLarge,
    2: typography.sizes.displayMedium,
    3: typography.sizes.displaySmall,
    4: typography.sizes.h2,
    5: typography.sizes.h3,
    6: typography.sizes.h4,
  };

  const headingStyle = {
    fontFamily: typography.fonts.heading,
    fontSize: size || sizeMap[level],
    fontWeight: typography.weights.regular,
    color: color || colors.textPrimary,
    textAlign: align,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: level <= 2 ? typography.letterSpacing.wide : typography.letterSpacing.normal,
    margin: 0,
    ...style,
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay }}
    >
      <Tag style={headingStyle}>{children}</Tag>
    </motion.div>
  );
};

export default SacredHeading;
