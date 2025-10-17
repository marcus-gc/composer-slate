# Plugin Index Export Patterns - Options & Analysis

## Current Problems

1. **`export * from './utils'`** - Unclear what functions are being exported
2. **Mixed patterns** - blockMenu exports a `Plugin` object, others don't
3. **No self-documentation** - Can't tell plugin shape without reading multiple files
4. **Inconsistent** - richText has `leaves`, others don't

---

## Option 1: Explicit Named Exports (RECOMMENDED)

**Best for:** Clarity, discoverability, and teaching developers the plugin structure

### richText Example:
```typescript
/**
 * Rich text formatting plugin
 *
 * Provides text formatting (bold, italic, underline, etc.), block types
 * (headings, paragraphs, lists, quotes), and inline elements (links).
 */

// Element components
export { elements } from './elements'

// Leaf (text format) components
export { leaves } from './leaves'

// Editor utilities
export {
  // Styling
  setLineHeight,
  getLineHeight,
  setFont,
  getFont,

  // Indentation
  increaseIndent,
  decreaseIndent,

  // Links
  insertLink,
  removeLink,
  isLinkActive,
} from './utils'

// Re-export as namespace for plugin registration
import { elements } from './elements'
import { leaves } from './leaves'
import * as utilFunctions from './utils'

export const richText = {
  elements,
  leaves,
  utils: {
    setLineHeight: utilFunctions.setLineHeight,
    getLineHeight: utilFunctions.getLineHeight,
    setFont: utilFunctions.setFont,
    getFont: utilFunctions.getFont,
    increaseIndent: utilFunctions.increaseIndent,
    decreaseIndent: utilFunctions.decreaseIndent,
    insertLink: utilFunctions.insertLink,
    removeLink: utilFunctions.removeLink,
    isLinkActive: utilFunctions.isLinkActive,
  },
}
```

### layouts Example:
```typescript
/**
 * Layout plugin
 *
 * Provides multi-column layout containers for organizing content.
 */

// Element components
export { elements } from './elements'

// Editor utilities
export {
  insertLayout,
} from './utils'

// Re-export as namespace for plugin registration
import { elements } from './elements'
import * as utilFunctions from './utils'

export const layouts = {
  elements,
  utils: {
    insertLayout: utilFunctions.insertLayout,
  },
}
```

### images Example:
```typescript
/**
 * Image plugin
 *
 * Provides image embedding with URL and alt text support.
 */

// Element components
export { elements } from './elements'

// Editor utilities
export {
  insertImage,
} from './utils'

// Re-export as namespace for plugin registration
import { elements } from './elements'
import * as utilFunctions from './utils'

export const images = {
  elements,
  utils: {
    insertImage: utilFunctions.insertImage,
  },
}
```

### blockMenu Example:
```typescript
/**
 * Block menu plugin
 *
 * Provides block manipulation menu (convert, duplicate, delete).
 * Includes a context provider for menu state management.
 */

import { Plugin } from '../../components/Composer/Root'
import { BlockMenuProvider } from '../../context/BlockMenuContext'

// Editor utilities
export {
  convertBlock,
  duplicateBlock,
  deleteBlock,
} from './utils'

// Re-export as Plugin object for registration
import * as utilFunctions from './utils'

export const blockMenu: Plugin = {
  provider: BlockMenuProvider,
  utils: {
    convertBlock: utilFunctions.convertBlock,
    duplicateBlock: utilFunctions.duplicateBlock,
    deleteBlock: utilFunctions.deleteBlock,
  },
}
```

**✅ Pros:**
- **Crystal clear** what each plugin exports
- **Self-documenting** - can see all exports at a glance
- **Great for learning** - developers can copy this pattern easily
- **Good for tree-shaking** - bundlers know exactly what's exported
- **IDE-friendly** - autocomplete shows all available functions
- **Searchable** - easy to find where functions are defined

