import { Fragment } from 'react'
import img_2 from '../../assets/2.jpg'
import { cv } from '../../data/cv'
import { groupSkillsByDomain } from '../../pages/Skills/Skills'
import { Technology } from '../../typings'
import CVFile from '../../assets/Ensar Ince.pdf'
import styles from './AboutContent.module.scss'

export default function AboutContent({ skills }: { skills?: Technology[] }) {
  const { grouped, domains } = groupSkillsByDomain(skills)

  const downloadCV = () => {
    const link = document.createElement('a')
    link.href = CVFile
    link.download = 'Ensar_Ince_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={styles.inner}>
      <img src={img_2} alt="Ensar Ince" className={styles.photo} />

      <div className={styles.body}>
        <h2 className={styles.heading}>About</h2>

        <blockquote className={styles.quote}>
          "I build things that are fast, honest, and worth the user's time."
        </blockquote>

        <p className={styles.bio}>
          Full-stack developer based in Germany. I work across the stack — TypeScript, React,
          Node (ever expanding with recent AI tools) — and care about code that's clean and
          worth maintaining. Outside of work I'm usually on a rock face somewhere.
        </p>

        <dl className={styles.facts}>
          <dt>Role</dt>
          <dd>Full-stack Developer</dd>
          <dt>Based in</dt>
          <dd>Saarbrücken, Germany</dd>
          <dt>Stack</dt>
          <dd>TypeScript · React · Node</dd>
          <dt>Available</dt>
          <dd>Open to new opportunities</dd>
        </dl>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={downloadCV}>
            Download CV
          </button>
          <a className={styles.secondary} href="mailto:ensrnce@gmail.com">
            Get in touch
          </a>
        </div>

        <section className={styles.cv} aria-labelledby="cv-heading">
          <h2 id="cv-heading" className={styles.heading}>CV</h2>

          <p className={styles.bio}>{cv.summary}</p>

          <h3 className={styles.cvLabel}>Experience</h3>
          {cv.experience.map((job) => (
            <article key={job.company} className={styles.job}>
              <header className={styles.jobHead}>
                <span className={styles.jobRole}>{job.role}</span>
                <span className={styles.jobPeriod}>{job.period}</span>
              </header>
              <div className={styles.jobCompany}>{job.company}</div>
              <ul className={styles.points}>
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {job.stack && <div className={styles.stack}>{job.stack.join(' · ')}</div>}
            </article>
          ))}

          <h3 className={styles.cvLabel}>Projects</h3>
          {cv.projects.map((p) => (
            <article key={p.name} className={styles.job}>
              <header className={styles.jobHead}>
                <a className={styles.jobRole} href={p.url} target="_blank" rel="noreferrer">
                  {p.name} ↗
                </a>
                <span className={styles.jobPeriod}>{p.period}</span>
              </header>
              <div className={styles.jobCompany}>{p.tagline}</div>
              <ul className={styles.points}>
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className={styles.stack}>{p.stack.join(' · ')}</div>
            </article>
          ))}

          <h3 className={styles.cvLabel}>Skills</h3>
          <dl className={styles.facts}>
            {domains.map((domain) => (
              <Fragment key={domain}>
                <dt>{domain}</dt>
                <dd>{grouped[domain].map((s) => s.title).join(' · ')}</dd>
              </Fragment>
            ))}
          </dl>

          <h3 className={styles.cvLabel}>Education</h3>
          {cv.education.map((e) => (
            <div key={e.degree} className={styles.job}>
              <header className={styles.jobHead}>
                <span className={styles.jobRole}>{e.degree}</span>
                <span className={styles.jobPeriod}>{e.period}</span>
              </header>
              <div className={styles.jobCompany}>{e.school}</div>
            </div>
          ))}

          <h3 className={styles.cvLabel}>Languages</h3>
          <dl className={styles.facts}>
            {cv.languages.map((l) => (
              <Fragment key={l.name}>
                <dt>{l.name}</dt>
                <dd>{l.level}</dd>
              </Fragment>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
