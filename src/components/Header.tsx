import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./Header.module.scss"

type Props = {}

export default function Header({}: Props) {
  return (
    <div className={styles.header}>
        <Link to="/">
            <h4>About</h4>
        </Link>
        <Link to="/projects">
            <h4>Projects</h4>
        </Link>
        <Link to="/skills">
            <h4>Skills</h4>
        </Link>
        <Link to="/blog">
            <h4>Blog</h4>
        </Link>
    </div>
  )
}