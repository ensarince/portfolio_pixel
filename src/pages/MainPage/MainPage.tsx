import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import imageUrlBuilder from '@sanity/image-url'
import Header from '../../components/Header'
import Skill from '../../components/Skill'
import { sanityClient } from '../../sanity'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SupabasePost, Project, Skill as SkillType } from '../../typings'
import img_1 from '../../assets/1.png'
import img_2 from '../../assets/2.jpg'
import CVFile from '../../assets/Ensar Ince_cv.pdf'
import styles from './MainPage.module.scss'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

type Props = {
  projects: Project[] | undefined
  posts: SupabasePost[] | undefined
  skills: SkillType[] | undefined
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  } catch { return '' }
}

export default function MainPage({ projects, posts, skills }: Props) {
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
  const displaySkills = skills ? skills.slice(0, 16) : []

  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroPhoto}>
          <img src={img_1} alt="Ensar Ince" className={styles.heroImg} />
          {/* Route-line SVG drawn over the portrait */}
          <svg
            className={styles.routeLineSvg}
            viewBox="0 0 100 140"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              className={styles.routePath}
              d="M 52 138 C 44 124 60 110 50 96 C 42 85 56 74 48 62 C 40 52 58 40 50 28 C 44 18 55 9 50 2"
            />
            <circle className={styles.routeBolt} cx="50" cy="96" r="2.5" style={{ animationDelay: '2s' }} />
            <circle className={styles.routeBolt} cx="48" cy="62" r="2.5" style={{ animationDelay: '2.4s' }} />
            <circle className={styles.routeBolt} cx="50" cy="28" r="2.5" style={{ animationDelay: '2.8s' }} />
          </svg>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroName}>
            Ensar<br />Ince.
          </h1>

          <div className={styles.heroAnnotation}>
            <span className={styles.annoKey}>Role</span>
            <span className={styles.annoVal}>Full-stack Developer</span>

            <span className={styles.annoKey}>Based in</span>
            <span className={styles.annoVal}>Saarbrücken, Germany</span>

            <span className={styles.annoKey}>Stack</span>
            <span className={styles.annoVal}>TypeScript · React · Node</span>

            <span className={styles.annoKey}>Available</span>
            <span className={styles.annoVal}>Open to new opportunities</span>
          </div>

          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={handleDownloadCV}>
              Download CV
            </button>
            <a href="#work" className={styles.ctaSecondary}>
              See my work
            </a>
          </div>

          <div className={styles.heroSocials}>
            <SocialIcon fgColor='#3D6B4F' bgColor='transparent' style={{ width: 32, height: 32, opacity: 0.50 }} url='mailto:ensrnce@gmail.com' />
            <SocialIcon fgColor='#3D6B4F' bgColor='transparent' style={{ width: 32, height: 32, opacity: 0.50 }} url='https://github.com/ensarince' target='_blank' rel='noopener noreferrer' />
            <SocialIcon fgColor='#3D6B4F' bgColor='transparent' style={{ width: 32, height: 32, opacity: 0.50 }} url='https://www.linkedin.com/in/ensar-ince-67a580155/' target='_blank' rel='noopener noreferrer' />
            <SocialIcon fgColor='#3D6B4F' bgColor='transparent' style={{ width: 32, height: 32, opacity: 0.50 }} url='https://www.instagram.com/rakionrocks' target='_blank' rel='noopener noreferrer' />
            <SocialIcon fgColor='#3D6B4F' bgColor='transparent' style={{ width: 32, height: 32, opacity: 0.50 }} url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' target='_blank' rel='noopener noreferrer' />
          </div>
        </div>
      </section>

      {/* ── SELECTED ROUTES ──────────────────────────────────── */}
      <section className={styles.section} id="work">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead} data-reveal>
            <h2 className={styles.sectionTitle}>Selected Work</h2>
            <div className={styles.sectionRule} />
          </div>

          {featuredProjects.length > 0 ? (
            <div className={styles.routeList}>
              {featuredProjects.map((project, i) => (
                <div
                  key={project._id}
                  className={styles.routeRow}
                  data-reveal
                  style={{ transitionDelay: `${i * 0.06}s` }}
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => project.linkToBuild
                    ? window.open(project.linkToBuild, '_blank', 'noopener,noreferrer')
                    : navigate('/portfolio')
                  }
                >
                  <span className={styles.routeNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.routeInfo}>
                    <p className={styles.routeName}>{project.title}</p>
                    <p className={styles.routeSummary}>{project.summary}</p>
                  </div>
                  <span className={styles.routeTech}>
                    {project.technologies?.slice(0, 3).map(t => t.title).join(' · ')}
                  </span>
                  <span className={styles.routeArrow}>→</span>
                  {project.image?.asset && hoveredProject === i && (
                    <div className={styles.routePreview}>
                      <img
                        src={urlFor(project.image).width(400).height(256).url()}
                        alt={project.title}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyHint}>Loading projects…</p>
          )}

          <div className={styles.sectionFooter} data-reveal>
            <Link to="/portfolio" className={styles.viewAllLink}>
              All projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FIELD NOTES ──────────────────────────────────────── */}
      <section className={styles.section} id="writing" style={{ background: 'var(--bg-2)' }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead} data-reveal>
            <h2 className={styles.sectionTitle}>Blog</h2>
            <div className={styles.sectionRule} />
          </div>

          {recentPosts.length > 0 && featuredPost && (
            <div className={styles.blogLayout}>
              <div
                className={styles.featuredPost}
                data-reveal
                onClick={() => navigate(`/blog/${featuredPost.id}`)}
              >
                {featuredPost.cover_image_url && (
                  <div className={styles.featuredPostImg}>
                    <img
                      src={featuredPost.cover_image_url}
                      alt={featuredPost.title}
                    />
                  </div>
                )}
                <span className={styles.postDate}>{formatDate(featuredPost.created_at)}</span>
                <h3 className={styles.featuredPostTitle}>{featuredPost.title}</h3>
                <p className={styles.featuredPostExcerpt}>{featuredPost.summary}</p>
                <span className={styles.readLink}>Read →</span>
              </div>

              <div className={styles.morePostsList} data-reveal>
                {morePosts.map((post, i) => (
                  <div
                    key={post.id}
                    className={styles.postItem}
                    style={{ transitionDelay: `${i * 0.07}s` }}
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <span className={styles.postItemNum}>{String(i + 2).padStart(2, '0')}</span>
                    <div>
                      <p className={styles.postItemTitle}>{post.title}</p>
                      <span className={styles.postItemDate}>{formatDate(post.created_at)}</span>
                    </div>
                    <span className={styles.postItemArrow}>→</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentPosts.length === 0 && <p className={styles.emptyHint}>Loading articles…</p>}

          <div className={styles.sectionFooter} data-reveal>
            <Link to="/blog" className={styles.viewAllLink}>
              All posts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section className={styles.sectionDark} id="about">
        <div className={styles.sectionInner}>
          <div className={styles.aboutLayout}>
            <div data-reveal="left">
              <blockquote className={styles.pullQuote}>
                "I build things that are fast, honest, and worth the user's time."
              </blockquote>
              <p className={styles.aboutBio}>
                Full-stack developer based in Germany. I work across the stack —
                TypeScript, React, Node (ever expanding with recent AI tools) —
                and care about code that's clean and worth maintaining.
                Outside of work I'm usually on a rock face somewhere.
              </p>
              <div className={styles.aboutTags}>
                <span>Developer</span>
                <span className={styles.tagDot}>·</span>
                <span>Climber</span>
              </div>
            </div>
            <div data-reveal="right">
              <div className={styles.aboutImageWrap}>
                <img src={img_2} alt="Ensar Ince" className={styles.aboutImage} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS ────────────────────────────────────────────── */}
      <section className={styles.section} id="skills">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead} data-reveal>
            <h2 className={styles.sectionTitle}>Tools & Stack</h2>
            <div className={styles.sectionRule} />
          </div>

          <div className={styles.skillsTagGroup} data-reveal>
            {displaySkills.map(skill => (
              <Skill skill={skill} key={skill._id} />
            ))}
            {displaySkills.length === 0 && <p className={styles.emptyHint}>Loading…</p>}
          </div>

          <div className={styles.sectionFooter} data-reveal>
            <Link to="/skills" className={styles.viewAllLink}>
              See all skills →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ELSEWHERE ────────────────────────────────────────── */}
      <section className={styles.section} id="elsewhere" style={{ paddingTop: '0' }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead} data-reveal>
            <h2 className={styles.sectionTitle}>Elsewhere</h2>
            <div className={styles.sectionRule} />
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
      <section className={styles.sectionConnect} id="connect">
        <div className={styles.sectionInner}>
          <div className={styles.connectLayout}>
            <div data-reveal>
              <span className={styles.connectLabel}>Let's talk</span>
              <h2 className={styles.connectHeading}>Get in touch.</h2>
              <a href="mailto:ensrnce@gmail.com" className={styles.connectEmail}>
                ensrnce@gmail.com
              </a>
              <div className={styles.connectSocials}>
                <SocialIcon fgColor='rgba(255,255,255,0.65)' bgColor='rgba(255,255,255,0.07)' style={{ width: 36, height: 36 }} url='mailto:ensrnce@gmail.com' />
                <SocialIcon fgColor='rgba(255,255,255,0.65)' bgColor='rgba(255,255,255,0.07)' style={{ width: 36, height: 36 }} url='https://github.com/ensarince' target='_blank' rel='noopener noreferrer' />
                <SocialIcon fgColor='rgba(255,255,255,0.65)' bgColor='rgba(255,255,255,0.07)' style={{ width: 36, height: 36 }} url='https://www.linkedin.com/in/ensar-ince-67a580155/' target='_blank' rel='noopener noreferrer' />
                <SocialIcon fgColor='rgba(255,255,255,0.65)' bgColor='rgba(255,255,255,0.07)' style={{ width: 36, height: 36 }} url='https://www.instagram.com/rakionrocks' target='_blank' rel='noopener noreferrer' />
                <SocialIcon fgColor='rgba(255,255,255,0.65)' bgColor='rgba(255,255,255,0.07)' style={{ width: 36, height: 36 }} url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' target='_blank' rel='noopener noreferrer' />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
