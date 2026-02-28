import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { colors, typography, spacing, layout } from '../../theme/tokens';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[NavaraMirror] Error caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.bgDeep,
            padding: spacing['2xl'],
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.lg,
              maxWidth: 400,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(220, 20, 60, 0.08)',
                border: '1px solid rgba(220, 20, 60, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={28} color="rgba(220, 20, 60, 0.6)" strokeWidth={1.5} />
            </div>

            <h2
              style={{
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.h3,
                color: colors.textPrimary,
                fontWeight: typography.weights.regular,
              }}
            >
              Something went awry
            </h2>

            <p
              style={{
                fontFamily: typography.fonts.body,
                fontSize: typography.sizes.body,
                color: colors.textMuted,
                lineHeight: typography.lineHeights.relaxed,
              }}
            >
              Even the most ancient mirrors sometimes cloud.
              Let us try once more.
            </p>

            <motion.button
              onClick={this.handleReset}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.xl}`,
                borderRadius: layout.borderRadius.full,
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                border: 'none',
                color: colors.bgDeep,
                fontFamily: typography.fonts.heading,
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.medium,
                letterSpacing: typography.letterSpacing.wide,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} />
              Begin Anew
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
