import { RenderLeafProps } from 'slate-react'

const Span = ({ attributes, children }: RenderLeafProps) => {
  return <span {...attributes}>{children}</span>
}

interface LeafProps extends RenderLeafProps {
  availableLeaves: Record<string, any>
}

const Leaf = ({ attributes, children, leaf, text, availableLeaves }: LeafProps) => {
  const toRender = Object.keys(availableLeaves).reduce((acc, key) => {
    const LeafComponent = availableLeaves[key];
    if ((leaf as any)[key]) {
      return <LeafComponent attributes={attributes} leaf={leaf} text={text}>{acc}</LeafComponent>
    }
    return acc;
  }, children)

  return <Span attributes={attributes} leaf={leaf} text={text}>{toRender}</Span>;
}

export default Leaf
