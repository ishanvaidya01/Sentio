import { getRules, getActiveIncidentForSensor, addIncident, resolveIncident } from './store.js';
import { emitEvent } from './events.js';

export function evaluateReading(reading) {
  const rules = getRules();
  const activeIncident = getActiveIncidentForSensor(reading.sensor);
  
  // Find if any rule is violated by this reading
  let violatedRule = null;
  for (const rule of rules) {
    if (!rule.enabled || rule.sensor !== reading.sensor) continue;
    
    let isViolated = false;
    if (rule.operator === '<' && reading.value < rule.threshold) isViolated = true;
    if (rule.operator === '<=' && reading.value <= rule.threshold) isViolated = true;
    if (rule.operator === '>' && reading.value > rule.threshold) isViolated = true;
    if (rule.operator === '>=' && reading.value >= rule.threshold) isViolated = true;
    
    if (isViolated) {
      violatedRule = rule;
      break; // Just need one violation to trigger alert
    }
  }

  // Edge-triggered logic
  if (violatedRule) {
    if (!activeIncident || activeIncident.ruleId !== violatedRule.id) {
      // If there was a different active incident, resolve it first
      if (activeIncident) {
        resolveIncident(activeIncident.id);
      }
      // Create new incident
      const newIncident = {
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        ruleId: violatedRule.id,
        sensor: reading.sensor,
        operator: violatedRule.operator,
        threshold: violatedRule.threshold,
        value: reading.value,
        message: `${reading.sensor} reading ${reading.value} ${violatedRule.operator} ${violatedRule.threshold}`,
        triggeredAt: new Date().toISOString(),
        resolvedAt: null,
        status: 'active'
      };
      addIncident(newIncident);
      emitEvent('incident', newIncident);
    }
  } else {
    // No rules violated, resolve active incident if any
    if (activeIncident) {
      resolveIncident(activeIncident.id);
      emitEvent('incident', activeIncident);
    }
  }
}

export function reevaluateAllRules(latestReadingsState) {
  // When rules are updated, we must immediately re-evaluate the latest reading for each sensor
  for (const sensor of ['temperature', 'distance', 'battery']) {
    const list = latestReadingsState[sensor];
    if (list && list.length > 0) {
      const latest = list[list.length - 1];
      evaluateReading(latest);
    } else {
       // If no readings, resolve any active incidents for this sensor (edge case)
       const active = getActiveIncidentForSensor(sensor);
       if (active) resolveIncident(active.id);
    }
  }
}
