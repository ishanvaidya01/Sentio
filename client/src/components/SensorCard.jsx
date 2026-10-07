import { Activity, Thermometer, Battery, Ruler, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const icons = {
  temperature: Thermometer,
  distance: Ruler,
  battery: Battery,
};

const unitDisplay = {
  degC: '°C',
  cm: 'cm',
  '%': '%',
};

const labels = {
  temperature: 'Temperature',
  distance: 'Distance',
  battery: 'Battery',
};

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
    trend === 'up'   ? '#ea580c' :
    trend === 'down' ? '#0369a1' :
    '#9ca3af';

  const alertStyle = hasAlert ? {
    background: '#fff5f5',
    border: '1px solid rgba(220,38,38,0.25)',
    borderTop: '3px solid #dc2626',
  } : {};

  return (
    <div
      className={[
        'relative p-5 rounded-2xl transition-all duration-300 overflow-hidden',
        `sensor-${sensor}`,
        hasAlert ? 'card-alert' : 'sensor-accent-border',
      ].join(' ')}
      style={{
        background: hasAlert ? '#fff5f5' : '#ffffff',
        border: hasAlert
          ? '1px solid rgba(220,38,38,0.22)'
          : '1px solid rgba(156,163,175,0.35)',
        borderTop: hasAlert ? '3px solid #dc2626' : undefined,
        boxShadow: hasAlert
          ? '0 0 0 3px rgba(220,38,38,0.08)'
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `color-mix(in srgb, var(--sensor-color) 12%, transparent)` }}
          >
            <Icon size={15} style={{ color: 'var(--sensor-color)' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: '#6b7280' }}>
            {labels[sensor] || sensor}
          </span>
        </div>

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 9px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            background: hasAlert ? 'rgba(220,38,38,0.08)' : 'rgba(21,128,61,0.09)',
            color: hasAlert ? '#dc2626' : '#15803d',
            border: hasAlert ? '1px solid rgba(220,38,38,0.20)' : '1px solid rgba(21,128,61,0.18)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: hasAlert ? '#dc2626' : '#15803d',
              display: 'inline-block',
              animation: hasAlert ? 'none' : 'pulse-ring 1.8s ease-out infinite',
            }}
          />
          {hasAlert ? 'ALERT' : 'OK'}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="mono" style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#111827', lineHeight: 1 }}>
          {value !== undefined ? value : '—'}
        </span>
        <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{displayUnit}</span>
        <TrendIcon size={13} style={{ color: trendColor, marginLeft: 'auto' }} />
      </div>

      {/* Timestamp */}
      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: 6 }}>
        {timestamp
          ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : 'Awaiting data…'}
      </div>
    </div>
  );
}

