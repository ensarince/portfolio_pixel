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
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Featured Projects</h1>
        </div>
        
        {projects ? (
          <div className={styles.container}>
            {projects?.map((project, index) => (
              <div key={project._id} className={styles.project} style={{'--delay': `${index * 0.1}s`} as React.CSSProperties}>
                <div className={styles.projectImageContainer}>
                  <img
                    className={styles.projectImage}
                    src={urlFor(project.image).url()}
                    alt={project.title}
                  />
                  <div className={styles.projectOverlay}>
                    <a href={project.linkToBuild} target="_blank" rel="noopener noreferrer" className={styles.viewProject}>
                      View Project →
                    </a>
                  </div>
                </div>
                
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectSummary}>{project.summary}</p>
                  
                  <div className={styles.technologies}>
                    {project.technologies?.slice(0, 4).map((tech, techIndex) => (
                      <div key={techIndex} className={styles.techBadge}>
                        <img
                          className={styles.techIcon}
                          src={urlFor(tech.image).url()}
                          alt={tech.title}
                          title={tech.title}
                        />
                        <span className={styles.techName}>{tech.title}</span>
                      </div>
                    ))}
                    {project.technologies && project.technologies.length > 4 && (
                      <div className={styles.moreTechs}>
                        +{project.technologies.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading projects...</p>
          </div>
        )}
      </div>
    </>
  )
}