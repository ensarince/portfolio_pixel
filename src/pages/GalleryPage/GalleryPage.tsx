import React, { useState } from 'react'
import styles from "./Gallery.module.scss"
import Header from '../../components/Header';
import { Gallery } from '../../typings';
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

type Props = {
  gallery: Gallery[] | undefined
}

function GalleryPage({ gallery }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  }

  const closeModal = () => {
    setSelectedImage(null);
  }

  return (
    <>
      <Header />
      
      <div className={styles.container}>
        <h1 className={styles.title}>Photo Gallery</h1>
        
        {gallery && gallery.length > 0 ? (
          <div className={styles.gallery}>
            {gallery.map((galleryDoc, galleryIndex) => (
              <div key={galleryIndex}>
                {galleryDoc.images && galleryDoc.images.map((imageItem, imageIndex) => {
                  try {
                    const imageUrl = urlFor(imageItem.image)?.url();
                    return imageUrl ? (
                      <div 
                        key={`${galleryIndex}-${imageIndex}`} 
                        className={styles.galleryItem}
                        style={{'--delay': `${(galleryIndex * galleryDoc.images.length + imageIndex) * 0.1}s`} as React.CSSProperties}
                        onClick={() => handleImageClick(imageUrl)}
                      >
                        <div className={styles.imageWrapper}>
                          <img
                            className={styles.galleryImage}
                            src={imageUrl}
                            alt={`Gallery image ${imageIndex + 1}`}
                          />
                          <div className={styles.imageOverlay}>
                            <div className={styles.overlayContent}>
                              {imageItem.description && (
                                <h4 className={styles.imageTitle}>{imageItem.description}</h4>
                              )}
                              <div className={styles.viewFullSize}>
                                Click to view full size
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  } catch (error) {
                    console.error('Error processing image:', error, imageItem);
                    return null;
                  }
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📸</div>
            <h2 className={styles.emptyTitle}>No photos yet</h2>
            <p className={styles.emptyDescription}>
              Gallery is currently empty. Photos will appear here once they're uploaded.
            </p>
          </div>
        )}

        {/* Modal for full-size image view */}
        {selectedImage && (
          <div className={styles.modal} onClick={closeModal}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <img
              className={styles.modalImage}
              src={selectedImage}
              alt="Full size view"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default GalleryPage