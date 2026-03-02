// src/components/icons/RasaIcons.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { drawLine } from '../../theme/animations';

// Each Rasa gets a unique, meaningful SVG icon inspired by its
// mythology, deity, and emotional essence. No emojis. Pure sacred geometry.

const iconDefaults = {
  size: 32,
  strokeWidth: 1.5,
};

// ─── SHRINGARA (Love) — Lotus Blossom ───
export const ShringaraIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, scale: 0.8 } : false}
    animate={animate ? { opacity: 1, scale: 1 } : false}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {/* Central lotus */}
    <path
      d="M16 8C16 8 12 12 12 16C12 18.5 13.8 20 16 20C18.2 20 20 18.5 20 16C20 12 16 8 16 8Z"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      fill={color}
      fillOpacity={0.08}
    />
    {/* Left petal */}
    <path
      d="M12 16C12 16 7 13 6 10C5 7 8 6 10 8C12 10 12 16 12 16Z"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
      fill={color}
      fillOpacity={0.05}
    />
    {/* Right petal */}
    <path
      d="M20 16C20 16 25 13 26 10C27 7 24 6 22 8C20 10 20 16 20 16Z"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
      fill={color}
      fillOpacity={0.05}
    />
    {/* Stem */}
    <path
      d="M16 20V26"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
    />
    {/* Small leaves */}
    <path
      d="M16 23C14 22 12 23 12 25"
      stroke={color}
      strokeWidth={0.8}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M16 24C18 23 20 24 20 26"
      stroke={color}
      strokeWidth={0.8}
      strokeLinecap="round"
      fill="none"
    />
  </motion.svg>
);

// ─── HASYA (Joy) — Radiant Sun ───
export const HasyaIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, rotate: -30 } : false}
    animate={animate ? { opacity: 1, rotate: 0 } : false}
    transition={{ duration: 0.6 }}
  >
    {/* Center */}
    <circle cx="16" cy="16" r="5" stroke={color} strokeWidth={1.2} fill={color} fillOpacity={0.1} />
    {/* Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 16 + 7 * Math.cos(rad);
      const y1 = 16 + 7 * Math.sin(rad);
      const x2 = 16 + 11 * Math.cos(rad);
      const y2 = 16 + 11 * Math.sin(rad);
      return (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={i % 2 === 0 ? 1.2 : 0.8}
          strokeLinecap="round"
        />
      );
    })}
    {/* Inner warmth dots */}
    <circle cx="14" cy="14.5" r="0.8" fill={color} fillOpacity={0.4} />
    <circle cx="18" cy="14.5" r="0.8" fill={color} fillOpacity={0.4} />
    {/* Subtle smile arc */}
    <path
      d="M13.5 17.5C14 18.5 18 18.5 18.5 17.5"
      stroke={color}
      strokeWidth={0.8}
      strokeLinecap="round"
      fill="none"
    />
  </motion.svg>
);

// ─── KARUNA (Sorrow) — Teardrop / Descending Water ───
export const KarunaIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, y: -5 } : false}
    animate={animate ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.8 }}
  >
    {/* Main teardrop */}
    <path
      d="M16 5C16 5 9 14 9 19C9 22.9 12.1 26 16 26C19.9 26 23 22.9 23 19C23 14 16 5 16 5Z"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      fill={color}
      fillOpacity={0.06}
    />
    {/* Inner ripple */}
    <path
      d="M16 10C16 10 12 16 12 19C12 21.2 13.8 23 16 23C18.2 23 20 21.2 20 19C20 16 16 10 16 10Z"
      stroke={color}
      strokeWidth={0.6}
      strokeLinecap="round"
      fill="none"
      opacity={0.4}
    />
    {/* Reflection */}
    <ellipse cx="14" cy="18" rx="1.5" ry="2" stroke={color} strokeWidth={0.5} fill="none" opacity={0.3} />
  </motion.svg>
);

