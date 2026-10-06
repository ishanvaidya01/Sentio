import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function IncidentLog({ incidents }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl h-full flex flex-col">
      <h2 className="text-lg font-semibold text-zinc-100 mb-4">Incident Log</h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {incidents.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No incidents recorded yet.</p>
        ) : (
          incidents.map(inc => (
            <div key={inc.id} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50 text-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-zinc-300 capitalize">{inc.sensor}</span>
                {inc.status === 'active' ? (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
                    <AlertTriangle size={12} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                    <CheckCircle2 size={12} /> Resolved
                  </span>
                )}
              </div>
              <p className="text-zinc-400">{inc.message}</p>
              <div className="mt-2 text-xs text-zinc-500 flex justify-between">
                <span>Triggered: {new Date(inc.triggeredAt).toLocaleTimeString()}</span>
                {inc.resolvedAt && <span>Resolved: {new Date(inc.resolvedAt).toLocaleTimeString()}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
