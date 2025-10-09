import { RenderElementProps } from "slate-react";
import React from "react";

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <p style={style} {...attributes}>
            {children}
        </p>
    )
}

type ComposerElementProps = RenderElementProps & {
    availableElements: Record<string, any>
}

const Element = ({ attributes, children, element, availableElements }: ComposerElementProps) => {
    const ElementToRender = availableElements[element.type] || Paragraph;

    return <ElementToRender attributes={attributes} children={children} element={element} />
}

export default Element;