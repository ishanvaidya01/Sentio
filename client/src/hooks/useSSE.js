import { useEffect, useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Connects to the SSE stream with automatic exponential-backoff reconnect.
 * Falls back to polling if SSE errors, then retries SSE after 30s.
 *
 * @param {(event: {type: string, data?: any}) => void} onEvent
 * @returns {'connected' | 'fallback' | 'connecting'} connection status
 */
export function useSSE(onEvent) {
  const [status, setStatus] = useState('connecting');
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;   // stable ref so effect doesn't re-run on every render

  useEffect(() => {
    let evtSource = null;
    let fallbackInterval = null;
    let reconnectTimeout = null;
    let retryDelay = 2000;         // start at 2s, max 30s
    let mounted = true;

    function stopFallback() {
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
        fallbackInterval = null;
      }
    }

    function startFallback() {
      if (fallbackInterval) return;   // already polling
      if (mounted) setStatus('fallback');
      onEventRef.current({ type: 'fallback_poll' });
      fallbackInterval = setInterval(() => {
        onEventRef.current({ type: 'fallback_poll' });
      }, 2000);
    }

    function connectSSE() {
      if (!mounted) return;
      evtSource = new EventSource(`${API_URL}/api/stream`);

      evtSource.onopen = () => {
        if (!mounted) return;
        stopFallback();
        setStatus('connected');
        retryDelay = 2000;    // reset backoff on success
      };

      evtSource.onerror = () => {
        if (!mounted) return;
        evtSource.close();
        evtSource = null;
        startFallback();

        // Schedule SSE reconnect with exponential backoff (cap 30s)
        reconnectTimeout = setTimeout(() => {
          stopFallback();
          if (mounted) setStatus('connecting');
          connectSSE();
        }, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30_000);
      };

      evtSource.addEventListener('reading',   (e) => onEventRef.current({ type: 'reading',   data: JSON.parse(e.data) }));
      evtSource.addEventListener('incident',  (e) => onEventRef.current({ type: 'incident',  data: JSON.parse(e.data) }));
      evtSource.addEventListener('rules',     (e) => onEventRef.current({ type: 'rules',     data: JSON.parse(e.data) }));
      evtSource.addEventListener('simulator', (e) => onEventRef.current({ type: 'simulator', data: JSON.parse(e.data) }));
    }

    connectSSE();

    return () => {
      mounted = false;
      evtSource?.close();
      stopFallback();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);   // empty deps — onEvent is accessed via stable ref

  return status;
}
