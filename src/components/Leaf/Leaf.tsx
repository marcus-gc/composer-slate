import React from 'react'
import { RenderLeafProps } from 'slate-react'

const Span = ({ attributes, children }: RenderLeafProps) => {
  return <span {...attributes}>{children}</span>
}

const Leaf = ({ attributes, children, leaf, availableLeaves }: RenderLeafProps) => {
  const toRender = Object.keys(availableLeaves).reduce((acc, key) => {
    const LeafComponent = availableLeaves[key];
    if (leaf[key]) {
      return <LeafComponent attributes={attributes}>{acc}</LeafComponent>
    }
    return acc;
  }, children)

  return <Span attributes={attributes}>{toRender}</Span>;
}

export default Leaf
