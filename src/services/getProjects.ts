import { groq } from "next-sanity";
import { sanityClient } from "../sanity";
import { Project } from "../typings";

const query = groq`
    *[_type == "project"] {
        ...,
        technologies[]->
    } | order(_createdAt desc)
`
type Data = {
    projects: Project[]
}

export default async function getProjects(): Promise<Data> {
  const projects = await sanityClient.fetch(query);
  return { projects };
}