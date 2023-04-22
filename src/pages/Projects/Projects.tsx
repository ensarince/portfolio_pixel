import React from 'react'
import Header from '../../components/Header'
import { Project } from '../../typings'
import styles from "./Projects.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'
import Skill from '../../components/Skill'

type Props = {
  projects: Project[] | undefined
}

export default function Projects({projects}: Props) {
  //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }

  return (
    <>
      <Header />

      <div className={styles.container}>
        {projects?.map((item, index) => (
          <div key={item._id} className={styles.project}>
              <img className={styles.projectImage} src={urlFor((item)?.image).url()} alt="project image" />              
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className={styles.skills}>
              {item.technologies.map((skill, index) => (
                  <img key={index} className={styles.skillImage} src={urlFor(skill.image).url()} alt="" />
              ))}
              </div>
              <a href={item.linkToBuild} className={styles.linkToBuild}>Link to Build🔗</a>
          </div>
        ))}
      </div>
    </>
      
  )
}