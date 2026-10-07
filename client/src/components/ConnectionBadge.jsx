import { WifiOff, RefreshCw } from 'lucide-react';

export default function ConnectionBadge({ status }) {
  if (status === 'connected') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: '12px', fontWeight: 600,
        color: '#15803d',
        background: 'rgba(21,128,61,0.08)',
        border: '1px solid rgba(21,128,61,0.18)',
        padding: '4px 12px', borderRadius: 20,
      }}>
        <span className="live-dot" aria-hidden="true" />
        Live
      </div>
    );
  }
  if (status === 'fallback') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: '12px', fontWeight: 600,
        color: '#b45309',
        background: 'rgba(180,83,9,0.08)',
        border: '1px solid rgba(180,83,9,0.18)',
        padding: '4px 12px', borderRadius: 20,
      }}>
        <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} />
        Polling
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: '12px', fontWeight: 600,
      color: '#dc2626',
      background: 'rgba(220,38,38,0.07)',
      border: '1px solid rgba(220,38,38,0.18)',
      padding: '4px 12px', borderRadius: 20,
    }}>
      <WifiOff size={11} />
      Offline
    </div>
  );
}

