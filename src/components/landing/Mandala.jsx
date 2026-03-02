// src/components/landing/Mandala.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../theme/tokens';

const Mandala = ({ size = 400 }) => {
  const center = size / 2;
  const strokeColor = colors.gold;

  // Generate petal paths for the lotus mandala
  const generateLotusPath = (cx, cy, innerR, outerR, petalCount, rotation = 0) => {
    const paths = [];
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount + (rotation * Math.PI) / 180;
      const nextAngle = (Math.PI * 2 * (i + 0.5)) / petalCount + (rotation * Math.PI) / 180;

      const x1 = cx + innerR * Math.cos(angle - 0.15);
      const y1 = cy + innerR * Math.sin(angle - 0.15);
      const x2 = cx + outerR * Math.cos(nextAngle);
      const y2 = cy + outerR * Math.sin(nextAngle);
      const x3 = cx + innerR * Math.cos(angle + 0.15);
      const y3 = cy + innerR * Math.sin(angle + 0.15);

      // Control points for smooth petals
      const cp1x = cx + (outerR * 0.7) * Math.cos(angle - 0.08);
      const cp1y = cy + (outerR * 0.7) * Math.sin(angle - 0.08);
      const cp2x = cx + (outerR * 0.7) * Math.cos(angle + 0.08);
      const cp2y = cy + (outerR * 0.7) * Math.sin(angle + 0.08);

      paths.push(
        `M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2} Q ${cp2x} ${cp2y} ${x3} ${y3} Z` 
      );
    }
    return paths;
  };

  // Create concentric decorative circles
  const circles = [
    { r: size * 0.06, strokeWidth: 1, opacity: 0.6 },
    { r: size * 0.12, strokeWidth: 0.5, opacity: 0.3, dashArray: '2 4' },
    { r: size * 0.22, strokeWidth: 0.5, opacity: 0.2, dashArray: '1 3' },
    { r: size * 0.32, strokeWidth: 0.5, opacity: 0.15, dashArray: '3 6' },
    { r: size * 0.42, strokeWidth: 0.5, opacity: 0.1 },
    { r: size * 0.48, strokeWidth: 0.3, opacity: 0.08, dashArray: '1 5' },
  ];

  const innerPetals = generateLotusPath(center, center, size * 0.05, size * 0.15, 8, 0);
  const middlePetals = generateLotusPath(center, center, size * 0.12, size * 0.25, 12, 15);
  const outerPetals = generateLotusPath(center, center, size * 0.22, size * 0.36, 16, 7.5);

  // Small dots around outer ring
  const dots = [];
  for (let i = 0; i < 36; i++) {
    const angle = (Math.PI * 2 * i) / 36;
    dots.push({
      cx: center + size * 0.44 * Math.cos(angle),
      cy: center + size * 0.44 * Math.sin(angle),
      r: 1.2,
    });
  }

  return (
    <motion.div
      style={{ position: 'relative', width: size, height: size }}
      animate={{
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Outer rotating layer (very slow) */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer decorative circles */}
        {circles.slice(3).map((c, i) => (
          <circle
            key={`outer-circle-${i}`}
            cx={center}
            cy={center}
            r={c.r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={c.strokeWidth}
            opacity={c.opacity}
            strokeDasharray={c.dashArray || 'none'}
          />
        ))}

        {/* Dots */}
        {dots.map((d, i) => (
          <circle
            key={`dot-${i}`}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={strokeColor}
            opacity={0.2}
          />
        ))}
      </motion.svg>

      {/* Middle rotating layer (opposite direction, slower) */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer petals */}
        {outerPetals.map((d, i) => (
          <motion.path
            key={`outer-petal-${i}`}
            d={d}
            fill={strokeColor}
            fillOpacity={0.04}
            stroke={strokeColor}
            strokeWidth={0.5}
            strokeOpacity={0.2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.05, duration: 1 }}
          />
        ))}

        {/* Middle circles */}
        {circles.slice(1, 3).map((c, i) => (
          <circle
            key={`mid-circle-${i}`}
            cx={center}
            cy={center}
            r={c.r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={c.strokeWidth}
            opacity={c.opacity}
            strokeDasharray={c.dashArray || 'none'}
          />
        ))}
      </motion.svg>

      {/* Inner static layer (breathes but doesn't rotate) */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={circles[0].r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={circles[0].strokeWidth}
          opacity={circles[0].opacity}
        />

        {/* Inner petals (lotus core) */}
        {innerPetals.map((d, i) => (
          <motion.path
            key={`inner-petal-${i}`}
            d={d}
            fill={strokeColor}
            fillOpacity={0.1}
            stroke={strokeColor}
            strokeWidth={0.8}
            strokeOpacity={0.5}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.8 }}
          />
        ))}

        {/* Middle petals */}
        {middlePetals.map((d, i) => (
          <motion.path
            key={`mid-petal-${i}`}
            d={d}
            fill={strokeColor}
            fillOpacity={0.06}
            stroke={strokeColor}
            strokeWidth={0.6}
            strokeOpacity={0.3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.06, duration: 1 }}
          />
        ))}

        {/* Center dot (bindu) */}
        <motion.circle
          cx={center}
          cy={center}
          r={3}
          fill={strokeColor}
          animate={{
            opacity: [0.4, 1, 0.4],
            r: [2.5, 3.5, 2.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>

      {/* Ambient glow behind mandala */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(218, 165, 32, 0.08) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </motion.div>
  );
};

export default Mandala;
