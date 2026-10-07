export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>
<h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 40 }}>Effective date: October 2026</p>

      <Section title="1. Overview">
        Sentio is a robot telemetry and sensor monitoring dashboard. This policy describes what data Sentio
        collects, how it is used, and how it is stored. Sentio is a technical tool intended for engineering
        teams, not a consumer product. No personal data is required to use the core dashboard.
      </Section>

      <Section title="2. Data We Collect">
        <p>Sentio collects only the data that you or your hardware explicitly sends to it:</p>
        <ul>
          <li><strong>Sensor readings</strong> — temperature, distance, and battery values submitted via the API.</li>
          <li><strong>Alert rules</strong> — threshold rules you define within the dashboard.</li>
          <li><strong>Incident records</strong> — timestamped logs of rule violations, created automatically.</li>
        </ul>
        <p>Sentio does not collect names, email addresses, location data, cookies, or any personally identifiable information.</p>
      </Section>

      <Section title="3. Data Storage">
        All sensor data, rules, and incidents are stored <strong>in-memory only</strong> on the Node.js server process.
        This data is not written to a database or disk. If the server restarts, all readings and incident history
        are cleared. No data is transmitted to any third-party service.
      </Section>

      <Section title="4. Data Retention">
        Data persists only for the lifetime of the server process. The in-memory store holds a maximum of
        500 readings per sensor (a ring buffer). Older readings are automatically discarded as new ones arrive.
        There is no long-term data retention.
      </Section>

      <Section title="5. Third-Party Services">
        <ul>
          <li><strong>Google Fonts</strong> — The dashboard loads Inter and JetBrains Mono typefaces from Google Fonts CDN.
          Google may log this request per their standard CDN privacy practices.</li>
          <li><strong>Shields.io</strong> — Used in the GitHub README for badge images only. Not loaded by the dashboard.</li>
        </ul>
        No analytics, tracking pixels, or advertising services are used.
      </Section>

      <Section title="6. Hardware Integration">
        When a physical Arduino or ESP32 device sends readings to the Sentio API, those readings contain only
        numeric sensor values. No device identifiers, serial numbers, or network addresses are stored by the
        application layer.
      </Section>

      <Section title="7. Your Rights">
        Because Sentio stores no persistent personal data and requires no account, there is nothing to access,
        correct, or delete. You can clear all in-memory data at any time by restarting the server process.
      </Section>

      <Section title="8. Changes to This Policy">
        This policy may be updated to reflect changes in the software. The effective date at the top of this
        page will reflect the most recent revision.
      </Section>

      <Section title="9. Contact">
        For questions about this policy, contact the developer directly:
        <ul>
          <li><strong>Ishan Vaidya</strong> &mdash; <a href="mailto:ishan.vaidya01@gmail.com">ishan.vaidya01@gmail.com</a></li>
          <li>GitHub: <a href="https://github.com/ishanvaidya01/Sentio" target="_blank" rel="noopener noreferrer">github.com/ishanvaidya01/Sentio</a></li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 10px' }}>{title}</h2>
      <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
