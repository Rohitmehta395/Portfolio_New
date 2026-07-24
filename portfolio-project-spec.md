# Premium Developer Portfolio — Project Specification

## Project Overview

This document is the complete technical specification for a premium, animated developer portfolio web application. It is built by reverse-engineering the structural, experiential, and animation patterns of a reference site (https://vikashuvi.me/) and then designing an original, production-grade full-stack architecture around those patterns — a dynamic, database-driven, CMS-managed portfolio rather than a static personal site.

The application is not a 1:1 visual clone of the reference site. Its own visual identity (colors, typography, exact spacing) will be designed independently, in a premium editorial direction. What is being reverse-engineered and reused is the **information architecture, section structure, animation strategy, and experience flow** of the reference site — the proven shape of a portfolio that reads as personal, credible, and non-generic.

**Core capabilities of the final product:**
- Premium animated frontend (kinetic typography, pinned scroll sequences, marquees, smooth scrolling)
- Dynamic content management via an admin dashboard (Projects and Blog, full CRUD)
- Database-driven content for Projects, Case Studies, Experience, Skills, Technology, Blog Posts, Testimonials, Contact Messages, and Site Settings
- OAuth-gated admin authentication (single-owner system, no public user accounts)
- Full SEO architecture: dynamic metadata, dynamic OG images, sitemap, robots.txt, structured data (JSON-LD)
- Performance-conscious animation architecture built for heavy GSAP/ScrollTrigger usage without jank or memory leaks

---

## Reference Website Analysis

### Source
Reference: https://vikashuvi.me/ (Vikash Thirumurugan — "Vikashuvi | Creative Software Developer")

### Overall Experience

**First impression:** Confident, personal, slightly playful — not a sterile "enterprise" portfolio. The hero leads with a giant animated headline built from stacked phrases ("HELLO, I'M Vikashuvi... SOFTWARE DEVELOPER WHO CRAFTS creative DIGITAL EXPERIENCES") interspersed with a portrait and small motif images. It reads like a sentence you assemble as you scroll/look, not a static tagline.

**Brand personality:** Craftsman-developer with a narrative voice. Copy is written in first person, informal-but-precise (e.g. framing that the site builder cares about software that "doesn't flinch under real traffic," and that a website is "the first conversation you have with a stranger"). It's editorial copywriting layered on top of a technical portfolio — this is a significant differentiator from generic templated portfolios that just list "Skills: React, Node."

**Target audience:** Founders/agencies/recruiters evaluating a freelance-leaning full-stack + creative developer for client work. A dedicated "Working Across Borders" section (flags for America, Germany, Nigeria, India) signals international client credibility.

**What makes it different from a normal portfolio:**
- Storytelling copy instead of bullet-point resume language
- A dedicated "My Journey" narrative page separate from "Experience"
- A playful GitHub contribution graph paired with animated "eyes" that appear to visually react — a signature delight detail
- Project/capability cards framed around outcomes and philosophy (e.g. "Research Before Pixels") rather than just tech stacks
- Country flags used as a trust/credibility signal instead of client logos

**Emotional journey:**
```
Land on hero → assemble identity via animated headline → scroll to proof-of-activity (GitHub graph, playful eyes) →
see tech stack (credibility) → see real experience with employers (trust) →
see categorized capabilities via "What I do" (positioning) → see global client range (scale/credibility) →
CTA to view all works / journey / contact
```

This is a "personality → credibility → capability → proof → conversion" funnel, not a flat "list of projects" funnel.

### Section-by-Section Breakdown

#### A. Navbar / Menu
- **Purpose:** Global navigation + brand identity anchor.
- **Layout:** Fixed/sticky, logo left, menu trigger right. Sitemap includes: Home, My Journey, My Works, My Experience, Open Source, plus social links and a "Get in Touch" + "Resume" CTA.
- **Components:** Logo, menu trigger button, full-screen overlay panel, nav links list, social icon row, resume/contact CTA.
- **Animation:** Full-screen overlay reveal with staggered link entrance, animated open/close (hamburger ↔ X) state.
- **Mobile behavior:** Same overlay pattern, full-viewport takeover, larger touch targets, stacked layout.

#### B. Hero Section
- **Purpose:** Identity + positioning statement delivered as kinetic typography rather than a static banner.
- **Layout:** Large multi-line headline built from separate animated word/phrase spans (name, role, descriptors), interleaved with small circular/inline imagery (portrait, abstract geometry) placed inline within the text flow.
- **Components:** Kinetic headline (multiple animated text spans), inline portrait + abstract-shape images, a contextual in-sentence link (e.g. "story?" linking to `/journey`), CTA button ("Read My Journey").
- **Animation:** Staggered text reveal (word-by-word fade/slide-up), inline images that scale/fade in as their word appears, subtle parallax on scroll-out.
- **Responsive behavior:** Text size scales down aggressively; inline images collapse or shrink on mobile; sentence structure must reflow gracefully at narrow widths — the hardest part of this section to rebuild faithfully.

#### C. GitHub Activity Section
- **Purpose:** Live proof-of-work / consistency signal — an unusual and effective credibility device.
- **Layout:** Contribution heatmap styled like GitHub's own calendar, with month/day labels and a "Less/More" legend.
- **Components:** Custom contribution graph component, animated "eyes" SVGs (a playful easter egg).
- **Animation:** Eyes likely track cursor position (pupil follows cursor) — a small, delightful, non-essential detail that adds personality.
- **Data required:** GitHub GraphQL API (contributions calendar), fetched server-side or via a cached API route, since this data must be live/real per user.

#### D. Technologies Marquee
- **Purpose:** Quick, skimmable tech credibility.
- **Layout:** Horizontal infinite scroll/marquee of tech logos + labels (Next.js, Python, TypeScript, Flutter, Tailwind CSS, Firebase, PostgreSQL, DynamoDB, Electron, Node.js, GSAP), duplicated for seamless looping.
- **Animation:** Continuous horizontal scroll, likely pausing on hover.
- **Responsive behavior:** Marquee naturally reflows; speed/size adjust on smaller viewports.

#### E. Experience Timeline
- **Purpose:** Chronological credibility — real companies, real roles, narrative reflection per role, not just a bullet list.
- **Layout:** Numbered list (01, 02...) with company name, role(s), date range, a first-person reflective paragraph, tag pills for skills used, a "VIEW" link to the company site, and a company image.
- **Components:** `ExperienceCard` (repeatable), tag/pill component, numbered index, "View All" link to `/experience`.
- **Animation:** Scroll-triggered reveal per card (fade/slide), possibly image reveal via clip-path.
- **Data required:** Company name, role(s) — supporting multiple roles per company (e.g. "Founding Developer" → "Technical Project Lead" at the same company) — date ranges, description, tags/skills array, external URL, image.

#### F. Marquee Divider ("ANALYZE ✦ DESIGN ✦ BUILD ✦ VALIDATE ✦ OPTIMIZE ✦ SCALE")
- **Purpose:** Rhythmic section break reinforcing "process" as a brand pillar.
- **Layout:** Single-line horizontal scrolling ticker with a separator glyph.
- **Animation:** Continuous horizontal scroll, likely in the opposite direction from the tech marquee for visual rhythm.

#### G. "What I do" (Capabilities Showcase)
- **Purpose:** Position the developer around outcomes (Enterprise Development, Web Presence, Mobile, UX Research) rather than a raw tech list — the site's strongest differentiator.
- **Layout:** A sticky/pinned showcase: one large image on one side, category label + tag pills + heading + description on the other, with a repeating oversized title watermark behind it (e.g. "Enterprise Development" repeated multiple times, oversized, faint) — a classic premium-editorial "ghost typography" background texture technique.
- **Components:** `CapabilityCard` (repeatable, 4 total: Enterprise Software, Website Design & Application, Mobile Application, UX & Product Excellence Research), each with a category eyebrow label, big background title text, image, description, and tag pills.
- **Animation:** Strong candidate for a GSAP ScrollTrigger pinned/stacked-card sequence (pin: true, scrub) — directly reusable from prior work building a sticky stacking-card case-studies pattern.
- **Data required:** Title, category label, description, tags array, image.

#### H. "Working Across Borders" (Global Reach)
- **Purpose:** Trust signal via client geography instead of client logos (privacy-friendly, still communicates scale).
- **Layout:** Row/grid of flag icons + country names (America, Germany, Nigeria, India).
- **Animation:** Staggered fade-in on scroll; possibly a subtle marquee too, for rhythm consistency with sections E and F.

#### I. Footer
- **Purpose:** Final conversion point + secondary sitemap.
- **Layout:** Repeats sitemap links, social links, "Work With Me" with an obfuscated/anti-scraping-protected email, resume link, copy-to-clipboard email button.
- **Components:** `FooterNav`, `SocialLinks`, `EmailCopyButton` (with copy feedback state), `ResumeLink`.

#### J. Works Page (`/works`)
- **Purpose:** Full project gallery, filterable by category.
- **Layout:** Filter tabs at top (Websites / SaaS Platforms / Mobile Apps / View All), then a vertical list of large project cards.
- **Components:** `FilterTabs`, `ProjectCard` (image, title, description, tech-stack pill row), closing CTA ("Let's connect!" + Get in Touch button).
- **Animation:** Filter transitions via crossfade/slide (layout animation); project images likely reveal on scroll via clip-path or scale-in, matching the hero treatment.
- **Data required (per project):** title, description, category (website/saas/mobile), tech stack array, cover image, external link and/or case-study slug for a detail page.

#### K. Journey Page (`/journey`) and Experience Page (`/experience`)
Structurally inferred (not deeply fetched): Journey is a narrative/story timeline (a personal "why I code" arc), and Experience is an expanded version of the homepage timeline section. These should be verified against the live source before final content modeling if an exact structural match is required.

### Design System (Inferred — Not Pixel-Verified)

> **Important caveat:** the following was inferred from page structure and semantic markup, not from an actual rendered screenshot or computed CSS inspection (no browser/screenshot tool was available to verify exact hex values, font-family names, or spacing scale). This project's own visual identity should be designed independently rather than treated as a verified clone of the reference site's exact design tokens.

**Color language:** Dark-mode-first, high-contrast, likely a near-black background with off-white/cream text (typical of this genre of editorial developer portfolio). Likely a single restrained accent hue used sparingly for links/CTAs rather than a multi-color palette.

**Typography:** Two-tier system — an oversized display font for hero and section headlines (dominating the viewport), paired with a clean, small, high-legibility sans for body copy and tags. The repeated oversized background text in "What I do" suggests a font weight extreme enough to remain legible even at low contrast/opacity.

**Spacing:** Generous vertical rhythm between sections in a single long-scroll homepage (roughly 8-9 major sections); large section padding, tight internal card padding; fully rounded pill-shaped tags with small text and tight padding, used consistently for tech stacks and descriptors.

**Visual language:** Editorial + developer-focused + narrative — closer to a design-agency site with strong developer credibility than a clean minimal resume. Repeated ghost-text backgrounds, inline-image-in-headline typography, and marquee dividers are all agency-site techniques. Smooth, physically-eased scrolling is almost certainly present site-wide, consistent with the reference author's other listed projects that use smooth-scroll libraries.

### Animation Analysis

| Interaction | What happens visually | Likely implementation | Library |
|---|---|---|---|
| Hero kinetic headline | Words/phrases animate in individually, inline images pop in mid-sentence | Timeline-based stagger, word-level splitting | GSAP (SplitText or manual span-wrapping) |
| Smooth scroll | Entire page scroll feels buttery/eased, not native | Virtual scroll hijack | Lenis, synced with GSAP ScrollTrigger |
| GitHub eyes | Pupils track cursor / react | Mouse position → transform on inner SVG group | Vanilla JS or Framer Motion `useMotionValue` |
| Tech marquee | Infinite horizontal loop | Duplicated track, translateX loop | CSS keyframes or GSAP `.to()` with modifiers plugin |
| Section marquee (ANALYZE✦DESIGN✦...) | Infinite horizontal ticker, opposite direction | Same as above, reversed | GSAP |
| Experience cards | Reveal on scroll into view | ScrollTrigger per-card fade/slide | GSAP ScrollTrigger |
| "What I do" showcase | Pinned section, content swaps as you scroll past, giant background title shifts | Pinned ScrollTrigger with scrub, image/text crossfade per scroll segment | GSAP ScrollTrigger (pin: true, scrub) |
| Works page filters | Tab click reorders/filters cards | Layout animation on filtered list | Framer Motion `layout` prop |
| Project card images | Reveal with a mask/clip as they scroll in | clip-path animation | GSAP or CSS |
| Email copy button | Click → icon/text swaps to "Copied" | Local state timeout | React state (no library needed) |
| Email obfuscation | Email only decodes/renders client-side | Character-offset encoding, decoded via inline script | Custom utility (own implementation, not a vendor CDN dependency) |

### Component Architecture (Reference-Derived Tree)

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   ├── MenuOverlay.tsx
│   │   │   └── NavLink.tsx
│   │   └── Footer/
│   │       ├── Footer.tsx
│   │       └── EmailCopyButton.tsx
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── KineticHeadline.tsx
│   │   └── InlineImageWord.tsx
│   ├── github/
│   │   ├── GithubActivityGraph.tsx
│   │   ├── ContributionCell.tsx
│   │   └── ReactiveEyes.tsx
│   ├── marquee/
│   │   ├── TechMarquee.tsx
│   │   └── TextMarquee.tsx
│   ├── experience/
│   │   ├── ExperienceTimeline.tsx
│   │   ├── ExperienceCard.tsx
│   │   └── TagPill.tsx
│   ├── capabilities/
│   │   ├── CapabilitiesShowcase.tsx
│   │   └── CapabilityCard.tsx
│   ├── global-reach/
│   │   └── FlagRow.tsx
│   ├── works/
│   │   ├── FilterTabs.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectGrid.tsx
│   ├── journey/
│   │   └── JourneyTimeline.tsx
│   └── ui/  (shadcn primitives: button, badge, dialog, etc.)
```

---

## User Experience Flow

```
Visitor lands on Hero
  → Kinetic headline assembles identity (name, role, descriptors)
  → Scrolls to GitHub Activity (live proof-of-work + playful eyes)
  → Scrolls to Tech Marquee (skimmable credibility)
  → Scrolls to Experience Timeline (real employers, real narrative)
  → Scrolls to "What I do" Capabilities Showcase (positioning by outcome, not tech list)
  → Scrolls to Global Reach (Working Across Borders — trust via scale)
  → Reaches Footer / CTA (Get in Touch, View Resume)
  → OR navigates to Works (filterable project gallery) → Case Study detail
  → OR navigates to Journey (personal narrative)
  → OR navigates to Blog (long-form writing)
```

This is a **personality → credibility → capability → proof → conversion** funnel. Every section either builds trust or builds momentum toward a contact action; nothing is decorative filler.

---

## Design System

The final visual identity (exact colors, type families, spacing scale) will be designed independently rather than copied from the reference site, since the reference's exact design tokens were not pixel-verified. The system should still follow the same *category* of visual language identified in the reference analysis:

- **Visual language:** Editorial, developer-focused, premium-agency feel — not a generic AI-templated look.
- **Mode:** Dark-first, high-contrast.
- **Typography tier 1 (display):** Oversized, dominant headline typography for hero and section titles, including support for a low-opacity oversized "ghost text" background treatment (as used in the Capabilities Showcase).
- **Typography tier 2 (body/UI):** Clean, small, high-legibility sans-serif for body copy, tags, and UI chrome.
- **Spacing:** Generous vertical section rhythm; tight, consistent internal card padding; fully rounded pill components for tags/tech badges.
- **Motion-first design:** Layouts should be authored with animation in mind from the start (e.g., text split into spans, images with defined reveal states) rather than retrofitting animation onto static markup.

---

## Animation System

### Libraries and Their Roles
- **GSAP + ScrollTrigger** — all scroll-driven, pinned, and scrubbed sequences: kinetic hero headline, pinned Capabilities Showcase, marquee dividers, experience card reveals.
- **Lenis** — smooth/virtual scrolling, synced with ScrollTrigger so pinned sections don't jitter against native scroll behavior.
- **Framer Motion** — React-state-driven micro-interactions: works-page filter tab transitions and layout animation, contact form field states, copy-button feedback.

### Key Animated Sequences
1. **Kinetic Hero Headline:** word/phrase-level staggered reveal with inline images popping in mid-sentence, built via GSAP timelines and (if needed) SplitText-style word wrapping.
2. **GitHub Reactive Eyes:** cursor-tracked pupil movement via mouse position transforms.
3. **Infinite Marquees:** tech logos strip and process-word ticker, duplicated tracks looping via translateX, opposite scroll directions for rhythm.
4. **Experience Timeline Reveal:** per-card scroll-triggered fade/slide entrance.
5. **Capabilities Pinned Showcase:** GSAP ScrollTrigger `pin: true, scrub: true` sequence where content and the oversized background title crossfade/shift as the user scrolls through a fixed viewport.
6. **Works Filter Transitions:** Framer Motion `layout` animations reordering/filtering the project grid on tab change.
7. **Image Reveals:** clip-path-based reveal-on-scroll for project and case-study imagery.

### Animation Engineering Rules
- All GSAP timelines/ScrollTriggers must be scoped and cleaned up (via `useGSAP()` from `@gsap/react`, or manual `gsap.context()` + `ctx.revert()`), since Next.js App Router does not fully unmount/remount components the way Pages Router did — orphaned ScrollTriggers are the primary cause of animation glitches on back-navigation.
- `ScrollTrigger.refresh()` must be called on route change and after image load completion, so pinned section height calculations aren't based on unloaded image dimensions.
- `will-change` used sparingly, applied only during active animation and removed after, to avoid permanent GPU layer overhead.

---

## Frontend Architecture

### Final Tech Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | Server Components cut client JS for static sections (experience, capabilities); Server Actions remove the need for a separate REST layer for CMS writes; built-in metadata/sitemap APIs cover SEO needs natively. |
| Language | TypeScript | Schema-to-UI type safety across Mongoose models → server actions → components; catches drift when a new project field is added. |
| Styling | Tailwind CSS | Fast iteration on the editorial spacing/type system being designed; consistent with prior project stack conventions (Tailwind v4). |
| Motion (UI-level) | Framer Motion | Best for React-state-driven micro-interactions: filter tab transitions, layout animations on the works grid, copy-button feedback. |
| Motion (scroll-level) | GSAP + ScrollTrigger | Best for pinned/scrubbed sequences — the "What I do" stacked showcase, experience timeline reveals. Directly reusable from a previously-built sticky-stacking-card case-studies pattern. |
| Smooth scroll | Lenis | Needed to sync scroll position with ScrollTrigger for pinned sections to feel physically correct; without it, native scroll + GSAP pin can jitter, especially on trackpads. |
| Components | shadcn/ui | Used only for admin dashboard primitives (tables, dialogs, forms, inputs) — kept out of the public site so the public-facing design stays fully custom/editorial rather than shadcn-flavored. |
| Backend | Server Actions (writes) + Route Handlers (public/external-facing reads and non-form operations) | Server Actions for anything the admin dashboard calls directly (create/update/delete). Route Handlers for anything that must be a real HTTP endpoint: contact form submission (public, untrusted), dynamic OG image generation, sitemap.xml/robots.txt. |
| Database | MongoDB + Mongoose | Content is document-shaped (projects have variable-length tag arrays, nested case-study blocks) — a better fit than relational tables for this content type. |
| Auth | Auth.js (NextAuth v5) — Google + GitHub OAuth, admin-only | Single-owner portfolio, so there is no public user system — auth exists purely to gate `/admin`. OAuth avoids managing password storage directly. Post-auth access is restricted by checking the signed-in email against a single allow-listed admin email in an environment variable. |
| Storage | Cloudinary | Project images, case-study media, blog cover images — offloads image transforms/optimization from the app server, and plugs into `next/image` via remote patterns. |
| Content authoring | MDX | For blog posts and case-study long-form bodies — allows custom components (code blocks, callouts, embedded demos) inside otherwise database-driven content. |
| Validation | Zod + React Hook Form | Shared schema between client form validation and server action input validation — one source of truth per model. |
| Client state | Zustand | Minimal use: works-page filter state, admin dashboard UI state (e.g. sidebar collapse) — not used for server data, which stays server-driven. |

### Content Management Scope Decision

The admin dashboard scope was deliberately kept **lighter** rather than a full CMS covering every model:

- **Full CRUD via admin UI:** Projects, Blog Posts, Contact Messages (view/read/delete only for messages — no message "creation" via admin).
- **Database-driven but seed/direct-edit managed (no dedicated admin UI initially):** Experience, Skills, Technology, Testimonials, Site Settings.

This keeps these five models in the database — so the frontend still reads them dynamically and nothing is hardcoded into JSX — while avoiding the cost of building full dashboard UIs for content that changes infrequently. The schema design does not need to change if dashboard UIs are added for these models later.

---

## Backend Architecture

### API and Server Action Design

**Rule of thumb:** if a mutation is initiated from the admin UI, it is a Server Action. If it must be reachable as a real HTTP endpoint (external callers, non-form triggers, dynamic image generation, crawlers, or anything public-facing and untrusted), it is a Route Handler.

| Operation | Type | Input | Validation | Database operation | Response |
|---|---|---|---|---|---|
| `createProject(formData)` | Server Action | title, slug, category, description, images, techStack[], links | Zod `projectSchema.parse()` | `Project.create()` | `{ success: true, id }` or `{ success: false, errors }` |
| `updateProject(id, formData)` | Server Action | same as above + id | Zod, partial schema | `Project.findByIdAndUpdate()` | `{ success, project }` |
| `deleteProject(id)` | Server Action | id | id existence check | `Project.findByIdAndDelete()` | `{ success }` |
| `getProjects(filters?)` | Server Action / direct Server Component fetch | category, published | none (internal, trusted caller) | `Project.find(query).sort()` | `Project[]` |
| `createBlogPost(formData)` | Server Action | title, slug, excerpt, contentMdx, tags | Zod | `BlogPost.create()` | `{ success, id }` |
| `updateBlogPost(id, formData)` | Server Action | same as above + id | Zod, partial | `BlogPost.findByIdAndUpdate()` | `{ success, post }` |
| `deleteBlogPost(id)` | Server Action | id | id existence check | `BlogPost.findByIdAndDelete()` | `{ success }` |
| `getMessages()` / `markAsRead(id)` / `deleteMessage(id)` | Server Actions | id (for the latter two) | id existence check | `ContactMessage` read/update/delete | `{ success, data? }` |
| `submitContactForm(formData)` — public-facing | **Route Handler** (`/api/contact`), not a Server Action | name, email, message | Zod + honeypot/rate-limit check (server-side, since this endpoint is public and untrusted) | `ContactMessage.create()` | `{ success }` |
| OG image generation | Route Handler (`/api/og`) | project/post title via query param | none (internal) | none — pure rendering via `next/og` | `image/png` response |
| Sitemap | Route Handler / `app/sitemap.ts` (Next.js convention) | none | none | `Project.find()`, `BlogPost.find()` for dynamic URLs | XML sitemap |
| robots.txt | `app/robots.ts` (Next.js convention) | none | none | none | robots directives |

The public contact form is the deliberate exception to "admin mutations = Server Actions": because it is reachable by anyone on the internet rather than only an authenticated session, it receives the extra scrutiny (rate limiting, honeypot field, no implicit trust) that is more explicit to reason about as a dedicated API route than as a Server Action.

---

## Database Design

Database: **MongoDB**, accessed via **Mongoose** schemas.

### User
```
fields:
  _id: ObjectId
  name: string, required
  email: string, required, unique, indexed
  image: string (OAuth avatar URL)
  role: enum ["admin"], default "admin", required
  provider: enum ["google", "github"], required
  createdAt, updatedAt: timestamps
relationships: none (single-owner system — no user-generated content beyond the one admin)
indexes: unique index on email
```
```json
{
  "_id": "664f...",
  "name": "Rohit",
  "email": "rohit@example.com",
  "image": "https://avatars.githubusercontent.com/...",
  "role": "admin",
  "provider": "github",
  "createdAt": "2026-07-01T10:00:00Z"
}
```

### Project
```
fields:
  _id: ObjectId
  title: string, required
  slug: string, required, unique, indexed
  category: enum ["website", "saas", "mobile"], required, indexed
  shortDescription: string, required
  coverImage: string (Cloudinary URL), required
  gallery: string[] (Cloudinary URLs)
  techStack: string[] (references Technology.name, denormalized for read speed), required
  liveUrl: string
  repoUrl: string
  caseStudyRef: ObjectId, ref: "CaseStudy" (optional — not every project has a full case study)
  featured: boolean, default false, indexed
  order: number (manual sort control), default 0
  published: boolean, default true, indexed
  createdAt, updatedAt: timestamps
relationships: optionally links to one CaseStudy (1:1)
indexes: unique on slug; compound index on {category, published, order} for the filtered/sorted works page query
```
```json
{
  "title": "PickMyCareer",
  "slug": "pickmycareer",
  "category": "saas",
  "shortDescription": "AI-powered career guidance platform...",
  "coverImage": "https://res.cloudinary.com/.../pickmycareer.webp",
  "techStack": ["Next.js", "Tailwind CSS", "Razorpay"],
  "liveUrl": "https://pickmycareer.example.com",
  "featured": true,
  "published": true,
  "order": 1
}
```

### CaseStudy
```
fields:
  _id: ObjectId
  projectRef: ObjectId, ref: "Project", required, unique
  problem: string (rich text/MDX)
  approach: string (rich text/MDX)
  solution: string (rich text/MDX)
  results: string (rich text/MDX)
  images: { url: string, caption: string }[]
  metrics: { label: string, value: string }[]   // e.g. "Load time" → "0.8s"
  createdAt, updatedAt
relationships: belongs to one Project (1:1, enforced via unique index)
indexes: unique on projectRef
```

### Experience
```
fields:
  _id: ObjectId
  company: string, required
  companyUrl: string
  companyLogo: string
  roles: [{ title: string, startDate: Date, endDate: Date|null, description: string }]  // supports multiple roles per company
  tags: string[]
  order: number
  createdAt, updatedAt
indexes: index on order for sorted timeline queries
```

### Skill
```
fields:
  _id: ObjectId
  name: string, required, unique
  category: enum ["language", "framework", "tool", "soft-skill"]
  proficiency: number (1-5), optional
indexes: unique on name
```

### Technology
```
fields:
  _id: ObjectId
  name: string, required, unique
  icon: string (svg path or Cloudinary URL)
  category: enum ["frontend", "backend", "database", "devops", "mobile"]
indexes: unique on name
```
*(Skill and Technology are kept as separate models: Technology drives the visual tech marquee with icons; Skill is a broader concept for things like "System Design" that don't have a logo.)*

### BlogPost
```
fields:
  _id: ObjectId
  title: string, required
  slug: string, required, unique, indexed
  excerpt: string, required
  contentMdx: string, required
  coverImage: string
  tags: string[]
  published: boolean, default false, indexed
  publishedAt: Date
  readTimeMinutes: number
  createdAt, updatedAt
indexes: unique on slug; index on {published, publishedAt} for the blog listing query
```

### ContactMessage
```
fields:
  _id: ObjectId
  name: string, required
  email: string, required
  message: string, required
  read: boolean, default false, indexed
  createdAt: timestamp
indexes: index on {read, createdAt} for the admin inbox view
```

### Testimonial
```
fields:
  _id: ObjectId
  authorName: string, required
  authorRole: string
  authorCompany: string
  authorImage: string
  quote: string, required
  projectRef: ObjectId, ref: "Project", optional
  order: number
```

### SiteSettings
```
fields:
  _id: ObjectId  (singleton document — only one ever exists)
  resumeUrl: string
  socialLinks: { platform: string, url: string }[]
  contactEmail: string
  seoDefaults: { title: string, description: string, ogImage: string }
  availableForWork: boolean
indexes: none needed (single document, fetched by a fixed known _id or findOne with no filter)
```

---

## Authentication System

- **Provider:** Auth.js (NextAuth v5).
- **Sign-in methods:** Google OAuth and GitHub OAuth only — no email/password flow, since there is no public user base to onboard.
- **Access control:** After a successful OAuth callback, the signed-in email is checked against a single allow-listed admin email stored in an environment variable. A mismatch redirects to an "unauthorized" state rather than establishing an authenticated admin session.
- **Scope:** Authentication exists solely to gate the `/admin` route group. There are no other authenticated user flows anywhere in the application.
- **Session handling:** Standard Auth.js session/JWT handling; the `(admin)` route group's layout performs the session/role check server-side before rendering any dashboard page.

---

## Admin Dashboard

Scope: **lighter CMS** — full management UI for Projects and Blog, view/triage only for Messages. Experience, Skills, Technology, Testimonials, and Site Settings remain database-driven but are managed via seed data or direct database edits rather than a dedicated UI (a decision made explicitly to control initial build scope; the schema supports adding dashboard UIs for these later without migration).

### `/admin` (Dashboard Overview)
- **Purpose:** At-a-glance status — project count, unread message count, latest blog post state.
- **Components:** `DashboardStats` (cards: total projects, published/draft blog posts, unread messages), quick links to create-project/create-post.
- **Data flow:** Server Component fetches counts directly via Mongoose on render (no client-side fetch needed — private, low-traffic page).
- **Server actions:** none (read-only page).

### `/admin/login`
- **Purpose:** OAuth sign-in gate.
- **Components:** Google/GitHub sign-in buttons (Auth.js `signIn()`).
- **Data flow:** On successful OAuth callback, Auth.js checks the returned email against the allow-listed admin email — mismatch redirects with an "unauthorized" message rather than creating a session.

### `/admin/projects`
- **Purpose:** List/manage all projects.
- **Components:** `DataTable` (title, category, published toggle, featured toggle, order, edit/delete row actions), filter by category.
- **Data flow:** Server Component fetch on load; row toggles (`published`, `featured`) call server actions directly from client row components (optimistic update, then revalidate).
- **Server actions:** `getProjects()`, `deleteProject(id)`, `toggleProjectField(id, field, value)`.

### `/admin/projects/create`
- **Purpose:** New project form.
- **Components:** `ProjectForm` (React Hook Form + Zod), Cloudinary upload widget for cover/gallery images, tag-input for techStack.
- **Data flow:** Client form → `createProject(formData)` server action → Zod validation → Mongoose insert → redirect to `/admin/projects` on success, inline error display on failure.
- **Server actions:** `createProject()`.

### `/admin/projects/[id]/edit`
- **Purpose:** Edit an existing project (and optionally its linked case study fields inline).
- **Components:** Same `ProjectForm`, pre-filled via server-fetched initial data.
- **Server actions:** `getProjectById(id)`, `updateProject(id, formData)`.

### `/admin/blog`
- **Purpose:** List/manage blog posts.
- **Components:** `DataTable` (title, published state, publishedAt, edit/delete).
- **Server actions:** `getBlogPosts()`, `deleteBlogPost(id)`, `togglePublish(id)`.

### `/admin/blog/create` and `/admin/blog/[id]/edit`
- **Purpose:** MDX-based post editor.
- **Components:** `BlogForm` — title/slug/excerpt fields + a plain textarea or lightweight MDX editor for `contentMdx`, cover image upload.
- **Server actions:** `createBlogPost()`, `updateBlogPost(id, formData)`.

### `/admin/messages`
- **Purpose:** View/triage contact form submissions.
- **Components:** `MessageList` (sender, message preview, read/unread state, delete action).
- **Server actions:** `getMessages()`, `markAsRead(id)`, `deleteMessage(id)`.

---

## Folder Structure

```
portfolio/
├── app/
│   ├── (site)/                        # public-facing route group
│   │   ├── layout.tsx                 # Navbar + Footer + Lenis provider
│   │   ├── page.tsx                   # home
│   │   ├── journey/page.tsx
│   │   ├── works/page.tsx
│   │   ├── works/[slug]/page.tsx      # case study detail
│   │   ├── experience/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   └── contact/page.tsx           # optional dedicated contact page
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx             # auth-gated shell, sidebar
│   │   │   ├── page.tsx               # dashboard overview
│   │   │   ├── login/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── projects/create/page.tsx
│   │   │   ├── projects/[id]/edit/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/create/page.tsx
│   │   │   ├── blog/[id]/edit/page.tsx
│   │   │   └── messages/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── og/route.tsx               # dynamic OG image generation
│   │   ├── contact/route.ts           # contact form submit (spam-checked)
│   │   ├── sitemap.xml/route.ts       # or app/sitemap.ts (Next convention)
│   │   └── robots.txt/route.ts        # or app/robots.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css
├── components/
│   ├── ui/                            # shadcn primitives (admin-only usage)
│   └── shared/                        # cross-cutting: Loader, EmptyState, TagPill
├── features/                          # feature-first organization
│   ├── hero/
│   │   ├── Hero.tsx
│   │   └── KineticHeadline.tsx
│   ├── github-activity/
│   │   ├── GithubActivityGraph.tsx
│   │   └── ReactiveEyes.tsx
│   ├── marquee/
│   │   ├── TechMarquee.tsx
│   │   └── TextMarquee.tsx
│   ├── experience/
│   │   ├── ExperienceTimeline.tsx
│   │   └── ExperienceCard.tsx
│   ├── capabilities/
│   │   ├── CapabilitiesShowcase.tsx
│   │   └── CapabilityCard.tsx
│   ├── works/
│   │   ├── FilterTabs.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectGrid.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── MDXRenderer.tsx
│   ├── contact/
│   │   └── ContactForm.tsx
│   ├── navbar/
│   │   ├── Navbar.tsx
│   │   └── MenuOverlay.tsx
│   ├── footer/
│   │   ├── Footer.tsx
│   │   └── EmailCopyButton.tsx
│   └── admin/
│       ├── DashboardStats.tsx
│       ├── ProjectForm.tsx
│       ├── BlogForm.tsx
│       ├── DataTable.tsx
│       └── MessageList.tsx
├── hooks/
│   ├── useLenis.ts
│   ├── useGsapContext.ts              # ensures ctx.revert() cleanup
│   ├── useMousePosition.ts
│   └── useCopyToClipboard.ts
├── lib/
│   ├── db/
│   │   └── connect.ts                 # Mongoose connection singleton
│   ├── auth/
│   │   └── auth.config.ts             # NextAuth config
│   ├── cloudinary/
│   │   └── upload.ts
│   ├── github/
│   │   └── fetchContributions.ts
│   ├── gsap/
│   │   └── registerPlugins.ts
│   ├── validations/                   # Zod schemas (shared client/server)
│   │   ├── project.schema.ts
│   │   ├── blog.schema.ts
│   │   └── contact.schema.ts
│   └── utils.ts
├── actions/                            # Server Actions, grouped by domain
│   ├── project.actions.ts
│   ├── blog.actions.ts
│   ├── message.actions.ts
│   └── auth.actions.ts
├── models/                              # Mongoose schemas
│   ├── User.model.ts
│   ├── Project.model.ts
│   ├── CaseStudy.model.ts
│   ├── Experience.model.ts
│   ├── Skill.model.ts
│   ├── Technology.model.ts
│   ├── BlogPost.model.ts
│   ├── ContactMessage.model.ts
│   ├── Testimonial.model.ts
│   └── SiteSettings.model.ts
├── types/
│   ├── project.types.ts
│   ├── blog.types.ts
│   └── index.ts
├── constants/
│   ├── nav-links.ts
│   ├── social-links.ts
│   └── seo-defaults.ts
├── config/
│   ├── site.config.ts                 # name, url, description, defaults
│   └── env.ts                         # typed env var access
├── styles/
│   └── (Tailwind config lives in globals.css under v4's CSS-first config)
└── public/
    ├── images/
    └── fonts/
```

**Folder rationale:**
- **`(site)` / `(admin)` route groups** — separates public and admin layouts/middleware cleanly without affecting URL structure.
- **`features/`** — feature-first rather than type-first organization (no giant flat `components/` folder); each section of the site is a self-contained unit, matching a one-prompt/phase-per-feature build discipline.
- **`components/`** kept minimal — only truly shared, presentation-agnostic pieces (shadcn primitives, generic Loader/EmptyState) live here, avoiding a dumping-ground folder.
- **`actions/` separate from `lib/`** — Server Actions are the "write API" of the app; a dedicated top-level folder makes it obvious where mutations live, separate from pure utilities.
- **`models/` at the root, not nested under `lib/db/`** — Mongoose models are imported from actions, route handlers, and scripts alike; a flat top-level folder avoids deep relative imports.
- **`config/` vs `constants/`** — `config` holds environment/site-identity values that could plausibly change per deployment; `constants` holds literal UI/content data (nav links, socials) that is content, not configuration.

---

## Component Architecture

See the reference-derived component tree in the **Reference Website Analysis** section above for the original section-by-section breakdown, and the **Folder Structure** section for the final `features/` and `components/` organization used in this project. Every major homepage section (Hero, GitHub Activity, Marquees, Experience Timeline, Capabilities Showcase, Global Reach, Works, Blog, Navbar, Footer) is implemented as a self-contained feature module with its own components, kept isolated from unrelated features to support incremental, phase-by-phase implementation.

Admin-specific components (`DashboardStats`, `ProjectForm`, `BlogForm`, `DataTable`, `MessageList`) are isolated under `features/admin/` and are built using shadcn/ui primitives, kept deliberately separate in style and dependency footprint from the public-facing, fully custom-designed components.

---

## API and Server Actions

See the full **API and Server Action Design** table under **Backend Architecture** above. Summary of the governing rule: Server Actions handle all authenticated admin-initiated mutations and internal reads; Route Handlers handle anything that must be a stable, independently-callable HTTP endpoint — the public contact form submission, dynamic OG image generation, and the sitemap/robots endpoints.

---

## Content Management Strategy

**Hardcoded (in code, not database):**
- Navigation links, social links, footer structure — these change infrequently and don't benefit from a database round-trip on every page load.
- Layout/animation logic (GSAP timelines, ScrollTrigger configs, Lenis setup) — this is behavior, not content.
- Static, truly one-off personal page copy (hero microcopy, narrative "About" voice) — closer to hand-authored prose than structured, independently-managed content.

**Database-driven:**
- Projects, Case Studies, Blog Posts — these grow over time and are the entire reason the admin dashboard exists.
- Experience, Skills, Technology, Testimonials — structured, list-like data, benefiting from being data-driven even while (per the chosen lighter admin scope) they are seeded/edited directly rather than through a dashboard UI — this keeps the door open to add a UI later without any schema migration.
- Contact Messages — inherently dynamic, user-generated.
- Site Settings — small, singleton, but still data-driven (resume URL, availability toggle) so updates don't require a redeploy.

**Reasoning:** the dividing line is not "is it text" — it is whether the content changes independently of a code deploy, and whether it has multiple instances that grow over time. Navigation links have neither property; projects and blog posts have both.

---

## SEO Strategy

- **Metadata system:** Next.js `generateMetadata()` per route — static metadata for home/works/experience, dynamic metadata for `/works/[slug]` and `/blog/[slug]` pulled from the corresponding database document (title, description, canonical URL).
- **Dynamic OG images:** `/api/og` route using `next/og` (`ImageResponse`) — generates a branded OG card per project/post at request time using title and category, cached via route segment configuration so it is not regenerated on every crawler hit.
- **Sitemap:** `app/sitemap.ts` — static routes hardcoded; dynamic routes (`/works/[slug]`, `/blog/[slug]`) generated by querying published Projects and BlogPosts at build/request time.
- **robots.txt:** `app/robots.ts` — allow all, point to the sitemap, disallow `/admin`.
- **Structured data (JSON-LD):**
  - **Person schema** on the homepage (name, jobTitle, sameAs: social links) — enables a knowledge-panel-style search result for the site owner's name.
  - **CreativeWork/Project schema** on case study pages.
  - **Article schema** on blog posts (headline, datePublished, author).

---

## Performance Strategy

- **Client vs Server Components:** Default to Server Components everywhere. Client Components are limited to: anything using GSAP/Framer Motion hooks, the Lenis provider, the works-page filter tabs (needs interactive state), forms, and the reactive-eyes component (needs mouse position). Data-fetching sections (experience list, project grid, blog list) remain Server Components that fetch directly and pass plain data down to small client "leaf" components that only handle the animation layer.
- **Image optimization:** All images routed through `next/image` with Cloudinary as the remote loader — automatic format negotiation (AVIF/WebP), responsive `sizes`, explicit width/height to prevent layout shift, which matters significantly given how image-heavy the works/case-study pages are.
- **Lazy loading:** Below-the-fold sections (capabilities showcase, experience timeline, global-reach) use `next/dynamic` with `ssr: false` only where the component is purely decorative/client-only (e.g., reactive eyes). Genuinely content-bearing sections remain server-rendered for SEO and instead lazy-*animate* in via ScrollTrigger rather than lazy-*loading* the component itself.
- **Animation optimization:**
  - GSAP timelines built inside `useGSAP()` (from `@gsap/react`) or a manual `gsap.context()`, ensuring all tweens/ScrollTriggers are scoped and auto-cleaned on unmount — important given App Router's component remounting behavior.
  - `will-change` used sparingly, only on actively-animating elements, and removed after animation completes, to avoid permanent GPU-layer overhead.
  - `ScrollTrigger.refresh()` called on route change and on image load completion, so pinned sections don't miscalculate heights before images finish loading.
- **GSAP cleanup:** Every component with a GSAP timeline must return a cleanup function via `useGSAP`'s built-in revert, or manually via `ctx.revert()` in a `useEffect` return — this is critical because App Router does not fully unmount/remount the way Pages Router did, and orphaned ScrollTriggers are the primary cause of "animations get weird after navigating back" bugs.
- **Bundle optimization:** GSAP plugins (`ScrollTrigger`, and `SplitText` if used) registered once in a shared `lib/gsap/registerPlugins.ts`, imported only where needed. Lenis and GSAP are kept out of the admin route group's bundle entirely, since the dashboard has zero scroll-animation needs — route groups naturally code-split this as long as imports remain properly scoped.

---

## Development Roadmap

| Phase | Goal | Files created | Dependencies | Order |
|---|---|---|---|---|
| **1. Foundation** | Project scaffold, config | `package.json`, `tsconfig.json`, `next.config.ts`, `.env.example`, `globals.css` (Tailwind v4 setup) | next, typescript, tailwindcss | 1st |
| **2. Database layer** | DB connection + all Mongoose models | `lib/db/connect.ts`, all files in `models/` | mongoose | 2nd |
| **3. Config & constants** | Site-wide static data | `config/site.config.ts`, `constants/nav-links.ts`, `constants/social-links.ts` | — | 3rd |
| **4. Layout shell** | Global layout, fonts, providers | `app/(site)/layout.tsx`, Lenis provider, GSAP plugin registration | lenis, gsap, framer-motion | 4th |
| **5. Navbar & Footer** | Global nav | `features/navbar/*`, `features/footer/*` | — | 5th |
| **6. Hero section** | Kinetic headline | `features/hero/*` | gsap SplitText or manual split | 6th |
| **7. GitHub activity** | Contribution graph + eyes | `lib/github/fetchContributions.ts`, `features/github-activity/*` | GitHub GraphQL token | 7th |
| **8. Tech marquee** | Infinite scroll strip | `features/marquee/TechMarquee.tsx` | — | 8th |
| **9. Experience timeline** | DB-driven timeline | Experience read action/direct fetch, `features/experience/*` | — | 9th (needs seed data from Phase 2) |
| **10. Capabilities showcase** | Pinned ScrollTrigger section | `features/capabilities/*` | gsap ScrollTrigger | 10th |
| **11. Global reach** | Flag row | `features/global-reach/FlagRow.tsx` | — | 11th |
| **12. Works listing** | Filterable project grid | `models/Project` (done), `actions/project.actions.ts` (read parts), `features/works/*`, `app/(site)/works/page.tsx` | — | 12th |
| **13. Case study detail** | Dynamic project page | `models/CaseStudy`, `app/(site)/works/[slug]/page.tsx` | — | 13th |
| **14. Blog** | List + MDX detail page | `app/(site)/blog/*`, `features/blog/*` | @next/mdx or next-mdx-remote | 14th |
| **15. Contact** | Form + route handler | `features/contact/ContactForm.tsx`, `app/api/contact/route.ts` | resend or nodemailer (for notification email) | 15th |
| **16. Auth setup** | Admin gate | `lib/auth/auth.config.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/(admin)/admin/login/page.tsx` | next-auth (Auth.js v5) | 16th |
| **17. Admin shell** | Dashboard layout + overview | `app/(admin)/admin/layout.tsx`, `app/(admin)/admin/page.tsx`, `features/admin/DashboardStats.tsx` | shadcn/ui | 17th |
| **18. Admin: Projects CRUD** | Full project management | `actions/project.actions.ts` (write parts), admin project pages/forms | — | 18th |
| **19. Admin: Blog CRUD** | Full post management | `actions/blog.actions.ts`, admin blog pages/forms | — | 19th |
| **20. Admin: Messages** | Inbox view | `actions/message.actions.ts`, `app/(admin)/admin/messages/page.tsx` | — | 20th |
| **21. SEO layer** | Metadata, sitemap, OG, JSON-LD | `app/sitemap.ts`, `app/robots.ts`, `app/api/og/route.tsx`, per-page `generateMetadata` | — | 21st |
| **22. Performance pass** | Cleanup, lazy-load audit, Lighthouse pass | no new files — audit existing | — | last |

---

## AI Agent Instructions

These rules govern how an AI coding agent (Antigravity) must operate when implementing this project from this specification:

1. **Analyze before coding.** Before writing any file, review the relevant section(s) of this document (architecture, schema, folder structure, roadmap phase) to confirm the plan for that file is consistent with the rest of the system.
2. **Create files one by one.** Never generate multiple files in a single, unexplained batch. Each file is a distinct step.
3. **Explain every file before generating it.** For each file: state its purpose, why it exists, and where it connects to the rest of the application (imports, consumers, related routes/models) — then show the complete code.
4. **Never generate the entire project at once.** Implementation proceeds strictly phase-by-phase per the Development Roadmap above. Do not skip ahead to a later phase's files.
5. **Follow the architecture defined in this document.** Folder structure, model schemas, Server Action vs. Route Handler boundaries, and the admin scope decisions (Projects/Blog/Messages only) are binding unless the project owner explicitly requests a change.
6. **Ask for confirmation before moving between major phases.** After completing all files in a roadmap phase, stop and wait for explicit approval before starting the next phase.
7. **Wait before creating the next file.** After presenting one file (purpose + connection + code), pause for confirmation before proceeding to the next file in the current phase.
