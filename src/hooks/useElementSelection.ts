import { useState, useEffect } from 'react'
import { Editor, Path, Range } from 'slate'
import { useComposer } from '../context/ComposerContext'

export interface ElementSelectionState {
  /** Whether the selection is within this element */
  isSelected: boolean
  /** The current Slate selection range (if any) */
  selection: Range | null
  /** The selected text content (if selection is not collapsed) */
  selectedText: string | null
  /** Whether the selection is collapsed (just a cursor position) */
  isCollapsed: boolean
}

/**
 * Hook to track selection state within a specific element
 * Returns an object with selection information that can be extended
 *
 * @param elementPath - The path to the element to track
 * @returns Selection state object
 */
export const useElementSelection = (elementPath?: Path): ElementSelectionState => {
  const { editor } = useComposer()

  const [selectionState, setSelectionState] = useState<ElementSelectionState>({
    isSelected: false,
    selection: null,
    selectedText: null,
    isCollapsed: true,
  })

  useEffect(() => {
    if (!elementPath) {
      setSelectionState({
        isSelected: false,
        selection: null,
        selectedText: null,
        isCollapsed: true,
      })
      return
    }

    const updateSelection = () => {
      const { selection } = editor

      if (!selection) {
        setSelectionState({
          isSelected: false,
          selection: null,
          selectedText: null,
          isCollapsed: true,
        })
        return
      }

      // Check if selection is within this element
      const isWithinElement = Path.isDescendant(selection.anchor.path, elementPath) ||
        Path.equals(selection.anchor.path, elementPath) ||
        Path.isDescendant(selection.focus.path, elementPath) ||
        Path.equals(selection.focus.path, elementPath)

      if (!isWithinElement) {
        setSelectionState({
          isSelected: false,
          selection: null,
          selectedText: null,
          isCollapsed: true,
        })
        return
      }

      // Selection is within this element
      const isCollapsed = Range.isCollapsed(selection)
      let selectedText: string | null = null

      if (!isCollapsed) {
        try {
          selectedText = Editor.string(editor, selection)
        } catch (e) {
          // If we can't get the string, leave it null
          selectedText = null
        }
      }

      setSelectionState({
        isSelected: true,
        selection,
        selectedText,
        isCollapsed,
      })
    }

    // Initial check
    updateSelection()

    // Listen for selection changes
    const handleSelectionChange = () => {
      updateSelection()
    }

    // Slate fires onChange when selection changes
    // We'll use a MutationObserver to detect changes
    // This is a bit of a hack, but it works well
    const observer = new MutationObserver(handleSelectionChange)

    // Observe the editor element for changes
    if (editor.selection) {
      observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: false,
      })
    }

    // Also listen to document selection changes
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [editor, elementPath])

  return selectionState
}
