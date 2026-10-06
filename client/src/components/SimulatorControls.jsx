import { Play, Square, Zap, BatteryLow, AlertOctagon } from 'lucide-react';
import { startSimulator, stopSimulator, injectFault } from '../api';

export default function SimulatorControls({ status, onUpdate }) {
  const { active, activeFault } = status || {};

  const handleStart = async () => { await startSimulator(); onUpdate(); };
  const handleStop = async () => { await stopSimulator(); onUpdate(); };
  const handleFault = async (type) => { await injectFault(type); onUpdate(); };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">Simulator</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">Status:</span>
          {active ? <span className="text-emerald-400 font-medium">Running</span> : <span className="text-zinc-500 font-medium">Stopped</span>}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={handleStart} disabled={active} className="flex-1 flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm transition-colors">
          <Play size={16} /> Start
        </button>
        <button onClick={handleStop} disabled={!active} className="flex-1 flex justify-center items-center gap-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm transition-colors">
          <Square size={16} /> Stop
        </button>
      </div>

      <h3 className="text-sm font-medium text-zinc-400 mb-3">Inject Fault</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button onClick={() => handleFault('glitch_sensor')} className="flex flex-col items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 hover:bg-orange-950/20 text-zinc-300 p-3 rounded-lg text-xs transition-colors">
          <Zap size={20} className="text-orange-400" />
          Sensor Glitch
        </button>
        <button onClick={() => handleFault('drain_battery')} className="flex flex-col items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/20 text-zinc-300 p-3 rounded-lg text-xs transition-colors">
          <BatteryLow size={20} className="text-red-400" />
          Drain Battery
        </button>
        <button onClick={() => handleFault('obstacle')} className="flex flex-col items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-yellow-500/50 hover:bg-yellow-950/20 text-zinc-300 p-3 rounded-lg text-xs transition-colors">
          <AlertOctagon size={20} className="text-yellow-400" />
          Obstacle
        </button>
      </div>
      {activeFault && (
        <p className="mt-3 text-xs text-orange-400 text-center">Active fault: {activeFault}</p>
      )}
    </div>
  );
}
