import { useEffect } from 'react'
import img_2 from '../../assets/2.jpg'
import CVFile from '../../assets/Ensar Ince_cv.pdf'
import { CloseIcon } from './icons'
import styles from './AboutPanel.module.scss'

export default function AboutPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const downloadCV = () => {
    const link = document.createElement('a')
    link.href = CVFile
    link.download = 'Ensar_Ince_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!open) return null

  return (
    <div className={styles.scrim} onClick={onClose}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <CloseIcon className={styles.closeIcon} />
        </button>

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
          </div>
        </div>
      </aside>
    </div>
  )
}
