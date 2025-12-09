import { sanityClient } from '../sanity';

export interface PortfolioData {
    pageInfo: any;
    skills: any[];
    projects: any[];
    socials: any[];
    climbs: any[];
    gallery: any[];
    posts: any[];
    cv: any;
}

/**
 * Fetch all portfolio data to use as context for the AI chatbot
 */
export async function getPortfolioData(): Promise<PortfolioData> {
    try {
        const [pageInfo, skills, projects, socials, climbs, gallery, posts, cv] = await Promise.all([
            sanityClient.fetch(`*[_type == "pageInfo"][0]`),
            sanityClient.fetch(`*[_type == "skill"]`),
            sanityClient.fetch(`*[_type == "project"]`),
            sanityClient.fetch(`*[_type == "social"]`),
            sanityClient.fetch(`*[_type == "climb"]`),
            sanityClient.fetch(`*[_type == "gallery"]`),
            sanityClient.fetch(`*[_type == "post"] | order(_createdAt desc)`),
            sanityClient.fetch(`*[_type == "cv"][0]`),
        ]);

        return {
            pageInfo,
            skills,
            projects,
            socials,
            climbs,
            gallery,
            posts,
            cv,
        };
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        throw error;
    }
}

/**
 * Format portfolio data into a readable string for AI context
 */
export function formatPortfolioContext(data: PortfolioData): string {
    const sections: string[] = [];

    // Personal Info
    if (data.pageInfo) {
        sections.push(`ABOUT ENSAR:
Name: ${data.pageInfo.name || 'Ensar'}
Role: ${data.pageInfo.role || 'N/A'}
Bio: ${data.pageInfo.backgroundInformation || ''}
Email: ${data.pageInfo.email || 'N/A'}
Phone: ${data.pageInfo.phoneNumber || 'N/A'}
Location: ${data.pageInfo.address || 'N/A'}
`);
    }

    // Skills/Technologies
    if (data.skills && data.skills.length > 0) {
        sections.push(`TECHNICAL SKILLS & TECHNOLOGIES:
${data.skills.map(s => `- ${s.title} (Proficiency: ${s.progress || 'N/A'}%)`).join('\n')}
`);
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
        sections.push(`PROJECTS & WORK:
${data.projects.map(p => {
            const details = [
                p.title,
                `Category: ${p.category}`,
                `Summary: ${p.summary || p.description || 'N/A'}`,
                p.technologies && p.technologies.length > 0 ? `Technologies: ${p.technologies.map((t: any) => t.title).join(', ')}` : '',
                p.role ? `Role: ${p.role}` : '',
                p.impact ? `Impact: ${p.impact}` : '',
                p.duration ? `Duration: ${p.duration}` : '',
                p.featured ? '⭐ Featured Project' : '',
            ].filter(Boolean).join(' | ');
            return `- ${details}`;
        }).join('\n')}
`);
    }

    // Climbing Achievements
    if (data.climbs && data.climbs.length > 0) {
        sections.push(`CLIMBING ACHIEVEMENTS:
${data.climbs.map(c => {
            const details = [
                c.title,
                `Type: ${c.category}`,
                `Difficulty: ${c.difficulty}`,
                c.location ? `Location: ${c.location}` : '',
                c.description ? `Description: ${c.description}` : '',
                c.dateCompleted ? `Date Completed: ${c.dateCompleted}` : '',
                c.elevation ? `Elevation: ${c.elevation}` : '',
                c.duration ? `Duration: ${c.duration}` : '',
                c.featured ? '⭐ Featured Climb' : '',
            ].filter(Boolean).join(' | ');
            return `- ${details}`;
        }).join('\n')}
`);
    }

    // Blog Posts
    if (data.posts && data.posts.length > 0) {
        sections.push(`BLOG & ARTICLES:
${data.posts.map(p => {
            const details = [
                p.title,
                p.summary ? `Summary: ${p.summary}` : '',
                p.categories && p.categories.length > 0 ? `Category: ${p.categories[0].title || 'N/A'}` : '',
            ].filter(Boolean).join(' | ');
            return `- ${details}`;
        }).join('\n')}
`);
    }

    // Social Links
    if (data.socials && data.socials.length > 0) {
        sections.push(`SOCIAL LINKS:
${data.socials.map(s => `- ${s.title}: ${s.url}`).join('\n')}
`);
    }

    // CV / Resume
    if (data.cv) {
        const cvSections: string[] = [];

        if (data.cv.summary) {
            cvSections.push(`PROFESSIONAL SUMMARY:
${data.cv.summary}`);
        }

        if (data.cv.experience && data.cv.experience.length > 0) {
            cvSections.push(`PROFESSIONAL EXPERIENCE:
${data.cv.experience.map((exp: any) => {
                const duration = exp.duration ? ` (${exp.duration})` : '';
                const current = exp.current ? ' [CURRENT]' : '';
                const details = [
                    `${exp.position} at ${exp.company}${duration}${current}`,
                    exp.description ? `Description: ${exp.description}` : '',
                ].filter(Boolean).join('\n  ');
                return `- ${details}`;
            }).join('\n')}`);
        }

        if (data.cv.education && data.cv.education.length > 0) {
            cvSections.push(`EDUCATION:
${data.cv.education.map((edu: any) => {
                const details = [
                    `${edu.degree} in ${edu.field} from ${edu.school}`,
                    edu.year ? `(${edu.year})` : '',
                    edu.description ? `Description: ${edu.description}` : '',
                ].filter(Boolean).join('\n  ');
                return `- ${details}`;
            }).join('\n')}`);
        }

        if (data.cv.certifications && data.cv.certifications.length > 0) {
            cvSections.push(`CERTIFICATIONS & CREDENTIALS:
${data.cv.certifications.map((cert: any) => {
                const details = [
                    `${cert.name} - ${cert.issuer}`,
                    cert.date ? `(${cert.date})` : '',
                    cert.url ? `URL: ${cert.url}` : '',
                ].filter(Boolean).join('\n  ');
                return `- ${details}`;
            }).join('\n')}`);
        }

        if (data.cv.languages && data.cv.languages.length > 0) {
            cvSections.push(`LANGUAGES:
${data.cv.languages.map((lang: any) => `- ${lang.language}: ${lang.proficiency}`).join('\n')}`);
        }

        if (cvSections.length > 0) {
            sections.push(`CV / RESUME:\n\n${cvSections.join('\n\n')}`);
        }
    }

    // Gallery
    if (data.gallery && data.gallery.length > 0 && data.gallery[0]?.images) {
        sections.push(`GALLERY & PHOTOGRAPHY:
${data.gallery[0].images.map((img: any) => `- ${img.description || 'Photo'}`).join('\n')}
`);
    }

    const context = sections.filter(s => s && s.trim().length > 0).join('\n\n---\n\n');
    return context || 'Unable to load portfolio data. Please try again later.';
}
