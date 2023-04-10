import React, {useState, useEffect} from 'react'
import Header from '../../components/Header'
import { BlogPost, Category } from '../../typings'
import styles from "./Blog.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

type Props = {
  posts: BlogPost[] 
}

export default function Blog({posts}: Props) {

  //const [preferredCategory, setPreferredCategory] = useState<string | undefined>();
/*   const [filteredPosts, setFilteredPosts] = useState<BlogPost[] | undefined>(posts);

  const filterPosts = (preferredCategory: string | undefined): void => {
    const filtered = posts.filter(post => post.categories[0]._ref === preferredCategory);
    setFilteredPosts(filtered);
  }; */

  //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)
  
  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  //console.log(filteredPosts)

  return (
    <>
      <Header />
    <div className={styles.buttonContainer}>
      <button /* onClick={() => filterPosts('91e45e40-f3a0-4488-85e9-fb87eafac059')} */ className={styles.categoryButton}>Climbing</button>
      <button /* onClick={() => filterPosts('807d499a-f06d-4ef5-a1e9-c4413d9be7eb')} */ className={styles.categoryButton}>Coding</button>
      <button /* onClick={() => filterPosts("85ab035c-ede8-4700-8c9b-c9eddf6199d5")} */ className={styles.categoryButton}>Other</button>
    </div>

      <div className={styles.container}>
        {posts?.map((item, index) => {
          const categoryRef = item.categories[0];
          const [category, setCategory] = useState("");

          useEffect(() => {
            sanityClient
              .fetch(`*[_id == "${categoryRef._ref}"][0].title`)
              .then((data) => setCategory(data));
          }, [categoryRef]);

          return (
            <div key={item._id} className={styles.post}>
              <img
                className={styles.postImage}
                src={urlFor(item?.mainImage)?.url()}
                alt="post image"
              />
              <h3 className={styles.postTitle}>{item.title}</h3>
              <div className={styles.postSummary}><h4>Summary</h4>: {item.summary}</div>
              <p className={styles.postText}>
                {item.body}
              </p>
              <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"1rem"}}>
                <div className={styles.postCategory}><h4>Category</h4>: {category}</div>
                <p className={styles.postDate}>{new Date(item._createdAt).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}