// src/components/mirror/CameraPreview.jsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { colors, typography, spacing } from '../../theme/tokens';

const CameraPreview = ({
  isActive,
  onStreamReady,
  onStreamError,
  size = 320,
  mirrorHorizontal = true,
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | requesting | active | denied | error

  const startCamera = useCallback(async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('active');
        if (onStreamReady) onStreamReady(videoRef.current);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('denied');
      } else {
        setStatus('error');
      }
      if (onStreamError) onStreamError(err);
    }
  }, [onStreamReady, onStreamError]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, startCamera, stopCamera]);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Video element — hidden until active */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: mirrorHorizontal ? 'scaleX(-1)' : 'none',
          display: status === 'active' ? 'block' : 'none',
          borderRadius: '50%',
        }}
      />

      {/* Loading / Permission states */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <PlaceholderState key="idle" icon={<Camera size={32} />} text="Preparing mirror..." />
        )}
        {status === 'requesting' && (
          <PlaceholderState key="requesting" icon={<CameraSpinner />} text="Requesting access to your mirror..." />
        )}
        {status === 'denied' && (
          <PlaceholderState
            key="denied"
            icon={<CameraOff size={32} />}
            text="Camera access was not granted"
            subtext="You can still choose your Rasa manually"
            isError
          />
        )}
        {status === 'error' && (
          <PlaceholderState
            key="error"
            icon={<AlertCircle size={32} />}
            text="Could not access camera"
            subtext="Please check your device settings"
            isError
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Placeholder overlay ───
const PlaceholderState = ({ icon, text, subtext, isError = false }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      background: `radial-gradient(circle, ${colors.bgElevated} 0%, ${colors.bgPrimary} 100%)`,
      borderRadius: '50%',
      padding: spacing.xl,
    }}
  >
    <div style={{ color: isError ? colors.error : colors.gold, opacity: 0.6 }}>
      {icon}
    </div>
    <p
      style={{
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.bodySmall,
        color: isError ? colors.error : colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.lineHeights.normal,
        maxWidth: '200px',
      }}
    >
      {text}
    </p>
    {subtext && (
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.caption,
          color: colors.textMuted,
          textAlign: 'center',
          maxWidth: '180px',
        }}
      >
        {subtext}
      </p>
    )}
  </motion.div>
);

// ─── Spinning camera icon ───
const CameraSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    style={{ display: 'flex' }}
  >
    <Camera size={32} />
  </motion.div>
);

export default CameraPreview;
