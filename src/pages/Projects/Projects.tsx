import React from 'react'
import Header from '../../components/Header'
import { Project } from '../../typings'
import styles from "./Projects.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'

type Props = {
  projects: Project[] | undefined
}

export default function Projects({projects}: Props) {
  //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }

console.log(projects)
  return (
    <>
      <Header />

      <div className={styles.container}>
        {projects?.map((item, index) => (
          <div key={item._id} className={styles.project}>
              <img className={styles.projectImage} src={urlFor((item)?.image).url()} alt="project image" />              
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
{/*               {item.technologies.map((skill, index) => (        
                <div key={skill._id}  className={styles.project_technologies}>
                    <img className={styles.technology} src={urlFor((skill)?.image).url()} alt="tech image" />
                </div>
              ))} */}
              <p>{item.linkToBuild}</p>
          </div>
        ))}

      </div>
    </>
      
  )
}