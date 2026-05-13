import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import imageUrlBuilder from '@sanity/image-url'
import Header from '../../components/Header'
import AIChat from '../../components/AIChat'
import { sanityClient } from '../../sanity'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { BlogPost, Project, Skill } from '../../typings'
import { SpotifyData } from '../../services/spotify'
import img_1 from '../../assets/1.png'
import CVFile from '../../assets/Ensar Ince_cv.pdf'
import styles from './MainPage.module.scss'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

type Props = {
  nowPlaying: SpotifyData | null
  projects: Project[] | undefined
  posts: BlogPost[] | undefined
  skills: Skill[] | undefined
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long'
    })
  } catch {
    return ''
  }
}

export default function MainPage({ nowPlaying, projects, posts, skills }: Props) {
  const navigate = useNavigate()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  useScrollReveal([projects, posts, skills])

  const handleDownloadCV = () => {
    const link = document.createElement('a')
    link.href = CVFile
    link.download = 'Ensar_Ince_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const featuredProjects = projects
    ? [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 4)
    : []

  const recentPosts = posts ? [...posts].slice(0, 4) : []
  const featuredPost = recentPosts[0]
  const morePosts = recentPosts.slice(1, 4)

  const displaySkills = skills ? skills.slice(0, 14) : []

  return (
    <>
      <Header />
    {/*   <AIChat /> */}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroEyebrow}>Software developer & rock climber</p>
            <h1 className={styles.heroName}>
              <span className={styles.heroNameLine}>Ensar</span>
              <span className={styles.heroNameLine}>Ince.</span>
            </h1>
            <p className={styles.heroBio}>
              I build digital products that are fast, thoughtful, and worth using.
              Based in Germany. Open to opportunities.
            </p>
            <div className={styles.heroCtas}>
              <button className={styles.ctaPrimary} onClick={handleDownloadCV}>
                Download CV
              </button>
              <a href="#work" className={styles.ctaSecondary}>
                See my work
              </a>
            </div>
            <div className={styles.heroSocials}>
              <SocialIcon fgColor='#1C1814' bgColor='transparent' style={{ width: 36, height: 36, opacity: 0.45 }} url='mailto:ensrnce@gmail.com' />
              <SocialIcon fgColor='#1C1814' bgColor='transparent' style={{ width: 36, height: 36, opacity: 0.45 }} url='https://github.com/ensarince' target='_blank' rel='noopener noreferrer' />
              <SocialIcon fgColor='#1C1814' bgColor='transparent' style={{ width: 36, height: 36, opacity: 0.45 }} url='https://www.linkedin.com/in/ensar-ince-67a580155/' target='_blank' rel='noopener noreferrer' />
              <SocialIcon fgColor='#1C1814' bgColor='transparent' style={{ width: 36, height: 36, opacity: 0.45 }} url='https://www.instagram.com/rakionrocks' target='_blank' rel='noopener noreferrer' />
              <SocialIcon fgColor='#1C1814' bgColor='transparent' style={{ width: 36, height: 36, opacity: 0.45 }} url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' target='_blank' rel='noopener noreferrer' />
            </div>
          </div>
          <div className={styles.heroImageWrap}>
            <img src={img_1} alt="Ensar Ince" className={styles.heroImage} />
          </div>
        </div>
        <div className={styles.heroScrollCue}>
          <span>scroll</span>
          <div className={styles.scrollLine}></div>
        </div>
      </section>

      {/* ── WORK ─────────────────────────────────────────────── */}
      <section className={styles.section} id="work">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <span className={styles.sectionNum}>01</span>
            <h2 className={styles.sectionTitle}>Selected work</h2>
          </div>

          {featuredProjects.length > 0 ? (
            <div className={styles.projectList}>
              {featuredProjects.map((project, i) => (
                <div
                  key={project._id}
                  className={styles.projectRow}
                  data-reveal
                  style={{ transitionDelay: `${i * 0.07}s` }}
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <span className={styles.projectNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.projectInfo}>
                    <h3 className={styles.projectName}>{project.title}</h3>
                    <p className={styles.projectRole}>{project.summary}</p>
                  </div>
                  <div className={styles.projectTech}>
                    {project.technologies?.slice(0, 3).map(t => t.title).join(' · ')}
                  </div>
                  <div className={styles.projectArrow}>→</div>
                  {project.image && hoveredProject === i && (
                    <div className={styles.projectPreview}>
                      <img
                        src={urlFor(project.image).width(320).height(200).url()}
                        alt={project.title}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyHint}>Loading projects…</div>
          )}

          <div className={styles.sectionFooter} data-reveal>
            <Link to="/portfolio" className={styles.viewAllLink}>
              View all work <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WRITING ──────────────────────────────────────────── */}
      <section className={styles.sectionAlt} id="writing">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <span className={styles.sectionNum}>02</span>
            <h2 className={styles.sectionTitle}>Writing</h2>
          </div>

          {recentPosts.length > 0 && featuredPost && (
            <div className={styles.blogLayout}>
              <div
                className={styles.featuredPost}
                data-reveal
                onClick={() => navigate(`/blog/${featuredPost._id}`)}
              >
                {featuredPost.image && (
                  <div className={styles.featuredPostImg}>
                    <img
                      src={urlFor(featuredPost.image).width(700).height(420).url()}
                      alt={featuredPost.title}
                    />
                  </div>
                )}
                <div className={styles.featuredPostMeta}>
                  <span className={styles.postDate}>{formatDate(featuredPost._createdAt)}</span>
                </div>
                <h3 className={styles.featuredPostTitle}>{featuredPost.title}</h3>
                <p className={styles.featuredPostExcerpt}>{featuredPost.summary}</p>
                <span className={styles.readLink}>Read article →</span>
              </div>

              <div className={styles.morePostsList}>
                {morePosts.map((post, i) => (
                  <div
                    key={post._id}
                    className={styles.postItem}
                    data-reveal
                    style={{ transitionDelay: `${i * 0.08}s` }}
                    onClick={() => navigate(`/blog/${post._id}`)}
                  >
                    <div className={styles.postItemNum}>{String(i + 2).padStart(2, '0')}</div>
                    <div className={styles.postItemText}>
                      <h4 className={styles.postItemTitle}>{post.title}</h4>
                      <span className={styles.postItemDate}>{formatDate(post._createdAt)}</span>
                    </div>
                    <span className={styles.postItemArrow}>→</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentPosts.length === 0 && (
            <div className={styles.emptyHint}>Loading articles…</div>
          )}

          <div className={styles.sectionFooter} data-reveal>
            <Link to="/blog" className={styles.viewAllLink}>
              Read all articles <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section className={styles.sectionDark} id="about">
        <div className={styles.sectionInner}>
          <div className={styles.aboutLayout}>
            <div className={styles.aboutLeft} data-reveal="left">
              <span className={styles.sectionNumLight}>03</span>
              <blockquote className={styles.pullQuote}>
                "I build things that are fast, honest, and worth the user's time."
              </blockquote>
              <p className={styles.aboutBio}>
                Full-stack developer with a background in TypeScript, React, and backend systems.
                When I'm not writing code, I'm climbing rock faces and writing about both.
              </p>
              <div className={styles.aboutTags}>
                <span>Developer</span>
                <span className={styles.tagDot}>·</span>
                <span>Climber</span>
                <span className={styles.tagDot}>·</span>
                <span>Writer</span>
              </div>
              <Link to="/about" className={styles.viewAllLinkLight}>
                Full story <span>→</span>
              </Link>
            </div>
            <div className={styles.aboutRight} data-reveal="right">
              <div className={styles.aboutExperience}>
                <div className={styles.expItem}>
                  <span className={styles.expNum}>3+</span>
                  <span className={styles.expLabel}>Years building</span>
                </div>
                <div className={styles.expItem}>
                  <span className={styles.expNum}>10+</span>
                  <span className={styles.expLabel}>Projects shipped</span>
                </div>
                <div className={styles.expItem}>
                  <span className={styles.expNum}>∞</span>
                  <span className={styles.expLabel}>Routes climbed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────── */}
      <section className={styles.section} id="skills">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <span className={styles.sectionNum}>04</span>
            <h2 className={styles.sectionTitle}>Skills & tools</h2>
          </div>

          <div className={styles.skillsGrid} data-reveal>
            {displaySkills.map(skill => (
              <div key={skill._id} className={styles.skillItem}>
                {skill.image && (
                  <img
                    src={urlFor(skill.image).width(48).height(48).url()}
                    alt={skill.title}
                    className={styles.skillIcon}
                  />
                )}
                <span className={styles.skillName}>{skill.title}</span>
                <div
                  className={styles.skillBar}
                  style={{ '--pct': `${skill.progress}%` } as React.CSSProperties}
                />
              </div>
            ))}
            {displaySkills.length === 0 && (
              <span className={styles.emptyHint}>Loading skills…</span>
            )}
          </div>

          <div className={styles.sectionFooter} data-reveal>
            <Link to="/skills" className={styles.viewAllLink}>
              All skills <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ELSEWHERE ────────────────────────────────────────── */}
      <section className={styles.section} id="elsewhere">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <span className={styles.sectionNum}>05</span>
            <h2 className={styles.sectionTitle}>Elsewhere</h2>
          </div>
          <div className={styles.elsewhereGrid} data-reveal>
            <Link to="/gallery" className={styles.elsewhereCard}>
              <span className={styles.elsewhereLabel}>Gallery</span>
              <p className={styles.elsewhereDesc}>Photos from the places and moments I've been part of.</p>
              <span className={styles.elsewhereArrow}>→</span>
            </Link>
            <Link to="/climbs" className={styles.elsewhereCard}>
              <span className={styles.elsewhereLabel}>Climbs</span>
              <p className={styles.elsewhereDesc}>A log of routes and problems I've sent, from bouldering to alpine.</p>
              <span className={styles.elsewhereArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONNECT ──────────────────────────────────────────── */}
      <section className={styles.connectSection} id="connect">
        <div className={styles.sectionInner}>
          <div className={styles.connectLayout}>
            <div className={styles.connectLeft} data-reveal>
              <p className={styles.connectEyebrow}>06 — Let's talk</p>
              <h2 className={styles.connectHeading}>Get in touch.</h2>
              <a href="mailto:ensrnce@gmail.com" className={styles.connectEmail}>
                ensrnce@gmail.com
              </a>
              <div className={styles.connectSocials}>
                <SocialIcon fgColor='#EDE8DC' bgColor='rgba(237,232,220,0.08)' style={{ width: 38, height: 38 }} url='mailto:ensrnce@gmail.com' />
                <SocialIcon fgColor='#EDE8DC' bgColor='rgba(237,232,220,0.08)' style={{ width: 38, height: 38 }} url='https://github.com/ensarince' target='_blank' rel='noopener noreferrer' />
                <SocialIcon fgColor='#EDE8DC' bgColor='rgba(237,232,220,0.08)' style={{ width: 38, height: 38 }} url='https://www.linkedin.com/in/ensar-ince-67a580155/' target='_blank' rel='noopener noreferrer' />
                <SocialIcon fgColor='#EDE8DC' bgColor='rgba(237,232,220,0.08)' style={{ width: 38, height: 38 }} url='https://www.instagram.com/rakionrocks' target='_blank' rel='noopener noreferrer' />
                <SocialIcon fgColor='#EDE8DC' bgColor='rgba(237,232,220,0.08)' style={{ width: 38, height: 38 }} url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' target='_blank' rel='noopener noreferrer' />
              </div>
            </div>

            <div className={styles.connectRight} data-reveal="right">
              {nowPlaying ? (
                <div className={styles.nowPlaying}>
                  <img
                    src={nowPlaying.item?.album.images[0]?.url}
                    alt={nowPlaying.item?.album.name}
                    className={styles.albumArt}
                  />
                  <div className={styles.trackInfo}>
                    <div className={styles.liveChip}>
                      <span className={styles.liveDot}></span>
                      now playing
                    </div>
                    <p className={styles.trackName}>{nowPlaying.item?.name}</p>
                    <p className={styles.artistName}>{nowPlaying.item?.album.artists[0]?.name}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.noTrack}>
                  <span className={styles.noTrackIcon}>🎧</span>
                  <p>Nothing playing right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
