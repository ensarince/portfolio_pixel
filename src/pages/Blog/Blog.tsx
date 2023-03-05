import React from 'react'
import Header from '../../components/Header'
import { BlogPost } from '../../typings'
import styles from "./Blog.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'

type Props = {
  posts: BlogPost[] | undefined
}

export default function Blog({posts}: Props) {

    //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }

  console.log(posts)
  return (
    <>
      <Header />

      <div className={styles.container}>
      {posts?.map((item, index) => (
          <div key={item._id} className={styles.post}>
{/*             <img className={styles.postImage} src={urlFor(item?.mainImage)?.url()} alt="post image" />              
 */}              <h3>{item.title}</h3>
              {/* <p>{item.summary}</p> */}
{/*               {item.technologies.map((skill, index) => (        
                <div key={skill._id}  className={styles.project_technologies}>
                    <img className={styles.technology} src={urlFor((skill)?.image).url()} alt="tech image" />
                </div>
              ))} */}
              <p className={styles.date}>{item.summary}</p>
          </div>
        ))}

      </div>
    </>
      
  )
}