import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import styles from "./About.module.scss"
import { SocialIcon } from 'react-social-icons'
import img_2 from '../../assets/2.jpg'

export default function About() {
    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <div className={styles.heroBanner}>
                    <img src={img_2} alt="About me" className={styles.heroBannerImg} />
                    <div className={styles.heroBannerOverlay}></div>
                    <div className={styles.heroBannerContent}>
                        <h1 className={styles.heroTitle}>About Me</h1>
                        <p className={styles.heroSubtitle}>Developer · Climber · Creative Thinker</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Who I Am</h2>
                        <p className={styles.sectionText}>
                            Full-stack developer based in Germany, building fast and thoughtful digital products.
                            I work across the stack — TypeScript, React, Node — and care about code that's clean and worth maintaining.
                            Outside of work I'm usually on a rock face somewhere.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Interests</h2>
                        <div className={styles.interestsGrid}>
                            <div className={styles.interestCard}>
                                <h3>Rock Climbing</h3>
                                <p>Bouldering, sport, alpine — the full range. See the Climbs log for routes I've sent.</p>
                            </div>
                            <div className={styles.interestCard}>
                                <h3>Music</h3>
                                <p>I play guitar. Different genres, mostly for keeping my head clear between deep work sessions.</p>
                            </div>
                            <div className={styles.interestCard}>
                                <h3>Photography</h3>
                                <p>Mostly landscapes and climbing shots. The Gallery has a selection.</p>
                            </div>
                            <div className={styles.interestCard}>
                                <h3>Writing</h3>
                                <p>Notes on development, process, and whatever else is worth thinking through out loud.</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.ctaSection}>
                        <h2 className={styles.ctaTitle}>Let's Connect</h2>
                        <p className={styles.ctaText}>
                            Open to interesting projects and conversations. Reach out via email or any of the links below.
                        </p>
                        <div className={styles.div__socials}>
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255,255,255,0.2)' url='mailto:ensrnce@gmail.com' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255,255,255,0.2)' url='https://github.com/ensarince' target='_blank' rel='noopener noreferrer' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255,255,255,0.2)' url='https://www.linkedin.com/in/ensar-ince-67a580155/' target='_blank' rel='noopener noreferrer' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255,255,255,0.2)' url='https://www.instagram.com/rakionrocks' target='_blank' rel='noopener noreferrer' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255,255,255,0.2)' url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' target='_blank' rel='noopener noreferrer' />
                        </div>
                        <div className={styles.ctaLinks}>
                            <Link to="/portfolio" className={styles.ctaButton}>View My Work</Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
