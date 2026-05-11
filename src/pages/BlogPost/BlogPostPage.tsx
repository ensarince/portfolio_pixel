import { useState, useEffect } from 'react'
import styles from "./BlogPostPage.module.scss"
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { BlogPost } from '../../typings'
import { sanityClient } from '../../sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PortableText } from '@portabletext/react'
import { CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type Props = {
  posts: BlogPost[] | undefined
}

function BlogPostPage({ posts }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>()

  useEffect(() => {
    setPost(posts?.filter(post => post._id === id))
  }, [posts])

  const builder = imageUrlBuilder(sanityClient)
  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  return (
    <>
      <Header />
      <button
        className={styles.backButton}
        onClick={() => navigate('/blog')}
        aria-label="Back to blog posts"
      >
        <ArrowBackIcon />
      </button>

      {post ? (
        <div className={styles.container}>
          <article className={styles.post}>
            <h1 className={styles.postTitle}>{post[0]?.title}</h1>

            {post[0]?.summary && (
              <p className={styles.postSummary}>{post[0]?.summary}</p>
            )}

            {post[0]?.mainImage && (
              <img
                className={styles.postImage}
                src={urlFor(post[0]?.mainImage)?.url()}
                alt={post[0]?.title}
              />
            )}

            <div className={styles.postBody}>
              <PortableText value={post[0]?.body} />
            </div>

            <div className={styles.postFooter}>
              <span className={styles.postDate}>
                {new Date(post[0]?._createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
              <button className={styles.backLinkBottom} onClick={() => navigate('/blog')}>
                ← Back to blog
              </button>
            </div>
          </article>
        </div>
      ) : (
        <div className={styles.loading}>
          <CircularProgress sx={{ color: '#C0421B' }} size={48} />
        </div>
      )}
    </>
  )
}

export default BlogPostPage
