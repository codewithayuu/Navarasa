// src/components/ui/OrnamentalDivider.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { drawLine } from '../../theme/animations';
import { colors } from '../../theme/tokens';

const OrnamentalDivider = ({ width = 200, color, style = {} }) => {
  const strokeColor = color || colors.gold;

  return (
    <motion.svg
      width={width}
      height="24"
      viewBox={`0 0 ${width} 24`}
      fill="none"
      style={{ overflow: 'visible', ...style }}
      initial="initial"
      animate="animate"
    >
      {/* Left decorative curl */}
      <motion.path
        d={`M ${width * 0.35} 12 Q ${width * 0.25} 4, ${width * 0.15} 12 Q ${width * 0.25} 20, ${width * 0.35} 12`}
        stroke={strokeColor}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        variants={drawLine}
        style={{ opacity: 0.6 }}
      />

      {/* Center line left */}
      <motion.line
        x1={width * 0.15}
        y1="12"
        x2={width * 0.42}
        y2="12"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        variants={drawLine}
        style={{ opacity: 0.4 }}
      />

      {/* Center diamond */}
      <motion.path
        d={`M ${width * 0.5} 6 L ${width * 0.54} 12 L ${width * 0.5} 18 L ${width * 0.46} 12 Z`}
        stroke={strokeColor}
        strokeWidth="1"
        fill={strokeColor}
        fillOpacity="0.3"
        variants={drawLine}
      />

      {/* Center line right */}
      <motion.line
        x1={width * 0.58}
        y1="12"
        x2={width * 0.85}
        y2="12"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        variants={drawLine}
        style={{ opacity: 0.4 }}
      />

      {/* Right decorative curl */}
      <motion.path
        d={`M ${width * 0.65} 12 Q ${width * 0.75} 4, ${width * 0.85} 12 Q ${width * 0.75} 20, ${width * 0.65} 12`}
        stroke={strokeColor}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        variants={drawLine}
        style={{ opacity: 0.6 }}
      />
    </motion.svg>
  );
};

export default OrnamentalDivider;
