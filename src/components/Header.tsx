import { Link } from 'react-router-dom'
import styles from "./Header.module.scss"

type Props = {}

export default function Header({}: Props) {
  return (
    <div className={styles.header}>
        <Link to="/">
            <h4>About</h4>
        </Link>
        <Link to="/portfolio">
            <h4>Portfolio</h4>
        </Link>
        <Link to="/skills">
            <h4>Skills</h4>
        </Link>
        <Link to="/blog">
            <h4>Blog</h4>
        </Link>
        <Link to="/gallery">
            <h4>Gallery</h4>
        </Link>
        <Link to="/climbs">
            <h4>Climbs</h4>
        </Link>
    </div>
  )
}