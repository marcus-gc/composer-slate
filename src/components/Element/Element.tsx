import { RenderElementProps } from "slate-react";

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <p style={style} {...attributes}>
            {children}
        </p>
    )
}

type ComposerElementProps = RenderElementProps & {
    availableElements: Record<string, { component: any; inline?: boolean; void?: boolean }>
}

const Element = ({ attributes, children, element, availableElements }: ComposerElementProps) => {
    const elementConfig = availableElements[element.type]
    const ElementToRender = elementConfig?.component || Paragraph;

    return <ElementToRender attributes={attributes} children={children} element={element} />
}

export default Element;