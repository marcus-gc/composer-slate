import React from 'react'

export interface ComposerToolbarProps {
  children: React.ReactNode
  className?: string
}

export const Toolbar: React.FC<ComposerToolbarProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>
}
