// src/theme/animations.js

// ============================================
// NAVARASA MIRROR — ANIMATION PRESETS
// Reusable Framer Motion variants for
// consistent, organic animation throughout.
// ============================================

// ===== PAGE TRANSITIONS =====
export const pageTransition = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1.0],
    },
  },
};

// ===== FADE IN VARIANTS =====
export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

// ===== STAGGERED CHILDREN =====
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerSlow = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.3,
    },
  },
};

export const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

// ===== TEXT REVEAL (Letter by Letter) =====
export const textRevealContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const textRevealLetter = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

// ===== BREATHING ANIMATION =====
export const breathePulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const breatheGlow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(218, 165, 32, 0.1)',
      '0 0 60px rgba(218, 165, 32, 0.3)',
      '0 0 20px rgba(218, 165, 32, 0.1)',
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ===== FLOAT / LEVITATE =====
export const float = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatSlow = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ===== ROTATE (for mandala) =====
export const rotateSlowCW = {
  animate: {
    rotate: 360,
    transition: {
      duration: 120,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const rotateSlowCCW = {
  animate: {
    rotate: -360,
    transition: {
      duration: 150,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ===== SCALE ENTRANCE (for buttons, cards) =====
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// ===== SHIMMER / GLINT =====
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ===== GOLDEN BORDER PULSE (for mirror frame) =====
export const goldenBorderPulse = {
  animate: {
    borderColor: [
      'rgba(218, 165, 32, 0.3)',
      'rgba(218, 165, 32, 0.7)',
      'rgba(218, 165, 32, 0.3)',
    ],
    boxShadow: [
      '0 0 15px rgba(218, 165, 32, 0.1), inset 0 0 15px rgba(218, 165, 32, 0.05)',
      '0 0 40px rgba(218, 165, 32, 0.3), inset 0 0 30px rgba(218, 165, 32, 0.1)',
      '0 0 15px rgba(218, 165, 32, 0.1), inset 0 0 15px rgba(218, 165, 32, 0.05)',
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ===== JOURNEY STAGE TRANSITIONS =====
export const journeyStageEnter = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1.0, ease: [0.4, 0.0, 0.2, 1.0] },
  },
};

// ===== LINE DRAWING (for decorative SVG strokes) =====
export const drawLine = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};
