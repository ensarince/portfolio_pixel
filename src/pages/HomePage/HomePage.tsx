import Header from '../../components/Header'
import styles from "./HomePage.module.scss"
import { useTypewriter } from "react-simple-typewriter"
import { SocialIcon } from 'react-social-icons';
import { SpotifyData } from '../../services/spotify';
import img_1 from "../../assets/1.jpg"

type Props = {
  nowPlaying: SpotifyData | null
}

export default function HomePage({ nowPlaying }: Props) {

  const [text] = useTypewriter({
    words: [`Hi, I am Ensar`, "<developer👨‍💻/>", "climber🧗‍♂️"],
    loop: true,
    delaySpeed: 3000,
  })

  return (
    <>
      <Header />
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        padding: "1rem", 
        alignItems: "center", 
        minHeight: "calc(100vh - 80px)"
      }}>
        <div className={styles.div__homeContainer}>
          <div className={styles.profileSection}>
            <div className={styles.videoContainer}>
              {/* <video 
                    autoPlay
                    loop 
                    muted 
                    id='video'
                    className={styles.video}>
                    <source src="./video1.mp4" type="video/mp4" />
                </video> */}
              <img src={img_1} alt="profile" className={styles.video} />
              <div className={styles.videoOverlay}></div>
            </div>

            <div className={styles.div__infoContainer}>
              <div className={styles.p__infoText}>
                <span>{text}</span>
              </div>
            </div>
          </div>

          <div className={styles.socialSection}>
            <div className={styles.div__socials}>
              <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='#1F2937' url='mailto:ensrnce@gmail.com' />
              <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='#1F2937' url='https://github.com/ensarince' />
              <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='#1F2937' url='https://www.linkedin.com/in/ensar-ince-67a580155/' />
              <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='#1F2937' url='https://www.instagram.com/rakionrocks' />
              <SocialIcon fgColor='#FFFFFF' className={styles.icon__social} bgColor='#1F2937' url='https://www.youtube.com/channel/UCQ-mC4AvDdFi8BufERuzV1g' />
            </div>
          </div>

          <div className={styles.musicSection}>
            <div className={styles.div__spotify}>
              {
                !nowPlaying ? (
                  <div className={styles.div__noPlayingScreen}>
                    <div className={styles.musicIcon}>🎧</div>
                    <h4>No track playing</h4>
                  </div>
                ) :
                  (
                    <div className={styles.div__playingScreen}>
                      <img src={nowPlaying.item?.album.images[0]?.url} alt={nowPlaying.item.album.name} />
                      <div className={styles.trackInfo}>
                        <h4>{nowPlaying.item?.name}</h4>
                        <p>{nowPlaying.item?.album.artists[0]?.name}</p>
                        <div className={styles.liveIndicator}>
                          <div className={styles.pulse}></div>
                          Live
                        </div>
                      </div>
                    </div>
                  )
              }
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
