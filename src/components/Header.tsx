import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from "./Header.module.scss"

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/skills', label: 'Skills' },
  { to: '/blog', label: 'Blog' },
]

type Props = {}

export default function Header({}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <div className={styles.navLinks}>
          {NAV_ITEMS.map(({ to, label }) => (
            <Link key={to} to={to} onClick={closeMenu}>
              <h4>{label}</h4>
            </Link>
          ))}
        </div>
        <button className={styles.hamburger} onClick={() => setIsMenuOpen(o => !o)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
        </button>
      </div>
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(({ to, label }) => (
            <Link key={to} to={to} onClick={closeMenu}>
              <h4>{label}</h4>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
