type IconProps = { className?: string }

const base = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function WorkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M2 4.6h3.9l1.3 1.7H14v7.3H2z" />
      <path d="M2 8.4h12" />
    </svg>
  )
}

export function BlogIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3.6 2.2h6.1l2.7 2.7v9.1h-8.8z" />
      <path d="M5.6 7.2h4.8M5.6 9.6h4.8M5.6 12h3" />
    </svg>
  )
}

export function SkillsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="2.4" y="2.4" width="4.6" height="4.6" />
      <rect x="9" y="2.4" width="4.6" height="4.6" />
      <rect x="2.4" y="9" width="4.6" height="4.6" />
      <rect x="9" y="9" width="4.6" height="4.6" />
    </svg>
  )
}

export function ClimbsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M1.4 13.2L6 4.3l2.7 4.9 1.6-2.4 4.3 6.4z" />
    </svg>
  )
}

export function GalleryIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="2" y="3.4" width="12" height="9.2" />
      <circle cx="5.7" cy="6.8" r="1.1" />
      <path d="M2 10.6l3.4-2.7 3.5 3.1 2.2-1.7 2.9 2.3" />
    </svg>
  )
}

export function AboutIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.6" />
      <path d="M3.1 14c0-2.8 2.2-4.5 4.9-4.5s4.9 1.7 4.9 4.5" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 8.4l3.3 3.3L13 5" />
    </svg>
  )
}

export function DragIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M8 2.6v10.8M2.6 8h10.8" />
      <path d="M5.6 5.1L8 2.6l2.4 2.5M5.6 10.9L8 13.4l2.4-2.5" />
      <path d="M5.1 5.6L2.6 8l2.5 2.4M10.9 5.6L13.4 8l-2.5 2.4" />
    </svg>
  )
}

export const ICONS = {
  work: WorkIcon,
  blog: BlogIcon,
  skills: SkillsIcon,
  climbs: ClimbsIcon,
  gallery: GalleryIcon,
  about: AboutIcon,
}

export type IconKey = keyof typeof ICONS
