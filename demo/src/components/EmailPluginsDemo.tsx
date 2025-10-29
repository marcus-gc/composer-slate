import { useState, useEffect, useRef } from 'react'
import { Descendant, Transforms, Editor } from 'slate'
import { Composer, richTextEmail, layoutsEmail, imagesEmail, blockMenu, blockStyling,  dragAndDrop, ComposerTheme } from '../../../src'
import { useComposer } from '../../../src/context/ComposerContext'
import { render } from '@react-email/render'
import * as Email from '../../../src/components/Email'

// Helper component to expose editor instance via ref
const EditorRef = ({ editorRef }: { editorRef: React.MutableRefObject<Editor | null> }) => {
  const { editor } = useComposer()
  editorRef.current = editor
  return null
}

interface EmailPluginsDemoProps {
  theme: ComposerTheme
}

export const EmailPluginsDemo = ({ theme }: EmailPluginsDemoProps) => {
  const [emailValue, setEmailValue] = useState<Descendant[]>()
  const [emailPluginsHtml, setEmailPluginsHtml] = useState<string>('')
  const [jsonText, setJsonText] = useState<string>('')
  const [jsonError, setJsonError] = useState<string>('')
  const editorRef = useRef<Editor | null>(null)

  // Sync editor changes to JSON text and email preview
  useEffect(() => {
    if (emailValue && emailValue.length > 0) {
      render(<Email.Letter elements={emailValue} theme={theme} />).then(setEmailPluginsHtml)
      setJsonText(JSON.stringify(emailValue, null, 2))
    }
  }, [emailValue, theme])

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

        setEmailValue(parsed)
      }

      setJsonError('')
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON')
    }
  }

  return (
    <section id="email-plugins" style={{ marginBottom: '80px', scrollMarginTop: '20px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '600' }}>Email Plugins Demo</h2>
      <p style={{ marginBottom: '30px', color: '#777', fontSize: '15px' }}>
        Using richTextEmail, layoutsEmail, and imagesEmail plugins that render with @react-email/components
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
            The email editor's data structure. Edit and blur to update the editor.
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
              background: 'white',
              minHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <Composer.Root
              plugins={[richTextEmail, layoutsEmail, imagesEmail, dragAndDrop, blockMenu, blockStyling]}
              theme={theme}
              onChange={(newValue) => {
                setEmailValue(newValue)
                console.log('Email editor changed:', newValue)
              }}
            >
              <EditorRef editorRef={editorRef} />
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
              minHeight: '80vh',
            }}
          >
            <iframe
              srcDoc={emailPluginsHtml}
              style={{ width: '100%', height: '100%', minHeight: '80vh', border: 'none' }}
              title="Email Plugins Preview"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
