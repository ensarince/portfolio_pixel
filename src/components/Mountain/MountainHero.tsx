import { Suspense, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import MountainScene, { POINTS } from './MountainScene'
import { ICONS, DragIcon } from './icons'
import AboutPanel from './AboutPanel'
import portrait from '../../assets/1.png'
import styles from './MountainHero.module.scss'

function canRender3D() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(max-width: 900px)').matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

export default function MountainHero() {
  const [active, setActive] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [use3D, setUse3D] = useState(false)
  const [dragged, setDragged] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setUse3D(canRender3D())
  }, [])

  const select = (action: string) => {
    if (action === 'about') setAboutOpen(true)
    else navigate(action)
  }

  return (
    <section className={styles.hero}>
      {use3D && (
        <Suspense fallback={<div className={styles.loading} />}>
          <MountainScene
            activeLabel={active}
            onHover={setActive}
            onSelect={select}
            onDragStart={() => setDragged(true)}
          />
        </Suspense>
      )}

      <div className={styles.overlay}>
        <header className={styles.identity}>
          <button
            className={styles.portraitBtn}
            onClick={() => setAboutOpen(true)}
            aria-label="About Ensar Ince"
          >
            <img src={portrait} alt="Ensar Ince" className={styles.portrait} />
          </button>
          <div>
            <h1 className={styles.name}>Ensar Ince</h1>
            <p className={styles.role}>Full-stack developer · Saarbrücken</p>
          </div>
        </header>

        {/* Route index — always reachable, mirrors the markers on the map */}
        <nav className={styles.index} aria-label="Sections">
          {POINTS.map((p) => {
            const Icon = ICONS[p.icon]
            const common = {
              className: styles.indexRow,
              'data-active': active === p.label,
              onPointerEnter: () => setActive(p.label),
              onPointerLeave: () => setActive(null),
              onFocus: () => setActive(p.label),
              onBlur: () => setActive(null),
            }
            const inner = (
              <>
                <Icon className={styles.indexIcon} />
                <span className={styles.indexLabel}>{p.label}</span>
              </>
            )
            return p.action === 'about' ? (
              <button key={p.label} {...common} onClick={() => setAboutOpen(true)}>
                {inner}
              </button>
            ) : (
              <Link key={p.label} to={p.action} {...common}>
                {inner}
              </Link>
            )
          })}
        </nav>

        <footer className={styles.footer}>
          {use3D && !dragged && (
            <span className={styles.dragHint}>
              <DragIcon className={styles.dragIcon} />
              Drag to turn the map
            </span>
          )}

          <div className={styles.contact}>
            <a className={styles.cornerLink} href="mailto:ensrnce@gmail.com">
              ensrnce@gmail.com
            </a>
            <button className={styles.cornerLink} onClick={() => setAboutOpen(true)}>
              About &amp; CV
            </button>
            <span className={styles.socials}>
              <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 28, height: 28 }} url="https://github.com/ensarince" target="_blank" rel="noopener noreferrer" />
              <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 28, height: 28 }} url="https://www.linkedin.com/in/ensar-ince-67a580155/" target="_blank" rel="noopener noreferrer" />
              <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 28, height: 28 }} url="https://www.instagram.com/rakionrocks" target="_blank" rel="noopener noreferrer" />
              <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 28, height: 28 }} url="https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g" target="_blank" rel="noopener noreferrer" />
            </span>
          </div>
        </footer>
      </div>

      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </section>
  )
}
