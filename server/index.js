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

if (process.env.SIMULATOR_AUTOSTART === 'true') {
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
