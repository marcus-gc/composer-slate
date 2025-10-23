interface QuillIconProps {
  size?: number
  color?: string
}

export const QuillIcon = ({ size = 32, color = '#0066cc' }: QuillIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Feather/quill body - elegant curve */}
      <path
        d="M20 2C20 2 18 4 16 6C14 8 12 10 11 12C10 14 9.5 16 9.5 17C9.5 17.5 9.75 18 10 18.5L10.5 19L4 21L3 22L4 21L6 14.5L6.5 14C7 13.25 8.5 13 9.5 13C10.5 13 12.5 13.5 14.5 12C16.5 10.5 18.5 8.5 20.5 6.5C22.5 4.5 23 2 23 2C23 2 22 1.5 20 2Z"
        fill={color}
        fillOpacity="0.15"
      />
      <path
        d="M20 2C20 2 18 4 16 6C14 8 12 10 11 12C10 14 9.5 16 9.5 17C9.5 17.5 9.75 18 10 18.5L10.5 19L4 21L3 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Quill tip/nib */}
      <path
        d="M4 21L6 14.5L6.5 14C7 13.25 8.5 13 9.5 13C10.5 13 12.5 13.5 14.5 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Decorative feather barbs - left side */}
      <path
        d="M16 6C15 7.5 14 9 13.5 10"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M14.5 7.5C13.5 9 12.5 10.5 12 11.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Decorative feather barbs - right side */}
      <path
        d="M18 4C17.5 5.5 16.5 7 16 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M19 3C18.5 4.5 17.5 6 17 7"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Ink dot accent */}
      <circle
        cx="5"
        cy="20"
        r="0.8"
        fill={color}
      />
    </svg>
  )
}
