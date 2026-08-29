import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from "./Header.module.scss"

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/skills', label: 'Skills' },
  { to: '/blog', label: 'Blog' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const close = () => setIsMenuOpen(false)

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <Link to="/" className={styles.logoLink} onClick={close}>
          Ensar Ince
        </Link>

        <nav className={styles.navLinks}>
          {NAV_ITEMS.map(({ to, label }) => (
            <Link key={to} to={to} className={styles.navLink}>
              {label}
            </Link>
          ))}
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`} />
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`} />
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`} />
        </button>
      </div>

      {isMenuOpen && (
        <nav className={styles.mobileMenu}>
          {NAV_ITEMS.map(({ to, label }) => (
            <Link key={to} to={to} className={styles.mobileLink} onClick={close}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
