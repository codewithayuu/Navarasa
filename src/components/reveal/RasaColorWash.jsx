// src/components/reveal/RasaColorWash.jsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const RasaColorWash = ({ colorConfig, phase = 'enter' }) => {
  const { primary, secondary, gradient, glow } = colorConfig;

  const blobs = useMemo(
    () => [
      { x: '25%', y: '30%', size: 500, color: `${primary}30`, blur: 120, delay: 0 },
      { x: '70%', y: '50%', size: 400, color: `${secondary}25`, blur: 100, delay: 0.5 },
      { x: '50%', y: '70%', size: 450, color: `${primary}20`, blur: 130, delay: 1 },
      { x: '15%', y: '65%', size: 300, color: glow, blur: 80, delay: 1.5 },
      { x: '80%', y: '25%', size: 350, color: `${secondary}18`, blur: 90, delay: 0.8 },
    ],
    [primary, secondary, glow]
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Base gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 40%, ${primary}15 0%, transparent 60%),
            radial-gradient(ellipse at 30% 70%, ${secondary}10 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0f 0%, ${primary}08 50%, #0a0a0f 100%)
          `,
        }}
      />

      {/* Animated blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.8, 0.6],
            scale: [0.6, 1.1, 1],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            y: [0, (i % 2 === 0 ? -15 : 15), 0],
          }}
          transition={{
            opacity: { duration: 2, delay: blob.delay },
            scale: { duration: 3, delay: blob.delay },
            x: { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: blob.delay },
            y: { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: blob.delay },
          }}
          style={{
            position: 'absolute',
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: blob.color,
            filter: `blur(${blob.blur}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Subtle grain overlay for texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};

export default RasaColorWash;
