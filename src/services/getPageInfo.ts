import { groq } from "next-sanity";
import { sanityClient } from "../sanity";
import { PageInfo } from "../typings";

const query = groq`
    *[_type == "pageInfo"][0] 
`

type Data = {
    pageInfo: PageInfo[]
}

export default async function getPageInfo(): Promise<Data> {
  const pageInfo = await sanityClient.fetch(query);
  return { pageInfo };
}