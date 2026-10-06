import { useEffect, useState } from 'react';
import { fetchReadings, fetchRules, fetchIncidents, fetchSimulatorStatus } from './api';
import SensorCard from './components/SensorCard';
import LiveChart from './components/LiveChart';
import RulesPanel from './components/RulesPanel';
import IncidentLog from './components/IncidentLog';
import SimulatorControls from './components/SimulatorControls';

const SENSORS = ['temperature', 'distance', 'battery'];

function App() {
  const [readings, setReadings] = useState({ temperature: [], distance: [], battery: [] });
  const [rules, setRules] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [simStatus, setSimStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [temp, dist, batt, rls, incs, sim] = await Promise.all([
        fetchReadings('temperature', 50),
        fetchReadings('distance', 50),
        fetchReadings('battery', 50),
        fetchRules(),
        fetchIncidents(),
        fetchSimulatorStatus()
      ]);
      setReadings({ temperature: temp, distance: dist, battery: batt });
      setRules(rls);
      setIncidents(incs);
      setSimStatus(sim);
    } catch (err) {
      console.error("Poll error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getLatest = (sensor) => {
    const list = readings[sensor];
    return list[list.length - 1] || {};
  };

  const hasActiveIncident = (sensor) => {
    return incidents.some(i => i.sensor === sensor && i.status === 'active');
  };

  const getThresholdLine = (sensor) => {
    const rule = rules.find(r => r.sensor === sensor && r.enabled);
    return rule ? rule.threshold : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-500">Waking up the server, this can take up to a minute...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">SensorScope</h1>
        <p className="text-zinc-400">Live Telemetry Dashboard</p>
      </header>

      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Live Sensors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                />
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Telemetry History</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SENSORS.map(sensor => (
              <LiveChart 
                key={sensor} 
                sensor={sensor} 
                data={readings[sensor]} 
                thresholdLine={getThresholdLine(sensor)}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <SimulatorControls status={simStatus} onUpdate={loadData} />
            <RulesPanel rules={rules} onRulesUpdated={(newRules) => setRules(newRules)} />
          </div>
          <div className="lg:col-span-2 h-[500px]">
            <IncidentLog incidents={incidents} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
