// src/components/ui/GlowOrb.jsx

import React from 'react';
import { motion } from 'framer-motion';

const GlowOrb = ({
  color = 'rgba(218, 165, 32, 0.08)',
  size = 400,
  x = '50%',
  y = '50%',
  blur = 120,
  duration = 8,
  delay = 0,
}) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur}px)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
};

export default GlowOrb;
