import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { Climb } from '../../typings'
import styles from "./Climbs.module.scss"
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'

type Props = {
    climbs: Climb[] | undefined
}

type FilterType = 'all' | 'boulder' | 'sport' | 'trad' | 'featured'

export default function Climbs({ climbs }: Props) {
    const [filteredClimbs, setFilteredClimbs] = useState<Climb[]>([])
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')

    const builder = imageUrlBuilder(sanityClient)

    function urlFor(source: any) {
        return builder.image(source)
    }

    useEffect(() => {
        if (!climbs) return

        let filtered = climbs

        switch (activeFilter) {
            case 'featured':
                filtered = climbs.filter(climb => climb.featured === true)
                break
            case 'all':
                filtered = climbs
                break
            default:
                filtered = climbs.filter(climb => climb.category === activeFilter)
                break
        }

        setFilteredClimbs(filtered)
    }, [climbs, activeFilter])

    const getCategoryInfo = (category: string) => {
        const categoryMap = {
            boulder: { icon: '🪨', name: 'Bouldering', color: '#F97316', difficulty: 'V-Scale' },
            sport: { icon: '🧗', name: 'Sport Climbing', color: '#3B82F6', difficulty: 'YDS' },
            trad: { icon: '⚙️', name: 'Traditional', color: '#10B981', difficulty: 'YDS' },
            alpine: { icon: '🏔️', name: 'Alpine/Mountaineering', color: '#8B5CF6', difficulty: 'Alpine' },
        }
        return categoryMap[category as keyof typeof categoryMap] || { icon: '🧗', name: category, color: '#6B7280', difficulty: '' }
    }

    const getDifficultyColor = (difficulty: string) => {
        // Color coding based on difficulty level
        if (difficulty.includes('V') && difficulty.includes('1')) return '#10B981' // V10+ = green
        if (difficulty.includes('V') && parseInt(difficulty.replace('V', '')) >= 7) return '#F59E0B' // V7-9 = yellow
        if (difficulty.includes('V') && parseInt(difficulty.replace('V', '')) >= 4) return '#EF4444' // V4-6 = red
        if (difficulty.includes('5.1') && parseInt(difficulty.split('.')[1]) >= 12) return '#EF4444' // 5.12+ = red
        if (difficulty.includes('5.1') && parseInt(difficulty.split('.')[1]) >= 10) return '#F59E0B' // 5.10-11 = yellow
        return '#10B981' // Default green for easier grades
    }

    const filters = [
        { key: 'all', label: 'All Climbs', icon: '🧗' },
        { key: 'featured', label: 'Featured', icon: '⭐' },
        { key: 'boulder', label: 'Bouldering', icon: '🪨' },
        { key: 'sport', label: 'Sport', icon: '🧗' },
        { key: 'trad', label: 'Traditional', icon: '⚙️' },
    ]

    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Routes I Climbed</h1>
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
                    <p>Showing {filteredClimbs.length} climb{filteredClimbs.length !== 1 ? 's' : ''}</p>
                </div>

                <div className={styles.climbsGrid}>
                    {filteredClimbs?.map((climb, i) => (
                        <div key={climb._id} className={styles.climbCard} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={urlFor(climb.image).url()!}
                                    alt={climb.title}
                                    className={styles.climbImage}
                                />
                                <div className={styles.imageOverlay}>
                                    <div className={styles.overlayContent}>
                                        {climb.firstAscent && (
                                            <span className={styles.firstAscentBadge}>
                                                🎯 First Ascent
                                            </span>
                                        )}
                                        <div className={styles.difficultyBadge} style={{ backgroundColor: getDifficultyColor(climb.difficulty) }}>
                                            {climb.difficulty}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.climbContent}>
                                <div className={styles.climbHeader}>
                                    <h3 className={styles.climbTitle}>{climb.title}</h3>
                                    <div className={styles.badges}>
                                        {climb.featured && (
                                            <span className={styles.featuredBadge}>⭐ Featured</span>
                                        )}
                                        <span
                                            className={styles.categoryBadge}
                                            style={{ backgroundColor: getCategoryInfo(climb.category).color + '20' }}
                                        >
                                            {getCategoryInfo(climb.category).icon} {getCategoryInfo(climb.category).name}
                                        </span>
                                    </div>
                                </div>

                                {climb.location && (
                                    <div className={styles.location}>
                                        📍 {climb.location}
                                    </div>
                                )}

                                {climb.description && (
                                    <p className={styles.climbDescription}>{climb.description}</p>
                                )}

                                <div className={styles.climbDetails}>
                                    {climb.dateCompleted && (
                                        <div className={styles.detail}>
                                            <strong>Completed:</strong> {formatDate(climb.dateCompleted)}
                                        </div>
                                    )}
                                    {climb.duration && (
                                        <div className={styles.detail}>
                                            <strong>Duration:</strong> {climb.duration}
                                        </div>
                                    )}
                                    {climb.elevation && (
                                        <div className={styles.detail}>
                                            <strong>Elevation:</strong> {climb.elevation}
                                        </div>
                                    )}
                                    {climb.partners && (
                                        <div className={styles.detail}>
                                            <strong>Partners:</strong> {climb.partners}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.gradeInfo}>
                                    <span
                                        className={styles.gradeBadge}
                                        style={{ backgroundColor: getDifficultyColor(climb.difficulty) }}
                                    >
                                        {climb.difficulty}
                                    </span>
                                    <span className={styles.gradeSystem}>
                                        {getCategoryInfo(climb.category).difficulty} Scale
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredClimbs?.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🏔️</div>
                        <h3>No climbs found</h3>
                        <p>Try adjusting your filter to see more climbing adventures.</p>
                    </div>
                )}
            </div>
        </>
    )
}