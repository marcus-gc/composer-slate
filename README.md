# Composer Slate

A WYSIWYG rich text editor library built on top of [Slate.js](https://www.slatejs.org/) with React and TypeScript.

## Features

- Full rich text editing capabilities
- Text formatting: **bold**, *italic*, <u>underline</u>, `code`
- Block types: headings (H1, H2), block quotes, lists (bulleted & numbered)
- Text alignment: left, center, right
- Keyboard shortcuts (Cmd/Ctrl + B, I, U, `)
- TypeScript support with comprehensive type definitions
- Built with React hooks

## Installation

```bash
npm install composer-slate
```

## Quick Start

```tsx
import { Editor } from 'composer-slate'
import { Descendant } from 'slate'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState<Descendant[]>()

  return (
    <Editor
      onChange={(newValue) => {
        setValue(newValue)
      }}
      placeholder="Start typing..."
    />
  )
}
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

## API

### Editor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | `Descendant[]` | Default rich text | Initial editor content |
| `onChange` | `(value: Descendant[]) => void` | - | Callback fired when content changes |
| `placeholder` | `string` | `"Enter some rich text..."` | Placeholder text |
| `className` | `string` | `""` | CSS class name for the editor container |

## Keyboard Shortcuts

- `Cmd/Ctrl + B` - Toggle bold
- `Cmd/Ctrl + I` - Toggle italic
- `Cmd/Ctrl + U` - Toggle underline
- `Cmd/Ctrl + `` ` `` - Toggle code

## Project Structure

```
composer-slate/
├── src/                    # Library source code
│   ├── components/
│   │   └── Editor.tsx     # Main editor component
│   ├── types.ts           # TypeScript type definitions
│   └── index.ts           # Public API exports
├── demo/                   # Demo application
│   ├── src/
│   │   ├── App.tsx        # Demo app
│   │   └── main.tsx       # Demo entry point
│   └── index.html
├── dist/                   # Built library (generated)
├── package.json
├── tsconfig.json          # Library TypeScript config
├── tsup.config.ts         # Build configuration
└── vite.config.ts         # Demo dev server config
```

## License

MIT
