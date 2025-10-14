import { useState, useEffect } from 'react'
import { Descendant } from 'slate'
import { Composer, useComposer, richText, layouts, images, blockMenu } from '../../src'
import {Email} from '../../src/components/Email/email'
import { render } from '@react-email/render';

// Advanced example: Custom toolbar using hooks
function CustomToolbar() {
  const { toggleMark, toggleBlock, isMarkActive, isBlockActive, insertBlock, insertText, insertLayout, insertImage } = useComposer()

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: '2px solid',
    borderColor: isActive ? '#4CAF50' : '#ddd',
    borderRadius: '6px',
    background: isActive ? '#E8F5E9' : 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s',
  })

  const actionButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '2px solid #2196F3',
    borderRadius: '6px',
    background: '#E3F2FD',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  }

  return (
    <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {/* Formatting buttons */}
      <button
        style={buttonStyle(isMarkActive('bold'))}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark('bold')
        }}
      >
        Bold
      </button>
      <button
        style={buttonStyle(isMarkActive('italic'))}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark('italic')
        }}
      >
        Italic
      </button>
      <button
        style={buttonStyle(isBlockActive('heading-one'))}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleBlock('heading-one')
        }}
      >
        Heading 1
      </button>

      {/* Separator */}
      <div style={{ width: '1px', background: '#ddd', margin: '0 4px' }} />

      {/* Insertion buttons */}
      <button
        style={actionButtonStyle}
        onMouseDown={(e) => {
          e.preventDefault()
          insertText('Hello World! ')
        }}
        title="Insert text"
      >
        Insert Text
      </button>
      <button
        style={actionButtonStyle}
        onMouseDown={(e) => {
          e.preventDefault()
          insertBlock({
            type: 'block-quote',
            children: [{ text: 'This is an inserted quote block!' }],
          })
        }}
        title="Insert quote block"
      >
        Insert Quote
      </button>
      <button
        style={actionButtonStyle}
        onMouseDown={(e) => {
          e.preventDefault()
          insertBlock({
            type: 'paragraph',
            children: [{ text: '' }],
          })
        }}
        title="Insert paragraph"
      >
        New Paragraph
      </button>
      <button
        style={actionButtonStyle}
        onMouseDown={(e) => {
          e.preventDefault()
          insertLayout(2)
        }}
        title="Insert 2-column layout"
      >
        2 Columns
      </button>
      <button
        style={actionButtonStyle}
        onMouseDown={(e) => {
          e.preventDefault()
          insertLayout(3)
        }}
        title="Insert 3-column layout"
      >
        3 Columns
      </button>
      <button
        style={actionButtonStyle}
        onMouseDown={(e) => {
          e.preventDefault()
          const url = prompt('Enter image URL:')
          if (url) {
            insertImage(url)
          }
        }}
        title="Insert image"
      >
        Insert Image
      </button>
    </div>
  )
}

function App() {
  const [simpleValue, setSimpleValue] = useState<Descendant[]>()
  const [advancedValue, setAdvancedValue] = useState<Descendant[]>()
  const [emailHtml, setEmailHtml] = useState<string>('');

    useEffect(() => {
        if (simpleValue && simpleValue.length > 0) {
            render(<Email elements={simpleValue} />).then(setEmailHtml);
        }
    }, [simpleValue, setEmailHtml])

  return (
      <div style={{maxWidth: '1000px', margin: '0 auto', padding: '40px 20px'}}>
          <h1 style={{marginBottom: '10px'}}>Composer Slate - Headless UI Library</h1>
          <p style={{marginBottom: '30px', color: '#666'}}>
              A flexible, headless rich text editor built with Slate.js
          </p>

          {/* Simple Example - with Block Menu */}
          <section style={{marginBottom: '60px'}}>
              <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Simple Usage (Pre-built Toolbar + Block Menu)</h2>
              <p style={{marginBottom: '15px', color: '#666', fontSize: '14px'}}>
                  Hover over any block to see the block menu handle. Click it to convert, duplicate, or delete blocks.
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
                          setSimpleValue(newValue)
                          console.log('Simple editor changed:', newValue)
                      }}
                  >
                      <Composer.DefaultToolbar/>
                      <Composer.BlockMenu/>
                      <Composer.Content placeholder=""/>
                  </Composer.Root>
              </div>
          </section>

          {/* Advanced Example - with custom toolbar and block menu */}
          <section style={{marginBottom: '60px'}}>
              <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Advanced Usage (Custom Toolbar + Block Menu)</h2>
              <p style={{marginBottom: '15px', color: '#666', fontSize: '14px'}}>
                  This example shows the block menu working alongside a custom toolbar.
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
                          setAdvancedValue(newValue)
                          console.log('Advanced editor changed:', newValue)
                      }}
                  >
                      <CustomToolbar/>
                      <Composer.BlockMenu/>
                      <Composer.Content
                          placeholder=""
                          style={{
                              minHeight: '150px',
                              padding: '16px',
                              border: '2px solid #4CAF50',
                              borderRadius: '8px',
                              fontSize: '16px',
                              lineHeight: '1.6',
                              background: 'white',
                          }}
                      />
                  </Composer.Root>
              </div>
          </section>

              <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Email Preview</h2>
                  <div className="border rounded-md overflow-hidden">
                      <iframe
                          srcDoc={emailHtml}
                          style={{ width: '100%' , height: '400px', border: '1px solid gray' }}
                          title="Email Preview"
                      />
                  </div>
              </div>

          {/* Debug Output */}
          <details style={{marginTop: '30px'}}>
              <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>
                  Simple Editor Value (JSON)
              </summary>
              <pre
                  style={{
                      background: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '12px',
                  }}
              >
          {JSON.stringify(simpleValue, null, 2)}
        </pre>
          </details>

          <details style={{marginTop: '20px'}}>
              <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>
                  Advanced Editor Value (JSON)
              </summary>
              <pre
                  style={{
                      background: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '12px',
                  }}
              >
          {JSON.stringify(advancedValue, null, 2)}
        </pre>
          </details>

          <details style={{marginTop: '20px'}}>
              <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>
                  Email
              </summary>
              <pre
                  style={{
                      background: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '12px',
                  }}
              >
          {JSON.stringify(emailHtml, null, 2)}
        </pre>
          </details>
      </div>
  )
}

export default App
