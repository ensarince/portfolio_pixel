import React, { useEffect, useState } from 'react'
import { Technology } from '../typings'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../sanity'
import styles from "./Skill.module.scss"

type Props = {
    skill: Technology
}

const builder = imageUrlBuilder(sanityClient);

export default function Skill({ skill }: Props) {
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!skill?.image) return;
    const url = builder.image(skill.image).width(48).height(48).url();
    setImageUrl(url);
  }, [skill]);

  return (
    <div className={styles.tag}>
      {imageUrl && (
        <img className={styles.icon} src={imageUrl} alt={skill?.title || ''} />
      )}
      <span className={styles.label}>{skill?.title}</span>
    </div>
  )
}
