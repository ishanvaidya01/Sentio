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
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">Alert Rules</h2>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Rules'}
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-400 bg-red-950/40 p-2 rounded border border-red-900/50">{error}</div>}

      <div className="space-y-2">
        {localRules.map(rule => (
          <div key={rule.id} className="flex flex-wrap items-center gap-2 p-2 bg-zinc-950/50 rounded border border-zinc-800 text-sm">
            <select className="bg-zinc-800 border-zinc-700 rounded p-1 text-zinc-200 outline-none" value={rule.sensor} onChange={(e) => handleChange(rule.id, 'sensor', e.target.value)}>
              {SENSORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="bg-zinc-800 border-zinc-700 rounded p-1 text-zinc-200 outline-none" value={rule.operator} onChange={(e) => handleChange(rule.id, 'operator', e.target.value)}>
              {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <input type="number" className="bg-zinc-800 border-zinc-700 rounded p-1 text-zinc-200 outline-none w-20" value={rule.threshold} onChange={(e) => handleChange(rule.id, 'threshold', e.target.value)} />
            <label className="flex items-center gap-1 ml-auto text-zinc-400 cursor-pointer">
              <input type="checkbox" checked={rule.enabled} onChange={(e) => handleChange(rule.id, 'enabled', e.target.checked)} className="accent-blue-500" />
              Enabled
            </label>
            <button onClick={() => deleteRule(rule.id)} className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-red-950/40 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {localRules.length === 0 && <p className="text-sm text-zinc-500 italic">No rules defined.</p>}
      </div>

      <button onClick={addRule} disabled={localRules.length >= 20} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
        <Plus size={16} /> Add Rule
      </button>
    </div>
  );
}
