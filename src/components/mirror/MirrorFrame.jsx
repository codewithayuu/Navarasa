// src/components/mirror/MirrorFrame.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../theme/tokens';

const MirrorFrame = ({ size = 320, children, progress = 0, isDetecting = false }) => {
  const strokeColor = colors.gold;
  const outerPadding = 24;
  const totalSize = size + outerPadding * 2;
  const center = totalSize / 2;
  const mainRadius = size / 2;

  // Progress arc calculation
  const circumference = 2 * Math.PI * (mainRadius + 8);
  const dashOffset = circumference - (progress * circumference);

  return (
    <div
      style={{
        position: 'relative',
        width: totalSize,
        height: totalSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ===== SVG ORNAMENTAL FRAME ===== */}
      <svg
        width={totalSize}
        height={totalSize}
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}
      >
        {/* Outermost decorative ring */}
        <circle
          cx={center} cy={center} r={mainRadius + 16}
          fill="none"
          stroke={strokeColor}
          strokeWidth={0.3}
          opacity={0.12}
          strokeDasharray="2 6"
        />

        {/* Main frame ring */}
        <circle
          cx={center} cy={center} r={mainRadius + 4}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={0.4}
        />

        {/* Inner decorative ring */}
        <circle
          cx={center} cy={center} r={mainRadius - 2}
          fill="none"
          stroke={strokeColor}
          strokeWidth={0.5}
          opacity={0.2}
        />

        {/* Progress arc (golden fill as detection progresses) */}
        {isDetecting && (
          <motion.circle
            cx={center} cy={center} r={mainRadius + 8}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              filter: `drop-shadow(0 0 6px ${colors.goldGlow})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Cardinal ornaments (N, E, S, W) */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180 - Math.PI / 2;
          const r = mainRadius + 4;
          const x = center + r * Math.cos(rad);
          const y = center + r * Math.sin(rad);
          return (
            <g key={`cardinal-${angle}`}>
              <circle cx={x} cy={y} r={3} fill={strokeColor} fillOpacity={0.3} />
              <circle cx={x} cy={y} r={1.2} fill={strokeColor} fillOpacity={0.6} />
            </g>
          );
        })}

        {/* Inter-cardinal small dots */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180 - Math.PI / 2;
          const r = mainRadius + 4;
          const x = center + r * Math.cos(rad);
          const y = center + r * Math.sin(rad);
          return (
            <circle
              key={`inter-${angle}`}
              cx={x} cy={y} r={1.5}
              fill={strokeColor} fillOpacity={0.2}
            />
          );
        })}

        {/* Corner floral motifs (simplified lotus petals at diagonals) */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180 - Math.PI / 2;
          const r = mainRadius + 16;
          const cx = center + r * Math.cos(rad);
          const cy = center + r * Math.sin(rad);

          // Three tiny petal arcs
          return (
            <g key={`floral-${angle}`} opacity={0.15}>
              <ellipse
                cx={cx} cy={cy} rx={4} ry={2}
                fill="none" stroke={strokeColor} strokeWidth={0.5}
                transform={`rotate(${angle} ${cx} ${cy})`}
              />
              <ellipse
                cx={cx} cy={cy} rx={4} ry={2}
                fill="none" stroke={strokeColor} strokeWidth={0.5}
                transform={`rotate(${angle + 60} ${cx} ${cy})`}
              />
              <ellipse
                cx={cx} cy={cy} rx={4} ry={2}
                fill="none" stroke={strokeColor} strokeWidth={0.5}
                transform={`rotate(${angle - 60} ${cx} ${cy})`}
              />
            </g>
          );
        })}
      </svg>

      {/* ===== AMBIENT GLOW BEHIND FRAME ===== */}
      <motion.div
        style={{
          position: 'absolute',
          width: size + 60,
          height: size + 60,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(218,165,32,0.06) 0%, transparent 70%)`,
          zIndex: 0,
        }}
        animate={
          isDetecting
            ? {
                boxShadow: [
                  '0 0 30px rgba(218,165,32,0.05)',
                  '0 0 60px rgba(218,165,32,0.12)',
                  '0 0 30px rgba(218,165,32,0.05)',
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ===== VIDEO CONTAINER (circular clip) ===== */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          background: colors.bgElevated,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.3)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MirrorFrame;
