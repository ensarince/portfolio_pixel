import Header from '../../components/Header'
import styles from "./HomePage.module.scss"
import {useTypewriter} from "react-simple-typewriter"
import { SocialIcon } from 'react-social-icons';
import { SpotifyData } from '../../services/spotify';

type Props = {
  nowPlaying: SpotifyData | null
}

export default function HomePage({nowPlaying}: Props) {
  
  const [text] = useTypewriter({
    words: [`Hi, I am Ensar`, "<developer👨‍💻/>", "climber🧗‍♂️"],
    loop: true,
    delaySpeed: 3000,
  })

  return (
    <>
    <Header />
    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", padding:"2em", alignItems:"center"}}>
        <div className={styles.div__homeContainer}>
            <video 
                autoPlay
                loop 
                muted 
                id='video'
                className={styles.video}>
                <source src="./video1.mp4" type="video/mp4" />
            </video>

            <div className={styles.div__infoContainer}>
                <div className={styles.p__infoText}>
                  <span>{text}</span>
                </div>
            </div>

            <div className={styles.div__socials}>
                <SocialIcon fgColor='#A9C5B9' className={styles.icon__social} bgColor='#122128' url='mailto:ensrnce@gmail.com'/>
                <SocialIcon fgColor='#A9C5B9' className={styles.icon__social} bgColor='#122128' url='https://github.com/ensarince'/>
                <SocialIcon fgColor='#A9C5B9' className={styles.icon__social} bgColor='#122128' url='https://www.linkedin.com/in/ensar-ince-67a580155/' />
                <SocialIcon fgColor='#A9C5B9' className={styles.icon__social} bgColor='#122128' url='https://www.instagram.com/'/>
                <SocialIcon fgColor='#A9C5B9' className={styles.icon__social} bgColor='#122128' url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g'/>
              </div>

              <div className={styles.div__spotify}>
                {
                  !nowPlaying ? (
                    <div className={styles.div__noPlayingScreen}>                
                      <h3>No track playing</h3>
                      <img src="https://media.tenor.com/RJeWfFKBnOUAAAAM/listening-to-music-jamming.gif" alt="" />
                    </div>
                  ) : 
                  (
                  <div className={styles.div__playingScreen}>
                    <h3>Now playing: {nowPlaying.item?.name}</h3>
                    <h3>Artist: {nowPlaying.item?.album.artists[0]?.name}</h3>
                    <img src={nowPlaying.item?.album.images[0]?.url} alt={nowPlaying.item.album.name} />
                  </div>
                  )
                }
              </div>

        </div>

    </div>
    </>
  )
}
