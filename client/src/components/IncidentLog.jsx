import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Filter } from 'lucide-react';

const UNIT_DISPLAY = { degC: '°C', cm: 'cm', '%': '%' };

const SENSOR_COLORS = {
  temperature: '#c2410c',
  distance:    '#0369a1',
  battery:     '#15803d',
};

/** Format a human-readable incident message */
function formatMessage(inc) {
  const sensorLabel =
    inc.sensor === 'temperature' ? 'Temperature' :
    inc.sensor === 'distance'    ? 'Distance'    :
    inc.sensor === 'battery'     ? 'Battery'     :
    inc.sensor;

  const opLabel =
    inc.operator === '<'  ? 'dropped below' :
    inc.operator === '<=' ? 'is at or below' :
    inc.operator === '>'  ? 'exceeded'       :
    inc.operator === '>=' ? 'reached or exceeded' :
    inc.operator;

  const unit =
    inc.sensor === 'temperature' ? '°C' :
    inc.sensor === 'distance'    ? ' cm' :
    inc.sensor === 'battery'     ? '%'   : '';

  return `${sensorLabel} ${opLabel} ${inc.threshold}${unit} (reading: ${inc.value}${unit})`;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString([], {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function IncidentLog({ incidents }) {
  const [showActive, setShowActive] = useState(false);

  const displayed = showActive
    ? incidents.filter(i => i.status === 'active')
    : incidents;

  const activeCount = incidents.filter(i => i.status === 'active').length;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(156,163,175,0.35)',
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>Incident Log</h2>
          {activeCount > 0 && (
            <span style={{
              fontSize: '11px', fontWeight: 700,
              background: 'rgba(220,38,38,0.08)', color: '#dc2626',
              border: '1px solid rgba(220,38,38,0.20)',
              padding: '2px 8px', borderRadius: 20,
            }}>
              {activeCount} active
            </span>
          )}
        </div>
        <button
          onClick={() => setShowActive(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: '11px', fontWeight: 500,
            padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
            background: showActive ? 'rgba(220,38,38,0.07)' : '#f3f4f6',
            border: showActive ? '1px solid rgba(220,38,38,0.20)' : '1px solid rgba(156,163,175,0.3)',
            color: showActive ? '#dc2626' : '#6b7280',
            transition: 'all 0.15s',
          }}
        >
          <Filter size={11} />
          {showActive ? 'Active only' : 'All'}
        </button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        {displayed.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle2 size={30} style={{ color: '#d1d5db', marginBottom: 8 }} />
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {showActive ? 'No active incidents.' : 'No incidents recorded yet.'}
            </p>
          </div>
        ) : (
          displayed.map(inc => (
            <div
              key={inc.id}
              className="incident-entry"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: inc.status === 'active'
                  ? '1px solid rgba(220,38,38,0.22)'
                  : '1px solid rgba(156,163,175,0.25)',
                background: inc.status === 'active' ? '#fff5f5' : '#f9fafb',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  color: SENSOR_COLORS[inc.sensor] ?? '#374151',
                }}>
                  {inc.sensor}
                </span>
                {inc.status === 'active' ? (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '11px', color: '#dc2626',
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.20)',
                    padding: '2px 8px', borderRadius: 20,
                  }}>
                    <AlertTriangle size={9} /> Active
                  </span>
                ) : (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '11px', color: '#15803d',
                    background: 'rgba(21,128,61,0.08)',
                    border: '1px solid rgba(21,128,61,0.18)',
                    padding: '2px 8px', borderRadius: 20,
                  }}>
                    <CheckCircle2 size={9} /> Resolved
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 6px', color: '#4b5563', fontSize: '12px', lineHeight: 1.5 }}>{formatMessage(inc)}</p>
              <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                <span>🔴 {formatDateTime(inc.triggeredAt)}</span>
                {inc.resolvedAt && <span>✅ {formatDateTime(inc.resolvedAt)}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
