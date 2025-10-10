# Composer Slate

A headless rich text editor library built on top of [Slate.js](https://www.slatejs.org/) with React and TypeScript.

## Features

- **Headless Architecture**: Complete control over UI/UX with compound components
- **Plugin System**: Modular architecture with colocated elements, leaves, and utilities
- **Rich Text Editing**: Bold, italic, underline, strikethrough, code marks
- **Block Elements**: Headings (H1-H3), paragraphs, block quotes, lists (bulleted & numbered)
- **Inline Elements**: Links with partial unlinking support
- **Void Elements**: Images
- **Layout System**: Multi-column layouts (2-column, 3-column, etc.)
- **Text Styling**: Line height, font selection, text indentation
- **Hooks-based API**: `useComposer()` hook for accessing editor functionality
- **TypeScript Support**: Full type safety with comprehensive type definitions

## Installation

```bash
npm install composer-slate
```

## Quick Start

### Simple Usage (Pre-built Toolbar)

```tsx
import { Composer, richText, layouts, images } from 'composer-slate'
import { Descendant } from 'slate'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState<Descendant[]>()

  return (
    <Composer.Root
      plugins={[richText, layouts, images]}
      onChange={(newValue) => setValue(newValue)}
    >
      <Composer.DefaultToolbar />
      <Composer.Content plugins={[richText, layouts, images]} />
    </Composer.Root>
  )
}
```

### Advanced Usage (Custom Toolbar with Hooks)

```tsx
import { Composer, useComposer, richText, layouts, images } from 'composer-slate'

function CustomToolbar() {
  const {
    toggleMark,
    toggleBlock,
    isMarkActive,
    isBlockActive,
    insertLayout,
    insertImage
  } = useComposer()

  return (
    <div>
      <button onClick={() => toggleMark('bold')}>
        Bold
      </button>
      <button onClick={() => toggleBlock('heading-one')}>
        H1
      </button>
      <button onClick={() => insertLayout(2)}>
        2 Columns
      </button>
      <button onClick={() => insertImage('https://example.com/image.jpg')}>
        Insert Image
      </button>
    </div>
  )
}

function App() {
  return (
    <Composer.Root plugins={[richText, layouts, images]}>
      <Composer.Toolbar>
        <CustomToolbar />
      </Composer.Toolbar>
      <Composer.Content
        plugins={[richText, layouts, images]}
        placeholder="Type something amazing..."
      />
    </Composer.Root>
  )
}
```

## Available Plugins

### `richText` Plugin

Provides text formatting, block types, and inline elements:

- **Marks**: `bold`, `italic`, `underline`, `strikethrough`, `code`
- **Blocks**: `paragraph`, `heading-one`, `heading-two`, `heading-three`, `block-quote`, `bulleted-list`, `numbered-list`, `list-item`
- **Inline Elements**: `link`
- **Utilities**:
  - `toggleMark(mark)` - Toggle text formatting
  - `toggleBlock(blockType)` - Toggle block type
  - `setLineHeight(lineHeight)` - Set line height
  - `setFont(font)` - Set font family
  - `increaseIndent()` / `decreaseIndent()` - Adjust indentation
  - `insertLink(url)` - Insert/wrap link
  - `removeLink()` - Remove link (supports partial unlinking)
  - `isLinkActive()` - Check if selection is in a link

### `layouts` Plugin

Provides multi-column layout support:

- **Elements**: `layout-container`, `layout-column`
- **Utilities**:
  - `insertLayout(columns)` - Insert N-column layout

### `images` Plugin

Provides image support with void elements:

- **Elements**: `image`
- **Utilities**:
  - `insertImage(url, alt?)` - Insert image (automatically adds cursor on next line)

## API

### Composer Components

#### `Composer.Root`

Main wrapper component that provides editor context.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `plugins` | `Plugin[]` | `[]` | Array of plugins to enable |
| `initialValue` | `Descendant[]` | Default paragraph | Initial editor content |
| `onChange` | `(value: Descendant[]) => void` | - | Callback fired when content changes |

#### `Composer.DefaultToolbar`

Pre-built toolbar with common formatting options.

#### `Composer.Toolbar`

Wrapper for custom toolbar content.

#### `Composer.Content`

The editable content area.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `plugins` | `Plugin[]` | `[]` | Array of plugins (should match Root) |
| `placeholder` | `string` | `""` | Placeholder text |
| `style` | `React.CSSProperties` | - | Custom styles for editor |
| `className` | `string` | - | CSS class name |

### `useComposer()` Hook

Access editor functionality from within the Composer context.

**Core Methods:**
- `toggleMark(mark: string)` - Toggle text formatting
- `toggleBlock(blockType: string)` - Toggle block type
- `isMarkActive(mark: string)` - Check if mark is active
- `isBlockActive(blockType: string)` - Check if block is active
- `insertBlock(block: CustomElement)` - Insert a block element
- `insertText(text: string)` - Insert text at cursor

**Plugin Utilities:**

Utilities from plugins are automatically merged into the hook return value. See plugin documentation above for available utilities.

## Plugin System

Plugins are objects with the following structure:

```typescript
interface Plugin {
  // Element renderers with metadata
  elements?: Record<string, {
    component: React.ComponentType<RenderElementProps>
    inline?: boolean  // Mark as inline element
    void?: boolean    // Mark as void element
  }>

  // Leaf renderers
  leaves?: Record<string, React.ComponentType<RenderLeafProps>>

  // Utility functions (curried with editor)
  utils?: Record<string, (editor: Editor) => (...args: any[]) => any>
}
```

### Creating Custom Plugins

```typescript
import { Plugin } from 'composer-slate'
import { RenderElementProps } from 'slate-react'
import { Editor as SlateEditor, Transforms } from 'slate'

const myPlugin: Plugin = {
  elements: {
    'my-element': {
      component: ({ attributes, children, element }) => (
        <div {...attributes} className="my-element">
          {children}
        </div>
      ),
      // Optional: mark as inline or void
      // inline: true,
      // void: true,
    }
  },

  utils: {
    insertMyElement: (editor: SlateEditor) => () => {
      const element = {
        type: 'my-element',
        children: [{ text: '' }],
      }
      Transforms.insertNodes(editor, element)
    }
  }
}

// Use in your app
<Composer.Root plugins={[richText, myPlugin]}>
  {/* ... */}
</Composer.Root>
```

## Development

### Install Dependencies

```bash
npm install
```

### Run Demo

Start the development server with the demo app:

```bash
npm run dev
```

The demo will be available at `http://localhost:5173`

### Build Library

Build the library for production:

```bash
npm run build
```

This will generate the distribution files in the `dist` directory.

### Type Check

Run TypeScript type checking:

```bash
npm run typecheck
```

## Project Structure

```
composer-slate/
├── src/                      # Library source code
│   ├── components/
│   │   ├── Composer/        # Main composer components
│   │   │   ├── Root.tsx     # Root component with context
│   │   │   ├── Toolbar.tsx  # Toolbar components
│   │   │   └── Content.tsx  # Editable content area
│   │   ├── Element/         # Element renderer
│   │   └── Leaf/            # Leaf renderer
│   ├── plugins/             # Plugin implementations
│   │   ├── richText/        # Rich text plugin
│   │   ├── layouts/         # Layouts plugin
│   │   └── images/          # Images plugin
│   ├── context/             # React context
│   ├── types.ts             # TypeScript type definitions
│   └── index.ts             # Public API exports
├── demo/                     # Demo application
│   ├── src/
│   │   ├── App.tsx          # Demo app
│   │   └── main.tsx         # Demo entry point
│   └── index.html
├── dist/                     # Built library (generated)
├── package.json
├── tsconfig.json            # Library TypeScript config
├── tsup.config.ts           # Build configuration
└── vite.config.ts           # Demo dev server config
```

## License

MIT
