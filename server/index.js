import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

import readingsRouter from './routes/readings.js';

import simulatorRouter from './routes/simulator.js';
import { startSimulator } from './services/simulator.js';

app.use(cors({
  origin: CLIENT_ORIGIN
}));
app.use(express.json());

import rulesRouter from './routes/rules.js';
import incidentsRouter from './routes/incidents.js';
import streamRouter from './routes/stream.js';

app.use('/api/readings', readingsRouter);
app.use('/api/simulator', simulatorRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/stream', streamRouter);

if (process.env.SIMULATOR_AUTOSTART !== 'false') {
  startSimulator();
}

// Phase 1 API health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// JSON error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Root route friendly message
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sentio API Server</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #111827;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }
          h1 {
            font-size: 20px;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 12px;
            margin-bottom: 24px;
          }
          p {
            font-size: 14px;
            color: #4b5563;
          }
          .status {
            display: inline-block;
            background: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            color: #374151;
            border: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <h1>Sentio Telemetry API</h1>
        <p>System Status: <span class="status">Operational</span></p>
        <p>This service provides WebSocket streams and REST endpoints for the Sentio Dashboard. Direct browser access is not intended.</p>
      </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
