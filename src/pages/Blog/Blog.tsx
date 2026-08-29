import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { BlogPost } from '../../typings'
import styles from './Blog.module.scss'
import { useNavigate } from 'react-router-dom'

type Props = { posts: BlogPost[] | undefined }

type Filter = 'all' | 'climbing' | 'coding' | 'other'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'climbing', label: 'Climbing' },
  { key: 'coding', label: 'Coding' },
  { key: 'other', label: 'Other' },
]

const CAT_MAP: Record<string, string> = {
  '91e45e40-f3a0-4488-85e9-fb87eafac059': 'climbing',
  '807d499a-f06d-4ef5-a1e9-c4413d9be7eb': 'coding',
  '85ab035c-ede8-4700-8c9b-c9eddf6199d5': 'other',
}

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return '' }
}

export default function Blog({ posts }: Props) {
  const [filtered, setFiltered] = useState<BlogPost[]>([])
  const [active, setActive] = useState<Filter>('all')
  const navigate = useNavigate()

  useEffect(() => {
    if (!posts) return
    if (active === 'all') { setFiltered(posts); return }
    setFiltered(posts.filter(p => CAT_MAP[p.categories?.[0]?._ref] === active))
  }, [posts, active])

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Field Notes</h1>
            <p className={styles.pageSub}>{filtered.length} note{filtered.length !== 1 ? 's' : ''}</p>
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

          <div className={styles.postList}>
            {filtered.map((post, i) => {
              const catKey = CAT_MAP[post.categories?.[0]?._ref] ?? 'other'
              const isFirst = i === 0 && active === 'all'
              return (
                <div
                  key={post._id}
                  className={isFirst ? styles.postRowFeatured : styles.postRow}
                  onClick={() => navigate(`/blog/${post._id}`)}
                >
                  <span className={styles.postNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.postBody}>
                    <div className={styles.postMeta}>
                      <span className={styles.postCategory} data-cat={catKey}>{catKey}</span>
                      <span className={styles.postDate}>{formatDate(post._createdAt)}</span>
                    </div>
                    <p className={styles.postTitle}>{post.title}</p>
                    {post.summary && <p className={styles.postSummary}>{post.summary}</p>}
                  </div>
                  <span className={styles.postArrow}>→</span>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && <div className={styles.empty}>No field notes yet</div>}
        </div>
      </div>
    </>
  )
}
