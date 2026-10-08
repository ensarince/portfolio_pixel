import { Suspense, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import MountainScene, { POINTS } from './MountainScene'
import { ICONS, DragIcon } from './icons'
import portrait from '../../assets/1.png'
import styles from './MountainLayer.module.scss'

// Routes that open as a panel over the living map
const PANEL_ROUTES: Record<string, string> = {
  '/portfolio': 'Work',
  '/skills': 'Skills',
  '/about': 'About',
  '/blog': 'Blog',
  '/climbs': 'Climbs',
  '/gallery': 'Gallery',
}

// Routes where the map gets out of the way entirely — reading needs calm
function isFullPage(path: string) {
  return (
    path.startsWith('/admin') ||
    /^\/blog\/[^/]+$/.test(path) ||
    /^\/climbs\/[^/]+$/.test(path)
  )
}

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

export default function MountainLayer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)
  const [use3D, setUse3D] = useState(false)
  const [dragged, setDragged] = useState(false)
  const [panelPx, setPanelPx] = useState(0)

  useEffect(() => {
    setUse3D(canRender3D())
  }, [])

  // Mirrors the panel's own width rule so the camera knows how much of the
  // scene is about to be covered
  useEffect(() => {
    const measure = () => {
      const rail = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--rail-w')
      ) || 0
      const gap = 5 * 16
      setPanelPx(Math.max(0, Math.min(880, window.innerWidth - rail - gap)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const routeLabel = PANEL_ROUTES[pathname] ?? null
  const hidden = isFullPage(pathname)
  const atHome = pathname === '/'

  // The marker the camera swings to; hover wins while the map is free
  const focus = routeLabel
  const active = hovered ?? routeLabel

  const select = (action: string) => navigate(action)

  if (hidden) return null

  return (
    <>
      {/* The scene sits at the bottom of the stack; an open panel covers it */}
      <div className={styles.canvasLayer}>
        {use3D && (
          <Suspense fallback={<div className={styles.loading} />}>
            <MountainScene
              activeLabel={active}
              focus={focus}
              paused={false}
              panelPx={panelPx}
              onHover={setHovered}
              onSelect={select}
              onDragStart={() => setDragged(true)}
            />
          </Suspense>
        )}
      </div>

      {/* Fixed rail: its own surface, so the type never has to fight the
          terrain for contrast, and nothing shifts when a panel opens */}
      <aside className={styles.rail}>
        <header className={styles.identity}>
          <Link to="/about" className={styles.portraitBtn} aria-label="About Ensar Ince">
            <img src={portrait} alt="Ensar Ince" className={styles.portrait} />
          </Link>
          <h1 className={styles.name}>
            <Link to="/" className={styles.nameLink}>Ensar Ince</Link>
          </h1>
          <p className={styles.role}>Full-stack developer · Saarbrücken</p>
        </header>

        <nav className={styles.index} aria-label="Sections">
          {POINTS.map((p) => {
            const Icon = ICONS[p.icon]
            return (
              <Link
                key={p.label}
                to={p.action}
                className={styles.indexRow}
                data-active={active === p.label}
                data-current={routeLabel === p.label}
                onPointerEnter={() => setHovered(p.label)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(p.label)}
                onBlur={() => setHovered(null)}
              >
                <Icon className={styles.indexIcon} />
                <span className={styles.indexLabel}>{p.label}</span>
              </Link>
            )
          })}
        </nav>

        <footer className={styles.railFooter}>
          <a className={styles.cornerLink} href="mailto:ensrnce@gmail.com">
            ensrnce@gmail.com
          </a>
          <Link className={styles.cornerLink} to="/about">
            About &amp; CV
          </Link>
          <span className={styles.socials}>
            <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 26, height: 26 }} url="https://github.com/ensarince" target="_blank" rel="noopener noreferrer" />
            <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 26, height: 26 }} url="https://www.linkedin.com/in/ensar-ince-67a580155/" target="_blank" rel="noopener noreferrer" />
            <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 26, height: 26 }} url="https://www.instagram.com/rakionrocks" target="_blank" rel="noopener noreferrer" />
            <SocialIcon fgColor="#1A1A1A" bgColor="transparent" style={{ width: 26, height: 26 }} url="https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g" target="_blank" rel="noopener noreferrer" />
          </span>
        </footer>
      </aside>

      {use3D && !dragged && atHome && (
        <span className={styles.dragHint}>
          <DragIcon className={styles.dragIcon} />
          Drag to turn the map
        </span>
      )}
    </>
  )
}
