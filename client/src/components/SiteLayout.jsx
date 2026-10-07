import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',       label: 'Dashboard' },
  { to: '/about',  label: 'About'     },
];

export default function SiteLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      {/* ── Top nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(156,163,175,0.25)',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 32px', height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#111827"/>
              <polyline points="3,18 8,18 10,11 14,23 17,8 20,22 24,18 29,18"
                stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827', letterSpacing: '-0.02em' }}>Sentio</span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: '5px 12px',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#111827' : '#6b7280',
                    textDecoration: 'none',
                    borderRadius: 6,
                    background: active ? '#f3f4f6' : 'transparent',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <a
              href="https://github.com/ishanvaidya01/Sentio"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 8,
                padding: '5px 12px',
                fontSize: 13,
                fontWeight: 400,
                color: '#6b7280',
                textDecoration: 'none',
                borderRadius: 6,
                border: '1px solid rgba(156,163,175,0.4)',
                background: '#fff',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(156,163,175,0.25)',
        background: '#fff',
        padding: '20px 32px',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 8,
          fontSize: 12, color: '#9ca3af',
        }}>
          <span>Sentio &mdash; Robot Telemetry Dashboard</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms',   label: 'Terms of Use'   },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderBottomColor = '#374151'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
