// src/components/layout/PageWrapper.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../theme/animations';
import { colors } from '../../theme/tokens';

const PageWrapper = ({ children, style = {} }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.bgDeep,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
