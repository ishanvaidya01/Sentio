# Sentio
**The Next-Generation Robot Telemetry & Observability Platform**

Sentio is an intelligent, real-time observability platform that goes beyond simple sensor dashboards. It acts as the "black box" flight recorder for your robotics hardware, providing automated fault detection, live telemetry streams, and seamless hardware-agnostic integration.

[Features](https://github.com/ishanvaidya01/Sentio#features) • [Why Sentio?](https://github.com/ishanvaidya01/Sentio#how-sentio-beats-the-competition) • [Architecture](https://github.com/ishanvaidya01/Sentio#architecture) • [Deployment Status](https://github.com/ishanvaidya01/Sentio#deployment-status) • [Getting Started](https://github.com/ishanvaidya01/Sentio#getting-started)

## Features
- **Real-Time Hardware Telemetry**: Sub-second data streaming powered by Server-Sent Events (SSE) that updates dynamic charts instantly without manual polling.
- **Dynamic Alert Rules Engine**: Define edge-triggered safety parameters (e.g., `temperature > 70°C` or `battery < 20%`). Breaking a rule instantly flags the sensor and logs the anomaly.
- **Immutable Incident Log**: The system's "Black Box". Every time a rule is broken or resolved, an exact timestamped entry is logged, making post-mortem hardware debugging completely deterministic.
- **Red-Alert Audio Alarms**: Uses the browser's native `AudioContext` to generate a loud, sweeping Red Alert klaxon siren the instant a catastrophic hardware fault occurs.
- **Integrated Hardware Simulator**: No Arduino plugged in? No problem. The backend includes a complete physics-based random-walk simulator with dedicated **Fault Injection** buttons (Sensor Glitch, Battery Drain, Obstacle) to test your safety rules.
- **Data Export & Portability**: Instantly download the complete telemetry history as a CSV for deeper analysis.

## How Sentio Beats the Competition
While generic IoT dashboards like Grafana or basic web panels are great for general data, they lack the immediate, hardware-focused observability required for live robotics testing. Here's how Sentio stands out:

| Feature | Sentio | Generic IoT Dashboards |
|---|---|---|
| **Core Focus** | Automated Safety & Observability | Static metric display |
| **Fault Detection** | Dynamic Rule Engine with Edge-Triggering | Manual visual inspection |
| **Alarms** | Jarring, native AudioContext Klaxons | Visual only or simple pings |
| **Traceability** | Human-readable, timestamped Incident Log | Complex query logs |
| **Integration** | ESP32/Arduino-ready flat JSON payloads | Complex proprietary schemas |

In short: Generic dashboards show numbers. **Sentio actively monitors the health of your robot.**

## Architecture
Sentio is built on a robust, lightweight architecture designed for real-time concurrency and low latency.

### Streaming Engine
At the heart of the backend is the Event Emitter & SSE Engine. Instead of forcing the frontend to spam API requests (polling), the backend maintains a persistent Server-Sent Events stream. The moment a sensor reading arrives via a simple `POST` request from an Arduino, the Event Engine broadcasts the reading, triggers the Rule Engine, and pushes updates to all connected clients in milliseconds.

### Tech Stack
**Frontend:**
- **React.js (Vite)** for lightning-fast UI rendering.
- **Recharts** for rendering performant, animated telemetry history graphs.
- **Vanilla CSS** with a robust, modern light-theme design system (Clean whites, precise typography, semantic status colors).

**Backend:**
- **Node.js & Express** for robust, high-performance API endpoints.
- **Native Server-Sent Events (SSE)** for zero-dependency real-time communication.
- **In-Memory Ring Buffers** to maintain a hyper-fast rolling history of the last 500 telemetry points without database latency.

## Deployment Status
Sentio is currently configured for local development and direct hardware integration. 

The frontend can be deployed easily on static tiers (like Vercel or Cloudflare Pages), and the lightweight Express backend can run effortlessly on platforms like Render or Railway. Because the state is managed entirely in-memory, it requires zero external database infrastructure, making deployment incredibly fast and cost-effective.

## Getting Started

### Prerequisites
- Node.js (v18+)

### 1. Clone the repository
```bash
git clone https://github.com/ishanvaidya01/Sentio.git
cd Sentio
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev # Starts the API, Simulator, and SSE stream on port 3000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev # Starts the Vite dev server on port 5173
```

### 4. Hardware Integration (Arduino/ESP32)
Point your physical robot to the backend. Use `POST /api/readings` with a flat JSON body:
```cpp
HTTPClient http;
http.begin("http://<your-server-ip>:3000/api/readings");
http.addHeader("Content-Type", "application/json");

String payload = "{\"temperature\":" + String(temp, 2)
               + ",\"distance\":" + String(dist, 2)
               + ",\"battery\":" + String(batt, 2) + "}";
http.POST(payload);
http.end();
```

## UI/UX Design Philosophy
Sentio was designed with a premium, crisp, and professional aesthetic. 
We completely avoided generic dashboard templates, utilizing curated grayscale palettes, vibrant semantic accents (Emerald, Rose, Amber), and subtle shadows. Every interaction and live update is designed to feel responsive, clear, and hardware-accurate.

Built with passion for the future of robotics observability.
