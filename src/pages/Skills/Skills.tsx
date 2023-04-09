import React from 'react'
import Header from '../../components/Header'
import Skill from '../../components/Skill'
import SkillComponent from '../../components/Skill'
import { Technology } from '../../typings'
import styles from  "./Skills.module.scss"

type Props = {
  skills: Technology[] | undefined
}

export default function Skills({skills}: Props) {

  return (
    <>
      <Header />
        <div className={styles.container}>
          {skills?.map((skill,index) => (
            <Skill skill={skill} key={index}/>
          ))}
        </div>

    </>
      
  )
}
