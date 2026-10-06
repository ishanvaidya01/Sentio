import { Activity, Thermometer, Battery, Ruler } from 'lucide-react';

const icons = {
  temperature: Thermometer,
  distance: Ruler,
  battery: Battery,
};

export default function SensorCard({ sensor, value, unit, timestamp, hasAlert }) {
  const Icon = icons[sensor] || Activity;
  
  return (
    <div className={`p-6 rounded-xl border transition-colors duration-300 ${hasAlert ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-zinc-900 border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-zinc-400 capitalize">
          <Icon size={20} />
          <span className="font-medium">{sensor}</span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-semibold ${hasAlert ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {hasAlert ? 'ALERT' : 'OK'}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-zinc-100">{value !== undefined ? value : '--'}</span>
        <span className="text-zinc-500">{unit}</span>
      </div>
      
      <div className="mt-4 text-xs text-zinc-600">
        {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Waiting for data...'}
      </div>
    </div>
  );
}
