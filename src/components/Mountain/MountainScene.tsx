import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ICONS, IconKey } from './icons'
import styles from './MountainScene.module.scss'

const SIZE = 16
const SEG = 132
const PEAK = 4.8

// Matterhorn-like horn: a steep four-ridged pyramid with a leaning summit.
// Arêtes bulge the silhouette outward; the faces between them stay steep and broken.
function heightAt(x: number, z: number) {
  // Lean the upper mass so the summit hooks over, as a glacial horn does
  const r0 = Math.hypot(x, z)
  const t0 = Math.max(0, 1 - r0 / 4.3)
  const sx = x - 0.5 * t0 * t0
  const sz = z + 0.24 * t0 * t0

  const r = Math.hypot(sx, sz)
  const theta = Math.atan2(sz, sx)

  // Four arêtes, rotated off-axis so no face reads as symmetric
  const arete = Math.pow(Math.abs(Math.cos(2 * (theta - 0.45))), 0.6)
  const reach = 2.75 + arete * 1.55

  const t = Math.max(0, 1 - r / reach)
  if (t <= 0) {
    // Scree apron spilling out from the base
    const skirt = Math.max(0, 1 - (r - reach) / 2.6)
    return Math.pow(skirt, 2.2) * 0.42 + Math.cos(sx * 4.3 - sz * 3.7) * 0.03 * skirt
  }

  // Steep, near-straight faces with a sharp cap
  let h = Math.pow(t, 1.12) * PEAK

  // Raise the arêtes so the ridges stand proud of the faces
  h += arete * Math.pow(t, 1.5) * 0.9

  // Broken rock — stronger on the upper faces, quiet near the base
  const rock =
    Math.sin(sx * 3.3 + sz * 2.1) * 0.15 +
    Math.cos(sz * 4.1 - sx * 2.7) * 0.12 +
    Math.sin(sx * 7.9 + sz * 6.3) * 0.06 +
    Math.cos(sx * 12.1 - sz * 10.7) * 0.03
  h += rock * Math.min(1, t * 2.3)

  return h
}

// Local steepness, used to settle snow only where it could actually hold
function slopeAt(x: number, z: number) {
  const e = 0.09
  const dx = heightAt(x + e, z) - heightAt(x - e, z)
  const dz = heightAt(x, z + e) - heightAt(x, z - e)
  return Math.hypot(dx, dz) / (2 * e)
}

export type Point = {
  label: string
  icon: IconKey
  action: string
  x: number
  z: number
  /** Kept in the map but not offered yet — its route still resolves if visited */
  hidden?: boolean
}

// Ordered by how fast a recruiter needs them: the hiring signal sits highest on
// the face and nearest the camera at rest, the personal work lower down.
// Nothing is placed on the summit — it stays clear.
export const POINTS: Point[] = [
  { label: 'Work', icon: 'work', action: '/portfolio', x: -0.7, z: 1.05 },
  { label: 'Skills', icon: 'skills', action: '/skills', x: 1.2, z: 0.7 },
  { label: 'About', icon: 'about', action: 'about', x: 1.55, z: -1.25 },
  { label: 'Blog', icon: 'blog', action: '/blog', x: -2.0, z: -0.6 },
  { label: 'Climbs', icon: 'climbs', action: '/climbs', x: 0.3, z: -2.6, hidden: true },
  { label: 'Gallery', icon: 'gallery', action: '/gallery', x: 0.55, z: 3.12 },
]

export const VISIBLE_POINTS = POINTS.filter((p) => !p.hidden)

function Terrain({ meshRef }: { meshRef: React.RefObject<THREE.Mesh> }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors: number[] = []

    const cMeadow = new THREE.Color('#2A5039')
    const cScree = new THREE.Color('#5E6358')
    const cRock = new THREE.Color('#6B6760')
    const cRockHi = new THREE.Color('#8E897F')
    const cSnow = new THREE.Color('#F4F1EA')
    const c = new THREE.Color()
    const rockTone = new THREE.Color()

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = heightAt(x, z)
      pos.setY(i, y)

      const t = THREE.MathUtils.clamp(y / PEAK, 0, 1)

      // Rock body: meadow at the foot, scree, then bare rock lightening with height
      if (t < 0.1) rockTone.lerpColors(cMeadow, cScree, t / 0.1)
      else if (t < 0.3) rockTone.lerpColors(cScree, cRock, (t - 0.1) / 0.2)
      else rockTone.lerpColors(cRock, cRockHi, (t - 0.3) / 0.7)

      // Snow settles high up and only where the ground is not near-vertical
      const slope = slopeAt(x, z)
      const flat = 1 / (1 + slope * slope * 1.5)
      const snow = THREE.MathUtils.clamp((t - 0.42) / 0.38, 0, 1) * flat * 1.65
      c.lerpColors(rockTone, cSnow, THREE.MathUtils.clamp(snow, 0, 1))

      colors.push(c.r, c.g, c.b)
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
    </mesh>
  )
}

