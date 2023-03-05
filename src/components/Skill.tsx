import React from 'react'
import { Technology } from '../typings'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../sanity'
import styles from "./Skill.module.scss"

type Props = {
    skill: Technology
}


export default function Skill({skill}: Props) {
  
      //needed to show sanity images
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }
  
    //console.log(urlFor(skill?.image).url())

  return (
    <div className={styles.skillContainer}>
      <p className={styles.skillTitle}>{skill?.title}</p>
      {/* <p>{skill?.progress}</p> */}
   {/*    <img className={styles.skillImage} src={urlFor(skill?.image).width(200).url()} alt="skill image" /> 
     */}</div>
  )
}