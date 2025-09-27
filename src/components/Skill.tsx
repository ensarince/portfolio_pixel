import React, {useEffect, useState} from 'react'
import { Technology } from '../typings'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../sanity'
import styles from "./Skill.module.scss"

type Props = {
    skill: Technology
}

export default function Skill({skill}: Props) {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const builder = imageUrlBuilder(sanityClient);
  
  function urlFor(source?: any) {
    return builder.image(source);
  }

  useEffect(() => {
    async function getUrl() {
      const url = await urlFor(skill?.image)?.url();
      setImageUrl(url);
    }
    getUrl();
  }, [skill]);

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(skill?.progress || 0);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [skill?.progress]);

  const getSkillLevel = (progress: number) => {
    if (progress >= 90) return { level: 'Expert', color: '#10B981' };
    if (progress >= 75) return { level: 'Advanced', color: '#3B82F6' };
    if (progress >= 60) return { level: 'Intermediate', color: '#F59E0B' };
    return { level: 'Beginner', color: '#EF4444' };
  };

  const skillLevel = getSkillLevel(skill?.progress || 0);

  return (
    <div className={styles.skillCard}>
      <div className={styles.skillHeader}>
        <div className={styles.skillIconContainer}>
          <img
            className={styles.skillImage}
            src={imageUrl}
            alt={skill?.title || 'Skill'}
          />
        </div>
        <div className={styles.skillInfo}>
          <h3 className={styles.skillTitle}>{skill?.title}</h3>
          <span 
            className={styles.skillLevel}
            style={{ color: skillLevel.color }}
          >
            {skillLevel.level}
          </span>
        </div>
        <div className={styles.skillPercentage}>
          {skill?.progress}%
        </div>
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBackground}>
          <div 
            className={styles.progressBar}
            style={{ 
              width: `${animatedProgress}%`,
              backgroundColor: skillLevel.color
            }}
          />
        </div>
      </div>
    </div>
  )
}
