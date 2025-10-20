import * as React from 'react';
import {
  Heading,
  Text,
  Link,
  Row,
  Column,
  Img,
} from '@react-email/components';
import {
  getHeadingStyles,
  getParagraphStyles,
  getBlockQuoteStyles,
  getListStyles,
  getListItemStyles,
  getLinkStyles,
} from '../../plugins/richText-email/sharedEmailStyles';

export interface ElementRendererProps {
  element: any;
  children: React.ReactNode;
  index: number;
}

export type ElementRenderer = (props: ElementRendererProps) => React.ReactNode;

// Layout-specific styles (not shared with richText-email)
const layoutStyles = {
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

export const baseComponents: Record<string, ElementRenderer> = {
  'heading-one': ({ element, children, index }) => (
    <Heading key={index} as="h1" style={getHeadingStyles(1, element)}>
      {children}
    </Heading>
  ),

  'heading-two': ({ element, children, index }) => (
    <Heading key={index} as="h2" style={getHeadingStyles(2, element)}>
      {children}
    </Heading>
  ),

  'heading-three': ({ element, children, index }) => (
    <Heading key={index} as="h3" style={getHeadingStyles(3, element)}>
      {children}
    </Heading>
  ),

  h4: ({ element, children, index }) => (
    <Heading key={index} as="h4" style={getHeadingStyles(4, element)}>
      {children}
    </Heading>
  ),

  h5: ({ element, children, index }) => (
    <Heading key={index} as="h5" style={getHeadingStyles(5, element)}>
      {children}
    </Heading>
  ),

  h6: ({ element, children, index }) => (
    <Heading key={index} as="h6" style={getHeadingStyles(6, element)}>
      {children}
    </Heading>
  ),

  paragraph: ({ element, children, index }) => {
    // Check if this is a list item
    if (element.indent && element.listStyleType) {
      const bullet = element.listStyleType === 'disc' ? '•' : '-';
      const indentPx = (element.indent - 1) * 20; // 20px per indent level
      const style = { ...getListItemStyles(element), marginLeft: `${indentPx}px` };

      return (
        <Text key={index} style={style}>
          <span style={{ marginRight: '8px' }}>{bullet}</span>
          {children}
        </Text>
      );
    }

    // Check if this paragraph has indentation (but not a list)
    if (element.indent && !element.listStyleType) {
      const indentPx = element.indent * 40; // 40px per indent level for regular paragraphs
      const style = { ...getParagraphStyles(element), marginLeft: `${indentPx}px` };

      return (
        <Text key={index} style={style}>
          {children}
        </Text>
      );
    }

    return (
      <Text key={index} style={getParagraphStyles(element)}>
        {children}
      </Text>
    );
  },

  'block-quote': ({ element, children, index }) => (
    <blockquote key={index} style={getBlockQuoteStyles(element)}>
      {children}
    </blockquote>
  ),

  'bulleted-list': ({ element, children, index }) => (
    <ul key={index} style={getListStyles(element)}>
      {children}
    </ul>
  ),

  'numbered-list': ({ element, children, index }) => (
    <ol key={index} style={getListStyles(element)}>
      {children}
    </ol>
  ),

  'list-item': ({ element, children, index }) => (
    <li key={index} style={getListItemStyles(element)}>
      {children}
    </li>
  ),

  image: ({ element, index }) => (
    <Img
      key={index}
      src={element.url || ''}
      alt={element.alt || ''}
      style={layoutStyles.image}
    />
  ),

  'layout-container': ({ element, children, index }) => (
    <Row key={index} style={{ ...layoutStyles.row, ...element }}>
      {children}
    </Row>
  ),

  'layout-column': ({ element, children, index }) => (
    <Column key={index} style={{ width: element.width || 'auto', ...layoutStyles.column }}>
      {children}
    </Column>
  ),

  link: ({ element, children, index }) => (
    <Link
      key={index}
      href={element.url || '#'}
      style={getLinkStyles()}
    >
      {children}
    </Link>
  ),

  // Legacy 'a' type support
  a: ({ element, children, index }) => (
    <Link
      key={index}
      href={element.url || '#'}
      style={getLinkStyles()}
    >
      {children}
    </Link>
  ),
};
