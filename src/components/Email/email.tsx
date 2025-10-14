import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Row,
  Column,
  Img,
} from '@react-email/components';

interface EmailProps {
  elements: any[];
}

interface PlateElement {
  type: string;
  children: Array<{ text?: string; bold?: boolean; italic?: boolean; underline?: boolean; [key: string]: any }>;
  indent?: number;
  listStyleType?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  [key: string]: any;
}

const renderTextNode = (child: any): React.ReactNode => {
  let text = child.text || '';

  if (!text && !child.type) return null;

  // Handle link elements
  if (child.type === 'a') {
    const linkText = child.children?.map((c: any) => c.text).join('') || '';
    return (
      <Link
        key={Math.random()}
        href={child.url || '#'}
        style={{ color: '#2563eb', textDecoration: 'underline' }}
      >
        {linkText}
      </Link>
    );
  }

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

const renderChildren = (children: any[]): React.ReactNode => {
  return children.map((child, index) => (
    <React.Fragment key={index}>
      {renderTextNode(child)}
    </React.Fragment>
  ));
};

const renderElement = (element: PlateElement, index: number): React.ReactNode => {
  const { type, children, indent, listStyleType, width, align, lineHeight, font, url, alt } = element;
  const content = renderChildren(children);

  // Helper to apply alignment, line height, and font family
  const applyTextStyle = (baseStyle: any) => {
    const style = { ...baseStyle };
    if (align) {
      style.textAlign = align;
    }
    if (lineHeight) {
      style.lineHeight = lineHeight.toString();
    }
    if (font) {
      style.fontFamily = font;
    }
    return style;
  };

  switch (type) {
    case 'heading-one':
      return (
        <Heading key={index} as="h1" style={applyTextStyle(styles.h1)}>
          {content}
        </Heading>
      );

    case 'heading-two':
      return (
        <Heading key={index} as="h2" style={applyTextStyle(styles.h2)}>
          {content}
        </Heading>
      );

    case 'heading-three':
      return (
        <Heading key={index} as="h3" style={applyTextStyle(styles.h3)}>
          {content}
        </Heading>
      );

    case 'h4':
      return (
        <Heading key={index} as="h4" style={applyTextStyle(styles.h4)}>
          {content}
        </Heading>
      );

    case 'h5':
      return (
        <Heading key={index} as="h5" style={applyTextStyle(styles.h5)}>
          {content}
        </Heading>
      );

    case 'h6':
      return (
        <Heading key={index} as="h6" style={applyTextStyle(styles.h6)}>
          {content}
        </Heading>
      );

    case 'paragraph':
      // Check if this is a list item
      if (indent && listStyleType) {
        const bullet = listStyleType === 'disc' ? '•' : '-';
        const indentPx = (indent - 1) * 20; // 20px per indent level

        return (
          <Text key={index} style={applyTextStyle({ ...styles.listItem, marginLeft: `${indentPx}px` })}>
            <span style={{ marginRight: '8px' }}>{bullet}</span>
            {content}
          </Text>
        );
      }

      // Check if this paragraph has indentation (but not a list)
      if (indent && !listStyleType) {
        const indentPx = indent * 40; // 40px per indent level for regular paragraphs

        return (
          <Text key={index} style={applyTextStyle({ ...styles.paragraph, marginLeft: `${indentPx}px` })}>
            {content}
          </Text>
        );
      }

      return (
        <Text key={index} style={applyTextStyle(styles.paragraph)}>
          {content}
        </Text>
      );

    case 'block-quote':
      return (
        <blockquote key={index} style={applyTextStyle(styles.blockquote)}>
          {content}
        </blockquote>
      );

    case 'bulleted-list':
      return (
        <ul key={index} style={applyTextStyle(styles.list)}>
          {children?.map((child: any, childIndex: number) =>
            renderElement(child as PlateElement, childIndex)
          )}
        </ul>
      );

    case 'numbered-list':
      return (
        <ol key={index} style={applyTextStyle(styles.list)}>
          {children?.map((child: any, childIndex: number) =>
            renderElement(child as PlateElement, childIndex)
          )}
        </ol>
      );

    case 'list-item':
      return (
        <li key={index} style={applyTextStyle(styles.listItem)}>
          {content}
        </li>
      );

    case 'image':
      return (
        <Img
          key={index}
          src={url || ''}
          alt={alt || ''}
          style={styles.image}
        />
      );

    case 'layout-container':
      return (
        <Row key={index} style={styles.row}>
          {children?.map((column: any, colIndex: number) => (
            <Column key={colIndex} style={{ width: column.width || 'auto', ...styles.column }}>
              {column.children?.map((child: any, childIndex: number) =>
                renderElement(child as PlateElement, childIndex)
              )}
            </Column>
          ))}
        </Row>
      );

    case 'column':
      // Columns are handled by column_group, so we shouldn't hit this directly
      return null;

    default:
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
  }
};

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

export function Email({ elements }: EmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          {elements?.map((element, index) => renderElement(element as PlateElement, index))}
        </Container>
      </Body>
    </Html>
  );
}
