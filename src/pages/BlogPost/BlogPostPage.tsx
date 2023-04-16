import React, {useState, useEffect} from 'react'
import styles from "./BlogPostPage.module.scss"
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import { BlogPost } from '../../typings'
import { sanityClient } from '../../sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import fifth from "../../assets/_variables.scss"

type Props = {
  posts: BlogPost[] | undefined
}

function BlogPostPage({posts}: Props) {

const {id} = useParams()
const [post, setPost] = useState<any>()

useEffect(() => {
  setPost(posts?.filter(post => post._id === id))
}, [posts])


  //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)
  
  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  console.log(post)

  return (
    <>
      <Header />
          {post &&
          <div className={styles.container}>
            <div className={styles.post}>
              <img
                  className={styles.postImage}
                  src={urlFor(post[0]?.mainImage)?.url()}
                  alt="post image"
                />
                <h3 className={styles.postTitle}>{post[0]?.title}</h3>
                <div className={styles.postSummary}><h4>Summary: &nbsp;</h4>{post[0]?.summary}</div>
                <p className={styles.postText}>
                  {post[0]?.body}
                </p>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"1rem"}}>
                  <p className={styles.postDate}>{new Date(post[0]?._createdAt).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>
          }
    </>
  )
}

export default BlogPostPage