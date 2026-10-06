import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SensorScope</h1>
        <p className="text-xl">
          Backend Health: {health ? (health.ok ? <span className="text-green-500">OK</span> : <span className="text-red-500">Error</span>) : <span className="text-zinc-500">Checking...</span>}
        </p>
      </div>
    </div>
  );
}

export default App;
