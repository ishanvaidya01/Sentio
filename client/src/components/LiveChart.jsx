import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';

/** Per-sensor stroke colors matching CSS custom properties */
const SENSOR_COLORS = {
  temperature: '#c2410c',  // orange-700
  distance:    '#0369a1',  // sky-700
  battery:     '#15803d',  // green-700
};

const SENSOR_LABELS = {
  temperature: 'Temperature (°C)',
  distance:    'Distance (cm)',
  battery:     'Battery (%)',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(156,163,175,0.4)',
      borderRadius: 10, padding: '7px 12px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.1)', fontSize: '12px',
    }}>
      <p style={{ color: '#9ca3af', marginBottom: 3 }}>
        {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="mono" style={{ fontWeight: 600, color: '#111827' }}>{v !== undefined ? v : '—'}</p>
    </div>
  );
}

/**
 * @param {{ data: object[], sensor: string, thresholds: {value: number, operator: string}[] }} props
 */
export default function LiveChart({ data, sensor, thresholds = [] }) {
  const color = SENSOR_COLORS[sensor] ?? '#94a3b8';
  const label = SENSOR_LABELS[sensor] ?? sensor;

  return (
    <div
      className={`sensor-${sensor} sensor-accent-border`}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid rgba(156,163,175,0.35)',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</h3>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(209,213,219,0.6)"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) =>
                new Date(t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
              }
              stroke="#e5e7eb"
              tick={{ fill: '#9ca3af', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#e5e7eb"
              tick={{ fill: '#9ca3af', fontSize: 9, fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Render one ReferenceLine per rule that applies to this sensor */}
            {thresholds.map((t, i) => (
              <ReferenceLine
                key={i}
                y={t.value}
                stroke="#ef4444"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{
                  value: `${t.operator} ${t.value}`,
                  position: 'insideTopRight',
                  fill: '#ef4444',
                  fontSize: 9,
                }}
              />
            ))}

            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
