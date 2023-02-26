import { BlogPost } from "../typings";

export const fetchBlogPosts = async() => {
    const res = await fetch(`${import.meta.env.VITE_APP_PUBLIC_BASE_URL}api/getBlogPosts` || "http://localhost:5173/api/getBlogPosts")

    const data = await res.json()
    const blogPosts: BlogPost[] = data.blogPosts;
    //console.log("fetching => > >", skills)
    return blogPosts
}