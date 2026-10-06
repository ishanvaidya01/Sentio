import express from 'express';
import { subscribeToEvents } from '../services/events.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const keepAlive = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 25000);

  const unsubscribe = subscribeToEvents(({ type, data }) => {
    res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  });

  req.on('close', () => {
    clearInterval(keepAlive);
    unsubscribe();
  });
});

export default router;
