import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
} from '@react-email/components';
import { createBaseComponents, ElementRenderer } from './baseComponents.tsx';
import type { ComposerTheme } from '../../types';

export interface LetterProps {
  elements: any[];
  components?: Record<string, ElementRenderer>;
  textDirection?: 'ltr' | 'rtl';
  language?: string;
  theme?: ComposerTheme;
  styles?: {
    body?: React.CSSProperties;
    container?: React.CSSProperties;
  };
}

  const renderTextNode = (child: any): React.ReactNode => {
    let text = child.text || '\u00A0';

    if (!text && !child.type) return null;

    // Apply text formatting
    if (child.bold) {
      text = <strong key={Math.random()}>{text}</strong>;
    }
    if (child.italic) {
      text = <em key={Math.random()}>{text}</em>;
    }
    if (child.underline) {
      text = <u key={Math.random()}>{text}</u>;
    }

    return text;
  };

const renderChildren = (
  children: any[],
  renderElementFn: (element: any, index: number) => React.ReactNode
): React.ReactNode => {
  return children.map((child, index) => {
    // If child has a type, it's an element (like inline links)
    if (child.type) {
      return renderElementFn(child, index);
    }
    // Otherwise it's a text node
    return (
      <React.Fragment key={index}>
        {renderTextNode(child)}
      </React.Fragment>
    );
  });
};

const renderElement = (
  element: any,
  index: number,
  components: Record<string, ElementRenderer>
): React.ReactNode => {
  const { type, children } = element;

  // Get the component renderer for this element type
  const Component = components[type];

  if (Component) {
    // For container elements, recursively render children
    if (type === 'bulleted-list' || type === 'numbered-list' || type === 'layout-container') {
      const renderedChildren = children?.map((child: any, childIndex: number) =>
        renderElement(child, childIndex, components)
      );
      return Component({ element, children: renderedChildren, index });
    }

    // For layout-column, render its children elements
    if (type === 'layout-column') {
      const renderedChildren = children?.map((child: any, childIndex: number) =>
        renderElement(child, childIndex, components)
      );
      return Component({ element, children: renderedChildren, index });
    }

    // For other elements, render text nodes
    const content = renderChildren(children, (el, idx) => renderElement(el, idx, components));
    return Component({ element, children: content, index });
  }

  // Fallback for unknown element types
  return (
    <div
      key={index}
      style={{
        padding: '8px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        color: '#856404',
        marginBottom: '8px',
      }}
    >
      ⚠️ Missing element type: <code>{type}</code>
    </div>
  );
};

export function Letter({
  elements,
  components = {},
  language = 'en',
  textDirection = 'ltr',
  theme,
  styles = {
    body: {fontFamily: 'Arial, sans-serif'},
    container: { maxWidth: '600px', margin: '0 auto', padding: '20px' }
  }
}: LetterProps) {
  // Create base components with theme support
  const themedBaseComponents = createBaseComponents(theme);

  // Merge custom components with themed defaults
  const mergedComponents = {
    ...themedBaseComponents,
    ...components,
  };

  return (
    <Html lang={language} dir={textDirection}>
      <Head />
      <Body style={styles?.body}>
        <Container style={styles?.container}>
          {elements?.map((element, index) => renderElement(element, index, mergedComponents))}
        </Container>
      </Body>
    </Html>
  );
}
