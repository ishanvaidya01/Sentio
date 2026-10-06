import { validateReading } from '../validators.js';
import { addReading, getReadings } from '../services/store.js';
import { evaluateReading } from '../services/ruleEngine.js';

const router = express.Router();

function getUnit(sensor) {
  if (sensor === 'temperature') return 'degC';
  if (sensor === 'distance') return 'cm';
  if (sensor === 'battery') return '%';
  return '';
}

function parseFrame(body) {
  const readings = [];
  if (body.sensor && body.value !== undefined) {
    readings.push({ sensor: body.sensor, value: Number(body.value), timestamp: body.timestamp });
  } else {
    // ESP32 style payload
    if (body.temperature !== undefined) readings.push({ sensor: 'temperature', value: Number(body.temperature) });
    if (body.distance !== undefined) readings.push({ sensor: 'distance', value: Number(body.distance) });
    if (body.battery !== undefined) readings.push({ sensor: 'battery', value: Number(body.battery) });
  }
  return readings;
}

router.post('/', (req, res) => {
  const rawReadings = parseFrame(req.body);
  
  if (rawReadings.length === 0) {
    return res.status(400).json({ error: 'Validation failed', details: ['No valid reading found in body'] });
  }

  const savedReadings = [];
  const allErrors = [];

  for (const raw of rawReadings) {
    const { isValid, errors } = validateReading(raw);
    if (!isValid) {
      allErrors.push(...errors);
      continue;
    }
    raw.unit = getUnit(raw.sensor);
    const saved = addReading(raw);
    savedReadings.push(saved);
    evaluateReading(raw);
  }

  if (allErrors.length > 0 && savedReadings.length === 0) {
     return res.status(400).json({ error: 'Validation failed', details: allErrors });
  }

  res.status(201).json(savedReadings.length === 1 ? savedReadings[0] : savedReadings);
});

router.get('/', (req, res) => {
  const { sensor, limit = 50 } = req.query;
  const data = getReadings(sensor, limit);
  res.json(data);
});

export default router;
