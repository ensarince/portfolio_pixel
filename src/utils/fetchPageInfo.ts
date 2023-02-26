import { PageInfo } from "../typings";

export const fetchSocials = async() => {
    const res = await fetch(`${import.meta.env.VITE_APP_PUBLIC_BASE_URL}api/getPageInfo` || "http://localhost:5173/api/getPageInfo")

    const data = await res.json()
    const pageInfo: PageInfo[] = data.pageInfo;
    //console.log("fetching => > >", skills)
    return pageInfo
}