// In-memory data store behind functions to allow easy swapping to a DB later

const READINGS_LIMIT = 500;
const readings = {
  temperature: [],
  distance: [],
  battery: []
};

// Default rules as per requirements
let rules = [
  { id: '1', sensor: 'battery', operator: '<', threshold: 20, enabled: true },
  { id: '2', sensor: 'distance', operator: '<', threshold: 10, enabled: true },
  { id: '3', sensor: 'temperature', operator: '>', threshold: 70, enabled: true },
];

let incidents = [];
let nextReadingId = 1;

export function addReading(reading) {
  const newReading = {
    ...reading,
    id: String(nextReadingId++),
    timestamp: reading.timestamp || new Date().toISOString()
  };
  
  const sensorArray = readings[newReading.sensor];
  if (sensorArray) {
    sensorArray.push(newReading);
    if (sensorArray.length > READINGS_LIMIT) {
      sensorArray.shift(); // Remove oldest
    }
  }
  return newReading;
}

export function getReadings(sensor, limit = 50) {
  const maxLimit = Math.min(Number(limit), 500);
  
  if (sensor) {
    return (readings[sensor] || []).slice(-maxLimit);
  }
  
  // If no sensor, merge and sort all
  const allReadings = [
    ...readings.temperature,
    ...readings.distance,
    ...readings.battery
  ];
  allReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return allReadings.slice(-maxLimit);
}

export function getRules() { return rules; }
export function setRules(newRules) { rules = newRules; }

export function addIncident(incident) {
  incidents.unshift(incident); // newest first
}
export function getIncidents() { return incidents; }
export function getActiveIncidentForSensor(sensor) {
  return incidents.find(i => i.sensor === sensor && i.status === 'active');
}
export function resolveIncident(incidentId) {
  const inc = incidents.find(i => i.id === incidentId);
  if (inc && inc.status === 'active') {
    inc.status = 'resolved';
    inc.resolvedAt = new Date().toISOString();
  }
}
export function getReadingsState() {
  return readings;
}
