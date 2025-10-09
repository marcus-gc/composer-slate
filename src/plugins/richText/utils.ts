import {Editor as SlateEditor, Element as SlateElement, Transforms} from "slate";

/**
 * Set line height for the current block
 * @param editor - The Slate editor instance
 * @returns A function that takes lineHeight value (e.g., '1.5', '2', '1.2')
 */
export const setLineHeight = (editor: SlateEditor) => (lineHeight: string | undefined) => {
    Transforms.setNodes<SlateElement>(editor, { lineHeight } as any, {
        match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
    })
}

/**
 * Set font family for the current block
 * @param editor - The Slate editor instance
 * @returns A function that takes font family name (e.g., 'Arial', 'Times New Roman', 'monospace')
 */
export const setFont = (editor: SlateEditor) => (font: string | undefined) => {
    Transforms.setNodes<SlateElement>(editor, { font } as any, {
        match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
    })
}

/**
 * Increase indentation of the current block
 * @param editor - The Slate editor instance
 * @returns A function that increases indentation
 */
export const increaseIndent = (editor: SlateEditor) => () => {
    const { selection } = editor
    if (!selection) return

    const [match] = Array.from(
        SlateEditor.nodes(editor, {
            at: selection,
            match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
        })
    )

    if (match) {
        const [node] = match
        const currentIndent = (node as any).indent || 0
        Transforms.setNodes<SlateElement>(
            editor,
            { indent: currentIndent + 1 } as any,
            {
                match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
            }
        )
    }
}

/**
 * Decrease indentation of the current block
 * @param editor - The Slate editor instance
 * @returns A function that decreases indentation
 */
export const decreaseIndent = (editor: SlateEditor) => () => {
    const { selection } = editor
    if (!selection) return

    const [match] = Array.from(
        SlateEditor.nodes(editor, {
            at: selection,
            match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
        })
    )

    if (match) {
        const [node] = match
        const currentIndent = (node as any).indent || 0
        if (currentIndent > 0) {
            Transforms.setNodes<SlateElement>(
                editor,
                { indent: currentIndent - 1 } as any,
                {
                    match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
                }
            )
        }
    }
}

/**
 * Get the current line height of the active block
 * @param editor - The Slate editor instance
 * @returns A function that returns the line height value or undefined
 */
export const getLineHeight = (editor: SlateEditor) => (): string | undefined => {
    const { selection } = editor
    if (!selection) return undefined

    const [match] = Array.from(
        SlateEditor.nodes(editor, {
            at: selection,
            match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
        })
    )

    if (match) {
        const [node] = match
        return (node as any).lineHeight
    }

    return undefined
}

/**
 * Get the current font family of the active block
 * @param editor - The Slate editor instance
 * @returns A function that returns the font family value or undefined
 */
export const getFont = (editor: SlateEditor) => (): string | undefined => {
    const { selection } = editor
    if (!selection) return undefined

    const [match] = Array.from(
        SlateEditor.nodes(editor, {
            at: selection,
            match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
        })
    )

    if (match) {
        const [node] = match
        return (node as any).font
    }

    return undefined
}

export const utils = {
    setLineHeight,
    getLineHeight,
    setFont,
    getFont,
    increaseIndent,
    decreaseIndent,
}
