import { useState, useMemo } from 'react'
import Header from '../../components/Header'
import { SupabasePost } from '../../typings'
import styles from './Blog.module.scss'
import { useNavigate } from 'react-router-dom'

type Props = { posts: SupabasePost[] | undefined }
type Filter = 'all' | 'climbing' | 'coding' | 'other'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'climbing', label: 'Climbing' },
  { key: 'coding', label: 'Coding' },
  { key: 'other', label: 'Other' },
]

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatDay(str: string) {
  try { return new Date(str).getDate() } catch { return '' }
}

export default function Blog({ posts }: Props) {
  const [active, setActive] = useState<Filter>('all')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    if (!posts) return []
    if (active === 'all') return posts
    return posts.filter(p => p.category === active)
  }, [posts, active])

  const grouped = useMemo(() => {
    const byYear: Record<number, Record<number, SupabasePost[]>> = {}
    filtered.forEach(post => {
      const d = new Date(post.created_at)
      const y = d.getFullYear()
      const m = d.getMonth()
      if (!byYear[y]) byYear[y] = {}
      if (!byYear[y][m]) byYear[y][m] = []
      byYear[y][m].push(post)
    })
    return byYear
  }, [filtered])

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Blog</h1>
            <p className={styles.pageSub}>{filtered.length} post{filtered.length !== 1 ? 's' : ''}</p>
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

          {years.length === 0 && (
            <div className={styles.empty}>No posts yet.</div>
          )}

          {years.map(year => (
            <div key={year} className={styles.yearBlock}>
              <div className={styles.yearLabel}>{year}</div>
              {Object.keys(grouped[year]).map(Number).sort((a, b) => b - a).map(month => (
                <div key={month} className={styles.monthBlock}>
                  <div className={styles.monthLabel}>{MONTH_NAMES[month]}</div>
                  {grouped[year][month].map(post => (
                    <div
                      key={post.id}
                      className={styles.postRow}
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      <span className={styles.postDay}>{formatDay(post.created_at)}</span>
                      <div className={styles.postInfo}>
                        <span className={styles.postTitle}>{post.title}</span>
                        {post.summary && <span className={styles.postSummary}>{post.summary}</span>}
                      </div>
                      <span className={styles.postCat} data-cat={post.category}>{post.category}</span>
                      <span className={styles.postArrow}>→</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
