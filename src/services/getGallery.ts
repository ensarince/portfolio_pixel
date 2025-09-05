import { groq } from "next-sanity";
import { sanityClient } from "../sanity";
import {  Gallery } from "../typings";

const query = groq`
  *[_type == "gallery"] | order(_createdAt desc)
`;
type Data = {
    gallery: Gallery
}

export default async function getGallery(): Promise<Data> {
  const gallery = await sanityClient.fetch(query);
  return { gallery };
}