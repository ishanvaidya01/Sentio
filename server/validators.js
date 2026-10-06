export const VALID_SENSORS = ['temperature', 'distance', 'battery'];

export function validateReading(data) {
  const errors = [];
  
  if (!VALID_SENSORS.includes(data.sensor)) {
    errors.push(`Invalid sensor: must be one of ${VALID_SENSORS.join(', ')}`);
  }
  
  if (typeof data.value !== 'number' || !Number.isFinite(data.value)) {
    errors.push('Invalid value: must be a finite number');
  } else {
    // Range validation
    if (data.sensor === 'temperature' && (data.value < -40 || data.value > 125)) {
      errors.push('Temperature must be between -40 and 125');
    }
    if (data.sensor === 'distance' && (data.value < 0 || data.value > 400)) {
      errors.push('Distance must be between 0 and 400');
    }
    if (data.sensor === 'battery' && (data.value < 0 || data.value > 100)) {
      errors.push('Battery must be between 0 and 100');
    }
  }

  if (data.timestamp) {
    const d = new Date(data.timestamp);
    if (isNaN(d.getTime())) {
      errors.push('Invalid timestamp format');
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateRule(rule) {
  const errors = [];
  
  if (!VALID_SENSORS.includes(rule.sensor)) {
    errors.push(`Invalid sensor: must be one of ${VALID_SENSORS.join(', ')}`);
  }
  
  const validOperators = ['<', '<=', '>', '>='];
  if (!validOperators.includes(rule.operator)) {
    errors.push(`Invalid operator: must be one of ${validOperators.join(', ')}`);
  }
  
  if (typeof rule.threshold !== 'number' || !Number.isFinite(rule.threshold)) {
    errors.push('Invalid threshold: must be a finite number');
  }
  
  if (typeof rule.enabled !== 'boolean') {
    errors.push('Invalid enabled: must be a boolean');
  }

  return { isValid: errors.length === 0, errors };
}
