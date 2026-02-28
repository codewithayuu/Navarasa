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
  const mountedRef = useRef(true);
  const startedRef = useRef(false);
  const readyFiredRef = useRef(false);
  const [status, setStatus] = useState('idle');

  // Cleanup helper
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) { /* ignore */ }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
    startedRef.current = false;
    readyFiredRef.current = false;
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    // Guard against double start
    if (startedRef.current) return;
    startedRef.current = true;

    if (!mountedRef.current) return;
    setStatus('requesting');

    try {
      // Stop any existing stream first
      stopStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      // Check if component unmounted during await
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      // Set srcObject
      video.srcObject = stream;

      // Wait for metadata to load before playing
      await new Promise((resolve, reject) => {
        const onLoaded = () => {
          video.removeEventListener('loadedmetadata', onLoaded);
          video.removeEventListener('error', onError);
          resolve();
        };
        const onError = (e) => {
          video.removeEventListener('loadedmetadata', onLoaded);
          video.removeEventListener('error', onError);
          reject(e);
        };

        // If metadata already loaded
        if (video.readyState >= 1) {
          resolve();
          return;
        }

        video.addEventListener('loadedmetadata', onLoaded);
        video.addEventListener('error', onError);
      });

      // Check mount again after await
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      // Now play — this should not be interrupted
      await video.play();

      // Check mount again
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      setStatus('active');

      // Fire onStreamReady exactly once
      if (!readyFiredRef.current && onStreamReady) {
        readyFiredRef.current = true;
        // Small delay to ensure video frames are actually rendering
        setTimeout(() => {
          if (mountedRef.current && videoRef.current) {
            onStreamReady(videoRef.current);
          }
        }, 300);
      }
    } catch (err) {
      if (!mountedRef.current) return;

      console.error('[CameraPreview] Camera error:', err.name, err.message);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('denied');
      } else if (err.name === 'AbortError') {
        // Retry once on AbortError — usually caused by race condition
        console.log('[CameraPreview] AbortError — retrying once...');
        startedRef.current = false;
        readyFiredRef.current = false;
        setTimeout(() => {
          if (mountedRef.current && isActive) {
            startCamera();
          }
        }, 500);
        return;
      } else {
        setStatus('error');
      }

      if (onStreamError) onStreamError(err);
    }
  }, [isActive, onStreamReady, onStreamError, stopStream]);

  // Effect: start/stop based on isActive
  useEffect(() => {
    mountedRef.current = true;

    if (isActive) {
      // Delay start slightly to avoid React render conflicts
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          startCamera();
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        mountedRef.current = false;
        stopStream();
        setStatus('idle');
      };
    } else {
      stopStream();
      setStatus('idle');
      return () => {
        mountedRef.current = false;
      };
    }
  }, [isActive, startCamera, stopStream]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => {
          try { t.stop(); } catch (e) { /* ignore */ }
        });
        streamRef.current = null;
      }
    };
  }, []);

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
      {/* Video element */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: mirrorHorizontal ? 'scaleX(-1)' : 'none',
          display: status === 'active' ? 'block' : 'none',
          borderRadius: '50%',
        }}
      />

      {/* Status overlays */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <PlaceholderState
            key="idle"
            icon={<Camera size={32} />}
            text="Preparing mirror..."
          />
        )}
        {status === 'requesting' && (
          <PlaceholderState
            key="requesting"
            icon={<CameraSpinner />}
            text="Requesting access to your mirror..."
          />
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
