import { addReading } from './store.js';
import { evaluateReading } from './ruleEngine.js';
import { emitEvent } from './events.js';

let interval = null;
let active = false;

// Current state of the simulated robot
let state = {
  temperature: 30, // drifts around 30..45
  distance: 50, // wanders 5..200
  battery: 100, // slowly drains
};

// Fault state
let activeFault = null;
let faultCycles = 0;

export function startSimulator() {
  if (active) return;
  active = true;
  interval = setInterval(tick, 2000);
}

export function stopSimulator() {
  if (!active) return;
  active = false;
  clearInterval(interval);
  interval = null;
}

export function getStatus() {
  return { active, activeFault };
}

export function injectFault(type) {
  // type: "drain_battery" | "glitch_sensor" | "obstacle"
  activeFault = type;
  if (type === 'obstacle') {
    faultCycles = 5; // drop distance for 10 seconds (5 ticks)
  } else if (type === 'glitch_sensor') {
    faultCycles = 3; // 3 wild readings
  } else if (type === 'drain_battery') {
    faultCycles = 1; // immediate sharp drop
  }
}

function tick() {
  // Normal random walk
  state.temperature += (Math.random() * 4 - 2); // +/- 2
  if (state.temperature < 30) state.temperature += 1;
  if (state.temperature > 45) state.temperature -= 1;

  state.distance += (Math.random() * 20 - 10); // +/- 10
  if (state.distance < 5) state.distance = 5;
  if (state.distance > 200) state.distance = 200;

  state.battery -= (Math.random() * 0.5); // drains slowly
  if (state.battery < 0) state.battery = 0;

  // Apply faults
  if (activeFault) {
    if (activeFault === 'obstacle') {
      state.distance = Math.random() * 5 + 2; // < 10 cm
    } else if (activeFault === 'glitch_sensor') {
      state.temperature = Math.random() * 100 + 100; // wild out of range but valid
    } else if (activeFault === 'drain_battery') {
      state.battery -= 25; // sharp drop
      if (state.battery < 0) state.battery = 0;
    }
    
    faultCycles--;
    if (faultCycles <= 0) {
      activeFault = null; // recover
    }
  }

  // Create readings
  const t = new Date().toISOString();
  
  const readings = [
    { sensor: 'temperature', value: Number(state.temperature.toFixed(2)), unit: 'degC', timestamp: t },
    { sensor: 'distance', value: Number(state.distance.toFixed(2)), unit: 'cm', timestamp: t },
    { sensor: 'battery', value: Number(state.battery.toFixed(2)), unit: '%', timestamp: t }
  ];

  for (const r of readings) {
    addReading(r);
    evaluateReading(r);
    // TODO: emit event
  }
}
