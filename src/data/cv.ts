// Single source of truth for the CV shown on the About page.
// Skills come from Sanity (same list as the Skills page).
// Edit here — the PDF in src/assets is a separate file and must be updated by hand.

export interface CvJob {
  role: string
  company: string
  period: string
  points: string[]
  stack?: string[]
}

export interface CvProject {
  name: string
  tagline: string
  url: string
  period: string
  points: string[]
  stack: string[]
}

export const cv = {
  summary:
    "I am a driven software developer with a Master's in Media Informatics. I combine a creative eye with an analytical mind, thrive in team environments and I'm known for fast, practical problem-solving.",

  experience: [
    {
      role: 'Software Developer (frontend-focused)',
      company: 'Didactic Innovations GmbH',
      period: '2023 – now',
      points: [
        'Built most of the learning minigames for an award-winning career platform of a global technology company, played by 10k+ young people and showcased at large events. Built in TypeScript.',
        'Developed ~20 SCORM e-learning apps that large companies (audit, retail, pharma) run in their LMS to train their employees.',
        'Built a custom AI chatbot for teachers and students in a German federal state: Python backend, TypeScript frontend.',
      ],
      stack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'LLMs / RAG', 'SCORM'],
    },
    {
      role: 'Freelancer Web Developer',
      company: 'Upwork',
      period: '2021 – 2023',
      points: ['Programming tailored user interfaces and experiences for various small clients'],
    },
  ] as CvJob[],

  projects: [
    {
      name: 'Take!',
      tagline: 'Climbing partner & dating app',
      url: 'https://takeclimbing.live',
      period: '2025',
      points: [
        'Solo-built a mobile app for climbers, from concept, branding and design through development, deployment and marketing.',
        'Partner matching by grade, style and location, real-time encrypted chat and Google sign-in. Live on Google Play with 50+ active users and growing.',
      ],
      stack: ['React Native', 'Expo', 'PocketBase', 'Railway', 'Vercel'],
    },
    {
      name: 'Barek Forum',
      tagline: 'Community forum for boulderers in Türkiye',
      url: 'https://www.barekforum.com',
      period: '2025',
      points: [
        'Solo-built an invite-only forum for the Barek Dağı bouldering community over 6 months, shaping features together with its members. 100 active members.',
        'Topics, boulder sector pages and admin-approved membership. Still maintained and improved.',
      ],
      stack: ['Next.js', 'Supabase'],
    },
  ] as CvProject[],

  education: [
    { degree: 'M.Sc. Media Informatics', school: 'Universität des Saarlandes', period: '2022 – 2025' },
    { degree: 'B.Sc. Computer Engineering', school: 'Eskişehir Technical University', period: '2016 – 2021' },
  ],

  languages: [
    { name: 'Turkish', level: 'Native' },
    { name: 'English', level: 'Business fluent' },
    { name: 'German', level: 'Intermediate (B2)' },
  ],
}
