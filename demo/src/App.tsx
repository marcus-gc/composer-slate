import { useState, useEffect, useRef } from 'react'
import { Descendant, Transforms, Editor } from 'slate'
import { Composer, richText, layouts, images, blockMenu, blockStyling, richTextEmail, layoutsEmail, imagesEmail, ComposerTheme } from '../../src'
import { useComposer } from '../../src/context/ComposerContext'
import * as Email from '../../src/components/Email'
import { render } from '@react-email/render'

// Helper component to expose editor instance via ref
const EditorRef = ({ editorRef }: { editorRef: React.MutableRefObject<Editor | null> }) => {
  const { editor } = useComposer()
  editorRef.current = editor
  return null
}

function App() {
  const [value, setValue] = useState<Descendant[]>()
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [emailValue, setEmailValue] = useState<Descendant[]>()
  const [emailPluginsHtml, setEmailPluginsHtml] = useState<string>('');

  // JSON editing state
  const [emailJsonText, setEmailJsonText] = useState<string>('');
  const [standardJsonText, setStandardJsonText] = useState<string>('');
  const [emailJsonError, setEmailJsonError] = useState<string>('');
  const [standardJsonError, setStandardJsonError] = useState<string>('');

  // Editor refs to access editor instances
  const emailEditorRef = useRef<Editor | null>(null);
  const standardEditorRef = useRef<Editor | null>(null);

  // Example theme - you can customize these values
  const theme: ComposerTheme = {
    primaryColor: '#0066cc',
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, -apple-system, sans-serif',
  };

  // Sync editor changes to JSON text
  useEffect(() => {
    if (value && value.length > 0) {
      render(<Email.Letter elements={value} theme={theme} />).then(setEmailHtml);
      setStandardJsonText(JSON.stringify(value, null, 2));
    }
  }, [value])

  useEffect(() => {
    if (emailValue && emailValue.length > 0) {
      render(<Email.Letter elements={emailValue} theme={theme} />).then(setEmailPluginsHtml);
      setEmailJsonText(JSON.stringify(emailValue, null, 2));
    }
  }, [emailValue])

  // Handle JSON blur with validation - uses Transforms to update editor
  const handleEmailJsonBlur = () => {
    try {
      const parsed = JSON.parse(emailJsonText) as Descendant[];

      // Use Transforms to replace editor contents
      if (emailEditorRef.current) {
        const editor = emailEditorRef.current;

        // Remove all existing content
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });

        // Remove the empty paragraph that remains
        Transforms.removeNodes(editor, {
          at: [0],
        });

        // Insert new content
        Transforms.insertNodes(editor, parsed, { at: [0] });

        setEmailValue(parsed);
      }

      setEmailJsonError('');
    } catch (error) {
      setEmailJsonError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  };

  const handleStandardJsonBlur = () => {
    try {
      const parsed = JSON.parse(standardJsonText) as Descendant[];

      // Use Transforms to replace editor contents
      if (standardEditorRef.current) {
        const editor = standardEditorRef.current;

        // Remove all existing content
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });

        // Remove the empty paragraph that remains
        Transforms.removeNodes(editor, {
          at: [0],
        });

        // Insert new content
        Transforms.insertNodes(editor, parsed, { at: [0] });

        setValue(parsed);
      }

      setStandardJsonError('');
    } catch (error) {
      setStandardJsonError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  };

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
                      The email editor's data structure. Edit and blur to update the editor.
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
                <textarea
                    value={emailJsonText}
                    onChange={(e) => setEmailJsonText(e.target.value)}
                    onBlur={handleEmailJsonBlur}
                    style={{
                        width: '100%',
                        height: '100%',
                        background: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        margin: 0,
                        border: emailJsonError ? '2px solid #ef4444' : '1px solid #e0e0e0',
                        fontFamily: 'monospace',
                        resize: 'none',
                    }}
                />
                {emailJsonError && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                    Error: {emailJsonError}
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
                  <EditorRef editorRef={emailEditorRef} />
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
                    The editor's data structure. Edit and blur to update the editor.
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
              <textarea
                  value={standardJsonText}
                  onChange={(e) => setStandardJsonText(e.target.value)}
                  onBlur={handleStandardJsonBlur}
                  style={{
                      width: '100%',
                      height: '100%',
                      background: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      margin: 0,
                      border: standardJsonError ? '2px solid #ef4444' : '1px solid #e0e0e0',
                      fontFamily: 'monospace',
                      resize: 'none',
                  }}
              />
              {standardJsonError && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                  Error: {standardJsonError}
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
                <EditorRef editorRef={standardEditorRef} />
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
