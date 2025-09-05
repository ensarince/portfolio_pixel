import React from 'react'
import styles from "./Gallery.module.scss"
import Header from '../../components/Header';
import { Gallery } from '../../typings';
import { Box } from '@mui/material';
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

type Props = {
  gallery: Gallery[] | undefined
}

function GalleryPage({ gallery }: Props) {

  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  return (
    <>
      <Header />

      <Box>
        <img
          className={styles.postImage}
          src={
            gallery && gallery.length > 0 && gallery[0].images && gallery[0].images.length > 0
              ? urlFor(gallery[0].images[0])?.url()
              : undefined
          }
          alt="gallery item"
        />

      </Box>
    </>
  )
}

export default GalleryPage