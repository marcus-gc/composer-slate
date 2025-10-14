import { useState } from "react";
import { RenderElementProps, ReactEditor, useSlateStatic } from "slate-react";
import { useBlockMenu } from "../../context/BlockMenuContext";
import { BlockMenuHandle } from "../Composer/BlockMenuHandle";

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <p style={style} {...attributes}>
            {children}
        </p>
    )
}

type ComposerElementProps = RenderElementProps & {
    availableElements: Record<string, { component: any; inline?: boolean; void?: boolean, hideBlockMenu?: boolean }>
}

const Element = ({ attributes, children, element, availableElements }: ComposerElementProps) => {
    const editor = useSlateStatic()
    const [isHovered, setIsHovered] = useState(false)

    // Try to access block menu context (might not be available if BlockMenu not used)
    let blockMenuContext = null
    try {
        blockMenuContext = useBlockMenu()
    } catch (e) {
        // BlockMenu not in use, which is fine
    }

    const elementConfig = availableElements[element.type]
    const ElementToRender = elementConfig?.component || Paragraph;

    // Get the path of this element
    let blockPath = null
    try {
        blockPath = ReactEditor.findPath(editor as ReactEditor, element)
    } catch (e) {
        // Path not found, skip block menu
    }

    // Check if this is an inline element
    const isInline = elementConfig?.inline || false

    // Don't show block menu for inline elements
    if (isInline || !blockMenuContext || !blockPath || elementConfig?.hideBlockMenu) {
        return <ElementToRender attributes={attributes} children={children} element={element} />
    }

    // Wrap block elements with hover container and handle
    return (
        <div
            style={{
                position: 'relative',
                paddingLeft: '30px', // Make room for the handle
                marginLeft: '-30px', // Keep content aligned
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && <BlockMenuHandle blockPath={blockPath} />}
            <ElementToRender attributes={attributes} children={children} element={element} />
        </div>
    )
}

export default Element;