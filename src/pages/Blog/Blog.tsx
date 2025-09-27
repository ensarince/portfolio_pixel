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
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate()

  const filterPosts = (preferredCategory: string | undefined, filterName: string): void => {
    if (filterName === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts?.filter(post => post.categories[0]._ref === preferredCategory);
      setFilteredPosts(filtered);
    }
    setActiveFilter(filterName);
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
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Blog & Articles</h1>
        </div>

        <div className={styles.filterContainer}>
          <button 
            onClick={() => filterPosts(undefined, 'all')} 
            className={`${styles.categoryButton} ${activeFilter === 'all' ? styles.active : ''}`}
          >
            All Posts
          </button>
          <button 
            onClick={() => filterPosts('91e45e40-f3a0-4488-85e9-fb87eafac059', 'climbing')} 
            className={`${styles.categoryButton} ${activeFilter === 'climbing' ? styles.active : ''}`}
          >
            🧗‍♂️ Climbing
          </button>
          <button 
            onClick={() => filterPosts('807d499a-f06d-4ef5-a1e9-c4413d9be7eb', 'coding')} 
            className={`${styles.categoryButton} ${activeFilter === 'coding' ? styles.active : ''}`}
          >
            💻 Coding
          </button>
          <button 
            onClick={() => filterPosts("85ab035c-ede8-4700-8c9b-c9eddf6199d5", 'other')} 
            className={`${styles.categoryButton} ${activeFilter === 'other' ? styles.active : ''}`}
          >
            📝 Other
          </button>
        </div>

        <div className={styles.container}>
          {filteredPosts?.map((item, index) => {
            const category = categories.find((category: any) => category._id === item.categories[0]._ref)?.title;

            return (
              <article 
                onClick={() => navigate(`/blog/${item._id}`)} 
                key={item._id} 
                className={styles.post}
                style={{'--delay': `${index * 0.1}s`} as React.CSSProperties}
              >
                <div className={styles.imageContainer}>
                  <img
                    className={styles.postImage}
                    src={urlFor(item?.mainImage)?.url()}
                    alt={item.title}
                  />
                </div>
                
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{category}</span>
                    <span className={styles.postDate}>
                      {new Date(item._createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h3 className={styles.postTitle}>{item.title}</h3>
                  <p className={styles.postSummary}>{item.summary}</p>
                  
                  <div className={styles.readMore}>
                    Read Article →
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}