import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { Project } from '../../typings'
import styles from './Projects.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'

type Props = { projects: Project[] | undefined }
type FilterType = 'all' | 'personal' | 'academic' | 'professional' | 'opensource' | 'featured'

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'featured', label: 'Featured' },
  { key: 'professional', label: 'Professional' },
  { key: 'personal', label: 'Personal' },
  { key: 'academic', label: 'Academic' },
  { key: 'opensource', label: 'Open Source' },
]

const builder = imageUrlBuilder(sanityClient)

export default function Projects({ projects }: Props) {
  const [filtered, setFiltered] = useState<Project[]>([])
  const [active, setActive] = useState<FilterType>('all')

  useEffect(() => {
    if (!projects) return
    if (active === 'all') { setFiltered(projects); return }
    if (active === 'featured') { setFiltered(projects.filter(p => p.featured)); return }
    setFiltered(projects.filter(p => p.category === active))
  }, [projects, active])

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Portfolio</h1>
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
            {filtered.map((project, i) => (
              <div
                key={project._id}
                className={styles.routeRow}
                onClick={() => project.linkToBuild && window.open(project.linkToBuild, '_blank', 'noopener,noreferrer')}
              >
                <span className={styles.routeNum}>{String(i + 1).padStart(2, '0')}</span>

                <div className={styles.routeBody}>
                  <p className={styles.routeName}>{project.title}</p>
                  <div className={styles.routeMeta}>
                    {project.summary && <p className={styles.routeDesc}>{project.summary}</p>}
                    <div className={styles.techChips}>
                      {project.technologies?.slice(0, 4).map(t => (
                        <span key={t._id} className={styles.techChip}>{t.title}</span>
                      ))}
                    </div>
                  </div>
                  {(project.linkToBuild || project.ndaRestricted) && (
                    <div className={styles.routeLinks}>
                      {project.linkToBuild && (
                        <a
                          href={project.linkToBuild}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.routeLink}
                          onClick={e => e.stopPropagation()}
                        >
                          Live →
                        </a>
                      )}
                      {project.ndaRestricted && (
                        <span className={styles.routeLink} style={{ color: 'var(--text-2)', cursor: 'default' }}>
                          NDA protected
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span
                  className={styles.routeType}
                  data-type={project.category || 'personal'}
                >
                  {project.category || 'personal'}
                </span>

                <span className={styles.routeArrow}>→</span>
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
