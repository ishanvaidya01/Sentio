import express from 'express';
import { startSimulator, stopSimulator, getStatus, injectFault } from '../services/simulator.js';

const router = express.Router();

router.post('/start', (req, res) => {
  startSimulator();
  res.json({ status: 'started' });
});

router.post('/stop', (req, res) => {
  stopSimulator();
  res.json({ status: 'stopped' });
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
  res.json({ status: 'fault_injected', type });
});

export default router;
