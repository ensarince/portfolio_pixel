import { ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ICONS, IconKey, CloseIcon } from '../Mountain/icons'
import styles from './Panel.module.scss'

export default function Panel({
  label,
  icon,
  children,
}: {
  label: string
  icon: IconKey
  children: ReactNode
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const Icon = ICONS[icon]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className={styles.wrap}>
      <button
        className={styles.scrim}
        onClick={() => navigate('/')}
        aria-label="Back to the map"
        tabIndex={-1}
      />

      <section className={styles.panel} role="dialog" aria-label={label}>
        <header className={styles.bar}>
          <span className={styles.barTitle}>
            <Icon className={styles.barIcon} />
            {label}
          </span>
          <button className={styles.close} onClick={() => navigate('/')} aria-label="Close">
            <CloseIcon className={styles.closeIcon} />
          </button>
        </header>

        {/* Keyed on the route so switching sections fades and resets scroll,
            rather than tearing the whole panel down and rebuilding it */}
        <div className={styles.body} key={pathname}>
          {children}
        </div>
      </section>
    </div>
  )
}
