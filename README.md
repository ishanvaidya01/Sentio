# SensorScope

Live telemetry dashboard for a misbehaving robot.

## Features Completed
- [x] Node.js Express backend with ES modules
- [x] React + Vite + Tailwind frontend
- [x] In-memory ring buffer (up to 500 readings per sensor)
- [x] Server-side validation (types, ranges)
- [x] Robot Simulator (drifts, bounds, fault injection)
- [x] Edge-triggered Rule Engine (active/resolved incidents)
- [x] Real-time updates via Server-Sent Events (SSE) with a polling fallback
- [x] Responsive layout (usable at 360px width)
- [x] CSV Export (Stretch goal)
- [x] `.env.example` setup

## How to Run Locally

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd SensorScope
   ```

2. **Start the Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm start
   ```
   *The server runs on http://localhost:3000 and auto-starts the simulator.*

3. **Start the Client**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   npm run dev
   ```
   *The client runs on http://localhost:5173.*

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/readings` | Submit a reading. Runs validation, rule engine, and SSE broadcast. |
| GET | `/api/readings` | Get last N readings. |
| GET | `/api/readings/export.csv`| Export readings as CSV. |
| GET/PUT | `/api/rules` | Read or overwrite alert rules. |
| GET | `/api/incidents` | List active and resolved incidents. |
| POST | `/api/simulator/start`| Start simulator. |
| POST | `/api/simulator/stop` | Stop simulator. |
| POST | `/api/simulator/fault`| Inject fault (`drain_battery`, `glitch_sensor`, `obstacle`). |
| GET | `/api/stream` | Server-Sent Events endpoint. |
| GET | `/api/health` | Health check. |

## Deployment Notes

- **Backend**: Deploy the `server` directory as a Web Service on Render. Set `PORT`, `CLIENT_ORIGIN`, and `SIMULATOR_AUTOSTART=true`. Note: Free Render instances spin down after inactivity. The frontend shows a "Waking up..." message during cold starts.
- **Frontend**: Deploy the `client` directory on Vercel. Set `VITE_API_URL` to the Render backend URL.

## Live Links
- **Frontend**: [Placeholder URL]
- **Backend**: [Placeholder URL]

## How I Used AI
[To be filled in by candidate]
