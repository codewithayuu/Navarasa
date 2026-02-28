import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { JOURNEY_STAGES } from '../../context/AppContext';

function lerpColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return color1;
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function getJourneyColor(rasaColors, totalProgress) {
  const transColors = rasaColors.shantaTransition;
  if (!transColors || transColors.length < 2) return rasaColors.primary;

  const segmentCount = transColors.length - 1;
  const scaledProgress = totalProgress * segmentCount;
  const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1);
  const segmentProgress = scaledProgress - segmentIndex;

  return lerpColor(transColors[segmentIndex], transColors[segmentIndex + 1], segmentProgress);
}

const JourneyBackground = ({
  rasaColors,
  currentStage,
  totalProgress,
  stageProgress,
}) => {
  const currentColor = getJourneyColor(rasaColors, totalProgress);
  const isShanta = currentStage === JOURNEY_STAGES.SHANTA;

  const blobData = useMemo(() => [
    { baseX: 20, baseY: 25, size: 500, blur: 140, opacity: 0.12 },
    { baseX: 75, baseY: 45, size: 400, blur: 120, opacity: 0.08 },
    { baseX: 45, baseY: 75, size: 450, blur: 130, opacity: 0.10 },
    { baseX: 60, baseY: 15, size: 300, blur: 100, opacity: 0.06 },
  ], []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'background 2s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isShanta
            ? `linear-gradient(180deg, #0a0a0f 0%, #0f0f18 30%, #1a1a28 70%, #0f0f18 100%)` 
            : `linear-gradient(180deg, #0a0a0f 0%, #0c0c16 50%, #0a0a0f 100%)`,
          transition: 'background 3s ease',
        }}
      />

      {blobData.map((blob, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, (i % 2 === 0 ? 30 : -30), 0],
            y: [0, (i % 2 === 0 ? -20 : 20), 0],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${blob.baseX}%`,
            top: `${blob.baseY}%`,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: currentColor,
            opacity: isShanta ? blob.opacity * 0.4 : blob.opacity,
            filter: `blur(${blob.blur}px)`,
            transform: 'translate(-50%, -50%)',
            transition: 'background 2s ease, opacity 2s ease',
          }}
        />
      ))}

      {isShanta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stageProgress * 0.15 }}
          transition={{ duration: 2 }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240,244,248,0.15) 0%, transparent 60%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.012,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};

export default JourneyBackground;
