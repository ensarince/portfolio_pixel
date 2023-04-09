import React, {useEffect, useState} from 'react'
import { Technology } from '../typings'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../sanity'
import styles from "./Skill.module.scss"

type Props = {
    skill: Technology
}


export default function Skill({skill}: Props) {

  const builder = imageUrlBuilder(sanityClient);
  
  function urlFor(source?: any) {
    return builder.image(source);
  }

  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    async function getUrl() {
      const url = await urlFor(skill?.image)?.url();
      setImageUrl(url);
    }
    getUrl();
  }, [skill]);

  return (
    <div className={styles.skillContainer}>
      <div className={styles.relative}>
        <img
          className={styles.skillImage}
          src={imageUrl}
          alt="skill"
        />
        <div className={styles.absolute}>
          <div className={styles.flex}>
            <p className={styles.skillTitle}>{skill?.title}</p>
            <p className={styles.skillTitle}>{skill?.progress}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
