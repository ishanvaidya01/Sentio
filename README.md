# SensorScope

> Real-time robot telemetry dashboard — track sensor health, trigger alerts, and diagnose failures live.

## Features

| Feature | Status |
|---|---|
| Robot simulator (temperature, distance, battery — every 2 s) | ✅ |
| Accept real sensor readings via `POST /api/readings` | ✅ |
| ESP32/Arduino-compatible payload format | ✅ |
| Live sensor cards with latest value + trend indicator | ✅ |
| Line charts — last 50 readings per sensor, per-sensor colors | ✅ |
| Editable alert rules (sensor, operator, threshold, enabled) | ✅ |
| Card turns red + incident logged when a rule breaks | ✅ |
| Incident log with active/resolved filter | ✅ |
| Human-readable incident messages | ✅ |
| Server-Sent Events (SSE) live updates | ✅ |
| SSE automatic reconnect with exponential backoff | ✅ |
| Polling fallback if SSE unavailable | ✅ |
| CSV export of all readings | ✅ |
| Fault injection (battery drain, sensor glitch, obstacle) | ✅ |
| Server-side validation (type, range, timestamp) | ✅ |
| Responsive layout (360 px+) | ✅ |

---

## Quick Start

### 1. Server

```bash
cd server
npm install
cp .env.example .env   # edit PORT / CLIENT_ORIGIN if needed
npm start              # production
npm run dev            # development (hot-reload via node --watch)
```

Server starts on **http://localhost:3000** and auto-starts the simulator.

### 2. Client

```bash
cd client
npm install
cp .env.example .env   # edit VITE_API_URL if server is not on :3000
npm run dev
```

Client runs on **http://localhost:5173**.

---

## API Reference

### Readings

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/readings` | Submit a reading. Accepts single `{sensor, value}` or ESP32-style `{temperature, distance, battery}`. |
| `GET`  | `/api/readings?sensor=&limit=` | Get last N readings (max 500). |
| `GET`  | `/api/readings/export.csv` | Download all readings as CSV. |

**POST body examples:**

```json
// Single sensor
{ "sensor": "temperature", "value": 35.2 }

// ESP32-style (all three at once)
{ "temperature": 35.2, "distance": 42.1, "battery": 87.5 }
```

### Rules

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rules` | Get all alert rules. |
| `PUT` | `/api/rules` | Replace all alert rules (array, max 20). |

**Rule object:**

```json
{ "id": "1", "sensor": "battery", "operator": "<", "threshold": 20, "enabled": true }
```

Operators: `<` `<=` `>` `>=`

### Incidents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/incidents` | List all incidents (newest first). Each has `status: "active" | "resolved"`. |

### Simulator

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/simulator/start` | Start the simulator. |
| `POST` | `/api/simulator/stop` | Stop the simulator. |
| `GET`  | `/api/simulator/status` | Get `{ active, activeFault }`. |
| `POST` | `/api/simulator/fault` | Inject a fault: `{ "type": "drain_battery" | "glitch_sensor" | "obstacle" }` |

### Stream (SSE)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stream` | Server-Sent Events. Events: `reading`, `incident`, `rules`, `simulator`. |

### Other

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ ok: true }`. |

---

## Architecture

```
SensorScope/
├── server/                   Node.js + Express (ES modules)
│   ├── index.js              Entry — mounts routes, starts simulator
│   ├── routes/
│   │   ├── readings.js       POST/GET readings + CSV export
│   │   ├── rules.js          GET/PUT rules + re-evaluation
│   │   ├── incidents.js      GET incidents
│   │   ├── simulator.js      Start/stop/fault injection
│   │   └── stream.js         SSE endpoint
│   ├── services/
│   │   ├── simulator.js      Tick every 2s, fault modes
│   │   ├── ruleEngine.js     Edge-triggered incident creation/resolution
│   │   ├── store.js          In-memory ring buffer (500 readings/sensor)
│   │   └── events.js         Node EventEmitter — decouples SSE from services
│   └── validators.js         Sensor type + range validation
│
└── client/                   React 19 + Vite + Tailwind CSS v4
    └── src/
        ├── App.jsx            Main layout + state orchestration
        ├── api.js             Typed fetch helpers
        ├── hooks/useSSE.js    SSE with exponential-backoff reconnect
        └── components/
            ├── SensorCard.jsx         Value + trend + alert state
            ├── LiveChart.jsx          Per-sensor color line chart + thresholds
            ├── RulesPanel.jsx         Editable rule editor
            ├── IncidentLog.jsx        Filtered log with human-readable messages
            ├── SimulatorControls.jsx  Start/stop/fault buttons
            └── ConnectionBadge.jsx    Live/Polling/Offline indicator
```

---

## Connecting a Real Arduino / ESP32

Use `POST /api/readings` with the ESP32-style body. Example Arduino sketch fragment:

```cpp
HTTPClient http;
http.begin("http://<your-server>/api/readings");
http.addHeader("Content-Type", "application/json");

String payload = "{\"temperature\":" + String(temp, 2)
               + ",\"distance\":" + String(dist, 2)
               + ",\"battery\":" + String(batt, 2) + "}";
http.POST(payload);
http.end();
```

---

## Deployment

| Layer | Platform | Notes |
|---|---|---|
| Backend | Render (Web Service) | Set `PORT`, `CLIENT_ORIGIN`, `SIMULATOR_AUTOSTART=true`. Free tier spins down after inactivity — the "Connecting…" spinner handles cold starts. |
| Frontend | Vercel | Set `VITE_API_URL` to the Render backend URL. |

---

## Live Links

- **Frontend**: [Placeholder — add after deploy]
- **Backend**: [Placeholder — add after deploy]
