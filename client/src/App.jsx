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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500"
              style={{ animation: `pulse-ring 1.4s ease-out infinite ${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-zinc-500 text-sm">Connecting to SensorScope…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SensorScope
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">Live Robot Telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`${API_URL}/api/readings/export.csv`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 px-3 py-1.5 rounded-xl transition-colors font-medium"
          >
            ↓ Export CSV
          </a>
          <ConnectionBadge status={sseStatus} />
        </div>
      </header>

      <main className="space-y-6">
        {/* ── Sensor Cards ── */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Live Sensors</h2>
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
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Telemetry History (last 50 readings)</h2>
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
      </main>
    </div>
  );
}

export default App;
