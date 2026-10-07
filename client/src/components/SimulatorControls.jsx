import { Play, Square, Zap, BatteryLow, AlertOctagon } from 'lucide-react';
import { startSimulator, stopSimulator, injectFault } from '../api';

const FAULT_BUTTONS = [
  {
    type: 'glitch_sensor',
    icon: Zap,
    label: 'Sensor Glitch',
    description: 'Wild temp spike for ~6s',
    hoverClass: 'hover:border-orange-500/50 hover:bg-orange-950/20',
    iconClass: 'text-orange-400',
  },
  {
    type: 'drain_battery',
    icon: BatteryLow,
    label: 'Drain Battery',
    description: 'Sharp 25% drop',
    hoverClass: 'hover:border-red-500/50 hover:bg-red-950/20',
    iconClass: 'text-red-400',
  },
  {
    type: 'obstacle',
    icon: AlertOctagon,
    label: 'Obstacle',
    description: 'Distance < 5 cm for 10s',
    hoverClass: 'hover:border-yellow-500/50 hover:bg-yellow-950/20',
    iconClass: 'text-yellow-400',
  },
];

export default function SimulatorControls({ status, onUpdate }) {
  const { active, activeFault } = status || {};

  const handleStart = async () => { await startSimulator(); onUpdate(); };
  const handleStop  = async () => { await stopSimulator();  onUpdate(); };
  const handleFault = async (type) => { await injectFault(type); onUpdate(); };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/60 p-4 rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-zinc-100">Simulator</h2>
        <div className="flex items-center gap-2 text-xs">
          {active ? (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded-full font-medium">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ animation: 'pulse-ring 1.6s ease-out infinite' }}
              />
              Running
            </span>
          ) : (
            <span className="text-zinc-500 font-medium">Stopped</span>
          )}
        </div>
      </div>

      {/* Start / Stop */}
      <div className="flex gap-2 mb-5">
        <button
          id="sim-start-btn"
          onClick={handleStart}
          disabled={active}
          className="flex-1 flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Play size={14} /> Start
        </button>
        <button
          id="sim-stop-btn"
          onClick={handleStop}
          disabled={!active}
          className="flex-1 flex justify-center items-center gap-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Square size={14} /> Stop
        </button>
      </div>

      {/* Fault Injection */}
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Inject Fault</p>
      <div className="grid grid-cols-3 gap-2">
        {FAULT_BUTTONS.map(({ type, icon: Icon, label, description, hoverClass, iconClass }) => (
          <button
            key={type}
            id={`fault-${type}-btn`}
            onClick={() => handleFault(type)}
            title={description}
            className={`flex flex-col items-center gap-1.5 bg-zinc-950/60 border border-zinc-800 ${hoverClass} text-zinc-300 p-2.5 rounded-xl text-xs transition-all duration-200`}
          >
            <Icon size={18} className={iconClass} />
            <span className="text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Active fault indicator */}
      {activeFault && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-orange-300 bg-orange-950/30 border border-orange-900/40 rounded-lg px-2 py-1.5">
          <Zap size={12} />
          <span>Fault active: <strong>{activeFault.replace(/_/g, ' ')}</strong></span>
        </div>
      )}
    </div>
  );
}
