import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { colors, typography, spacing, layout } from '../../theme/tokens';

const MobileOptimizer = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const mobile = window.innerWidth < 768;
      const landscape = window.innerWidth > window.innerHeight && mobile;
      setIsMobile(mobile);
      setIsLandscape(landscape);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <>
      {children}

      <AnimatePresence>
        {isLandscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: colors.bgDeep,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.lg,
              padding: spacing.xl,
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ rotate: [0, -90, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <RotateCcw size={40} color={colors.gold} strokeWidth={1} />
            </motion.div>
            <p
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.h3,
                color: colors.textPrimary,
              }}
            >
              Please rotate your device
            </p>
            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.body,
                color: colors.textMuted,
              }}
            >
              This experience is designed for portrait orientation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileOptimizer;
