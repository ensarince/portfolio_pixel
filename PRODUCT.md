# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Recruiters and hiring managers at product companies, startups, and agencies in Germany/EU. They form an opinion in under 30 seconds — skimming fast for signal. They need to feel the person, not just read a CV, and they remember personalities over credentials.

**Secondary:** Peers and potential collaborators who arrive via a shared link or the climbing/writing content.

## Product Purpose

Ensar Ince's personal portfolio — a working argument that he is worth hiring. The site must do three things: establish who Ensar is as a person (not just a developer), demonstrate real technical work, and make it effortless to reach out.

## Positioning

Ensar is a developer who also climbs hard routes. The combination is the differentiator: climbing is a discipline of reading a system, committing under uncertainty, iterating on failures, and finishing problems — the same moves coding demands. That duality is the one thing a neighbour portfolio cannot copy, and it should hit a recruiter immediately.

## Operating Context

Recruiters land on the page, spend 20–40 seconds, and decide whether to click a link or close the tab. The portfolio competes with dozens of near-identical React-dev portfolios open in adjacent tabs. The human story is what survives that comparison. Climbers, developers, and people who moved abroad to reinvent themselves will feel a specific recognition.

## Capabilities and Constraints

- React + TypeScript + Vite SPA, deployed on Netlify via Git push
- Sanity CMS powers Projects, Blog, Skills, Gallery, and Climbs content
- SCSS Modules; design system variables in `src/assets/_variables.scss`
- `@portabletext/react` renders rich text; `@sanity/image-url` builds image URLs
- Spotify "now playing" widget on the contact section (live API polling)
- Pages: Home (single-page with sections), Portfolio, Skills, Blog, BlogPost, Gallery, Climbs, ClimbDetail (climb saga view)
- CV PDF download available on the hero
- No CMS for the hero or About section — copy is hard-coded in components

## Brand Commitments

- Name: **Ensar Ince** (no nickname variant in use)
- Identity: developer + rock climber — both halves are load-bearing, neither is decorative
- Voice: direct, self-aware, slightly wry; Turkish-German background surfaces naturally; no corporate polish
- The climbing section (Climbs, ClimbDetail saga writing) is a first-class content type, not a hobby footnote

## Evidence on Hand

- Photo assets: `src/assets/1.png` (hero portrait), `src/assets/2.jpg` (secondary/about photo)
- CV: `src/assets/Ensar Ince_cv.pdf`
- Live projects in Sanity, blog posts, skill entries, gallery images, climb entries — all CMS-managed
- No testimonials, client logos, or press coverage on hand; future work must not fabricate any

## Product Principles

1. **Personality over credentials.** A recruiter who remembers Ensar the person will reach out; one who read another TypeScript list won't.
2. **The duality is the hook.** Developer and climber are not two facts in a bio — they are one coherent identity. Design choices should reflect that.
3. **Fast signal.** Every section should earn its scroll. If something does not help a recruiter decide, it should not be above the fold.
4. **Honest and specific.** No invented social proof, no vague superlatives. Real work, real writing, real routes.
5. **Human texture over slickness.** The site should feel made by a person, not assembled from a template. Warmth and specificity beat polish.

## Accessibility & Inclusion

No specific accessibility requirements established beyond standard web baseline (semantic HTML, keyboard nav, contrast). Recruiter audience skews desktop but mobile must be functional.
