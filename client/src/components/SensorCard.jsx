import { Activity, Thermometer, Battery, Ruler, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const icons = {
  temperature: Thermometer,
  distance: Ruler,
  battery: Battery,
};

/** Map internal unit codes to display symbols */
const unitDisplay = {
  degC: '°C',
  cm: 'cm',
  '%': '%',
};

/** Human-readable sensor labels */
const labels = {
  temperature: 'Temperature',
  distance: 'Distance',
  battery: 'Battery',
};

/** Determine trend from last two readings */
function getTrend(history) {
  if (!history || history.length < 2) return 'flat';
  const last = history[history.length - 1]?.value;
  const prev = history[history.length - 2]?.value;
  if (last == null || prev == null) return 'flat';
  const diff = last - prev;
  if (Math.abs(diff) < 0.1) return 'flat';
  return diff > 0 ? 'up' : 'down';
}

export default function SensorCard({ sensor, value, unit, timestamp, hasAlert, history }) {
  const Icon = icons[sensor] || Activity;
  const trend = getTrend(history);
  const displayUnit = unitDisplay[unit] || unit || '';

  const TrendIcon =
    trend === 'up'   ? TrendingUp   :
    trend === 'down' ? TrendingDown :
    Minus;

  const trendColor =
    trend === 'up'   ? 'text-orange-400' :
    trend === 'down' ? 'text-blue-400'   :
    'text-zinc-500';

  return (
    <div
      className={[
        'relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden',
        `sensor-${sensor} sensor-accent-border`,
        hasAlert
          ? 'bg-red-950/30 border-red-500/40 card-alert'
          : 'bg-zinc-900/80 border-zinc-800/60 hover:border-zinc-700/60',
      ].join(' ')}
    >
      {/* Background glow on alert */}
      {hasAlert && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-red-950/20 to-transparent" />
      )}

      {/* Header row */}
      <div className="flex justify-between items-start mb-3 relative">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `color-mix(in srgb, var(--sensor-color) 15%, transparent)` }}
          >
            <Icon size={16} style={{ color: 'var(--sensor-color)' }} />
          </div>
          <span className="text-sm font-medium text-zinc-400">{labels[sensor] || sensor}</span>
        </div>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            hasAlert
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${hasAlert ? 'bg-red-400' : 'bg-emerald-400'}`}
            style={hasAlert ? {} : { animation: 'pulse-ring 1.6s ease-out infinite' }}
          />
          {hasAlert ? 'ALERT' : 'OK'}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1 relative">
        <span className="mono text-4xl font-bold tracking-tight text-zinc-50">
          {value !== undefined ? value : '—'}
        </span>
        <span className="text-zinc-500 text-sm">{displayUnit}</span>
        <TrendIcon size={14} className={`ml-auto ${trendColor}`} />
      </div>

      {/* Timestamp */}
      <div className="text-xs text-zinc-600 relative">
        {timestamp
          ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : 'Awaiting data…'}
      </div>
    </div>
  );
}
