import { ComposerTheme } from '../../src'
import { StandardPluginsDemo } from './components/StandardPluginsDemo'
import { EmailPluginsDemo } from './components/EmailPluginsDemo'
import { QuillIcon } from './components/QuillIcon'

function App() {
  // Example theme - you can customize these values
  const theme: ComposerTheme = {
    primaryColor: '#0066cc',
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, -apple-system, sans-serif',
  };

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '240px',
          height: '80vh',
          background: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
          padding: '40px 20px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <QuillIcon size={28} color="#0066cc" />
          <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Composer Slate</h1>
        </div>
        <p style={{ fontSize: '13px', color: '#777', marginBottom: '32px', lineHeight: '1.5' }}>
          A headless rich text editor with block menus, built on Slate.js
        </p>

        <nav>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '12px' }}>
              <a
                href="#standard-plugins"
                style={{
                  color: '#0066cc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'block',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e6f2ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Standard Plugins
              </a>
            </li>
            <li>
              <a
                href="#email-plugins"
                style={{
                  color: '#0066cc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'block',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e6f2ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Email Plugins
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', maxWidth: 'calc(100% - 240px)' }}>
        <StandardPluginsDemo theme={theme} />
        <EmailPluginsDemo theme={theme} />
      </main>
    </div>
  )
}

export default App
