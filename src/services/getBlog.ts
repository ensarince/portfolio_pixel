import { useState, useEffect } from "react";
import { groq } from "next-sanity";
import { sanityClient } from "../sanity";
import { BlogPost } from "../typings";

const query = groq`
    *[_type == "post"]
`
type Data = {
    posts: BlogPost[]
}

export default async function getBlogPosts(): Promise<Data> {
  const posts = await sanityClient.fetch(query);
  return { posts };
}