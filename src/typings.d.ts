interface SanityBody{
    _createdAt: string
    _id: string
    _rev: string
    _updatedAt: string
} 

interface Image{
    _type: "image";
    asset: {
        _ref: string;
        _type: "reference"
    }
}

export interface PageInfo extends SanityBody{
    _type: "pageInfo"
    name: string
    address: string
    backgroundInformation: string
    email: string
    role: string
    heroImage: Image
    phoneNumber: string
    profilePic: Image
    socials?: Array
}

export interface Skill extends SanityBody{
    _type: "skill"
    image: Image
    progress: number
    title: string
}


export interface Technology extends SanityBody{
    _type: "skill"
    image: Image
    progress: number
    title: string
}

export interface Project extends SanityBody{
    title: string
    _type: "project"
    image: Image
    linkToBuild: string
    summary: string
    technologies: Technology[]
}

export interface Social extends SanityBody{
    _type: "social";
    title: string;
    url: string;
}

export interface Category extends SanityBody{
    _type: "category";
    title: string;
}

export interface BlogPost extends SanityBody{
    title: string
    _type: "blog"
    image: Image
    text: string
    summary: string
    category: Category[]
}