import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { Project } from '../../typings'
import styles from "./Projects.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'

type Props = {
  projects: Project[] | undefined
}

type FilterType = 'all' | 'personal' | 'academic' | 'professional' | 'opensource' | 'featured'

export default function Projects({projects}: Props) {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source:any) {
    return builder.image(source)
  }

  useEffect(() => {
    if (!projects) return
    
    let filtered = projects
    
    switch (activeFilter) {
      case 'featured':
        filtered = projects.filter(project => project.featured === true)
        break
      case 'all':
        filtered = projects
        break
      default:
        filtered = projects.filter(project => project.category === activeFilter)
        break
    }
    
    setFilteredProjects(filtered)
  }, [projects, activeFilter])

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      personal: { icon: '🚀', name: 'Personal', color: '#3B82F6' },
      academic: { icon: '🎓', name: 'Academic', color: '#10B981' },
      professional: { icon: '💼', name: 'Professional', color: '#F59E0B' },
    }
    return categoryMap[category as keyof typeof categoryMap] || { icon: '📁', name: category, color: '#6B7280' }
  }

  const filters = [
    { key: 'all', label: 'All Projects', icon: '📂' },
    { key: 'featured', label: 'Featured', icon: '⭐' },
    { key: 'professional', label: 'Professional', icon: '💼' },
    { key: 'personal', label: 'Personal', icon: '🚀' },
    { key: 'academic', label: 'Academic', icon: '🎓' },
  ]

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Portfolio</h1>
        </div>
        
        <div className={styles.filterContainer}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as FilterType)}
              className={`${styles.filterButton} ${activeFilter === filter.key ? styles.active : ''}`}
            >
              <span className={styles.filterIcon}>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.resultsInfo}>
          <p>Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</p>
        </div>

        <div className={styles.projectsGrid}>
          {filteredProjects?.map((project, i) => (
            <div key={project._id} className={styles.projectCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.imageContainer}>
                <img 
                  src={urlFor(project.image).url()!} 
                  alt={project.title}
                  className={styles.projectImage}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.projectActions}>
                    {project.linkToBuild && (
                      <a 
                        href={project.linkToBuild} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.actionButton}
                      >
                        <span>🔗</span> Live Demo
                      </a>
                    )}
                    {project.ndaRestricted && (
                      <span className={styles.ndaBadge}>
                        🔒 NDA Protected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.projectContent}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <div className={styles.badges}>
                    {project.featured && (
                      <span className={styles.featuredBadge}>⭐ Featured</span>
                    )}
                    <span 
                      className={styles.categoryBadge}
                      style={{ backgroundColor: getCategoryInfo(project.category || 'personal').color + '20' }}
                    >
                      {getCategoryInfo(project.category || 'personal').icon} {getCategoryInfo(project.category || 'personal').name}
                    </span>
                  </div>
                </div>
                
                <p className={styles.projectSummary}>{project.summary}</p>
                
                {project.description && (
                  <p className={styles.projectDescription}>{project.description}</p>
                )}

                <div className={styles.projectDetails}>
                  {project.role && (
                    <div className={styles.detail}>
                      <strong>Role:</strong> {project.role}
                    </div>
                  )}
                  {project.duration && (
                    <div className={styles.detail}>
                      <strong>Duration:</strong> {project.duration}
                    </div>
                  )}
                  {project.teamSize && (
                    <div className={styles.detail}>
                      <strong>Team Size:</strong> {project.teamSize}
                    </div>
                  )}
                </div>

                {project.impact && (
                  <div className={styles.impact}>
                    <h4>Impact & Results</h4>
                    <p>{project.impact}</p>
                  </div>
                )}
                
                <div className={styles.technologies}>
                  {project?.technologies?.map(technology => (
                    <span key={technology._id} className={styles.techTag}>
                      <img 
                        src={urlFor(technology.image).url()!} 
                        alt={technology.title}
                        className={styles.techIcon}
                      />
                      {technology.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects?.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>No projects found</h3>
            <p>Try adjusting your filter to see more projects.</p>
          </div>
        )}
      </div>
    </>
  )
}