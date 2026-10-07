import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';

/** Per-sensor stroke colors matching CSS custom properties */
const SENSOR_COLORS = {
  temperature: '#f97316',  // orange
  distance:    '#06b6d4',  // cyan
  battery:     '#22c55e',  // green
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
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-zinc-400 mb-1">
        {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="mono font-semibold text-zinc-100">{v !== undefined ? v : '—'}</p>
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
    <div className={`bg-zinc-900/80 rounded-2xl border border-zinc-800/60 p-4 sensor-${sensor} sensor-accent-border`}>
      <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">{label}</h3>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(63,63,70,0.4)"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) =>
                new Date(t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
              }
              stroke="#3f3f46"
              tick={{ fill: '#52525b', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#3f3f46"
              tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'var(--font-mono)' }}
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
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 4, fill: color, stroke: '#18181b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