**❌ Cons:**
- More verbose (but that's the point!)
- Need to maintain export list when adding utils

**Usage:**
```typescript
// Import the plugin
import { richText } from '@givecampus/composer'

// Use in Composer
<Composer.Root plugins={[richText]} />

// Import specific utilities
import { insertLink, setLineHeight } from '@givecampus/composer/richText'
```

---

## Option 2: Namespace Exports Only

**Best for:** Minimalism, when you want to force namespace usage

### richText Example:
```typescript
/**
 * Rich text formatting plugin
 */

import { elements } from './elements'
import { leaves } from './leaves'
import * as utils from './utils'

// Single default export
export const richText = {
  elements,
  leaves,
  utils,
}

// Also export types/interfaces if needed
export type * from './utils'
```

**✅ Pros:**
- **Simplest** - minimal code
- **Forces namespacing** - `richText.utils.insertLink()`
- **One clear export** - the plugin object

**❌ Cons:**
- **Hidden exports** - can't see what utils are available
- **Worse tree-shaking** - bundles might include unused code
- **Less discoverable** - need to read source to know what's available
- **Forced namespacing** - can't do `import { insertLink } from 'richText'`

**Usage:**
```typescript
import { richText } from '@givecampus/composer'

// Always use namespace
const { insertLink } = useComposer()
insertLink('https://...')

// Or
richText.utils.insertLink // For docs/reference
```

---

## Option 3: Hybrid (Best of Both)

**Best for:** Maximum flexibility while maintaining clarity

### richText Example:
```typescript
/**
 * Rich text formatting plugin
 *
 * @example
 * ```typescript
 * import { richText, insertLink, setLineHeight } from '@givecampus/composer/richText'
 *
 * // Use in Composer
 * <Composer.Root plugins={[richText]} />
 *
 * // Or use utilities directly
 * const editor = useSlateEditor()
 * insertLink(editor)('https://...')
 * ```
 */

// ============================================
// PLUGIN REGISTRATION
// ============================================

import { elements } from './elements'
import { leaves } from './leaves'
import * as utilFunctions from './utils'

/**
 * Rich text plugin for Composer
 *
 * Provides:
 * - Elements: paragraph, headings (h1-h3), block quote, lists, links
 * - Leaves: bold, italic, underline, strikethrough
 * - Utils: styling, indentation, link management
 */
export const richText = {
  elements,
  leaves,
  utils: {
    setLineHeight: utilFunctions.setLineHeight,
    getLineHeight: utilFunctions.getLineHeight,
    setFont: utilFunctions.setFont,
    getFont: utilFunctions.getFont,
    increaseIndent: utilFunctions.increaseIndent,
    decreaseIndent: utilFunctions.decreaseIndent,
    insertLink: utilFunctions.insertLink,
    removeLink: utilFunctions.removeLink,
    isLinkActive: utilFunctions.isLinkActive,
  },
}

// ============================================
// DIRECT EXPORTS (for convenience)
// ============================================

export { elements, leaves }

// Styling
export { setLineHeight, getLineHeight, setFont, getFont } from './utils'

// Indentation
export { increaseIndent, decreaseIndent } from './utils'

// Links
export { insertLink, removeLink, isLinkActive } from './utils'
```

**✅ Pros:**
- **Maximum flexibility** - use however you want
- **Clear sections** - plugin registration vs. direct exports
- **Self-documenting** - shows all available functions
- **Great DX** - import what you need, how you need it

**❌ Cons:**
- Most verbose
- Duplication between plugin object and exports

**Usage:**
```typescript
// Option A: Import plugin
import { richText } from '@givecampus/composer'
<Composer.Root plugins={[richText]} />

// Option B: Import specific utils
import { insertLink, setLineHeight } from '@givecampus/composer/richText'

// Option C: Mix
import { richText, insertLink } from '@givecampus/composer/richText'
```

---

## Option 4: Documented Barrel Export

**Best for:** When you want minimal code but good documentation

### richText Example:
```typescript
/**
 * Rich text formatting plugin
 *
 * ## Elements
 * - `paragraph` - Standard paragraph block
 * - `heading-one`, `heading-two`, `heading-three` - Headings
 * - `block-quote` - Block quotation
 * - `bulleted-list`, `numbered-list`, `list-item` - Lists
 * - `link` - Inline hyperlink
 *
 * ## Leaves (Text Formats)
 * - `bold` - Bold text
 * - `italic` - Italic text
 * - `underline` - Underlined text
 * - `strikethrough` - Strikethrough text
 *
 * ## Utilities
 * - Styling: `setLineHeight`, `getLineHeight`, `setFont`, `getFont`
 * - Indentation: `increaseIndent`, `decreaseIndent`
 * - Links: `insertLink`, `removeLink`, `isLinkActive`
 *
 * @example
 * ```typescript
 * import { richText } from '@givecampus/composer'
 * <Composer.Root plugins={[richText]} />
 * ```
 */

export { elements } from './elements'
export { leaves } from './leaves'
export * from './utils'

import { elements } from './elements'
import { leaves } from './leaves'
import * as utils from './utils'

export const richText = { elements, leaves, utils }
```

**✅ Pros:**
- **Minimal code** - close to current
- **Well documented** - JSDoc tells you everything
- **Flexible imports** - can import specific functions

**❌ Cons:**
- Still using `export *` (less clear)
- Documentation can get out of sync
- IDE doesn't always show JSDoc for wildcard exports

---

## Comparison Table

| Feature | Option 1 (Explicit) | Option 2 (Namespace) | Option 3 (Hybrid) | Option 4 (Documented) |
|---------|---------------------|----------------------|-------------------|----------------------|
| **Clarity** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Discoverability** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Teaching Value** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Brevity** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Maintainability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibility** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tree-shaking** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Recommendation: Option 1 (Explicit Named Exports)

**Why?**

Given your priorities (declarativeness, clarity, good DX, inspirational for other developers):

1. **✅ Declarative** - You can see exactly what the plugin provides at a glance
2. **✅ Clear** - No hidden exports, no wildcards
3. **✅ Great DX** - IDEs show all exports, easy to autocomplete
4. **✅ Teaching-friendly** - Other developers can copy this pattern and immediately understand it
5. **✅ Maintainable** - When you add a util, you explicitly add it to exports (forces intentionality)
6. **✅ Self-documenting** - The index file IS the documentation

**Example Pattern for New Plugin Authors:**

```typescript
// my-plugin/index.ts

/**
 * My Custom Plugin
 *
 * Brief description of what it does
 */

// 1. Export your components/elements
export { elements } from './elements'

// 2. Export your utilities (explicitly!)
export {
  myUtility,
  anotherUtility,
} from './utils'

// 3. Package it for Composer registration
import { elements } from './elements'
import * as utils from './utils'

export const myPlugin = {
  elements,
  utils: {
    myUtility: utils.myUtility,
    anotherUtility: utils.anotherUtility,
  },
}
```

This pattern is:
- Easy to understand ✅
- Easy to copy ✅
- Hard to mess up ✅
- Explicit about what's public API ✅

---

## Migration Path

If you choose Option 1, here's how to migrate:

1. **Add JSDoc comment** at top of each index file
2. **Replace `export * from './utils'`** with explicit exports
3. **Add sections** with comments (optional but helpful)
4. **Keep the plugin object** at the bottom

**Time to implement:** ~15 minutes
**Breaking changes:** None (only adding exports)

Would you like me to implement Option 1 across all plugins?
