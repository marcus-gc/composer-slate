import { useState } from 'react'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { useBlockMenu } from '../../context/BlockMenuContext'
import { BlockMenuHandle } from '../../components/Composer/BlockMenuHandle'
import { ElementDecoratorProps } from '../../components/Composer/Root'

export const BlockMenuWrapper = ({
  element,
  children,
  isInline
}: ElementDecoratorProps) => {
  const editor = useSlateStatic()
  const [isHovered, setIsHovered] = useState(false)

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
  if (isInline || (element as any).hideBlockMenu) {
    return <>{children}</>
  }

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
      {isHovered && <BlockMenuHandle blockPath={blockPath} />}
      {children}
    </div>
  )
}
