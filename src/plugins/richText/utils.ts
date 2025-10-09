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

/**
 * Insert a link at the current selection
 */
export const insertLink = (editor: SlateEditor) => (url: string) => {
    const { selection } = editor
    if (!selection) return

    const isCollapsed = selection.anchor.offset === selection.focus.offset

    if (isCollapsed) {
        // Insert a new link node with the URL as text
        const link = {
            type: 'link',
            url,
            children: [{ text: url }],
        }
        Transforms.insertNodes(editor, link as any)
    } else {
        // Check if we're already in a link
        const isInLink = isLinkActive(editor)()

        if (isInLink) {
            // If already in a link, unwrap first
            Transforms.unwrapNodes(editor, {
                match: (n) =>
                    !SlateEditor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type === 'link',
            })
        }

        // Wrap the selected text in a link
        const link = {
            type: 'link',
            url,
            children: [],
        }
        // Use split: true to split text nodes, but Slate should not split block nodes
        // because link is marked as inline in withInlines
        Transforms.wrapNodes(editor, link as any, {
            split: true,
            // Don't wrap void nodes
            voids: false,
        })
        Transforms.collapse(editor, { edge: 'end' })
    }
}

/**
 * Remove link from the current selection
 * If only part of a link is selected, it will split the link and only unlink the selected portion
 */
export const removeLink = (editor: SlateEditor) => () => {
    const { selection } = editor
    if (!selection) return

    // Check if the selection is collapsed (cursor) or spans text
    const isCollapsed = selection.anchor.offset === selection.focus.offset

    if (isCollapsed) {
        // If collapsed, remove the entire link at cursor
        Transforms.unwrapNodes(editor, {
            match: (n) =>
                !SlateEditor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n as any).type === 'link',
        })
    } else {
        // For partial selections, we need to split first, then unwrap the SELECTED portion (middle)

        // Get all link nodes in the selection
        const linkNodes = Array.from(
            SlateEditor.nodes(editor, {
                at: selection,
                match: (n) =>
                    !SlateEditor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type === 'link',
            })
        )

        if (linkNodes.length === 0) return

        // Get the parent path (the paragraph) - we'll use this to find links after splitting
        const [, linkPath] = linkNodes[0]
        const parentPath = linkPath.slice(0, -1)

        // Split at both ends
        // Important: split at the END first, then the START
        Transforms.splitNodes(editor, {
            at: selection.focus,
            match: (n) =>
                !SlateEditor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n as any).type === 'link',
        })

        Transforms.splitNodes(editor, {
            at: selection.anchor,
            match: (n) =>
                !SlateEditor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n as any).type === 'link',
        })

        // After splitting, we have three links in the parent
        // Find ALL links in the parent node
        const allLinksInParent = Array.from(
            SlateEditor.nodes(editor, {
                at: parentPath,
                match: (n) =>
                    !SlateEditor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type === 'link',
            })
        )

        // After splitting, we should have created 3 links (or 2 if selection was at edge)
        // The middle one is the one we want to unwrap
        // Unwrap the MIDDLE link (index 1 if we have 3)
        if (allLinksInParent.length >= 2) {
            const middleIndex = Math.floor(allLinksInParent.length / 2)
            const [, middleLinkPath] = allLinksInParent[middleIndex]

            Transforms.unwrapNodes(editor, {
                at: middleLinkPath,
                match: (n) =>
                    !SlateEditor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type === 'link',
            })
        }
    }
}

/**
 * Check if the current selection has a link
 */
export const isLinkActive = (editor: SlateEditor) => (): boolean => {
    const [link] = SlateEditor.nodes(editor, {
        match: (n) =>
            !SlateEditor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n as any).type === 'link',
    })
    return !!link
}

export const utils = {
    setLineHeight,
    getLineHeight,
    setFont,
    getFont,
    increaseIndent,
    decreaseIndent,
    insertLink,
    removeLink,
    isLinkActive,
}
