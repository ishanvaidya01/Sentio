import { useEffect, useState } from 'react';
import { fetchReadings } from './api';
import SensorCard from './components/SensorCard';
import LiveChart from './components/LiveChart';

const SENSORS = ['temperature', 'distance', 'battery'];

function App() {
  const [readings, setReadings] = useState({ temperature: [], distance: [], battery: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [temp, dist, batt] = await Promise.all([
          fetchReadings('temperature', 50),
          fetchReadings('distance', 50),
          fetchReadings('battery', 50)
        ]);
        setReadings({ temperature: temp, distance: dist, battery: batt });
      } catch (err) {
        console.error("Poll error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getLatest = (sensor) => {
    const list = readings[sensor];
    return list[list.length - 1] || {};
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
        <h1 className="text-3xl font-bold">SensorScope</h1>
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
                  hasAlert={false}
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
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
