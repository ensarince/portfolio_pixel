import { useState, useEffect } from 'react'
import styles from "./BlogPostPage.module.scss"
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import { BlogPost } from '../../typings'
import { sanityClient } from '../../sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PortableText } from '@portabletext/react'
import { CircularProgress } from '@mui/material'

type Props = {
  posts: BlogPost[] | undefined
}

function BlogPostPage({ posts }: Props) {

  const { id } = useParams()
  const [post, setPost] = useState<any>()

  useEffect(() => {
    setPost(posts?.filter(post => post._id === id))
  }, [posts])

  //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  return (
    <>
      <Header />
      {post ?
        <div className={styles.container}>
          <div className={styles.post}>
            <h3 className={styles.postTitle}>{post[0]?.title}</h3>
            <img
              className={styles.postImage}
              src={urlFor(post[0]?.mainImage)?.url()}
              alt="post image"
            />
            <div className={styles.postSummary}>
              <div style={{ width: '100%', backgroundColor: '#A9C5B9', height: '1px', marginTop: "0.8rem" }}></div>
              <p style={{ width: '100%', textAlign: 'justify', padding: '0.3rem' }}>{post[0]?.summary}</p>
              <div style={{ width: '100%', backgroundColor: '#A9C5B9', height: '1px' }}></div>
            </div>
            <div style={{ alignSelf: "flex-start" }}>
              <PortableText
                value={post[0]?.body}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
              <p className={styles.postDate}>{new Date(post[0]?._createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>
        :
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress sx={{ color: "#5187C4" }} size={100} />
        </div>
      }
    </>
  )
}

export default BlogPostPage