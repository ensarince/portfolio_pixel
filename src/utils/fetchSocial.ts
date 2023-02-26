import { Social } from "../typings";

export const fetchSocials = async() => {
    const res = await fetch(`${import.meta.env.VITE_APP_PUBLIC_BASE_URL}api/getSocials` || "http://localhost:5173/api/getSocials")

    const data = await res.json()
    const socials: Social[] = data.socials;
    //console.log("fetching => > >", skills)
    return socials
}