function Marker({
  point,
  active,
  onHover,
  onSelect,
  occluder,
}: {
  point: Point
  active: boolean
  onHover: (label: string | null) => void
  onSelect: (action: string) => void
  occluder: React.RefObject<THREE.Mesh>
}) {
  const anchor = useRef<THREE.Group>(null)
  const Icon = ICONS[point.icon]
  const y = useMemo(() => heightAt(point.x, point.z), [point.x, point.z])

  useFrame((state) => {
    if (!anchor.current) return
    const bob = Math.sin(state.clock.elapsedTime * 1.5 + point.x) * 0.05
    const lift = active ? 0.3 : 0
    anchor.current.position.y = THREE.MathUtils.lerp(
      anchor.current.position.y,
      y + 0.82 + bob + lift,
      0.12
    )
  })

  return (
    <group position={[point.x, 0, point.z]}>
      <mesh position={[0, y + 0.41, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.82, 6]} />
        <meshBasicMaterial color={active ? '#D94000' : '#6A6258'} transparent opacity={active ? 0.8 : 0.45} />
      </mesh>

      <mesh position={[0, y + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.075, 14]} />
        <meshBasicMaterial color={active ? '#D94000' : '#1A1A1A'} transparent opacity={0.5} />
      </mesh>

      <group ref={anchor} position={[0, y + 0.82, 0]}>
        <Html center distanceFactor={8} occlude={[occluder]} zIndexRange={[20, 0]}>
          <button
            className={styles.tag}
            data-active={active}
            onPointerEnter={() => onHover(point.label)}
            onPointerLeave={() => onHover(null)}
            onClick={() => onSelect(point.action)}
          >
            <Icon className={styles.tagIcon} />
            <span className={styles.tagLabel}>{point.label}</span>
          </button>
        </Html>
      </group>
    </group>
  )
}

// Swings the focused marker to the front and slides the massif clear of an
// open panel. Runs off the shared OrbitControls so user drags still win.
function CameraDirector({ focus, panelPx }: { focus: string | null; panelPx: number }) {
  const controls = useThree((s) => s.controls) as any
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)

  useFrame(() => {
    if (!controls) return

    // Translate the panel's pixel width into world units, so the massif lands in
    // the strip left uncovered no matter the viewport
    let wantX = 0
    if (focus && panelPx > 0 && size.width > 0) {
      const dist = camera.position.distanceTo(controls.target)
      const vH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360)
      const vW = vH * (size.width / size.height)
      wantX = (panelPx / size.width) * vW * 0.5
    }
    controls.target.x += (wantX - controls.target.x) * 0.055

    if (focus) {
      const p = POINTS.find((q) => q.label === focus)
      if (p) {
        const want = Math.atan2(p.x, p.z)
        const cur = controls.getAzimuthalAngle()
        let d = want - cur
        while (d > Math.PI) d -= Math.PI * 2
        while (d < -Math.PI) d += Math.PI * 2
        if (Math.abs(d) > 0.004) controls.setAzimuthalAngle(cur + d * 0.055)
      }
    }

    controls.update()
  })

  return null
}

export default function MountainScene({
  activeLabel,
  focus,
  paused,
  panelPx,
  onHover,
  onSelect,
  onDragStart,
}: {
  activeLabel: string | null
  focus: string | null
  paused: boolean
  panelPx: number
  onHover: (label: string | null) => void
  onSelect: (action: string) => void
  onDragStart: () => void
}) {
  const terrain = useRef<THREE.Mesh>(null)
  const [spinning, setSpinning] = useState(true)
  const resume = useRef<number>()

  return (
    <Canvas
      className={styles.canvas}
      dpr={[1, 1.75]}
      camera={{ position: [0, 4.2, 12.2], fov: 40 }}
      gl={{ antialias: true }}
      frameloop={paused ? 'never' : 'always'}
    >
      <color attach="background" args={['#F0EDE5']} />
      <fog attach="fog" args={['#F0EDE5', 12, 25]} />

      <hemisphereLight args={['#ffffff', '#C4BDAE', 0.72]} />
      <directionalLight position={[7, 8, 5]} intensity={1.35} />
      <directionalLight position={[-8, 3.5, -6]} intensity={0.34} color="#9FB6C9" />

      <Terrain meshRef={terrain} />
      {VISIBLE_POINTS.map((p) => (
        <Marker
          key={p.label}
          point={p}
          active={activeLabel === p.label}
          onHover={onHover}
          onSelect={onSelect}
          occluder={terrain}
        />
      ))}

      <CameraDirector focus={focus} panelPx={panelPx} />

      <OrbitControls
        makeDefault
        target={[0, 1.7, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        rotateSpeed={0.5}
        minPolarAngle={0.95}
        maxPolarAngle={1.46}
        autoRotate={spinning && !focus}
        autoRotateSpeed={0.32}
        onStart={() => {
          window.clearTimeout(resume.current)
          setSpinning(false)
          onDragStart()
        }}
        onEnd={() => {
          window.clearTimeout(resume.current)
          resume.current = window.setTimeout(() => setSpinning(true), 3500)
        }}
      />
    </Canvas>
  )
}
