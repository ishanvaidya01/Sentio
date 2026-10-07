import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Filter } from 'lucide-react';

const UNIT_DISPLAY = { degC: '°C', cm: 'cm', '%': '%' };

const SENSOR_COLORS = {
  temperature: 'text-orange-400',
  distance:    'text-cyan-400',
  battery:     'text-green-400',
};

/** Format a human-readable incident message */
function formatMessage(inc) {
  const sensorLabel =
    inc.sensor === 'temperature' ? 'Temperature' :
    inc.sensor === 'distance'    ? 'Distance'    :
    inc.sensor === 'battery'     ? 'Battery'     :
    inc.sensor;

  const opLabel =
    inc.operator === '<'  ? 'dropped below' :
    inc.operator === '<=' ? 'is at or below' :
    inc.operator === '>'  ? 'exceeded'       :
    inc.operator === '>=' ? 'reached or exceeded' :
    inc.operator;

  const unit =
    inc.sensor === 'temperature' ? '°C' :
    inc.sensor === 'distance'    ? ' cm' :
    inc.sensor === 'battery'     ? '%'   : '';

  return `${sensorLabel} ${opLabel} ${inc.threshold}${unit} (reading: ${inc.value}${unit})`;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString([], {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function IncidentLog({ incidents }) {
  const [showActive, setShowActive] = useState(false);

  const displayed = showActive
    ? incidents.filter(i => i.status === 'active')
    : incidents;

  const activeCount = incidents.filter(i => i.status === 'active').length;

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/60 p-4 rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-zinc-100">Incident Log</h2>
          {activeCount > 0 && (
            <span className="text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowActive(v => !v)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
            showActive
              ? 'bg-red-950/40 border-red-900/50 text-red-400'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
          }`}
        >
          <Filter size={12} />
          {showActive ? 'Active only' : 'All'}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <CheckCircle2 size={32} className="text-zinc-700 mb-2" />
            <p className="text-sm text-zinc-500">
              {showActive ? 'No active incidents.' : 'No incidents recorded yet.'}
            </p>
          </div>
        ) : (
          displayed.map(inc => (
            <div
              key={inc.id}
              className={`incident-entry p-3 rounded-xl border text-sm transition-colors ${
                inc.status === 'active'
                  ? 'bg-red-950/20 border-red-900/40'
                  : 'bg-zinc-950/60 border-zinc-800/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-semibold capitalize ${SENSOR_COLORS[inc.sensor] ?? 'text-zinc-300'}`}>
                  {inc.sensor}
                </span>
                {inc.status === 'active' ? (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-950/50 px-2 py-0.5 rounded-full border border-red-900/50">
                    <AlertTriangle size={10} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/40">
                    <CheckCircle2 size={10} /> Resolved
                  </span>
                )}
              </div>

              <p className="text-zinc-300 text-xs leading-relaxed mb-2">{formatMessage(inc)}</p>

              <div className="text-xs text-zinc-600 flex justify-between">
                <span>🔴 {formatDateTime(inc.triggeredAt)}</span>
                {inc.resolvedAt && <span>✅ {formatDateTime(inc.resolvedAt)}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
