import express from 'express';
import { startSimulator, stopSimulator, getStatus, injectFault, resetSimulator } from '../services/simulator.js';
import { emitEvent } from '../services/events.js';

const router = express.Router();

router.post('/start', (req, res) => {
  startSimulator();
  emitEvent('simulator', getStatus());
  res.json({ status: 'started' });
});

router.post('/stop', (req, res) => {
  stopSimulator();
  emitEvent('simulator', getStatus());
  res.json({ status: 'stopped' });
});

router.post('/reset', (req, res) => {
  resetSimulator();
  emitEvent('simulator', getStatus());
  res.json({ status: 'reset' });
});

router.get('/status', (req, res) => {
  res.json(getStatus());
});

router.post('/fault', (req, res) => {
  const { type } = req.body;
  if (!['drain_battery', 'glitch_sensor', 'obstacle'].includes(type)) {
    return res.status(400).json({ error: 'Validation failed', details: ['Invalid fault type'] });
  }
  injectFault(type);
  emitEvent('simulator', getStatus());
  res.json({ status: 'fault_injected', type });
});

export default router;
