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
    <html>
      <head>
        <title>Sentio API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #111827; color: #f9fafb; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .container { text-align: center; background: #1f2937; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          h1 { margin-top: 0; color: #10b981; }
          p { color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sentio Backend is Running 🚀</h1>
          <p>This is the API server for the Sentio Dashboard.</p>
          <p>The frontend will automatically connect to this service.</p>
        </div>
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
