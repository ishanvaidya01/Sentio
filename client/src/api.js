const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchReadings(sensor, limit = 50) {
  const url = new URL(`${API_URL}/api/readings`);
  if (sensor) url.searchParams.append('sensor', sensor);
  if (limit) url.searchParams.append('limit', limit);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch readings');
  return res.json();
}

export async function fetchRules() {
  const res = await fetch(`${API_URL}/api/rules`);
  if (!res.ok) throw new Error('Failed to fetch rules');
  return res.json();
}

export async function updateRules(rules) {
  const res = await fetch(`${API_URL}/api/rules`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rules)
  });
  if (!res.ok) throw new Error('Failed to update rules');
  return res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_URL}/api/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchSimulatorStatus() {
  const res = await fetch(`${API_URL}/api/simulator/status`);
  if (!res.ok) throw new Error('Failed to fetch simulator status');
  return res.json();
}

export async function startSimulator() {
  await fetch(`${API_URL}/api/simulator/start`, { method: 'POST' });
}

export async function stopSimulator() {
  await fetch(`${API_URL}/api/simulator/stop`, { method: 'POST' });
}

export async function injectFault(type) {
  await fetch(`${API_URL}/api/simulator/fault`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type })
  });
}
