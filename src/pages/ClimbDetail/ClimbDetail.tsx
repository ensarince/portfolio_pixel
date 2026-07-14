import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import Header from '../../components/Header'
import { sanityClient } from '../../sanity'
import { getClimb } from '../../services/getClimb'
import { Climb } from '../../typings'
import styles from './ClimbDetail.module.scss'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

const CATEGORY_LABEL: Record<string, string> = {
  boulder: 'Bouldering',
  sport: 'Sport',
  trad: 'Trad',
  alpine: 'Alpine',
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  } catch {
    return dateStr
  }
}

export default function ClimbDetail() {
  const { id } = useParams<{ id: string }>()
  const [climb, setClimb] = useState<Climb | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getClimb(id).then(data => {
      setClimb(data)
      setLoading(false)
    })
  }, [id])

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link to="/climbs" className={styles.back}>← All climbs</Link>

        {loading && <div className={styles.loading}>Loading…</div>}

        {!loading && !climb && (
          <p className={styles.noSaga}>Climb not found.</p>
        )}

        {!loading && climb && (
          <>
            <div className={styles.meta}>
              <div className={styles.routeMeta}>
                <span className={styles.grade}>{climb.difficulty}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.category}>{CATEGORY_LABEL[climb.category] ?? climb.category}</span>
                {climb.location && (
                  <>
                    <span className={styles.dot}>·</span>
                    <span className={styles.location}>{climb.location}</span>
                  </>
                )}
              </div>

              <h1 className={styles.title}>{climb.title}</h1>

              {climb.dateCompleted && (
                <div className={styles.dateRow}>{formatDate(climb.dateCompleted)}</div>
              )}
            </div>

            {climb.image?.asset && (
              <img
                src={urlFor(climb.image).width(1200).height(675).url()}
                alt={climb.title}
                className={styles.heroImage}
              />
            )}

            {climb.story && climb.story.length > 0 && (
              <div className={styles.narrative}>
                <PortableText
                  value={climb.story}
                  components={{
                    types: {
                      image: ({ value }) =>
                        value?.asset ? (
                          <img
                            src={urlFor(value).width(800).url()}
                            alt={value.alt ?? ''}
                            style={{ width: '100%', borderRadius: 2, margin: '1.5rem 0' }}
                          />
                        ) : null,
                    },
                  }}
                />
              </div>
            )}

            {!climb.story && climb.description && (
              <div className={styles.narrative}>
                <p>{climb.description}</p>
              </div>
            )}

            {climb.diaryEntries && climb.diaryEntries.length > 0 && (
              <div className={styles.diarySection}>
                <p className={styles.diaryHeading}>Session log</p>
                <div className={styles.timeline}>
                  {climb.diaryEntries.map((entry, i) => (
                    <div key={entry._key ?? i} className={styles.entry}>
                      <div className={styles.entryHeader}>
                        {entry.sessionDate && (
                          <span className={styles.entryDate}>{entry.sessionDate}</span>
                        )}
                        {entry.sessionNum != null && (
                          <span className={styles.entryNum}>Session {entry.sessionNum}</span>
                        )}
                      </div>
                      {entry.note && <p className={styles.entryNote}>{entry.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
