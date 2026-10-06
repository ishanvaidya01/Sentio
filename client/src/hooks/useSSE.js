import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useSSE(onEvent) {
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    let evtSource;
    let fallbackInterval;
    let isComponentMounted = true;

    function connectSSE() {
      evtSource = new EventSource(`${API_URL}/api/stream`);

      evtSource.onopen = () => {
        if (isComponentMounted) setStatus('connected');
      };

      evtSource.onerror = () => {
        if (isComponentMounted) {
          evtSource.close();
          setStatus('fallback');
          if (!fallbackInterval) {
             onEvent({ type: 'fallback_poll' });
             fallbackInterval = setInterval(() => {
               onEvent({ type: 'fallback_poll' });
             }, 2000);
          }
        }
      };

      evtSource.addEventListener('reading', (e) => onEvent({ type: 'reading', data: JSON.parse(e.data) }));
      evtSource.addEventListener('incident', (e) => onEvent({ type: 'incident', data: JSON.parse(e.data) }));
      evtSource.addEventListener('rules', (e) => onEvent({ type: 'rules', data: JSON.parse(e.data) }));
      evtSource.addEventListener('simulator', (e) => onEvent({ type: 'simulator', data: JSON.parse(e.data) }));
    }

    connectSSE();

    return () => {
      isComponentMounted = false;
      if (evtSource) evtSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [onEvent]);

  return status;
}
