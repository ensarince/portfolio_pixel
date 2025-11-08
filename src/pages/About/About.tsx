import React from 'react'
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
                        <p className={styles.heroSubtitle}>Developer • Climber • Creative Thinker</p>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Bio Section */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Who I Am</h2>
                        <p className={styles.sectionText}>
                            I'm a passionate full-stack developer with a deep love for building elegant, user-centric applications.
                            With experience in modern web technologies, I thrive on solving complex problems and creating seamless digital experiences.
                            Beyond the code, I'm an avid rock climber who values perseverance, problem-solving, and pushing beyond limits.
                        </p>
                    </section>

                    {/* Background Section */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Background</h2>
                        <div className={styles.timelineContainer}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineMarker}></div>
                                <div className={styles.timelineContent}>
                                    <h3 className={styles.timelineTitle}>Web Development</h3>
                                    <p className={styles.timelineDescription}>
                                        Specialized in TypeScript, React, and modern frontend frameworks.
                                        Experienced with backend development and full-stack application architecture.
                                    </p>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineMarker}></div>
                                <div className={styles.timelineContent}>
                                    <h3 className={styles.timelineTitle}>Problem Solving</h3>
                                    <p className={styles.timelineDescription}>
                                        Passionate about crafting solutions that are not just functional but also performant and maintainable.
                                        I believe in code quality and clean architecture.
                                    </p>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineMarker}></div>
                                <div className={styles.timelineContent}>
                                    <h3 className={styles.timelineTitle}>Continuous Learning</h3>
                                    <p className={styles.timelineDescription}>
                                        Always exploring new technologies and methodologies.
                                        I stay updated with industry trends and best practices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Interests Section */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Interests & Passions</h2>
                        <div className={styles.interestsGrid}>
                            <div className={styles.interestCard}>
                                <div className={styles.interestEmoji}>🧗‍♂️</div>
                                <h3>Rock Climbing</h3>
                                <p>Pushing physical and mental limits. Check out my climbing progress in the Climbs section.</p>
                            </div>
                            <div className={styles.interestCard}>
                                <div className={styles.interestEmoji}>🎵</div>
                                <h3>Music</h3>
                                <p>I play guitar, exploring different genres and styles. Music fuels my creativity and keeps me motivated.</p>
                            </div>
                            <div className={styles.interestCard}>
                                <div className={styles.interestEmoji}>📸</div>
                                <h3>Photography</h3>
                                <p>Capturing moments and beautiful landscapes. Explore my gallery for visual stories.</p>
                            </div>
                            <div className={styles.interestCard}>
                                <div className={styles.interestEmoji}>✍️</div>
                                <h3>Writing</h3>
                                <p>Sharing thoughts on life, development, and personal experiences.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className={styles.ctaSection}>
                        <h2 className={styles.ctaTitle}>Let's Connect</h2>
                        <p className={styles.ctaText}>
                            Interested in collaborating or just want to chat about code, climbing, or music?
                            Reach out through any of my social links or explore my work in the Portfolio section.
                        </p>
                        <div className={styles.div__socials}>
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255, 255, 255, 0.2)' url='mailto:ensrnce@gmail.com' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255, 255, 255, 0.2)' url='https://github.com/ensarince' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255, 255, 255, 0.2)' url='https://www.linkedin.com/in/ensar-ince-67a580155/' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255, 255, 255, 0.2)' url='https://www.instagram.com/rakionrocks' />
                            <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='rgba(255, 255, 255, 0.2)' url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' />
                        </div>
                        <div className={styles.ctaLinks}>
                            <a href="/portfolio" className={styles.ctaButton}>View My Work</a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
