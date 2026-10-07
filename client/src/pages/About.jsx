const STACK = [
  { category: 'Frontend',  items: ['React 19', 'Vite', 'Recharts', 'Vanilla CSS'] },
  { category: 'Backend',   items: ['Node.js', 'Express.js', 'Server-Sent Events'] },
  { category: 'Tooling',   items: ['React Router', 'AudioContext API', 'Lucide Icons'] },
];

export default function About() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* Project */}
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        About Sentio
      </h1>
      <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.75, margin: '0 0 40px' }}>
        Sentio is a real-time robot telemetry dashboard. When a robot misbehaves during testing, engineers
        often cannot tell whether the battery dipped, a sensor glitched, or the firmware failed. Sentio solves
        that by streaming live sensor readings directly to the browser, maintaining a timestamped incident log,
        and sounding an alarm the moment a safety rule is broken.
      </p>

      <Divider />

      {/* What it does */}
      <Section title="What it does">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <tbody>
            {[
              ['Live sensor cards', 'Show the latest temperature, distance and battery value with a trend indicator (rising / falling / flat).'],
              ['Telemetry charts', 'Line graphs of the last 50 readings per sensor, updated every 2 seconds via Server-Sent Events.'],
              ['Alert rules engine', 'Define threshold rules (e.g. temperature > 70°C). Violations are detected on the server and immediately flagged on the card.'],
              ['Incident log', 'A timestamped, immutable record of every alert — when it triggered and when it resolved.'],
              ['Audio alarm', 'A Red Alert klaxon sounds in the browser whenever a new incident is created, so engineers do not need to watch the screen continuously.'],
              ['Hardware simulator', 'A built-in random-walk simulator produces realistic sensor data every 2 seconds. Fault injection buttons simulate battery drain, sensor glitches, and close-range obstacles.'],
              ['Arduino / ESP32 API', 'Real hardware can POST flat JSON sensor readings directly to the backend. No firmware library required.'],
              ['CSV export', 'All stored readings can be downloaded as a CSV file for offline analysis.'],
            ].map(([feature, desc]) => (
              <tr key={feature} style={{ borderBottom: '1px solid rgba(156,163,175,0.2)' }}>
                <td style={{ padding: '10px 16px 10px 0', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', verticalAlign: 'top', width: '30%' }}>{feature}</td>
                <td style={{ padding: '10px 0', color: '#4b5563', lineHeight: 1.65 }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Divider />

      {/* Tech stack */}
      <Section title="Tech stack">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {STACK.map(({ category, items }) => (
            <div key={category} style={{
              background: '#fff',
              border: '1px solid rgba(156,163,175,0.3)',
              borderRadius: 10,
              padding: '14px 16px',
            }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{category}</p>
              <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                {items.map(item => (
                  <li key={item} style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Developer */}
      <Section title="Developer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem', color: '#374151' }}>
          <p style={{ margin: 0 }}><strong style={{ color: '#111827' }}>Ishan Vaidya</strong></p>
          <p style={{ margin: 0 }}>B.Tech, Computer Science &amp; Engineering &mdash; Vellore Institute of Technology, Chennai</p>
          <p style={{ margin: 0, color: '#6b7280' }}>Pune, India</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
            <ContactLink href="mailto:ishan.vaidya01@gmail.com" label="ishan.vaidya01@gmail.com" />
            <ContactLink href="https://github.com/ishanvaidya01" label="github.com/ishanvaidya01" />
            <ContactLink href="https://github.com/ishanvaidya01/Sentio" label="Sentio repository" />
          </div>
        </div>
      </Section>

      <Divider />

      {/* Source */}
      <Section title="Source code">
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.75 }}>
          Sentio is open source. The full source code, architecture documentation, and API reference are
          available at{' '}
          <a
            href="https://github.com/ishanvaidya01/Sentio"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0369a1', textDecoration: 'none', borderBottom: '1px solid rgba(3,105,161,0.3)' }}
          >
            github.com/ishanvaidya01/Sentio
          </a>
          . The README includes a complete API reference, architecture diagram, and instructions for
          connecting a real Arduino or ESP32 device.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ margin: '36px 0' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>{title}</h2>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid rgba(156,163,175,0.22)', margin: 0 }} />;
}

function ContactLink({ href, label }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{ fontSize: '0.875rem', color: '#0369a1', textDecoration: 'none', borderBottom: '1px solid rgba(3,105,161,0.25)', transition: 'border-color 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderBottomColor = '#0369a1'; }}
      onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'rgba(3,105,161,0.25)'; }}
    >
      {label}
    </a>
  );
}
