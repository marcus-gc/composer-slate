import { useState, useEffect } from 'react'
import { Descendant } from 'slate'
import { Composer, richText, layouts, images, blockMenu, blockStyling, richTextEmail, layoutsEmail, imagesEmail, ComposerTheme } from '../../src'
import * as Email from '../../src/components/Email'
import { render } from '@react-email/render'

function App() {
  const [value, setValue] = useState<Descendant[]>()
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [emailValue, setEmailValue] = useState<Descendant[]>()
  const [emailPluginsHtml, setEmailPluginsHtml] = useState<string>('');

  // Example theme - you can customize these values
  const theme: ComposerTheme = {
    primaryColor: '#0066cc',
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, -apple-system, sans-serif',
  };

  useEffect(() => {
    if (value && value.length > 0) {
      render(<Email.Letter elements={value} theme={theme} />).then(setEmailHtml);
    }
  }, [value])

  useEffect(() => {
    if (emailValue && emailValue.length > 0) {
      render(<Email.Letter elements={emailValue} theme={theme} />).then(setEmailPluginsHtml);
    }
  }, [emailValue])

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '10px' }}>Composer Slate</h1>
        <p style={{ marginBottom: '30px', color: '#777' }}>
          A headless rich text editor with block menus, built on Slate.js
        </p>

        {/* Email Plugins Demo */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '600' }}>Email Plugins Demo</h2>
          <p style={{ marginBottom: '20px', color: '#777' }}>
            Using richTextEmail, layoutsEmail, and imagesEmail plugins that render with @react-email/components
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 2fr))',
              gap: '20px',
              marginBottom: '20px',
            }}
          >

              {/* Email JSON Column */}
              <div style={{ gridColumn: 'span 1' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>JSON Output</h3>
                  <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
                      The email editor's data structure.
                  </p>
                  <div
                      style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '20px',
                          background: '#fafafa',
                          height: '400px',
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
                  {JSON.stringify(emailValue, null, 2)}
                </pre>
                  </div>
              </div>
            {/* Email Editor Column */}
            <div style={{ gridColumn: 'span 1' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Email Editor</h3>
              <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
                Editor using email-specific plugins with @react-email components
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
                  plugins={[richTextEmail, layoutsEmail, imagesEmail, blockMenu, blockStyling]}
                  theme={theme}
                  onChange={(newValue) => {
                    setEmailValue(newValue)
                    console.log('Email editor changed:', newValue)
                  }}
                >
                  <Composer.DefaultToolbar />
                  <Composer.BlockMenu />
                  <Composer.Content placeholder="Start typing with email plugins..." />
                </Composer.Root>
              </div>
            </div>

            {/* Email Preview Column */}
            <div style={{ gridColumn: 'span 1' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Email Preview</h3>
              <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
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
                  srcDoc={emailPluginsHtml}
                  style={{ width: '100%', height: '400px', border: 'none' }}
                  title="Email Plugins Preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Standard Plugins Demo */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '600' }}>Standard Plugins Demo</h2>
          <p style={{ marginBottom: '20px', color: '#777' }}>
            Using standard richText, layouts, images, and blockMenu plugins
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

            {/* JSON Column */}
            <div style={{ gridColumn: 'span 1' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>JSON Output</h3>
                <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
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

            {/* Editor Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Editor</h3>
            <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
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
                plugins={[richText, layouts, images, blockMenu, blockStyling]}
                theme={theme}
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

          {/* Email Preview Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Email Preview</h3>
            <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
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
    </div>
  )
}

export default App
