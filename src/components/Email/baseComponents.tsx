import * as React from 'react';
import {
  Heading,
  Text,
  Link,
  Row,
  Column,
  Img,
} from '@react-email/components';

export interface ElementRendererProps {
  element: any;
  children: React.ReactNode;
  index: number;
}

export type ElementRenderer = (props: ElementRendererProps) => React.ReactNode;

const styles = {
  h1: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  h2: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '14px',
    lineHeight: '1.3',
  },
  h3: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  h4: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  h5: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  h6: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '12px',
  },
  list: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '12px',
    paddingLeft: '24px',
  },
  listItem: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '4px',
  },
  blockquote: {
    borderLeft: '4px solid #e5e7eb',
    paddingLeft: '16px',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '0',
    marginBottom: '12px',
    fontStyle: 'italic',
    color: '#6b7280',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    marginTop: '0',
    marginBottom: '16px',
  },
  row: {
    marginBottom: '16px',
  },
  column: {
    verticalAlign: 'top' as const,
    padding: '0 12px',
  },
};

// Helper to apply alignment, line height, and font family
const applyTextStyle = (element: any, baseStyle: any) => {
  const style = { ...baseStyle };
  if (element.align) {
    style.textAlign = element.align;
  }
  if (element.lineHeight) {
    style.lineHeight = element.lineHeight.toString();
  }
  if (element.font) {
    style.fontFamily = element.font;
  }
  return style;
};

export const baseComponents: Record<string, ElementRenderer> = {
  'heading-one': ({ element, children, index }) => (
    <Heading key={index} as="h1" style={applyTextStyle(element, styles.h1)}>
      {children}
    </Heading>
  ),

  'heading-two': ({ element, children, index }) => (
    <Heading key={index} as="h2" style={applyTextStyle(element, styles.h2)}>
      {children}
    </Heading>
  ),

  'heading-three': ({ element, children, index }) => (
    <Heading key={index} as="h3" style={applyTextStyle(element, styles.h3)}>
      {children}
    </Heading>
  ),

  h4: ({ element, children, index }) => (
    <Heading key={index} as="h4" style={applyTextStyle(element, styles.h4)}>
      {children}
    </Heading>
  ),

  h5: ({ element, children, index }) => (
    <Heading key={index} as="h5" style={applyTextStyle(element, styles.h5)}>
      {children}
    </Heading>
  ),

  h6: ({ element, children, index }) => (
    <Heading key={index} as="h6" style={applyTextStyle(element, styles.h6)}>
      {children}
    </Heading>
  ),

  paragraph: ({ element, children, index }) => {
    // Check if this is a list item
    if (element.indent && element.listStyleType) {
      const bullet = element.listStyleType === 'disc' ? '•' : '-';
      const indentPx = (element.indent - 1) * 20; // 20px per indent level

      return (
        <Text key={index} style={applyTextStyle(element, { ...styles.listItem, marginLeft: `${indentPx}px` })}>
          <span style={{ marginRight: '8px' }}>{bullet}</span>
          {children}
        </Text>
      );
    }

    // Check if this paragraph has indentation (but not a list)
    if (element.indent && !element.listStyleType) {
      const indentPx = element.indent * 40; // 40px per indent level for regular paragraphs

      return (
        <Text key={index} style={applyTextStyle(element, { ...styles.paragraph, marginLeft: `${indentPx}px` })}>
          {children}
        </Text>
      );
    }

    return (
      <Text key={index} style={applyTextStyle(element, styles.paragraph)}>
        {children}
      </Text>
    );
  },

  'block-quote': ({ element, children, index }) => (
    <blockquote key={index} style={applyTextStyle(element, styles.blockquote)}>
      {children}
    </blockquote>
  ),

  'bulleted-list': ({ element, children, index }) => (
    <ul key={index} style={applyTextStyle(element, styles.list)}>
      {children}
    </ul>
  ),

  'numbered-list': ({ element, children, index }) => (
    <ol key={index} style={applyTextStyle(element, styles.list)}>
      {children}
    </ol>
  ),

  'list-item': ({ element, children, index }) => (
    <li key={index} style={applyTextStyle(element, styles.listItem)}>
      {children}
    </li>
  ),

  image: ({ element, index }) => (
    <Img
      key={index}
      src={element.url || ''}
      alt={element.alt || ''}
      style={styles.image}
    />
  ),

  'layout-container': ({ element, children, index }) => (
    <Row key={index} style={{ ...styles.row, ...element }}>
      {children}
    </Row>
  ),

  'layout-column': ({ element, children, index }) => (
    <Column key={index} style={{ width: element.width || 'auto', ...styles.column }}>
      {children}
    </Column>
  ),

  link: ({ element, children, index }) => (
    <Link
      key={index}
      href={element.url || '#'}
      style={{ color: '#2563eb', textDecoration: 'underline' }}
    >
      {children}
    </Link>
  ),

  // Legacy 'a' type support
  a: ({ element, children, index }) => (
    <Link
      key={index}
      href={element.url || '#'}
      style={{ color: '#2563eb', textDecoration: 'underline' }}
    >
      {children}
    </Link>
  ),
};
