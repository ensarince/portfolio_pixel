import { groq } from "next-sanity";
import { sanityClient } from "../sanity"
import {Skill} from "../typings"

const query = groq`
    *[_type == "skill"] | order(_createdAt desc)
`
type Data = {
    skills: Skill[]
}

export default async function getSkills(): Promise<Data> {
  const skills = await sanityClient.fetch(query);
  return { skills };
}