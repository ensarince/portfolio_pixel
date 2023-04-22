import React, {useState, useEffect} from 'react'
import Header from '../../components/Header'
import { BlogPost, Category } from '../../typings'
import styles from "./Blog.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { useNavigate } from 'react-router-dom'

type Props = {
  posts: BlogPost[] | undefined
}

export default function Blog({posts}: Props) {

  const [filteredPosts, setFilteredPosts] = useState<BlogPost[] | undefined>([]);
  const [categories, setCategories] = useState<Category[] | any>([]);
  const navigate = useNavigate()

  const filterPosts = (preferredCategory: string | undefined): void => {
    const filtered = posts?.filter(post => post.categories[0]._ref === preferredCategory);
    setFilteredPosts(filtered);
  };

  const builder = imageUrlBuilder(sanityClient)
  
  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  useEffect(() => {
    const categoryRefs = posts?.map((post) => post.categories[0]._ref);
    if (categoryRefs) {
      Promise.all(categoryRefs.map((ref) => sanityClient.fetch(`*[_id == "${ref}"][0].title`)))
        .then((titles) => setCategories(titles.map((title, index) => ({_id: categoryRefs[index], title}))));
    }
  }, [posts]);

  useEffect(() => {
    setFilteredPosts(posts)
  }, [posts])
  
  return (
    <>
      <Header />
    <div className={styles.buttonContainer}>
      <button onClick={() => filterPosts('91e45e40-f3a0-4488-85e9-fb87eafac059')} className={styles.categoryButton}>Climbing</button>
      <button onClick={() => filterPosts('807d499a-f06d-4ef5-a1e9-c4413d9be7eb')} className={styles.categoryButton}>Coding</button>
      <button onClick={() => filterPosts("85ab035c-ede8-4700-8c9b-c9eddf6199d5")} className={styles.categoryButton}>Other</button>
      {(filteredPosts?.length !== posts?.length) && <button onClick={() => setFilteredPosts(posts)} style={{color:"#cd5e56"}} className={styles.categoryButton}>Reset</button>}
    </div>

<div className={styles.container}>
        {filteredPosts?.map((item, index) => {
          const category = categories.find((category: any) => category._id === item.categories[0]._ref)?.title;

          return (
            <div onClick={() => navigate(`/blog/${item._id}`)} key={item._id} className={styles.post}>
              <img
                className={styles.postImage}
                src={urlFor(item?.mainImage)?.url()}
                alt="post image"
              />
              <h3 className={styles.postTitle}>{item.title}</h3>
              <h4 className={styles.postSummary}>{item.summary}</h4>
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