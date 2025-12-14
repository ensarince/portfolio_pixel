import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from "./Header.module.scss"

type Props = {}

export default function Header({}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <div className={styles.navLinks}>
          <Link to="/" onClick={closeMenu}>
            <h4>Home</h4>
          </Link>
          <Link to="/about" onClick={closeMenu}>
            <h4>About</h4>
          </Link>
          <Link to="/portfolio" onClick={closeMenu}>
            <h4>Portfolio</h4>
          </Link>
          <Link to="/skills" onClick={closeMenu}>
            <h4>Skills</h4>
          </Link>
          <Link to="/blog" onClick={closeMenu}>
            <h4>Blog</h4>
          </Link>
          <Link to="/gallery" onClick={closeMenu}>
            <h4>Gallery</h4>
          </Link>
          <Link to="/climbs" onClick={closeMenu}>
            <h4>Climbs</h4>
          </Link>
        </div>
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
        </button>
      </div>
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" onClick={closeMenu}>
            <h4>Home</h4>
          </Link>
          <Link to="/about" onClick={closeMenu}>
            <h4>About</h4>
          </Link>
          <Link to="/portfolio" onClick={closeMenu}>
            <h4>Portfolio</h4>
          </Link>
          <Link to="/skills" onClick={closeMenu}>
            <h4>Skills</h4>
          </Link>
          <Link to="/blog" onClick={closeMenu}>
            <h4>Blog</h4>
          </Link>
          <Link to="/gallery" onClick={closeMenu}>
            <h4>Gallery</h4>
          </Link>
          <Link to="/climbs" onClick={closeMenu}>
            <h4>Climbs</h4>
          </Link>
        </div>
      )}
    </div>
  )
}