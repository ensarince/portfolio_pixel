import { groq } from "next-sanity";
import { sanityClient } from "../sanity"
import {Skill} from "../typings"

const query = groq`
    *[_type == "skill"] | order(domain asc, title asc) {
        _id, _type, _createdAt, _updatedAt, _rev,
        title,
        domain,
        image
    }
`
type Data = {
    skills: Skill[]
}

export default async function getSkills(): Promise<Data> {
  const skills = await sanityClient.fetch(query);
  return { skills };
}