import React from 'react'
import Header from '../../components/Header'
import Skill from '../../components/Skill'
import { Technology } from '../../typings'
import styles from  "./Skills.module.scss"

type Props = {
  skills: Technology[] | undefined
}

export default function Skills({skills}: Props) {

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skills & Technologies</h1>
        </div>
        
        <div className={styles.container}>
          {skills?.map((skill, index) => (
            <Skill skill={skill} key={index}/>
          ))}
        </div>
      </div>
    </>
  )
}
