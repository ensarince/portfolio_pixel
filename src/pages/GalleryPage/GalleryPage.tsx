import { useState } from 'react'
import Header from '../../components/Header'
import { Gallery } from '../../typings'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'
import styles from './Gallery.module.scss'

type Props = { gallery: Gallery[] | undefined }

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

export default function GalleryPage({ gallery }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const allImages = (gallery ?? []).flatMap(doc =>
    (doc.images ?? []).reduce<{ url: string; desc?: string }[]>((acc, item) => {
      try {
        const url = urlFor(item.image).url()
        if (url) acc.push({ url, desc: item.description })
      } catch {}
      return acc
    }, [])
  )

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Gallery</h1>
            <p className={styles.pageSub}>{allImages.length} frame{allImages.length !== 1 ? 's' : ''}</p>
          </div>

          {allImages.length > 0 ? (
            <div className={styles.grid}>
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={styles.cell}
                  onClick={() => setSelected(img.url)}
                >
                  <img
                    src={img.url}
                    alt={img.desc ?? `Frame ${i + 1}`}
                    className={styles.photo}
                    loading="lazy"
                  />
                  {img.desc && (
                    <div className={styles.caption}>{img.desc}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>No frames yet</div>
          )}
        </div>
      </div>

      {selected && (
        <div className={styles.lightbox} onClick={() => setSelected(null)}>
          <button className={styles.close} onClick={() => setSelected(null)} aria-label="Close">×</button>
          <img
            src={selected}
            alt="Full view"
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
