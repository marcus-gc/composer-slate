import { useState, useEffect, useRef } from 'react'
import { Descendant, Transforms, Editor } from 'slate'
import { Composer, richText, layouts, images, blockMenu, blockStyling, ComposerTheme } from '../../../src'
import { useComposer } from '../../../src/context/ComposerContext'
import { render } from '@react-email/render'
import * as Email from '../../../src/components/Email'

// Helper component to expose editor instance via ref
const EditorRef = ({ editorRef }: { editorRef: React.MutableRefObject<Editor | null> }) => {
  const { editor } = useComposer()
  editorRef.current = editor
  return null
}

interface StandardPluginsDemoProps {
  theme: ComposerTheme
}

export const StandardPluginsDemo = ({ theme }: StandardPluginsDemoProps) => {
  const [value, setValue] = useState<Descendant[]>()
  const [emailHtml, setEmailHtml] = useState<string>('')
  const [jsonText, setJsonText] = useState<string>('')
  const [jsonError, setJsonError] = useState<string>('')
  const editorRef = useRef<Editor | null>(null)

  // Sync editor changes to JSON text and email preview
  useEffect(() => {
    if (value && value.length > 0) {
      render(<Email.Letter elements={value} theme={theme} />).then(setEmailHtml)
      setJsonText(JSON.stringify(value, null, 2))
    }
  }, [value, theme])

  // Handle JSON blur with validation - uses Transforms to update editor
  const handleJsonBlur = () => {
    try {
      const parsed = JSON.parse(jsonText) as Descendant[]

      // Use Transforms to replace editor contents
      if (editorRef.current) {
        const editor = editorRef.current

        // Remove all existing content
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        })

        // Remove the empty paragraph that remains
        Transforms.removeNodes(editor, {
          at: [0],
        })

        // Insert new content
        Transforms.insertNodes(editor, parsed, { at: [0] })

        setValue(parsed)
      }

      setJsonError('')
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON')
    }
  }

  return (
    <section id="standard-plugins" style={{ marginBottom: '80px', scrollMarginTop: '20px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '600' }}>Standard Plugins Demo</h2>
      <p style={{ marginBottom: '30px', color: '#777', fontSize: '15px' }}>
        Using standard richText, layouts, images, and blockMenu plugins
      </p>

      {/* 3-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 2fr))',
          gap: '20px',
        }}
      >
        {/* JSON Column */}
        <div style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>JSON Output</h3>
          <p style={{ marginBottom: '15px', color: '#777', fontSize: '14px' }}>
            The editor's data structure. Edit and blur to update the editor.
          </p>
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              background: '#fafafa',
              minHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              onBlur={handleJsonBlur}
              style={{
                width: '100%',
                height: '75vh',
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '4px',
                fontSize: '12px',
                margin: 0,
                border: jsonError ? '2px solid #ef4444' : '1px solid #e0e0e0',
                fontFamily: 'monospace',
                resize: 'none',
              }}
            />
            {jsonError && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                Error: {jsonError}
              </div>
            )}
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
              background: 'white',
              minHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <Composer.Root
              plugins={[richText, layouts, images, blockMenu, blockStyling]}
              theme={theme}
              onChange={(newValue) => {
                setValue(newValue)
                console.log('Standard editor changed:', newValue)
              }}
            >
              <EditorRef editorRef={editorRef} />
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
              minHeight: '80vh',
            }}
          >
            <iframe
              srcDoc={emailHtml}
              style={{ width: '100%', height: '100%', minHeight: '80vh', border: 'none' }}
              title="Standard Plugins Email Preview"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
