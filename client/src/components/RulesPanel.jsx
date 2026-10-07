import { useState, useEffect } from 'react';
import { Trash2, Plus, Save } from 'lucide-react';
import { updateRules } from '../api';

const SENSORS = ['temperature', 'distance', 'battery'];
const OPERATORS = ['<', '<=', '>', '>='];

export default function RulesPanel({ rules, onRulesUpdated }) {
  const [localRules, setLocalRules] = useState(rules);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalRules(rules);
  }, [rules]);

  const handleChange = (id, field, value) => {
    setLocalRules(localRules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRule = () => {
    if (localRules.length >= 20) return;
    setLocalRules([...localRules, {
      id: Date.now().toString(),
      sensor: 'temperature',
      operator: '>',
      threshold: 0,
      enabled: true
    }]);
  };

  const deleteRule = (id) => {
    setLocalRules(localRules.filter(r => r.id !== id));
  };

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      const payload = localRules.map(r => ({ ...r, threshold: Number(r.threshold) }));
      const updated = await updateRules(payload);
      onRulesUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(156,163,175,0.35)',
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>Alert Rules</h2>
        <button
          onClick={save}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: saving ? '#e0e7ff' : '#4f46e5',
            color: saving ? '#6b7280' : '#fff',
            border: 'none', borderRadius: 8,
            padding: '6px 12px', fontSize: '12px', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          <Save size={13} />
          {saving ? 'Saving…' : 'Save Rules'}
        </button>
      </div>

      {error && (
        <div style={{
          marginBottom: 12, fontSize: '12px', color: '#dc2626',
          background: 'rgba(220,38,38,0.07)', padding: '8px 10px',
          borderRadius: 8, border: '1px solid rgba(220,38,38,0.18)',
        }}>{error}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {localRules.map(rule => (
          <div key={rule.id} style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
            padding: '8px 10px',
            background: '#f9fafb',
            border: '1px solid rgba(156,163,175,0.3)',
            borderRadius: 10,
          }}>
            <select
              value={rule.sensor}
              onChange={e => handleChange(rule.id, 'sensor', e.target.value)}
            >
              {SENSORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={rule.operator}
              onChange={e => handleChange(rule.id, 'operator', e.target.value)}
            >
              {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <input
              type="number"
              value={rule.threshold}
              onChange={e => handleChange(rule.id, 'threshold', e.target.value)}
              style={{ width: 72 }}
            />
            <label style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginLeft: 'auto', fontSize: '12px', color: '#6b7280', cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={e => handleChange(rule.id, 'enabled', e.target.checked)}
                style={{ accentColor: '#4f46e5', width: 13, height: 13 }}
              />
              Enabled
            </label>
            <button
              onClick={() => deleteRule(rule.id)}
              style={{
                background: 'none', border: 'none', padding: '4px', borderRadius: 6,
                cursor: 'pointer', color: '#9ca3af', transition: 'color 0.15s',
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {localRules.length === 0 && (
          <p style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>No rules defined.</p>
        )}
      </div>

      <button
        onClick={addRule}
        disabled={localRules.length >= 20}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 14, background: 'none', border: 'none',
          fontSize: '13px', fontWeight: 500,
          color: localRules.length >= 20 ? '#9ca3af' : '#4f46e5',
          cursor: localRules.length >= 20 ? 'not-allowed' : 'pointer',
          padding: 0,
        }}
      >
        <Plus size={14} /> Add Rule
      </button>
    </div>
  );
}

