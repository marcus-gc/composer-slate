import { useState } from 'react'
import { Descendant } from 'slate'
import { Composer, useComposer, richText, layouts, images } from '../../src'

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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '10px' }}>Composer Slate - Headless UI Library</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        A flexible, headless rich text editor built with Slate.js
      </p>

      {/* Simple Example - Option 6 style */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Simple Usage (Pre-built Toolbar)</h2>
        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            background: '#fafafa',
          }}
        >
          <Composer.Root
            plugins={[richText, layouts, images]}
            onChange={(newValue) => {
              setSimpleValue(newValue)
              console.log('Simple editor changed:', newValue)
            }}
          >
            <Composer.DefaultToolbar />
            <Composer.Content plugins={[richText, layouts, images]} />
          </Composer.Root>
        </div>
      </section>

      {/* Advanced Example - Option 2 style with custom toolbar */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Advanced Usage (Custom Toolbar with Hooks)</h2>
        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            background: '#fafafa',
          }}
        >
          <Composer.Root
            plugins={[richText, layouts, images]}
            onChange={(newValue) => {
              setAdvancedValue(newValue)
              console.log('Advanced editor changed:', newValue)
            }}
          >
            <Composer.Toolbar>
              <CustomToolbar />
            </Composer.Toolbar>
            <Composer.Content
              plugins={[richText, layouts, images]}
              placeholder="Type something amazing..."
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

      {/* Debug Output */}
      <details style={{ marginTop: '30px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
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

      <details style={{ marginTop: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
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
    </div>
  )
}

export default App
