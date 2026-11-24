import Skill from '../../components/Skill'
import { Technology } from '../../typings'
import styles from './Skills.module.scss'

type Props = { skills: Technology[] | undefined }

const DOMAIN_ORDER = ['Frontend', 'Backend', 'Languages', 'Database', 'DevOps', 'Mobile', 'Tools', 'Other']

// Groups skills by domain, in DOMAIN_ORDER first, then any unknown domains
export function groupSkillsByDomain(skills: Technology[] | undefined) {
  const grouped = (skills ?? []).reduce<Record<string, Technology[]>>((acc, skill) => {
    const domain = skill.domain || 'Other'
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(skill)
    return acc
  }, {})

  const domains = [
    ...DOMAIN_ORDER.filter(d => grouped[d]),
    ...Object.keys(grouped).filter(d => !DOMAIN_ORDER.includes(d)),
  ]
  return { grouped, domains }
}

export default function Skills({ skills }: Props) {
  const { grouped, domains } = groupSkillsByDomain(skills)

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Tools & Stack</h1>
          </div>

          <div className={styles.sections}>
            {domains.map(domain => (
              <section key={domain} className={styles.section}>
                <h2 className={styles.domainLabel}>{domain}</h2>
                <div className={styles.tagGroup}>
                  {grouped[domain].map(skill => (
                    <Skill skill={skill} key={skill._id} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
