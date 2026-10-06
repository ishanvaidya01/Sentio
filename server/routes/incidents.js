import express from 'express';
import { getIncidents } from '../services/store.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getIncidents());
});

export default router;
