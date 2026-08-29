import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import Header from '../../components/Header'
import { sanityClient } from '../../sanity'
import { BlogPost } from '../../typings'
import styles from './BlogPostPage.module.scss'

type Props = { posts: BlogPost[] | undefined }

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

function formatDate(str?: string) {
  if (!str) return ''
  try {
    return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return '' }
}

export default function BlogPostPage({ posts }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const found = posts?.find(p => p._id === id)
    setPost(found ?? null)
  }, [posts, id])

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <button className={styles.back} onClick={() => navigate('/blog')}>
            ← Field Notes
          </button>

          {!post && posts !== undefined && (
            <div className={styles.loading}>Not found</div>
          )}

          {!post && posts === undefined && (
            <div className={styles.loading}>Loading…</div>
          )}

          {post && (
            <article className={styles.article}>
              <div className={styles.postMeta}>
                <span className={styles.postDate}>{formatDate(post._createdAt)}</span>
              </div>

              <h1 className={styles.postTitle}>{post.title}</h1>

              {post.summary && (
                <p className={styles.postSummary}>{post.summary}</p>
              )}

              {post.mainImage && (
                <img
                  className={styles.postImage}
                  src={urlFor(post.mainImage).width(1200).url()}
                  alt={post.title}
                />
              )}

              <div className={styles.postBody}>
                <PortableText
                  value={post.body}
                  components={{
                    types: {
                      image: ({ value }) =>
                        value?.asset ? (
                          <img
                            src={urlFor(value).width(800).url()}
                            alt={value.alt ?? ''}
                          />
                        ) : null,
                    },
                  }}
                />
              </div>

              <div className={styles.postFooter}>
                <span className={styles.postDate}>{formatDate(post._createdAt)}</span>
                <button className={styles.backLinkBottom} onClick={() => navigate('/blog')}>
                  ← Back to field notes
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  )
}
