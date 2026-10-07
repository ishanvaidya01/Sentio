export default function Terms() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Terms of Use</h1>
      <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 40 }}>Effective date: October 2026</p>

      <Section title="1. Acceptance">
        By accessing or running Sentio, you agree to these terms. If you are deploying Sentio for a team or
        organisation, you accept these terms on their behalf.
      </Section>

      <Section title="2. What Sentio Is">
        Sentio is an open-source, in-memory robot telemetry dashboard. It is provided as-is for engineering,
        prototyping, and educational use. It is not a certified safety system, and it must not be used as
        the sole safety mechanism for any device operating near people or in regulated environments.
      </Section>

      <Section title="3. Permitted Use">
        <ul>
          <li>Running Sentio locally for hardware testing and development.</li>
          <li>Deploying Sentio on internal infrastructure for a robotics team.</li>
          <li>Modifying the source code for personal or commercial projects under the terms of the project licence.</li>
        </ul>
      </Section>

      <Section title="4. Prohibited Use">
        <ul>
          <li>Using Sentio as the only line of defence for hardware that could cause physical harm if mismanaged.</li>
          <li>Misrepresenting the origin or authorship of the software.</li>
          <li>Removing or replacing attribution in the source code in ways that violate the project licence.</li>
        </ul>
      </Section>

      <Section title="5. Disclaimer of Warranties">
        Sentio is provided <strong>"as is"</strong> without any warranties, express or implied, including but
        not limited to merchantability, fitness for a particular purpose, or accuracy of sensor data. Sensor
        readings are provided by external hardware or a simulation engine; Sentio does not verify their accuracy.
      </Section>

      <Section title="6. Limitation of Liability">
        The authors of Sentio shall not be liable for any direct, indirect, incidental, or consequential damages
        arising from the use of this software, including hardware damage, data loss, or personal injury. You
        assume full responsibility for how you interpret and act on the data displayed in the dashboard.
      </Section>

      <Section title="7. Open Source Licence">
        The Sentio source code is available on{' '}
        <a href="https://github.com/ishanvaidya01/Sentio" target="_blank" rel="noopener noreferrer">GitHub</a>.
        Use of the source code is governed by the licence file in that repository. These Terms of Use govern
        the running software (the deployed dashboard), not the source code licence itself.
      </Section>

      <Section title="8. Changes to These Terms">
        These terms may be revised to reflect changes in the software or applicable regulations. The effective
        date at the top will reflect the latest revision. Continued use of the software after a revision
        constitutes acceptance.
      </Section>

      <Section title="9. Contact">
        Questions or concerns about these terms can be directed to the developer:
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