// ─── RAUDRA (Fury) — Sacred Flame / Agni ───
export const RaudraIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, scale: 0.8 } : false}
    animate={animate ? { opacity: 1, scale: 1 } : false}
    transition={{ duration: 0.5 }}
  >
    {/* Main flame */}
    <path
      d="M16 3C16 3 8 12 8 19C8 23 11 27 16 27C21 27 24 23 24 19C24 16 21 12 21 12C21 12 20 15 18 15C16 15 16 12 16 12C16 12 19 9 16 3Z"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.08}
    />
    {/* Inner flame */}
    <path
      d="M16 14C16 14 13 18 13 21C13 23 14.5 25 16 25C17.5 25 19 23 19 21C19 18 16 14 16 14Z"
      stroke={color}
      strokeWidth={0.8}
      fill={color}
      fillOpacity={0.12}
    />
    {/* Core */}
    <ellipse cx="16" cy="22" rx="1.5" ry="2" fill={color} fillOpacity={0.2} />
  </motion.svg>
);

// ─── VEERA (Courage) — Upward Arrow / Vajra ───
export const VeeraIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, y: 8 } : false}
    animate={animate ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* Central pillar */}
    <line x1="16" y1="6" x2="16" y2="26" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    {/* Arrow head */}
    <path d="M10 13L16 5L22 13" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Cross guard (vajra) */}
    <path d="M11 18L16 16L21 18" stroke={color} strokeWidth={1} strokeLinecap="round" fill="none" />
    <path d="M11 20L16 22L21 20" stroke={color} strokeWidth={1} strokeLinecap="round" fill="none" />
    {/* Base */}
    <circle cx="16" cy="26" r="1.5" stroke={color} strokeWidth={1} fill={color} fillOpacity={0.15} />
  </motion.svg>
);

// ─── BHAYANAKA (Fear) — Crescent / Eclipse ───
export const BhayanakaIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0 } : false}
    animate={animate ? { opacity: 1 } : false}
    transition={{ duration: 1 }}
  >
    {/* Outer circle (full moon) */}
    <circle cx="16" cy="16" r="11" stroke={color} strokeWidth={1} fill={color} fillOpacity={0.04} />
    {/* Eclipse shadow */}
    <path
      d="M20 5.5C15 7 12 11 12 16C12 21 15 25 20 26.5C25.5 24 28 20 28 16C28 12 25.5 8 20 5.5Z"
      fill={color}
      fillOpacity={0.15}
      stroke={color}
      strokeWidth={0.5}
    />
    {/* Stars */}
    <circle cx="8" cy="9" r="0.7" fill={color} fillOpacity={0.3} />
    <circle cx="6" cy="14" r="0.5" fill={color} fillOpacity={0.2} />
    <circle cx="9" cy="22" r="0.6" fill={color} fillOpacity={0.25} />
    <circle cx="7" cy="18" r="0.4" fill={color} fillOpacity={0.15} />
  </motion.svg>
);

// ─── BIBHATSA (Disgust) — Coiled Serpent / Turning Away ───
export const BibhatsaIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, rotate: -10 } : false}
    animate={animate ? { opacity: 1, rotate: 0 } : false}
    transition={{ duration: 0.7 }}
  >
    {/* Spiral */}
    <path
      d="M16 26C16 26 8 24 8 18C8 14 12 12 16 12C20 12 22 14 22 17C22 19 20 20 18 20C16 20 15 19 15 17.5C15 16.5 15.8 16 16.5 16"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      fill="none"
    />
    {/* Radiating discomfort lines */}
    <line x1="6" y1="8" x2="9" y2="11" stroke={color} strokeWidth={0.6} strokeLinecap="round" opacity={0.3} />
    <line x1="5" y1="12" x2="8" y2="13" stroke={color} strokeWidth={0.6} strokeLinecap="round" opacity={0.25} />
    <line x1="26" y1="8" x2="23" y2="11" stroke={color} strokeWidth={0.6} strokeLinecap="round" opacity={0.3} />
    <line x1="27" y1="12" x2="24" y2="13" stroke={color} strokeWidth={0.6} strokeLinecap="round" opacity={0.25} />
    {/* Eye (awareness) */}
    <ellipse cx="16" cy="7" rx="3" ry="2" stroke={color} strokeWidth={0.8} fill="none" opacity={0.5} />
    <circle cx="16" cy="7" r="0.8" fill={color} fillOpacity={0.4} />
  </motion.svg>
);

