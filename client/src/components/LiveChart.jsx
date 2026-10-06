import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function LiveChart({ data, sensor, thresholdLine }) {
  return (
    <div className="h-48 w-full bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-4 capitalize">{sensor} History</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} 
              stroke="#52525b" 
              fontSize={10} 
            />
            <YAxis stroke="#52525b" fontSize={10} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              labelFormatter={(l) => new Date(l).toLocaleTimeString()}
            />
            {thresholdLine && (
              <ReferenceLine y={thresholdLine} stroke="#ef4444" strokeDasharray="3 3" />
            )}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
