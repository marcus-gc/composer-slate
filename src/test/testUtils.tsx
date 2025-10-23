import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { createEditor, Descendant, Editor as SlateEditor } from 'slate'
import { Slate, Editable, withReact, RenderLeafProps, RenderElementProps } from 'slate-react'
import { ThemeProvider } from '../context/ThemeContext'

/**
 * Default theme for testing
 */
const defaultTheme = {
  primaryColor: '#0066cc',
  backgroundColor: '#ffffff',
  textColor: '#000000',
}

interface EditorWrapperProps {
  children: React.ReactNode
  editor?: SlateEditor
  initialValue?: Descendant[]
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  theme?: typeof defaultTheme
}

/**
 * Wrapper component that provides Slate context for testing
 */
export const EditorWrapper: React.FC<EditorWrapperProps> = ({
  children,
  editor: providedEditor,
  initialValue = [{ type: 'paragraph', children: [{ text: '' }] }] as Descendant[],
  renderElement,
  renderLeaf,
  theme = defaultTheme,
}) => {
  const editor = providedEditor || withReact(createEditor())
  const [value, setValue] = React.useState<Descendant[]>(initialValue)

  return (
    <ThemeProvider theme={theme}>
      <Slate editor={editor} initialValue={value} onChange={setValue}>
        {children}
        {(renderElement || renderLeaf) && (
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        )}
      </Slate>
    </ThemeProvider>
  )
}

/**
 * Custom render function that wraps components with Slate context
 */
export const renderWithEditor = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    editor?: SlateEditor
    initialValue?: Descendant[]
    renderElement?: (props: RenderElementProps) => JSX.Element
    renderLeaf?: (props: RenderLeafProps) => JSX.Element
    theme?: typeof defaultTheme
  }
) => {
  const { editor, initialValue, renderElement, renderLeaf, theme, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <EditorWrapper
        editor={editor}
        initialValue={initialValue}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        theme={theme}
      >
        {children}
      </EditorWrapper>
    ),
    ...renderOptions,
  })
}

/**
 * Creates a mock Slate editor with React plugin
 */
export const createTestEditor = () => {
  return withReact(createEditor())
}

/**
 * Creates a basic paragraph node
 */
export const createParagraph = (text: string, properties?: Record<string, any>) => ({
  type: 'paragraph',
  children: [{ text }],
  ...properties,
})

/**
 * Creates a heading node
 */
export const createHeading = (level: 1 | 2 | 3, text: string, properties?: Record<string, any>) => ({
  type: `heading-${level === 1 ? 'one' : level === 2 ? 'two' : 'three'}`,
  children: [{ text }],
  ...properties,
})

/**
 * Creates a link node
 */
export const createLink = (text: string, url: string, properties?: Record<string, any>) => ({
  type: 'link',
  url,
  children: [{ text }],
  ...properties,
})

/**
 * Creates a list item node
 */
export const createListItem = (text: string, properties?: Record<string, any>) => ({
  type: 'list-item',
  children: [{ text }],
  ...properties,
})
