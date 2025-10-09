import { useState } from 'react'
import { Descendant } from 'slate'
import { Editor, richText } from '../../src'

function App() {
  const [value, setValue] = useState<Descendant[]>()

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '10px' }}>Composer Slate Editor</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        A rich text WYSIWYG editor built with Slate.js
      </p>

      <Editor
        plugins={[richText]}
        onChange={(newValue) => {
          setValue(newValue)
          console.log('Editor value changed:', newValue)
        }}
      />

      <details style={{ marginTop: '30px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Editor Value (JSON)
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
          {JSON.stringify(value, null, 2)}
        </pre>
      </details>
    </div>
  )
}

export default App
