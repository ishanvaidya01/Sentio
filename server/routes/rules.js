import express from 'express';
import { getRules, setRules, getReadingsState } from '../services/store.js';
import { validateRule } from '../validators.js';
import { reevaluateAllRules } from '../services/ruleEngine.js';
import { emitEvent } from '../services/events.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getRules());
});

router.put('/', (req, res) => {
  const newRules = req.body;
  if (!Array.isArray(newRules) || newRules.length > 20) {
    return res.status(400).json({ error: 'Validation failed', details: ['Rules must be an array of max 20 items'] });
  }

  const allErrors = [];
  for (let i = 0; i < newRules.length; i++) {
    const { isValid, errors } = validateRule(newRules[i]);
    if (!isValid) {
      allErrors.push(`Rule ${i}: ${errors.join(', ')}`);
    }
    if (!newRules[i].id) {
      newRules[i].id = Date.now().toString() + i;
    }
  }

  if (allErrors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: allErrors });
  }

  setRules(newRules);
  
  // Re-evaluate immediately
  reevaluateAllRules(getReadingsState());
  emitEvent('rules', getRules());

  res.json(getRules());
});

export default router;
