import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import { Climb } from '../../typings'
import styles from './Climbs.module.scss'

type Props = { climbs: Climb[] | undefined }
type Filter = 'all' | 'boulder' | 'sport' | 'trad' | 'featured'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'featured', label: 'Featured' },
  { key: 'sport', label: 'Sport' },
  { key: 'boulder', label: 'Boulder' },
  { key: 'trad', label: 'Trad' },
]

export default function Climbs({ climbs }: Props) {
  const [filtered, setFiltered] = useState<Climb[]>([])
  const [active, setActive] = useState<Filter>('all')

  useEffect(() => {
    if (!climbs) return
    if (active === 'all') { setFiltered(climbs); return }
    if (active === 'featured') { setFiltered(climbs.filter(c => c.featured)); return }
    setFiltered(climbs.filter(c => c.category === active))
  }, [climbs, active])

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Climbs</h1>
            <p className={styles.pageSub}>{filtered.length} route{filtered.length !== 1 ? 's' : ''} logged</p>
          </div>

          <div className={styles.filters}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${active === f.key ? styles.active : ''}`}
                onClick={() => setActive(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={styles.routeTable}>
            {filtered.map((climb, i) => (
              <div
                key={climb._id}
                className={styles.routeRow}
              >
                <span className={styles.routeNum}>{String(i + 1).padStart(2, '0')}</span>

                <div className={styles.routeBody}>
                  <p className={styles.routeName}>{climb.title}</p>
                  <div className={styles.routeDetails}>
                    {climb.location && (
                      <span className={styles.routeLocation}>{climb.location}</span>
                    )}
                    {climb.description && (
                      <span className={styles.routeDesc}>{climb.description}</span>
                    )}
                  </div>
                  {climb.hasSaga && (
                    <Link to={`/climbs/${climb._id}`} className={styles.sagaLink}>
                      Read the saga →
                    </Link>
                  )}
                </div>

                <span className={styles.routeGrade}>{climb.difficulty}</span>
                <span className={styles.routeType} data-type={climb.category}>{climb.category}</span>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={styles.empty}>No routes found</div>
          )}
        </div>
      </div>
    </>
  )
}