// ─── ADBHUTA (Wonder) — Cosmic Eye / Starburst ───
export const AdbhutaIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0, scale: 0.5 } : false}
    animate={animate ? { opacity: 1, scale: 1 } : false}
    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
  >
    {/* Outer starburst */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const inner = i % 2 === 0 ? 6 : 8;
      const outer = i % 2 === 0 ? 13 : 11;
      return (
        <line
          key={i}
          x1={16 + inner * Math.cos(rad)}
          y1={16 + inner * Math.sin(rad)}
          x2={16 + outer * Math.cos(rad)}
          y2={16 + outer * Math.sin(rad)}
          stroke={color}
          strokeWidth={i % 2 === 0 ? 1 : 0.5}
          strokeLinecap="round"
          opacity={i % 2 === 0 ? 0.6 : 0.3}
        />
      );
    })}
    {/* Central eye */}
    <ellipse cx="16" cy="16" rx="5" ry="3.5" stroke={color} strokeWidth={1.2} fill={color} fillOpacity={0.05} />
    {/* Iris */}
    <circle cx="16" cy="16" r="2" stroke={color} strokeWidth={0.8} fill={color} fillOpacity={0.15} />
    {/* Pupil */}
    <circle cx="16" cy="16" r="0.8" fill={color} fillOpacity={0.5} />
    {/* Sparkle */}
    <circle cx="15" cy="15" r="0.5" fill={color} fillOpacity={0.6} />
  </motion.svg>
);

// ─── SHANTA (Peace) — Om / Infinite Stillness ───
export const ShantaIcon = ({ size = iconDefaults.size, color = 'currentColor', animate = false }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    initial={animate ? { opacity: 0 } : false}
    animate={animate ? { opacity: 1 } : false}
    transition={{ duration: 1.2 }}
  >
    {/* Concentric circles (ripples of stillness) */}
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth={0.4} opacity={0.15} />
    <circle cx="16" cy="16" r="10" stroke={color} strokeWidth={0.5} opacity={0.2} />
    <circle cx="16" cy="16" r="7" stroke={color} strokeWidth={0.7} opacity={0.3} />
    <circle cx="16" cy="16" r="4" stroke={color} strokeWidth={0.9} opacity={0.4} fill={color} fillOpacity={0.03} />
    {/* Bindu (the point of infinite stillness) */}
    <circle cx="16" cy="16" r="1.5" fill={color} fillOpacity={0.3} />
    {/* Crescent above (chandrabindu) */}
    <path
      d="M12 8C13 6.5 19 6.5 20 8"
      stroke={color}
      strokeWidth={0.8}
      strokeLinecap="round"
      fill="none"
      opacity={0.4}
    />
    <circle cx="16" cy="5.5" r="1" fill={color} fillOpacity={0.3} />
  </motion.svg>
);

// ─── ICON MAP for programmatic access ───
export const RasaIconMap = {
  shringara: ShringaraIcon,
  hasya: HasyaIcon,
  karuna: KarunaIcon,
  raudra: RaudraIcon,
  veera: VeeraIcon,
  bhayanaka: BhayanakaIcon,
  bibhatsa: BibhatsaIcon,
  adbhuta: AdbhutaIcon,
  shanta: ShantaIcon,
};

// Utility component that picks the right icon by rasa ID
export const RasaIcon = ({ rasaId, size, color, animate }) => {
  const IconComponent = RasaIconMap[rasaId];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} animate={animate} />;
};

export default RasaIcon;
