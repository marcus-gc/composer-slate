# Theming Guide for @givecampus/composer

This guide explains how to use the theming system in the Composer library.

## Overview

The Composer library now supports theming via a `theme` prop on `Composer.Root`. The theme is available to all plugin components via the `useComposerTheme` hook.

## Theme Interface

```typescript
interface ComposerTheme {
  primaryColor: string        // Required - primary brand color
  textColor?: string          // Optional - default: '#000000'
  backgroundColor?: string    // Optional - default: '#ffffff'
  fontFamily?: string         // Optional - default: 'Arial, sans-serif'
}
```

## Usage

### 1. Consumer App (Passing Theme to Composer)

```tsx
import { Composer, ComposerTheme } from '@givecampus/composer';

function MyEditor({ school }) {
  const theme: ComposerTheme = {
    primaryColor: school.primaryColor, // Required
    textColor: '#333333',              // Optional
    fontFamily: 'Inter, sans-serif',   // Optional
  };

  return (
    <Composer.Root
      plugins={[richText, layouts, images, blockMenu]}
      theme={theme}
    >
      <Composer.DefaultToolbar />
      <Composer.Content placeholder="Start typing..." />
    </Composer.Root>
  );
}
```

### 2. Plugin Components (Using Theme)

```tsx
import { useComposerTheme } from '@givecampus/composer';

const Button = ({ attributes, children, element }) => {
  const theme = useComposerTheme();

  return (
    <button
      style={{
        backgroundColor: theme.primaryColor,
        color: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      {...attributes}
    >
      {children}
    </button>
  );
};

const Link = ({ attributes, children, element }) => {
  const theme = useComposerTheme();

  return (
    <a
      href={element.url}
      style={{
        color: theme.primaryColor,
        textDecoration: 'underline',
        fontFamily: theme.fontFamily,
      }}
      {...attributes}
    >
      {children}
    </a>
  );
};
```

### 3. Email Components (Using Theme)

The theme is also available in Email rendering components:

```tsx
import { useComposerTheme } from '@givecampus/composer';

const EmailButton = ({ url, text }) => {
  const theme = useComposerTheme();

  return (
    <a
      href={url}
      style={{
        display: 'inline-block',
        backgroundColor: theme.primaryColor,
        color: theme.backgroundColor,
        padding: '12px 24px',
        textDecoration: 'none',
        borderRadius: '4px',
        fontFamily: theme.fontFamily,
      }}
    >
      {text}
    </a>
  );
};
```

## Behavior When Theme is Not Provided

If `useComposerTheme` is called:
- **Outside `Composer.Root`**: Returns default theme values with a console warning
- **Inside `Composer.Root` without theme prop**: Returns default theme values with a console warning

Default values:
```typescript
{
  primaryColor: '#0066cc',
  textColor: '#000000',
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
}
```

## Best Practices

1. **Always pass a theme** - While optional, passing a theme ensures consistent branding
2. **Use primaryColor for CTAs** - Buttons, links, and important UI elements
3. **Email-safe values** - All default values are email-client-friendly
4. **Font families** - Use common web-safe fonts or email-compatible font stacks
5. **Contrast** - Ensure text and background colors have sufficient contrast

## Example: Creating a Themed Plugin

```tsx
import { useComposerTheme } from '@givecampus/composer';

// Define your element component
const CallToAction = ({ attributes, children, element }) => {
  const theme = useComposerTheme();

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: theme.primaryColor,
        color: theme.backgroundColor,
        borderRadius: '8px',
        textAlign: 'center',
        fontFamily: theme.fontFamily,
      }}
      {...attributes}
    >
      {children}
    </div>
  );
};

// Register in your plugin
export const elements = {
  'call-to-action': {
    component: CallToAction,
    label: 'Call to Action',
    showInBlockMenu: true,
  },
};
```

## TypeScript Support

The library exports the `ComposerTheme` type for TypeScript users:

```typescript
import { ComposerTheme } from '@givecampus/composer';

const myTheme: ComposerTheme = {
  primaryColor: '#ff6b6b',
  textColor: '#2c3e50',
  backgroundColor: '#f8f9fa',
  fontFamily: 'Georgia, serif',
};
```

## Migration Guide

If you're upgrading from a version without theming:

1. **No breaking changes** - The `theme` prop is optional
2. **Existing code works** - Components will use default theme values
3. **Gradual adoption** - Add theme support to plugins as needed

### Before:
```tsx
<Composer.Root plugins={[richText]}>
  <Composer.Content />
</Composer.Root>
```

### After:
```tsx
<Composer.Root
  plugins={[richText]}
  theme={{ primaryColor: '#007bff' }}
>
  <Composer.Content />
</Composer.Root>
```
