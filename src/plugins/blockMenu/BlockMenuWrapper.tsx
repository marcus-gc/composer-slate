import { useState } from 'react'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { useBlockMenu } from '../../context/BlockMenuContext'
import { BlockMenuHandle } from '../../components/Composer/BlockMenuHandle'
import { ElementDecoratorProps } from '../../components/Composer/Root'
import { pathToId, useDragAndDrop } from '../../context/DragAndDropContext'

export const BlockMenuWrapper = ({
  element,
  children,
  isInline,
  hideBlockMenu,
}: ElementDecoratorProps) => {
  const editor = useSlateStatic()
  const [isHovered, setIsHovered] = useState(false)

  // Get drag state - use try/catch in case dragAndDrop plugin isn't loaded
  let isDragging = false
  let activeId = null
  try {
    const dragState = useDragAndDrop()
    isDragging = dragState.isDragging
    activeId = dragState.activeId
  } catch (e) {
    // DragAndDrop context not available
  }

  // Try to access block menu context (might not be available)
  try {
    useBlockMenu()
  } catch (e) {
    // BlockMenu context not available, just render children
    return <>{children}</>
  }

  // Get the path of this element
  let blockPath = null
  try {
    blockPath = ReactEditor.findPath(editor as ReactEditor, element)
  } catch (e) {
    // Path not found, just render children
    return <>{children}</>
  }

  // Don't wrap inline elements or elements with hideBlockMenu
  if (isInline || hideBlockMenu) {
    return <>{children}</>
  }

  // Check if this is the block being dragged
  const blockId = blockPath ? pathToId(blockPath) : null
  const isBeingDragged = isDragging && activeId === blockId

  // Only show handle if:
  // 1. Not currently dragging, OR
  // 2. This block is the one being dragged
  const shouldShowHandle = isHovered && (!isDragging || isBeingDragged)

  // Wrap block elements with hover container and handle
  return (
    <div
      style={{
        position: 'relative',
        paddingLeft: '24px', // Make room for the handle
        marginLeft: '-24px', // Keep content aligned
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {shouldShowHandle && <BlockMenuHandle blockPath={blockPath} />}
      {children}
    </div>
  )
}
