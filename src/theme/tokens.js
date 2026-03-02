// src/theme/tokens.js

// ============================================
// NAVARASA MIRROR — DESIGN TOKEN SYSTEM
// The single source of truth for all visual
// decisions across the entire application.
// ============================================

// ===== RASA COLOR PALETTES =====
// Each Rasa has: primary, secondary, gradient array,
// glow color, text color, and transition-to-shanta gradient
export const rasaColors = {
  shringara: {
    id: 'shringara',
    primary: '#0A6E5C',
    secondary: '#1B4D3E',
    gradient: ['#0A6E5C', '#12593E', '#1B4D3E'],
    glow: 'rgba(10, 110, 92, 0.4)',
    glowStrong: 'rgba(10, 110, 92, 0.7)',
    textOnBg: '#E0FFF6',
    shantaTransition: ['#0A6E5C', '#4A9E8E', '#A0CEC0', '#E2E8F0', '#F0F4F8'],
  },
  hasya: {
    id: 'hasya',
    primary: '#FFD700',
    secondary: '#FFA500',
    gradient: ['#FFF8E7', '#FFE44D', '#FFD700'],
    glow: 'rgba(255, 215, 0, 0.4)',
    glowStrong: 'rgba(255, 215, 0, 0.7)',
    textOnBg: '#3D2E00',
    shantaTransition: ['#FFD700', '#FFE57A', '#FFF3C4', '#F0F4F8', '#FFFFFF'],
  },
  karuna: {
    id: 'karuna',
    primary: '#708090',
    secondary: '#4A5568',
    gradient: ['#8899AA', '#708090', '#4A5568'],
    glow: 'rgba(112, 128, 144, 0.4)',
    glowStrong: 'rgba(112, 128, 144, 0.7)',
    textOnBg: '#E8EDF2',
    shantaTransition: ['#708090', '#95A5B5', '#C0CDD8', '#E2E8F0', '#F0F4F8'],
  },
  raudra: {
    id: 'raudra',
    primary: '#8B0000',
    secondary: '#DC143C',
    gradient: ['#DC143C', '#B01030', '#8B0000'],
    glow: 'rgba(139, 0, 0, 0.5)',
    glowStrong: 'rgba(220, 20, 60, 0.7)',
    textOnBg: '#FFE0E0',
    shantaTransition: ['#8B0000', '#C04040', '#D09090', '#E8D0D0', '#F0F4F8'],
  },
  veera: {
    id: 'veera',
    primary: '#DAA520',
    secondary: '#B8860B',
    gradient: ['#F0C850', '#DAA520', '#B8860B'],
    glow: 'rgba(218, 165, 32, 0.4)',
    glowStrong: 'rgba(218, 165, 32, 0.7)',
    textOnBg: '#FFF8E0',
    shantaTransition: ['#DAA520', '#E0C060', '#EDE0A0', '#F0F0E0', '#F0F4F8'],
  },
  bhayanaka: {
    id: 'bhayanaka',
    primary: '#1A1A2E',
    secondary: '#16213E',
    gradient: ['#2A2A4E', '#1A1A2E', '#16213E'],
    glow: 'rgba(26, 26, 46, 0.6)',
    glowStrong: 'rgba(40, 40, 80, 0.7)',
    textOnBg: '#C0C0E0',
    shantaTransition: ['#1A1A2E', '#3A3A5E', '#7070A0', '#B0B0D0', '#F0F4F8'],
  },
  bibhatsa: {
    id: 'bibhatsa',
    primary: '#1B1464',
    secondary: '#0D0D3B',
    gradient: ['#2B2484', '#1B1464', '#0D0D3B'],
    glow: 'rgba(27, 20, 100, 0.5)',
    glowStrong: 'rgba(43, 36, 132, 0.7)',
    textOnBg: '#D0D0FF',
    shantaTransition: ['#1B1464', '#4040A0', '#8080C0', '#C0C0E0', '#F0F4F8'],
  },
  adbhuta: {
    id: 'adbhuta',
    primary: '#FFD700',
    secondary: '#FFA500',
    gradient: ['#FFD700', '#FFBF00', '#FFA500'],
    glow: 'rgba(255, 191, 0, 0.4)',
    glowStrong: 'rgba(255, 165, 0, 0.7)',
    textOnBg: '#3D2E00',
    shantaTransition: ['#FFA500', '#FFC860', '#FFE8A0', '#FFF5E0', '#F0F4F8'],
  },
  shanta: {
    id: 'shanta',
    primary: '#F0F4F8',
    secondary: '#FFFFFF',
    gradient: ['#E2E8F0', '#F0F4F8', '#FFFFFF'],
    glow: 'rgba(240, 244, 248, 0.3)',
    glowStrong: 'rgba(255, 255, 255, 0.5)',
    textOnBg: '#2D3748',
    shantaTransition: ['#F0F4F8', '#F5F7FA', '#FAFBFC', '#FFFFFF'],
  },
};

