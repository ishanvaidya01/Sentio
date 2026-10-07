import { Play, Square, Zap, BatteryLow, AlertOctagon } from 'lucide-react';
import { startSimulator, stopSimulator, injectFault } from '../api';

const FAULT_BUTTONS = [
  {
    type: 'glitch_sensor',
    icon: Zap,
    label: 'Sensor Glitch',
    description: 'Wild temp spike for ~6s',
    color: '#c2410c',
    bg: 'rgba(194,65,12,0.07)',
    border: 'rgba(194,65,12,0.20)',
  },
  {
    type: 'drain_battery',
    icon: BatteryLow,
    label: 'Drain Battery',
    description: 'Sharp 25% drop',
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.07)',
    border: 'rgba(220,38,38,0.20)',
  },
  {
    type: 'obstacle',
    icon: AlertOctagon,
    label: 'Obstacle',
    description: 'Distance < 5 cm for 10s',
    color: '#b45309',
    bg: 'rgba(180,83,9,0.07)',
    border: 'rgba(180,83,9,0.20)',
  },
];

export default function SimulatorControls({ status, onUpdate }) {
  const { active, activeFault } = status || {};

  const handleStart = async () => { await startSimulator(); onUpdate(); };
  const handleStop  = async () => { await stopSimulator();  onUpdate(); };
  const handleFault = async (type) => { await injectFault(type); onUpdate(); };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(156,163,175,0.35)',
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>Simulator</h2>
        <div>
          {active ? (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '11px', fontWeight: 600,
              color: '#15803d',
              background: 'rgba(21,128,61,0.09)',
              border: '1px solid rgba(21,128,61,0.18)',
              padding: '3px 10px', borderRadius: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#15803d', display: 'inline-block',
                animation: 'pulse-ring 1.8s ease-out infinite',
              }} />
              Running
            </span>
          ) : (
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>Stopped</span>
          )}
        </div>
      </div>

      {/* Start / Stop */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button
          id="sim-start-btn"
          onClick={handleStart}
          disabled={active}
          style={{
            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7,
            background: active ? '#d1fae5' : '#15803d',
            color: active ? '#6b7280' : '#fff',
            border: 'none', borderRadius: 10,
            padding: '9px 0', fontSize: '13px', fontWeight: 600,
            cursor: active ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s, opacity 0.15s',
            opacity: active ? 0.55 : 1,
          }}
        >
          <Play size={13} /> Start
        </button>
        <button
          id="sim-stop-btn"
          onClick={handleStop}
          disabled={!active}
          style={{
            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7,
            background: !active ? '#f3f4f6' : '#f3f4f6',
            color: !active ? '#9ca3af' : '#374151',
            border: '1px solid rgba(107,114,128,0.25)',
            borderRadius: 10,
            padding: '9px 0', fontSize: '13px', fontWeight: 600,
            cursor: !active ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            opacity: !active ? 0.5 : 1,
          }}
        >
          <Square size={13} /> Stop
        </button>
      </div>

      {/* Fault Injection */}
      <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Inject Fault
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {FAULT_BUTTONS.map(({ type, icon: Icon, label, description, color, bg, border }) => (
          <button
            key={type}
            id={`fault-${type}-btn`}
            onClick={() => handleFault(type)}
            title={description}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 10, padding: '10px 6px',
              cursor: 'pointer', transition: 'background 0.15s, transform 0.1s',
              color: '#374151', fontSize: '11px', fontWeight: 500,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon size={16} style={{ color }} />
            <span style={{ textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Active fault indicator */}
      {activeFault && (
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: '12px', color: '#b45309',
          background: 'rgba(180,83,9,0.07)',
          border: '1px solid rgba(180,83,9,0.18)',
          borderRadius: 8, padding: '6px 10px',
        }}>
          <Zap size={12} />
          <span>Fault active: <strong>{activeFault.replace(/_/g, ' ')}</strong></span>
        </div>
      )}
    </div>
  );
}

