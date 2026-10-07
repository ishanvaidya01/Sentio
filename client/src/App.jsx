import { useEffect, useState, useCallback } from 'react';
import { fetchReadings, fetchRules, fetchIncidents, fetchSimulatorStatus } from './api';
import SensorCard from './components/SensorCard';
import LiveChart from './components/LiveChart';
import RulesPanel from './components/RulesPanel';
import IncidentLog from './components/IncidentLog';
import SimulatorControls from './components/SimulatorControls';
import ConnectionBadge from './components/ConnectionBadge';
import { useSSE } from './hooks/useSSE';

const SENSORS = ['temperature', 'distance', 'battery'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const playBeep = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play 5 sweeping bursts (Submarine / Red Alert Klaxon style)
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Sawtooth wave is extremely buzzy and grating (the "alarm" sound)
      osc.type = 'sawtooth'; 
      const startTime = ctx.currentTime + (i * 0.4); 
      
      // Klaxon sweep: Start very high (1200Hz) and dive bomb down to 400Hz
      osc.frequency.setValueAtTime(1200, startTime);
      osc.frequency.exponentialRampToValueAtTime(400, startTime + 0.3);
      
      // Loud, aggressive volume envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02); // VERY loud punch
      gain.gain.linearRampToValueAtTime(0, startTime + 0.35);   // Quick fade
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    }
  } catch (e) {
    console.warn('Audio beep blocked or failed', e);
  }
};

function App() {
  const [readings,   setReadings]   = useState({ temperature: [], distance: [], battery: [] });
  const [rules,      setRules]      = useState([]);
  const [incidents,  setIncidents]  = useState([]);
  const [simStatus,  setSimStatus]  = useState({});
  const [loading,    setLoading]    = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [temp, dist, batt, rls, incs, sim] = await Promise.all([
        fetchReadings('temperature', 50),
        fetchReadings('distance',    50),
        fetchReadings('battery',     50),
        fetchRules(),
        fetchIncidents(),
        fetchSimulatorStatus(),
      ]);
      setReadings({ temperature: temp, distance: dist, battery: batt });
      setRules(rls);
      setIncidents(incs);
      setSimStatus(sim);
    } catch (err) {
      console.error('Poll error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSSE = useCallback((event) => {
    if (event.type === 'fallback_poll') { loadData(); return; }

    if (event.type === 'reading') {
      setReadings(prev => {
        const list = [...prev[event.data.sensor], event.data];
        if (list.length > 50) list.shift();
        return { ...prev, [event.data.sensor]: list };
      });
    }
    if (event.type === 'incident') {
      // Play a beep if this is a newly triggered active incident
      if (event.data.status === 'active') {
        playBeep();
      }
      // Re-fetch to get the authoritative list with correct status
      fetchIncidents().then(setIncidents);
    }
    if (event.type === 'rules') {
      setRules(event.data);
    }
    if (event.type === 'simulator') {
      setSimStatus(event.data);
    }
  }, [loadData]);

  const sseStatus = useSSE(handleSSE);

  /** Latest reading value for a sensor */
  const getLatest = (sensor) => {
    const list = readings[sensor];
    return list[list.length - 1] || {};
  };

  /** Is there an active incident for this sensor? */
  const hasActiveIncident = (sensor) =>
    incidents.some(i => i.sensor === sensor && i.status === 'active');

  /**
   * All threshold lines for a sensor (supports multiple rules per sensor).
   * Returns array of { value, operator }.
   */
  const getThresholds = (sensor) =>
    rules
      .filter(r => r.sensor === sensor && r.enabled)
      .map(r => ({ value: r.threshold, operator: r.operator }));

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#15803d',
                animation: `pulse-ring 1.4s ease-out infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Connecting to Sentio…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: 32, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#111827' }}>
            Sentio
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#9ca3af' }}>Live Robot Telemetry</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={`${API_URL}/api/readings/export.csv`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px', fontWeight: 500,
              background: '#f3f4f6',
              border: '1px solid rgba(156,163,175,0.4)',
              color: '#374151',
              padding: '6px 14px', borderRadius: 8,
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
          >
            ↓ Export CSV
          </a>
          <ConnectionBadge status={sseStatus} />
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ── Sensor Cards ── */}
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Live Sensors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SENSORS.map(sensor => {
              const latest = getLatest(sensor);
              return (
                <SensorCard
                  key={sensor}
                  sensor={sensor}
                  value={latest.value}
                  unit={latest.unit}
                  timestamp={latest.timestamp}
                  hasAlert={hasActiveIncident(sensor)}
                  history={readings[sensor]}
                />
              );
            })}
          </div>
        </section>

        {/* ── Charts ── */}
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Telemetry History (last 50 readings)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SENSORS.map(sensor => (
              <LiveChart
                key={sensor}
                sensor={sensor}
                data={readings[sensor]}
                thresholds={getThresholds(sensor)}
              />
            ))}
          </div>
        </section>

        {/* ── Controls + Incident Log ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <SimulatorControls status={simStatus} onUpdate={loadData} />
            <RulesPanel rules={rules} onRulesUpdated={setRules} />
          </div>
          <div className="lg:col-span-2" style={{ minHeight: '420px' }}>
            <IncidentLog incidents={incidents} />
          </div>
        </section>
        {/* Footer */}
        <footer style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: '1px solid rgba(156,163,175,0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: 12,
          color: '#9ca3af',
        }}>
          <span>Sentio &mdash; Robot Telemetry Dashboard</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'transparent'; }}
            >Privacy Policy</a>
            <a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'transparent'; }}
            >Terms of Use</a>
            <a href="https://github.com/ishanvaidya01/Sentio" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'transparent'; }}
            >GitHub</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
