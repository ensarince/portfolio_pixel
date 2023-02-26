import { Skill } from "../typings";

export const fetchSkills = async() => {
    const res = await fetch(`${import.meta.env.VITE_APP_PUBLIC_BASE_URL}api/getSkills` || "http://localhost:5173/api/getSkills")

    const data = await res.json()
    const skills: Skill[] = data.skills;
    //console.log("fetching => > >", skills)
    return skills
}