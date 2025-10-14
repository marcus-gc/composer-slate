import { useState, useEffect } from 'react'
import { Descendant } from 'slate'
import { Composer, richText, layouts, images, blockMenu } from '../../src'
import { Email } from '../../src/components/Email/email'
import { render } from '@react-email/render'

function App() {
  const [value, setValue] = useState<Descendant[]>()
  const [emailHtml, setEmailHtml] = useState<string>('');

  useEffect(() => {
    if (value && value.length > 0) {
      render(<Email elements={value} />).then(setEmailHtml);
    }
  }, [value])

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '10px' }}>Composer Slate</h1>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          A headless rich text editor with block menus, built on Slate.js
        </p>

        {/* 3-column layout for wider screens */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 2fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {/* Editor Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Editor</h2>
            <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
              Hover over blocks to see the menu. Use the toolbar for formatting and layouts.
            </p>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                background: '#fafafa',
              }}
            >
              <Composer.Root
                plugins={[richText, layouts, images, blockMenu]}
                onChange={(newValue) => {
                  setValue(newValue)
                  console.log('Editor changed:', newValue)
                }}
              >
                <Composer.DefaultToolbar />
                <Composer.BlockMenu />
                <Composer.Content placeholder="Start typing..." />
              </Composer.Root>
            </div>
          </div>

          {/* JSON Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>JSON Output</h2>
            <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
              The editor's data structure.
            </p>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                background: '#fafafa',
                height: '500px',
                overflow: 'auto',
              }}
            >
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  margin: 0,
                }}
              >
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          </div>

          {/* Email Preview Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Email Preview</h2>
            <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
              Rendered HTML email output.
            </p>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'white',
              }}
            >
              <iframe
                srcDoc={emailHtml}
                style={{ width: '100%', height: '500px', border: 'none' }}
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
