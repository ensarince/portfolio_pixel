import { groq } from "next-sanity";
import { useEffect, useState } from "react";
import { sanityClient } from "../sanity"
import {Social} from "../typings"

const query = groq`
    *[_type == "social"] 
`
type Data = {
    socials: Social[]
}

export default async function getSocials(): Promise<Data> {
  const socials = await sanityClient.fetch(query);
  return { socials };
}