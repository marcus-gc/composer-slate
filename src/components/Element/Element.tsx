import { RenderElementProps } from "slate-react"
import { ElementDecoratorProps } from "../Composer/Root"

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
    elementDecorators: Array<(props: ElementDecoratorProps) => React.ReactNode>
}

const Element = ({
    attributes,
    children,
    element,
    availableElements,
    elementDecorators = []
}: ComposerElementProps) => {
    const elementConfig = availableElements[element.type]
    const ElementToRender = elementConfig?.component || Paragraph
    const isInline = elementConfig?.inline || false

    // Render the element component
    let rendered = (
        <ElementToRender
            attributes={attributes}
            children={children}
            element={element}
        />
    )

    // Apply element decorators in order (innermost to outermost)
    // Using reduceRight to wrap from inside out
    rendered = elementDecorators.reduceRight((wrappedElement, decorator) => {
        return decorator({
            element,
            children: wrappedElement,
            attributes,
            isInline,
        }) as React.ReactElement
    }, rendered)

    return rendered
}

export default Element;