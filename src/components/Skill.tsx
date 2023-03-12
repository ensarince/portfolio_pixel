import React from 'react'
import { Technology } from '../typings'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../sanity'
import styles from "./Skill.module.scss"

type Props = {
    skill: Technology
}


export default function Skill({skill}: Props) {
  
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }
  
    //console.log(urlFor(skill?.image).url())
    //console.log(skill)

  return (
    <div className={styles.skillContainer}>
      <div className={styles.relative}>
        <img className={styles.skillImage} src={urlFor((skill)?.image).url()} alt="" />
        <div className={styles.absolute}>
          <div className={styles.flex}>
            <p className={styles.skillTitle}>{skill?.title}</p>
            <p className={styles.skillTitle}>{skill.progress}%</p>
          </div>
        </div>

      </div>
    </div> 
  )
}
