const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchReadings(sensor, limit = 50) {
  const url = new URL(`${API_URL}/api/readings`);
  if (sensor) url.searchParams.append('sensor', sensor);
  if (limit) url.searchParams.append('limit', limit);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch readings');
  return res.json();
}
