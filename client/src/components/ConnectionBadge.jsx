import { WifiOff, RefreshCw } from 'lucide-react';

export default function ConnectionBadge({ status }) {
  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-900/50">
        <span className="live-dot" aria-hidden="true" />
        Live
      </div>
    );
  }
  if (status === 'fallback') {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-yellow-400 bg-yellow-950/40 px-3 py-1.5 rounded-full border border-yellow-900/50">
        <RefreshCw size={12} className="animate-spin" />
        Polling
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-950/40 px-3 py-1.5 rounded-full border border-red-900/50">
      <WifiOff size={12} />
      Offline
    </div>
  );
}
