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

  console.log(skills);

  return (
    <>
      <Header />

{/*       <div style={{display:"flex", height:"80vh", justifyContent:"center", alignItems:"center"}}>

        <img style={{width:"45%", borderRadius:"3rem", border:"1px solid #A9C5B9", padding:"2rem"}} src="https://giffiles.alphacoders.com/158/158667.gif" alt="" />
      </div> */}
        <div className={styles.container}>
          {skills?.map((skill,index) => (
            <Skill skill={skill}/>
          ))}
        </div>

    </>
      
  )
}