// ===== CORE APPLICATION COLORS =====
export const colors = {
  // Background layers
  bgDeep: '#0a0a0f',
  bgPrimary: '#0f0f18',
  bgSecondary: '#161625',
  bgElevated: '#1e1e30',
  bgOverlay: 'rgba(10, 10, 15, 0.85)',

  // Text hierarchy
  textPrimary: '#f0e6d3',
  textSecondary: '#c4b69c',
  textMuted: '#8a7e6b',
  textAccent: '#daa520',

  // Gold accent system (primary accent for the app)
  gold: '#daa520',
  goldLight: '#f0d060',
  goldDark: '#b8860b',
  goldMuted: 'rgba(218, 165, 32, 0.15)',
  goldGlow: 'rgba(218, 165, 32, 0.3)',

  // Sacred/spiritual accents
  saffron: '#FF9933',
  ivory: '#FFFFF0',
  lotus: '#F2B5D4',
  sandalwood: '#C2956B',

  // Functional
  error: '#E53E3E',
  success: '#38A169',
  warning: '#D69E2E',

  // Border & divider
  borderSubtle: 'rgba(218, 165, 32, 0.12)',
  borderMedium: 'rgba(218, 165, 32, 0.25)',
  borderStrong: 'rgba(218, 165, 32, 0.5)',

  // Gradients (as CSS strings)
  gradientGoldVertical: 'linear-gradient(180deg, #daa520 0%, #b8860b 100%)',
  gradientGoldRadial: 'radial-gradient(ellipse at center, rgba(218,165,32,0.15) 0%, transparent 70%)',
  gradientDarkVertical: 'linear-gradient(180deg, #0a0a0f 0%, #161625 50%, #0a0a0f 100%)',
  gradientHeroRadial: 'radial-gradient(ellipse at 50% 40%, rgba(218,165,32,0.08) 0%, transparent 60%)',
};

// ===== TYPOGRAPHY =====
export const typography = {
  fonts: {
    heading: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sanskrit: "'Noto Sans Devanagari', 'Tiro Devanagari', serif",
    accent: "'Playfair Display', Georgia, serif",
  },
  sizes: {
    // Display — for hero headlines
    displayLarge: 'clamp(3.2rem, 7vw, 5.5rem)',
    displayMedium: 'clamp(2.5rem, 5vw, 4.2rem)',
    displaySmall: 'clamp(2rem, 4vw, 3.2rem)',

    // Headings
    h1: 'clamp(2.2rem, 4.5vw, 3.4rem)',
    h2: 'clamp(1.8rem, 3.5vw, 2.8rem)',
    h3: 'clamp(1.5rem, 2.8vw, 2.1rem)',
    h4: 'clamp(1.25rem, 2.2vw, 1.6rem)',

    // Body
    bodyLarge: '1.3rem',
    body: '1.125rem',
    bodySmall: '1rem',

    // Caption / UI
    caption: '0.85rem',
    overline: '0.8rem',
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.6,
    relaxed: 1.8,
    loose: 2.0,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.05em',
    extraWide: '0.15em',
    ultra: '0.25em',
  },
};

// ===== SPACING SYSTEM (8px base) =====
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
};

// ===== ANIMATION TOKENS =====
export const animation = {
  // Durations
  duration: {
    instant: 0.1,
    fast: 0.25,
    normal: 0.5,
    slow: 0.8,
    slower: 1.2,
    slowest: 2.0,
    breathe: 4.0,
    journeyTransition: 1.5,
  },

  // Easing curves
  easing: {
    // Organic, natural-feeling curves
    gentle: [0.25, 0.1, 0.25, 1.0],
    smooth: [0.4, 0.0, 0.2, 1.0],
    breatheIn: [0.4, 0.0, 0.6, 1.0],
    breatheOut: [0.2, 0.0, 0.4, 1.0],

    // Dramatic for reveals
    dramatic: [0.16, 1.0, 0.3, 1.0],
    spring: { type: 'spring', stiffness: 100, damping: 15 },
    springGentle: { type: 'spring', stiffness: 60, damping: 20 },
    springBouncy: { type: 'spring', stiffness: 200, damping: 10 },
  },

  // Stagger for sequential reveals
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2,
    verySlow: 0.4,
  },
};

// ===== LAYOUT =====
export const layout = {
  maxWidth: '1200px',
  contentWidth: '800px',
  narrowWidth: '600px',

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.4)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 30px rgba(218, 165, 32, 0.15)',
    glowStrong: '0 0 60px rgba(218, 165, 32, 0.25)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  zIndex: {
    base: 0,
    content: 10,
    overlay: 100,
    modal: 200,
    tooltip: 300,
    toast: 400,
  },
};

// ===== BREAKPOINTS =====
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// ===== MEDIA QUERIES (for use in styled-components or JS) =====
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
};
