import {Project} from "../typings"

export const fetchProjects = async() => {
    const res = await fetch(`${import.meta.env.VITE_APP_PUBLIC_BASE_URL}api/getProjects` || "http://localhost:5173/api/getProjects")

    const data = await res.json()
    const projects: Project[] = data.projects;
    //console.log("fetching => > >", skills)
    return projects
}