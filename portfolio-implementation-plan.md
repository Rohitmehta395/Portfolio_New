# Premium Developer Portfolio — Implementation Plan

This document explains **how** to build the system defined in `portfolio-project-spec.md`. It does not redefine architecture, schemas, folder structure, or design analysis — refer back to the specification for the "what" and "why" of any given system. This document is the execution sequence: what gets built, in what order, with what validation, and with what dependencies between phases.

---

## 1. Implementation Strategy

### Development Approach

This project is built **incrementally, one file at a time, in strict phase order**. Each phase produces a working, verifiable increment — nothing is left half-built across phases. A phase is not considered complete until its Validation Checklist passes.

### Build Order Philosophy

The build order follows four governing principles, applied in this priority order whenever there's a choice about what to build next:

1. **Foundation before features.** Nothing application-specific gets built until the project scaffold, TypeScript config, Tailwind setup, and environment configuration exist and run cleanly.
2. **Database before dynamic content.** Every Mongoose model must exist and be connectable before any component that will eventually read from that model is built. Static/hardcoded placeholder data is acceptable only as a temporary bridge inside a single phase — never as a long-term substitute for a real DB read.
3. **Design system before complex sections.** Global layout, typography, color tokens, and the animation utility layer (GSAP registration, Lenis provider) must be in place before any section that depends on them (Hero, Capabilities Showcase) is attempted — otherwise those components get rebuilt twice.
4. **Animation system before animated components.** The shared animation infrastructure (GSAP plugin registration, ScrollTrigger utilities, cleanup hooks) is built once, early, and reused — no section should register its own ad hoc GSAP setup.
5. **CMS after public frontend structure.** The admin dashboard and CRUD flows are built only after the public-facing pages that consume that data already exist and render correctly against seed/mock data. This ensures the CMS is built against a known-good data contract instead of guessing at one.

### How Dependencies Between Phases Work

Each phase in Section 2 has an explicit **Dependencies** block. As a general rule:
- Phases 1–3 are hard prerequisites for everything else (scaffold, DB, config).
- Phases 4–5 are hard prerequisites for every subsequent public-facing section (layout shell, nav/footer).
- Phases 6–11 (homepage sections) can technically be built in parallel with each other once Phase 4–5 are done, but should still be built in the listed order because later sections reuse animation utilities and layout patterns established by earlier ones (e.g., Phase 9's ScrollTrigger reveal pattern is reused in Phase 10).
- Phases 12–15 (Works, Case Study, Blog, Contact) depend on their respective models existing (Phase 2) and on the global layout (Phase 4–5), but not on each other.
- Phase 16 (Auth) must exist before Phase 17 (Admin Dashboard shell), which must exist before Phases 18–20 (CMS features).
- Phases 21–22 (SEO, Performance) are explicitly last — they audit and enhance what already exists rather than building new user-facing surfaces.

No phase should be started if a phase it depends on has not passed its Validation Checklist.

---

## 2. Complete Development Phases

## Phase 1 — Project Foundation

### Goal
Establish a running Next.js 15 App Router project with TypeScript and Tailwind CSS configured, and a clean environment variable contract defined.

### Why This Phase Exists
Every other phase assumes a working build. This phase exists to guarantee `npm run dev` succeeds before any application logic is written, eliminating tooling issues as a variable later.

### Dependencies
None — this is the first phase.

### Tasks
- Initialize the Next.js 15 App Router project with TypeScript
- Configure `tsconfig.json` (strict mode enabled)
- Install and configure Tailwind CSS (v4, CSS-first config)
- Set up `globals.css` with base resets and CSS variable placeholders for the design system
- Create `.env.example` documenting all environment variables the project will eventually need (see Section 5)
- Configure `next.config.ts` (image remote patterns for Cloudinary, any experimental flags needed for Server Actions)
- Verify the dev server runs and hot-reloads correctly

### Files Created
- `package.json` — dependency manifest and scripts. Connects to: every other phase's dependency additions.
- `tsconfig.json` — TypeScript compiler configuration, path aliases (e.g. `@/*`). Connects to: all imports across the app.
- `next.config.ts` — Next.js configuration, including `images.remotePatterns` for Cloudinary. Connects to: Phase 12/13 image rendering.
- `.env.example` — documents every required environment variable without real values. Connects to: Section 5 (Environment Setup Plan).
- `app/globals.css` — Tailwind entry point and base CSS variables. Connects to: every visual component built in later phases.
- `app/layout.tsx` (minimal placeholder root layout) — will be expanded in Phase 4.

### Implementation Notes
- Use Tailwind v4's CSS-first configuration approach (`@theme` in `globals.css`) rather than a legacy `tailwind.config.ts`, to match the intended design-system approach.
- Do not install animation, database, or auth dependencies yet — this phase is scaffold-only.
- `.env.example` should be created now even though most values aren't needed until later phases, so the environment contract is visible from day one.

### Validation Checklist
- [ ] `npm run dev` starts without errors
- [ ] A blank page renders at `localhost:3000`
- [ ] TypeScript strict mode produces no config errors
- [ ] Tailwind utility classes apply correctly on a test element

### Phase Completion Criteria
Project builds and runs locally with zero errors, and the environment variable contract is documented (even if unpopulated).

---

## Phase 2 — Database Layer

### Goal
Establish a working MongoDB connection and create all Mongoose models defined in the specification.

### Why This Phase Exists
Per the "database before dynamic content" principle, every model must exist before any component attempts to read from it — even if that component won't be built until much later. Building all models together also surfaces relationship/reference issues (e.g. `Project.caseStudyRef`) early.

### Dependencies
Phase 1 complete (project runs, `.env.example` exists).

### Tasks
- Install `mongoose`
- Create the MongoDB connection singleton (handles Next.js hot-reload connection reuse)
- Create all ten Mongoose models exactly as defined in `portfolio-project-spec.md` → Database Design
- Write a small internal seed script (not user-facing) to populate placeholder Experience, Technology, Skill, and SiteSettings documents, since these are seed-managed per the spec's CMS scope decision
- Verify each model can be created, read, and connected to without runtime errors

### Files Created
- `lib/db/connect.ts` — Mongoose connection singleton with hot-reload-safe caching. Connects to: every model file and every Server Action that touches the database.
- `models/User.model.ts`
- `models/Project.model.ts`
- `models/CaseStudy.model.ts`
- `models/Experience.model.ts`
- `models/Skill.model.ts`
- `models/Technology.model.ts`
- `models/BlogPost.model.ts`
- `models/ContactMessage.model.ts`
- `models/Testimonial.model.ts`
- `models/SiteSettings.model.ts`
- `scripts/seed.ts` (or similar) — one-off seed script for Experience/Technology/Skill/SiteSettings placeholder data. Connects to: Phase 9 (Experience Timeline) and Phase 8 (Technology Marquee), which read this seeded data.

### Implementation Notes
- The connection singleton must guard against creating multiple connections during Next.js dev-mode hot reloads (standard cached-global pattern).
- Schema field types, required flags, and indexes must match the specification exactly — do not simplify or omit indexes, since later query patterns (e.g. the Works page's compound filter) depend on them.
- The seed script is a developer utility, not a Server Action, and is not exposed to any route.

### Validation Checklist
- [ ] Connection to MongoDB succeeds locally (Atlas or local instance)
- [ ] Each model can insert and retrieve a test document without validation errors
- [ ] Unique indexes (slug fields, email) correctly reject duplicates
- [ ] Seed script populates Experience, Technology, Skill, and SiteSettings without errors

### Phase Completion Criteria
All ten models exist, are connectable, and seed data is present for the models that will be read before the CMS exists (Experience, Technology, Skill, SiteSettings).

---

## Phase 3 — Configuration and Constants

### Goal
Define all static, hardcoded site data and typed configuration access.

### Why This Phase Exists
Per the spec's content-management strategy, navigation links, social links, and site-identity config are hardcoded rather than database-driven. Establishing these now means every later phase (Navbar, Footer, SEO) can import from a single source of truth instead of duplicating literals.

### Dependencies
Phase 1 complete.

### Tasks
- Define `config/site.config.ts` (site name, URL, description, default SEO values)
- Define `config/env.ts` (typed accessor/validator for environment variables, failing fast if a required var is missing)
- Define `constants/nav-links.ts` (Home, My Journey, My Works, My Experience, Blog)
- Define `constants/social-links.ts` (LinkedIn, GitHub, etc.)
- Define `constants/seo-defaults.ts` (fallback title/description/OG image used when a page doesn't override them)

### Files Created
- `config/site.config.ts` — Connects to: Navbar, Footer, SEO metadata generation (Phase 21).
- `config/env.ts` — Connects to: `lib/db/connect.ts`, auth config, Cloudinary config — anywhere an env var is read.
- `constants/nav-links.ts` — Connects to: Phase 5 (Navbar/Footer).
- `constants/social-links.ts` — Connects to: Phase 5 (Footer), Phase 21 (Person JSON-LD `sameAs`).
- `constants/seo-defaults.ts` — Connects to: Phase 21 (SEO Implementation).

### Implementation Notes
- `config/env.ts` should throw a clear error at startup if a required variable is missing, rather than failing silently deep inside a Server Action later.
- These files contain zero JSX — pure data and typed accessors.

### Validation Checklist
- [ ] Importing `site.config.ts` anywhere in the app resolves without circular dependency issues
- [ ] `env.ts` throws a descriptive error when a required variable is intentionally removed (manual test)
- [ ] Nav/social link arrays match the sitemap defined in the specification

### Phase Completion Criteria
All static configuration and constants exist and are importable; no application code duplicates these literals directly.

---

## Phase 4 — Global Layout and Providers

### Goal
Build the root layout shell for the public site, including font loading, the Lenis smooth-scroll provider, and GSAP plugin registration.

### Why This Phase Exists
Per "animation system before animated components," the shared scroll/animation infrastructure must exist before any section attempts to use ScrollTrigger or Lenis — otherwise each section would need to bootstrap its own instance.

### Dependencies
Phase 1 (scaffold), Phase 3 (config for metadata defaults).

### Tasks
- Install `gsap`, `lenis`, `framer-motion`, `@gsap/react`
- Create `lib/gsap/registerPlugins.ts` — registers ScrollTrigger (and any other GSAP plugins) exactly once
- Create a `LenisProvider` client component that initializes Lenis and syncs its scroll updates with `ScrollTrigger.update()`
- Build `app/(site)/layout.tsx` — wraps all public pages with fonts, `LenisProvider`, and slots for Navbar/Footer (built in Phase 5)
- Confirm smooth scrolling works on a placeholder tall page

### Files Created
- `lib/gsap/registerPlugins.ts` — Connects to: every animated feature module from Phase 6 onward.
- `hooks/useLenis.ts` — thin hook wrapping Lenis instance access. Connects to: `LenisProvider`, and any component needing manual scroll control (e.g. nav link smooth-scroll-to-section).
- `hooks/useGsapContext.ts` — wraps `useGSAP()`/`gsap.context()` cleanup pattern for reuse across feature components. Connects to: every phase from 6–13 that uses GSAP.
- `app/(site)/layout.tsx` — root public layout. Connects to: every public route.
- `components/providers/LenisProvider.tsx` — Connects to: `app/(site)/layout.tsx`.

### Implementation Notes
- `useGsapContext.ts` is the single reusable cleanup pattern referenced throughout the Performance Strategy in the spec — every later phase's GSAP usage should route through this hook rather than reimplementing `ctx.revert()` manually.
- Lenis must be initialized client-side only (`'use client'`), and its `raf` loop must be synced to GSAP's ticker so ScrollTrigger positions stay accurate.
- Fonts are loaded here via `next/font` if using custom typefaces decided during design-system finalization.

### Validation Checklist
- [ ] Scrolling on a tall placeholder page feels smooth/eased, not native
- [ ] `ScrollTrigger` and Lenis scroll position stay in sync (no visual lag/jump)
- [ ] `useGsapContext` cleans up a test timeline correctly on component unmount (verify no console warnings about duplicate ScrollTriggers after navigating away and back)

### Phase Completion Criteria
The animation and smooth-scroll infrastructure is in place, reusable, and verified not to leak on unmount, before any real section is built on top of it.

---

## Phase 5 — Navbar and Footer

### Goal
Build the global navigation overlay and footer, using the constants defined in Phase 3.

### Why This Phase Exists
These are present on every public page; building them immediately after the layout shell means every subsequent homepage-section phase can be viewed in a realistic page context (with working nav) rather than in isolation.

### Dependencies
Phase 3 (nav/social constants), Phase 4 (layout shell, animation utilities).

### Tasks
- Build `Navbar.tsx` with logo, menu trigger, and social/CTA elements
- Build `MenuOverlay.tsx` — full-screen overlay with staggered link entrance animation (Framer Motion or GSAP timeline)
- Build `Footer.tsx` — sitemap links, social links, resume link
- Build `EmailCopyButton.tsx` — copy-to-clipboard with temporary "Copied" state, using an internally-built obfuscation utility (not a third-party embed) for the displayed email
- Wire both into `app/(site)/layout.tsx`

### Files Created
- `features/navbar/Navbar.tsx`
- `features/navbar/MenuOverlay.tsx`
- `features/navbar/NavLink.tsx`
- `features/footer/Footer.tsx`
- `features/footer/EmailCopyButton.tsx`
- `hooks/useCopyToClipboard.ts` — Connects to: `EmailCopyButton.tsx`.

### Implementation Notes
- The menu overlay's staggered entrance should use the shared `useGsapContext` hook from Phase 4 rather than a standalone `useEffect`.
- Email obfuscation should be a simple in-house encode/decode utility, not a dependency on any external service.

### Validation Checklist
- [ ] Menu overlay opens/closes with correct staggered animation and no layout shift
- [ ] All nav links route to the correct (even if not-yet-built) pages without 404s breaking the build
- [ ] Copy button correctly copies the real email and shows temporary confirmation state
- [ ] Mobile menu overlay is fully usable at narrow viewport widths

### Phase Completion Criteria
Every public page will now render with a working, animated nav and footer.

---

## Phase 6 — Hero Section

### Goal
Build the kinetic-typography hero section: staggered animated headline with inline imagery.

### Why This Phase Exists
The hero is the first and most animation-dense homepage section; building it right after the shared animation infrastructure (Phase 4) and nav (Phase 5) validates that infrastructure against a real, complex use case before it's reused elsewhere.

### Dependencies
Phase 4 (GSAP/Lenis infra), Phase 5 (Navbar present for realistic layout testing).

### Tasks
- Build `KineticHeadline.tsx` — splits headline text into individually-animatable word/phrase spans
- Build `InlineImageWord.tsx` — small inline image component that animates in alongside its associated word
- Compose `Hero.tsx` combining headline, inline images, and the CTA button
- Implement the staggered GSAP timeline (entrance animation on page load, not scroll-triggered, since this is above the fold)

### Files Created
- `features/hero/Hero.tsx`
- `features/hero/KineticHeadline.tsx`
- `features/hero/InlineImageWord.tsx`

### Implementation Notes
- Word-splitting can be done manually (wrapping known phrases in spans at author-time) rather than requiring a runtime text-splitting library, since the hero copy is static/hardcoded per the content strategy.
- This is an on-load timeline, not a ScrollTrigger — keep this distinction clear so it isn't accidentally tied to scroll position.
- Test text reflow carefully at mobile widths per the spec's noted responsive-behavior risk for this section.

### Validation Checklist
- [ ] Headline animates in correctly on page load, in the correct stagger order
- [ ] Inline images appear synced to their associated word, not before/after
- [ ] Layout does not break or overflow at mobile widths
- [ ] No console warnings about GSAP targets not found (guards against a common word-splitting bug)

### Phase Completion Criteria
Hero renders and animates correctly across breakpoints and validates the animation infrastructure built in Phase 4.

---

## Phase 7 — GitHub Activity

### Goal
Build the GitHub contribution graph and the reactive-eyes easter egg.

### Why This Phase Exists
This section introduces the first external API dependency (GitHub) and the first mouse-tracking interaction — isolating it in its own phase keeps API-fetch logic and cursor-tracking logic separate from pure-animation phases.

### Dependencies
Phase 4 (layout/animation infra).

### Tasks
- Create `lib/github/fetchContributions.ts` — server-side fetch against the GitHub GraphQL API, with caching (e.g. Next.js `fetch` revalidation) to avoid rate-limit issues
- Build `GithubActivityGraph.tsx` (Server Component that fetches data) and `ContributionCell.tsx` (presentational)
- Build `ReactiveEyes.tsx` — client component using `useMousePosition` to transform pupil position

### Files Created
- `lib/github/fetchContributions.ts`
- `features/github-activity/GithubActivityGraph.tsx`
- `features/github-activity/ContributionCell.tsx`
- `features/github-activity/ReactiveEyes.tsx`
- `hooks/useMousePosition.ts`

### Implementation Notes
- A GitHub personal access token is required for the GraphQL contributions query — store it as `GITHUB_TOKEN` in environment variables (see Section 5).
- Set a sane revalidation window (e.g. 1 hour) on the fetch so the homepage doesn't hit GitHub's API on every request.
- `ReactiveEyes.tsx` must be a Client Component; keep its mouse-tracking logic isolated so it doesn't force the whole section to be client-rendered.

### Validation Checklist
- [ ] Contribution graph renders real data matching the connected GitHub account
- [ ] Graph gracefully handles a GitHub API failure (fallback/empty state, not a crashed page)
- [ ] Eyes visibly track cursor movement smoothly, without jank
- [ ] Only `ReactiveEyes.tsx` is a Client Component — the graph itself stays server-rendered

### Phase Completion Criteria
Live GitHub data renders correctly with caching in place, and the eyes interaction works smoothly.

---

## Phase 8 — Technology Marquee

### Goal
Build the infinite horizontal scrolling strip of technology logos.

### Why This Phase Exists
This is a simple, self-contained animation pattern (infinite marquee) that will be reused with the reversed-direction text marquee — building it now establishes the pattern before Phase 9/10 need variations of it.

### Dependencies
Phase 2 (Technology model + seed data), Phase 4 (animation infra).

### Tasks
- Build `TechMarquee.tsx` — reads seeded Technology documents, renders a duplicated track for seamless looping
- Implement the infinite-scroll animation (GSAP `.to()` with modifiers, or CSS keyframes)
- Implement pause-on-hover behavior

### Files Created
- `features/marquee/TechMarquee.tsx`

### Implementation Notes
- Duplicate the track content (render the list twice back-to-back) so the loop point is invisible.
- Prefer a CSS-keyframe-based loop if the animation is purely decorative and doesn't need to sync with scroll position, reserving GSAP for cases where sync actually matters (per Performance Strategy's bundle-size awareness).

### Validation Checklist
- [ ] Marquee loops seamlessly with no visible jump at the seam
- [ ] Pausing on hover works correctly
- [ ] Technology data renders from the database, not hardcoded

### Phase Completion Criteria
Marquee renders live Technology data and loops smoothly with no performance jank.

---

## Phase 9 — Experience Timeline

### Goal
Build the database-driven experience timeline with per-card scroll reveal.

### Why This Phase Exists
This is the first section combining real database reads (Experience model) with a ScrollTrigger-based reveal pattern — this pattern (per-card fade/slide on scroll entry) is the template reused in Phase 10's more complex pinned sequence.

### Dependencies
Phase 2 (Experience model + seed data), Phase 4 (animation infra).

### Tasks
- Build `ExperienceTimeline.tsx` (Server Component, fetches Experience documents sorted by `order`)
- Build `ExperienceCard.tsx` (presentational, receives one Experience document)
- Build `TagPill.tsx` (shared tag/pill component, reused across Works and Capabilities)
- Implement the ScrollTrigger-based per-card reveal animation as a client "leaf" component wrapping the server-rendered card content

### Files Created
- `features/experience/ExperienceTimeline.tsx`
- `features/experience/ExperienceCard.tsx`
- `features/experience/TagPill.tsx` (or placed under `components/shared/` if reused broadly enough — confirm against actual reuse before duplicating)

### Implementation Notes
- Keep the data-fetching component a Server Component; only the animation wrapper around each card needs to be a Client Component, per the Performance Strategy's Server/Client split rule.
- This phase establishes the "server fetch → pass plain props → client animates" pattern that should be followed by every subsequent database-driven section (Works, Blog).

### Validation Checklist
- [ ] Timeline renders real Experience documents from the database in correct `order`
- [ ] Multiple roles at a single company render correctly nested under one card
- [ ] Each card animates in independently as it enters the viewport
- [ ] "View All" link correctly points to `/experience`

### Phase Completion Criteria
Timeline is fully data-driven and demonstrates the reusable server-fetch/client-animate pattern cleanly.

---

## Phase 10 — Capabilities Showcase

### Goal
Build the pinned, scroll-scrubbed "What I do" section with oversized background title text.

### Why This Phase Exists
This is the most complex animation sequence in the spec. It's deliberately placed after Phase 9 (which validates the simpler per-card reveal pattern) and after all shared animation infra (Phase 4) is proven stable across two prior sections.

### Dependencies
Phase 4 (animation infra), Phase 9 (proven ScrollTrigger reveal pattern to build on).

### Tasks
- Build `CapabilitiesShowcase.tsx` — the pinned container, using GSAP ScrollTrigger with `pin: true, scrub: true`
- Build `CapabilityCard.tsx` — one capability's image/copy/tags, plus its oversized ghost-text background title
- Implement the crossfade/shift logic as the user scrolls through the pinned segment
- Test carefully against Lenis to confirm pin behavior isn't fighting the smooth-scroll implementation

### Files Created
- `features/capabilities/CapabilitiesShowcase.tsx`
- `features/capabilities/CapabilityCard.tsx`

### Implementation Notes
- This is the highest-risk animation in the project for scroll-jank; budget extra manual testing time here specifically.
- `ScrollTrigger.refresh()` must be called after all capability images load, or the pin's calculated height will be wrong on first paint.
- Reuse `useGsapContext` from Phase 4 without exception here — this is exactly the kind of complex timeline that leaks ScrollTriggers if cleanup is handled manually and incorrectly.

### Validation Checklist
- [ ] Section pins correctly and unpins at the right scroll position, with no visual snapping/jumping
- [ ] Content crossfades smoothly as the user scrolls through the pinned segment
- [ ] Works correctly after a client-side route navigation away and back (no duplicate/orphaned ScrollTriggers — check browser console and DOM for leftover pinned elements)
- [ ] Behaves correctly at common breakpoints (this section may need a simplified, non-pinned fallback on small mobile screens — decide and document that decision here if so)

### Phase Completion Criteria
The pinned sequence works correctly across navigation cycles and breakpoints with no scroll jank or leaked ScrollTrigger instances.

---

## Phase 11 — Global Reach

### Goal
Build the "Working Across Borders" flag/country row.

### Why This Phase Exists
A simple, low-risk section placed after the highest-complexity animation phase (10) as a deliberate lower-intensity phase before moving into the Works/Blog/Contact route-building phases.

### Dependencies
Phase 4 (animation infra).

### Tasks
- Build `FlagRow.tsx` — staggered fade-in row of flag + country name pairs
- Decide whether country data is hardcoded (per spec's "hardcoded" content-strategy category, since this is unlikely to change often) or pulled from Testimonial/Project associations — default to hardcoded unless the specification indicates otherwise

### Files Created
- `features/global-reach/FlagRow.tsx`

### Implementation Notes
- Keep this section's animation intentionally simple (fade/stagger) — it's a rhythm break, not a technical showcase, per the original UX-flow analysis.

### Validation Checklist
- [ ] Flags and country names render correctly and stagger in on scroll
- [ ] Section is responsive at narrow widths (wraps correctly rather than overflowing)

### Phase Completion Criteria
Section renders correctly and completes the homepage's full section set (Hero through Global Reach).

---

## Phase 12 — Works Page

### Goal
Build the filterable project gallery at `/works`.

### Why This Phase Exists
This is the first phase building a full route (not a homepage section) and the first to require Framer Motion's layout-animation capability (filter transitions) rather than GSAP — establishing that pattern before Phase 14 (Blog) needs a similar list-page structure.

### Dependencies
Phase 2 (Project model, some seed/placeholder projects inserted manually for testing), Phase 4/5 (layout, nav).

### Tasks
- Build `getProjects()` as a Server Action or direct Server Component fetch (read-only at this stage — write actions come in Phase 18)
- Build `FilterTabs.tsx` (Client Component, holds active-category state, likely via Zustand or simple `useState`)
- Build `ProjectCard.tsx` and `ProjectGrid.tsx`
- Implement Framer Motion `layout` animations for filter transitions
- Build `app/(site)/works/page.tsx`

### Files Created
- `actions/project.actions.ts` (read portion only: `getProjects()`)
- `features/works/FilterTabs.tsx`
- `features/works/ProjectCard.tsx`
- `features/works/ProjectGrid.tsx`
- `app/(site)/works/page.tsx`

### Implementation Notes
- Insert a handful of manually-created Project documents (via a script or direct DB insert) at this stage purely for layout/testing purposes — this is not the CMS (Phase 18); it's test data.
- Filtering can happen client-side against a pre-fetched full list (simpler, fine at this content scale) rather than re-fetching per filter change, unless project count is expected to grow very large.

### Validation Checklist
- [ ] All test projects render correctly with correct category tagging
- [ ] Filter tabs correctly narrow the visible grid with a smooth layout transition
- [ ] Images render via `next/image` with correct Cloudinary remote pattern configuration
- [ ] Page is fully server-rendered for the initial project list (verify via view-source, not just dev tools network tab)

### Phase Completion Criteria
`/works` renders and filters real (test) database content correctly, with working layout animations.

---

## Phase 13 — Case Study System

### Goal
Build the dynamic case study detail route.

### Why This Phase Exists
This extends the Works system with a 1:1 related model (CaseStudy) and introduces dynamic route metadata generation, which will be reused identically in Phase 14 for blog posts.

### Dependencies
Phase 2 (CaseStudy model), Phase 12 (Project listing must exist to link into this).

### Tasks
- Build `getProjectBySlug(slug)` (fetches Project + populated CaseStudy reference)
- Build `app/(site)/works/[slug]/page.tsx`
- Implement `generateMetadata()` for this dynamic route using the project's title/description
- Render case study content sections: problem/approach/solution/results, metrics, image gallery

### Files Created
- Addition to `actions/project.actions.ts`: `getProjectBySlug()`
- `app/(site)/works/[slug]/page.tsx`

### Implementation Notes
- Handle the case where a Project has no linked CaseStudy gracefully (either redirect back to `/works` or render a simpler project-only view) — do not let this crash the route.
- This phase is the template for Phase 14's blog detail page — keep the metadata-generation and not-found-handling pattern consistent between them.

### Validation Checklist
- [ ] Visiting a valid project slug renders full case study content correctly
- [ ] Visiting an invalid slug returns a proper 404, not a crash
- [ ] `generateMetadata()` produces correct per-project title/description (verify via page source `<title>` tag)
- [ ] Projects without a linked case study don't break the route

### Phase Completion Criteria
Dynamic case study routes render correctly with proper metadata and graceful handling of missing data.

---

## Phase 14 — Blog System

### Goal
Build the blog listing and MDX-rendered detail page.

### Why This Phase Exists
Reuses the exact list/detail pattern established in Phases 12–13, substituting MDX rendering for case-study-block rendering — this is the last "public content route" phase before Contact/Auth/CMS work begins.

### Dependencies
Phase 2 (BlogPost model), Phase 13 (established list/detail/metadata pattern).

### Tasks
- Install MDX rendering dependency (`next-mdx-remote` or `@next/mdx`)
- Build `getBlogPosts()` and `getBlogPostBySlug()` (read-only; write actions arrive in Phase 19)
- Build `BlogCard.tsx`, `MDXRenderer.tsx`
- Build `app/(site)/blog/page.tsx` and `app/(site)/blog/[slug]/page.tsx`
- Implement `generateMetadata()` and Article JSON-LD placeholder (full JSON-LD wiring finalized in Phase 21)

### Files Created
- `actions/blog.actions.ts` (read portion)
- `features/blog/BlogCard.tsx`
- `features/blog/MDXRenderer.tsx`
- `app/(site)/blog/page.tsx`
- `app/(site)/blog/[slug]/page.tsx`

### Implementation Notes
- Only `published: true` posts with a `publishedAt` in the past should appear on the public listing — draft/future posts must be excluded from the public query (but remain visible in the admin, per Phase 19).
- Insert a couple of test MDX posts directly in the database for validation before the CMS write-path exists.

### Validation Checklist
- [ ] Blog listing shows only published posts, sorted by `publishedAt` descending
- [ ] MDX content (including at least one custom embedded component, if used) renders correctly
- [ ] Draft posts do not appear on the public listing or detail route

### Phase Completion Criteria
Blog list and detail pages render correctly against real (test) MDX content with correct publish-state filtering.

---

## Phase 15 — Contact System

### Goal
Build the public contact form and its Route Handler-backed submission flow.

### Why This Phase Exists
This is the first and only public-facing write path in the entire application, and per the spec is deliberately implemented as a Route Handler (not a Server Action) due to being reachable by untrusted, unauthenticated visitors.

### Dependencies
Phase 2 (ContactMessage model), Phase 4/5 (layout/nav).

### Tasks
- Build `ContactForm.tsx` using React Hook Form + Zod validation matching `lib/validations/contact.schema.ts`
- Build `app/api/contact/route.ts` — validates input server-side again (never trust client validation alone), applies a honeypot field check and basic rate limiting, then writes to `ContactMessage`
- Wire the form to POST to this route and show success/error state

### Files Created
- `lib/validations/contact.schema.ts`
- `features/contact/ContactForm.tsx`
- `app/api/contact/route.ts`

### Implementation Notes
- Server-side validation must be re-run inside the Route Handler even though the client form already validates — this is the whole reason this path is a Route Handler and not a trusted Server Action.
- A simple honeypot hidden field (bots fill it, humans don't) is sufficient at this scale; don't over-engineer rate limiting beyond a basic in-memory or IP-based check unless spam becomes an actual problem later.

### Validation Checklist
- [ ] Valid submissions create a `ContactMessage` document correctly
- [ ] Invalid submissions (missing fields, honeypot filled) are rejected server-side even if client validation is bypassed (test by disabling JS or hitting the route directly)
- [ ] Form shows correct success/error UI states

### Phase Completion Criteria
Contact form is fully functional and appropriately hardened against the most basic spam/abuse patterns.

---

## Phase 16 — Authentication

### Goal
Set up Auth.js with Google + GitHub OAuth, gated to a single allow-listed admin email.

### Why This Phase Exists
This is a hard prerequisite for the entire Admin Dashboard (Phase 17) — no dashboard work should begin until the auth gate is proven to correctly allow the admin and reject everyone else.

### Dependencies
Phase 1–3 (scaffold, config, env).

### Tasks
- Install `next-auth` (v5 / Auth.js)
- Configure Google and GitHub OAuth providers
- Implement the post-callback email allow-list check
- Build `app/api/auth/[...nextauth]/route.ts`
- Build `app/(admin)/admin/login/page.tsx`
- Build middleware or a layout-level session check protecting the entire `(admin)` route group

### Files Created
- `lib/auth/auth.config.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/(admin)/admin/login/page.tsx`
- `actions/auth.actions.ts` (if any auth-related server actions are needed, e.g. sign-out)

### Implementation Notes
- The admin allow-list should be a single email stored in an environment variable (`ADMIN_EMAIL`), checked in the Auth.js `signIn` callback — reject the session outright rather than allowing sign-in and checking later.
- Protect the entire `(admin)` route group at the layout level (`app/(admin)/admin/layout.tsx`, built in Phase 17) rather than per-page, so no admin page can accidentally ship without the check.

### Validation Checklist
- [ ] Signing in with the allow-listed email succeeds and creates/updates the correct `User` document
- [ ] Signing in with any other Google/GitHub account is rejected before reaching any admin page
- [ ] Session persists correctly across page reloads
- [ ] Sign-out correctly clears the session

### Phase Completion Criteria
Only the designated admin account can authenticate, and no admin route is reachable without a valid, authorized session.

---

## Phase 17 — Admin Dashboard

### Goal
Build the authenticated admin shell and overview page.

### Why This Phase Exists
This is the container all CMS features (Phases 18–20) will be built inside — building the shell (layout, sidebar, session guard, overview stats) first means each subsequent CMS phase only needs to add pages, not rebuild the shell.

### Dependencies
Phase 16 (auth working), Phase 2 (models to read counts from).

### Tasks
- Install `shadcn/ui` and initialize its config (admin-only usage, per the spec's decision to keep it out of the public site)
- Build `app/(admin)/admin/layout.tsx` — session-guarded shell with sidebar nav
- Build `app/(admin)/admin/page.tsx` — overview with `DashboardStats`
- Build `DashboardStats.tsx` — total projects, published/draft blog counts, unread message count

### Files Created
- `app/(admin)/admin/layout.tsx`
- `app/(admin)/admin/page.tsx`
- `features/admin/DashboardStats.tsx`

### Implementation Notes
- The layout-level session guard built here is what actually enforces the protection described in Phase 16 — verify it redirects unauthenticated visitors to `/admin/login` correctly, not just that login itself works.
- Keep shadcn/ui's Tailwind theme scoped so it doesn't leak default styling into the public site's custom design system.

### Validation Checklist
- [ ] Unauthenticated visits to any `/admin/*` route redirect to `/admin/login`
- [ ] Dashboard overview shows correct live counts from the database
- [ ] Sidebar navigation links to all planned admin pages (even ones not yet built, pointing correctly for when they arrive)

### Phase Completion Criteria
Admin shell is fully gated and displays accurate live stats; ready to host CRUD pages.

---

## Phase 18 — Project CMS

### Goal
Build full CRUD management for Projects (and their linked Case Studies).

### Why This Phase Exists
Per the "CMS after public frontend structure" principle, this is only built now because the public Works/Case Study pages (Phases 12–13) already exist and define the exact data contract this CMS must produce.

### Dependencies
Phase 12–13 (public consumer of this data), Phase 17 (admin shell).

### Tasks
- Complete `actions/project.actions.ts` with write operations: `createProject()`, `updateProject()`, `deleteProject()`, `toggleProjectField()`
- Build `ProjectForm.tsx` (React Hook Form + Zod, Cloudinary upload widget, tag-input for tech stack)
- Build `DataTable.tsx` (generic, reusable — also used by Phase 19's blog list)
- Build `app/(admin)/admin/projects/page.tsx`, `/create/page.tsx`, `/[id]/edit/page.tsx`

### Files Created
- Additions to `actions/project.actions.ts`
- `lib/validations/project.schema.ts`
- `lib/cloudinary/upload.ts`
- `features/admin/ProjectForm.tsx`
- `features/admin/DataTable.tsx`
- `app/(admin)/admin/projects/page.tsx`
- `app/(admin)/admin/projects/create/page.tsx`
- `app/(admin)/admin/projects/[id]/edit/page.tsx`

### Implementation Notes
- `DataTable.tsx` should be built generically enough (via props/generics) to be reused for the Blog list in Phase 19 without duplication.
- Cloudinary upload should return a secure URL that's stored directly on the Project document — no need to proxy image serving through the app itself.
- Deleting a Project should also handle its linked CaseStudy (either cascade-delete or explicitly warn/require it be handled first — decide and document the choice here).

### Validation Checklist
- [ ] Creating a project via the admin form correctly appears on the public `/works` page after creation
- [ ] Editing a project updates it correctly on the public site
- [ ] Deleting a project removes it from the public site and handles its CaseStudy relationship as decided above
- [ ] Image upload via Cloudinary works and displays correctly via `next/image`

### Phase Completion Criteria
Full project lifecycle (create/edit/delete/publish-toggle) works end-to-end and is immediately reflected on the public site.

---

## Phase 19 — Blog CMS

### Goal
Build full CRUD management for Blog Posts.

### Why This Phase Exists
Mirrors Phase 18's pattern exactly, reusing `DataTable.tsx`, applied to the Blog model and the public blog pages built in Phase 14.

### Dependencies
Phase 14 (public consumer), Phase 18 (reusable `DataTable`, established CMS pattern).

### Tasks
- Complete `actions/blog.actions.ts` with `createBlogPost()`, `updateBlogPost()`, `deleteBlogPost()`, `togglePublish()`
- Build `BlogForm.tsx` (title/slug/excerpt fields, MDX content textarea or lightweight editor, cover image upload)
- Build `app/(admin)/admin/blog/page.tsx`, `/create/page.tsx`, `/[id]/edit/page.tsx`

### Files Created
- Additions to `actions/blog.actions.ts`
- `lib/validations/blog.schema.ts`
- `features/admin/BlogForm.tsx`
- `app/(admin)/admin/blog/page.tsx`
- `app/(admin)/admin/blog/create/page.tsx`
- `app/(admin)/admin/blog/[id]/edit/page.tsx`

### Implementation Notes
- Slug should auto-generate from the title but remain manually editable, to avoid broken links if a title is edited after publishing.
- Publishing a post (`published: true`) should also validate that `publishedAt` is set (default to current time if not manually chosen).

### Validation Checklist
- [ ] Creating and publishing a post correctly appears on the public `/blog` listing
- [ ] Draft posts remain hidden from the public site but visible/editable in the admin
- [ ] Editing MDX content correctly reflects on the public detail page

### Phase Completion Criteria
Full blog post lifecycle works end-to-end, matching the Project CMS pattern.

---

## Phase 20 — Message Management

### Goal
Build the admin inbox for viewing and triaging contact form submissions.

### Why This Phase Exists
This is the simplest CMS phase (read/mark-read/delete only, no create form) and depends on Phase 15's contact form already producing real data to manage.

### Dependencies
Phase 15 (ContactMessage data source), Phase 17 (admin shell).

### Tasks
- Build `actions/message.actions.ts`: `getMessages()`, `markAsRead(id)`, `deleteMessage(id)`
- Build `MessageList.tsx`
- Build `app/(admin)/admin/messages/page.tsx`

### Files Created
- `actions/message.actions.ts`
- `features/admin/MessageList.tsx`
- `app/(admin)/admin/messages/page.tsx`

### Implementation Notes
- Sort by unread-first, then most recent, per the model's compound index defined in the specification.
- Marking as read should happen either explicitly (a button) or implicitly (opening/expanding the message) — decide and document which, for consistency.

### Validation Checklist
- [ ] New submissions from the public contact form appear correctly in this list
- [ ] Marking as read updates state correctly and persists on reload
- [ ] Deleting a message removes it permanently

### Phase Completion Criteria
Admin can fully triage incoming contact messages without needing direct database access.

---

## Phase 21 — SEO Implementation

### Goal
Implement the complete SEO layer: metadata, dynamic OG images, sitemap, robots.txt, and structured data.

### Why This Phase Exists
Placed deliberately after all content routes and the CMS exist, since SEO metadata generation depends on real, finalized content models and routes — building it earlier would mean revisiting it repeatedly as routes changed.

### Dependencies
Phases 12–14 (all public content routes), Phase 2 (models for dynamic sitemap generation).

### Tasks
- Implement/finalize `generateMetadata()` across every route (home, works, works/[slug], blog, blog/[slug], experience, journey)
- Build `app/api/og/route.tsx` using `next/og`'s `ImageResponse`, parameterized by title/category
- Build `app/sitemap.ts` (static routes + dynamic Project/BlogPost slugs)
- Build `app/robots.ts` (allow all, disallow `/admin`, reference sitemap)
- Implement Person JSON-LD on the homepage, CreativeWork/Project JSON-LD on case study pages, Article JSON-LD on blog posts

### Files Created
- `app/api/og/route.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- JSON-LD script components embedded in the relevant existing pages (no new dedicated files necessarily required, unless a shared `StructuredData.tsx` component is preferred for reuse)

### Implementation Notes
- Cache the OG image route via route segment config so identical requests (e.g. repeated crawler hits) don't regenerate the image each time.
- Validate the sitemap output against Next.js's expected sitemap XML shape directly, not just by eyeballing it.

### Validation Checklist
- [ ] Every route has a correct, unique `<title>` and meta description (verify via page source)
- [ ] OG image route produces a correctly rendered image for at least one project and one blog post
- [ ] `sitemap.xml` includes all published Projects and BlogPosts and excludes drafts
- [ ] `robots.txt` correctly disallows `/admin`
- [ ] JSON-LD validates correctly (test with Google's Rich Results Test or equivalent)

### Phase Completion Criteria
All routes have correct metadata, the sitemap/robots files are correct and complete, and structured data validates cleanly.

---

## Phase 22 — Performance Optimization

### Goal
Audit and optimize the completed application for animation performance, bundle size, and Core Web Vitals.

### Why This Phase Exists
This is intentionally the final phase — optimization is done against the complete, feature-full application rather than prematurely, since earlier optimization would need to be redone as later phases added new components.

### Dependencies
All prior phases complete.

### Tasks
- Audit every GSAP-using component for correct `useGsapContext`/cleanup usage; fix any component found managing its own ad hoc cleanup
- Verify no orphaned ScrollTriggers accumulate after repeated client-side navigation across the whole site (not just Phase 10's section)
- Run a full Lighthouse pass on key pages (home, works, blog post) and address flagged issues (image sizing, unused JS, CLS)
- Confirm the admin route group's bundle does not include GSAP/Lenis/Framer Motion (verify via bundle analyzer)
- Confirm all images use correct `next/image` `sizes` attributes to avoid over-fetching

### Files Created
No new feature files — this phase modifies existing files based on audit findings. A short internal performance-audit note/checklist document may be created for the team's own reference, but is not part of the public application.

### Implementation Notes
- Use `@next/bundle-analyzer` or equivalent to verify the admin/public bundle split is actually happening as designed, not just assumed.
- Pay particular attention to Phase 10 (Capabilities Showcase) and Phase 7 (GitHub eyes) during the ScrollTrigger/mouse-tracking leak audit, since they are the highest-risk components identified during their own phases.

### Validation Checklist
- [ ] Lighthouse performance score meets an agreed target (e.g. 90+) on the homepage and works pages
- [ ] No console warnings about duplicate/orphaned ScrollTriggers after extensive click-through navigation testing
- [ ] Admin bundle confirmed free of animation library weight
- [ ] CLS (Cumulative Layout Shift) is near zero on image-heavy pages

### Phase Completion Criteria
The application meets performance targets and is confirmed free of the animation-cleanup issues flagged as risks throughout earlier phases. This marks the project as production-ready.

---

## 3. Exact File Creation Sequence

This is the literal, chronological file-by-file build order Antigravity should follow. Files within the same phase are listed in the order they should be created (later files in a phase often depend on earlier ones in that same phase).

```
Step 1   package.json
Step 2   tsconfig.json
Step 3   next.config.ts
Step 4   .env.example
Step 5   app/globals.css
Step 6   app/layout.tsx (placeholder)

Step 7   lib/db/connect.ts
Step 8   models/User.model.ts
Step 9   models/Project.model.ts
Step 10  models/CaseStudy.model.ts
Step 11  models/Experience.model.ts
Step 12  models/Skill.model.ts
Step 13  models/Technology.model.ts
Step 14  models/BlogPost.model.ts
Step 15  models/ContactMessage.model.ts
Step 16  models/Testimonial.model.ts
Step 17  models/SiteSettings.model.ts
Step 18  scripts/seed.ts

Step 19  config/site.config.ts
Step 20  config/env.ts
Step 21  constants/nav-links.ts
Step 22  constants/social-links.ts
Step 23  constants/seo-defaults.ts

Step 24  lib/gsap/registerPlugins.ts
Step 25  hooks/useLenis.ts
Step 26  hooks/useGsapContext.ts
Step 27  components/providers/LenisProvider.tsx
Step 28  app/(site)/layout.tsx

Step 29  features/navbar/NavLink.tsx
Step 30  features/navbar/MenuOverlay.tsx
Step 31  features/navbar/Navbar.tsx
Step 32  hooks/useCopyToClipboard.ts
Step 33  features/footer/EmailCopyButton.tsx
Step 34  features/footer/Footer.tsx

Step 35  features/hero/InlineImageWord.tsx
Step 36  features/hero/KineticHeadline.tsx
Step 37  features/hero/Hero.tsx

Step 38  hooks/useMousePosition.ts
Step 39  lib/github/fetchContributions.ts
Step 40  features/github-activity/ContributionCell.tsx
Step 41  features/github-activity/GithubActivityGraph.tsx
Step 42  features/github-activity/ReactiveEyes.tsx

Step 43  features/marquee/TechMarquee.tsx

Step 44  features/experience/TagPill.tsx
Step 45  features/experience/ExperienceCard.tsx
Step 46  features/experience/ExperienceTimeline.tsx

Step 47  features/capabilities/CapabilityCard.tsx
Step 48  features/capabilities/CapabilitiesShowcase.tsx

Step 49  features/global-reach/FlagRow.tsx

Step 50  app/(site)/page.tsx (assembles Hero through Global Reach)

Step 51  lib/validations/project.schema.ts
Step 52  actions/project.actions.ts (read-only)
Step 53  features/works/ProjectCard.tsx
Step 54  features/works/FilterTabs.tsx
Step 55  features/works/ProjectGrid.tsx
Step 56  app/(site)/works/page.tsx

Step 57  app/(site)/works/[slug]/page.tsx

Step 58  lib/validations/blog.schema.ts
Step 59  actions/blog.actions.ts (read-only)
Step 60  features/blog/BlogCard.tsx
Step 61  features/blog/MDXRenderer.tsx
Step 62  app/(site)/blog/page.tsx
Step 63  app/(site)/blog/[slug]/page.tsx

Step 64  lib/validations/contact.schema.ts
Step 65  features/contact/ContactForm.tsx
Step 66  app/api/contact/route.ts

Step 67  lib/auth/auth.config.ts
Step 68  app/api/auth/[...nextauth]/route.ts
Step 69  app/(admin)/admin/login/page.tsx

Step 70  app/(admin)/admin/layout.tsx
Step 71  features/admin/DashboardStats.tsx
Step 72  app/(admin)/admin/page.tsx

Step 73  lib/cloudinary/upload.ts
Step 74  features/admin/DataTable.tsx
Step 75  features/admin/ProjectForm.tsx
Step 76  actions/project.actions.ts (write additions)
Step 77  app/(admin)/admin/projects/page.tsx
Step 78  app/(admin)/admin/projects/create/page.tsx
Step 79  app/(admin)/admin/projects/[id]/edit/page.tsx

Step 80  features/admin/BlogForm.tsx
Step 81  actions/blog.actions.ts (write additions)
Step 82  app/(admin)/admin/blog/page.tsx
Step 83  app/(admin)/admin/blog/create/page.tsx
Step 84  app/(admin)/admin/blog/[id]/edit/page.tsx

Step 85  actions/message.actions.ts
Step 86  features/admin/MessageList.tsx
Step 87  app/(admin)/admin/messages/page.tsx

Step 88  app/api/og/route.tsx
Step 89  app/sitemap.ts
Step 90  app/robots.ts
Step 91  (metadata + JSON-LD additions across existing route files)

Step 92  (performance audit — modifications to existing files, no new files)
```

---

## 4. Dependency Installation Order

### Core (Phase 1)
```
next
react
react-dom
typescript
@types/react
@types/node
tailwindcss
```
Introduced immediately — nothing builds without these.

### Database (Phase 2)
```
mongoose
```
Introduced right after core scaffolding, before any content-bearing component is built.

### Animation (Phase 4)
```
gsap
@gsap/react
lenis
framer-motion
```
Introduced once the scaffold and database layer exist, immediately before the layout shell — these are needed by every homepage-section phase from Phase 6 onward.

### Forms (Phase 15, first real use; schemas may be stubbed earlier)
```
zod
react-hook-form
@hookform/resolvers
```
Zod schema *files* may be created earlier alongside their related models (e.g. `project.schema.ts` in Phase 18), but the packages themselves aren't strictly needed until the first real form is built — the Contact form in Phase 15 is the first hard requirement.

### Media (Phase 18, first real use)
```
cloudinary
next-cloudinary  (if used for the upload widget)
```
Introduced when the Project CMS needs image upload; not needed for public-facing pages, which only consume already-uploaded Cloudinary URLs via `next/image`.

### Content (Phase 14)
```
next-mdx-remote
```
(or `@next/mdx`, depending on whether MDX is compiled at build time vs. rendered at request time — request-time rendering via `next-mdx-remote` is recommended here since blog content is database-driven, not file-based)

### Authentication (Phase 16)
```
next-auth
```
Introduced immediately before building the admin gate — has no purpose earlier in the build.

### UI (Phase 17)
```
shadcn/ui (via its CLI, not a single npm package — components added individually as needed: button, table, dialog, input, etc.)
```
Introduced only for the admin dashboard shell — the public site never depends on this.

### State (introduced opportunistically, first needed in Phase 12)
```
zustand
```
Only if the Works page filter state or admin sidebar state ends up complex enough to warrant it over plain `useState` — evaluate at Phase 12 rather than installing preemptively.

---

## 5. Environment Setup Plan

`.env.example` (created in Phase 1, populated with real values locally/in deployment — never committed with real values):

```
# Database
DATABASE_URL=

# Authentication
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
ADMIN_EMAIL=

# GitHub Activity Section
GITHUB_TOKEN=
GITHUB_USERNAME=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=
```

**Variable purposes:**

- **`DATABASE_URL`** — Purpose: MongoDB connection string (Atlas or self-hosted). Consumed by `lib/db/connect.ts`.
- **`AUTH_SECRET`** — Purpose: Auth.js session/JWT encryption secret. Required by `lib/auth/auth.config.ts`.
- **`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`** — Purpose: Google OAuth provider credentials for admin sign-in.
- **`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`** — Purpose: GitHub OAuth provider credentials for admin sign-in. (Distinct from `GITHUB_TOKEN` below — this is for the auth flow, not the activity graph.)
- **`ADMIN_EMAIL`** — Purpose: the single allow-listed email checked in the Auth.js `signIn` callback to gate `/admin` access.
- **`GITHUB_TOKEN`** — Purpose: personal access token for the GitHub GraphQL contributions query used by the GitHub Activity section (Phase 7). Unrelated to admin auth.
- **`GITHUB_USERNAME`** — Purpose: the GitHub username whose contribution graph is displayed.
- **`CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`** — Purpose: image upload/storage credentials, used in `lib/cloudinary/upload.ts` and the Project/Blog admin forms.
- **`NEXT_PUBLIC_SITE_URL`** — Purpose: the canonical site URL, used in metadata generation, sitemap, and OG image absolute URLs. Prefixed `NEXT_PUBLIC_` because it's needed client-side (e.g. for share links) as well as server-side.

---

## 6. Development Checkpoints

### Checkpoint 1 — Project runs locally
**Testing steps:** Run `npm install` then `npm run dev`; visit `localhost:3000`.
**Expected result:** Blank/placeholder homepage loads with no build or console errors. Corresponds to completion of Phase 1.

### Checkpoint 2 — Database connected
**Testing steps:** Run the seed script (Phase 2); query a model directly (e.g. via a temporary test route or script) to confirm read/write works.
**Expected result:** All ten models can be created and retrieved; seed data (Experience, Technology, Skill, SiteSettings) exists in the database. Corresponds to completion of Phase 2–3.

### Checkpoint 3 — Homepage complete
**Testing steps:** Visit `/` after Phases 4–11 are complete; scroll through the entire page.
**Expected result:** Navbar, Hero, GitHub Activity, Tech Marquee, Experience Timeline, Capabilities Showcase, and Global Reach all render correctly with real/seeded data, in the correct order, at both desktop and mobile widths.

### Checkpoint 4 — Animations complete
**Testing steps:** Interact with every animated element (menu overlay, hero entrance, marquees, experience card reveals, capabilities pin sequence, eyes tracking); navigate away from and back to the homepage multiple times via client-side routing.
**Expected result:** All animations play correctly with no jank; no console warnings about duplicate/orphaned ScrollTriggers after repeated navigation. Corresponds to a cross-cutting check spanning Phases 4–11, formally re-verified in Phase 22.

### Checkpoint 5 — CMS working
**Testing steps:** Log into `/admin` with the allow-listed account; create, edit, publish, and delete a project and a blog post; submit a real contact form and verify it appears in `/admin/messages`.
**Expected result:** Every CMS action correctly reflects on the corresponding public page, and non-admin accounts cannot access `/admin`. Corresponds to completion of Phases 16–20.

### Checkpoint 6 — Production ready
**Testing steps:** Run a full production build (`npm run build && npm run start`); run Lighthouse against the deployed/staging build; validate sitemap, robots.txt, and structured data.
**Expected result:** Build succeeds with no errors; Lighthouse scores meet the agreed target; sitemap/robots/JSON-LD all validate correctly. Corresponds to completion of Phases 21–22.

---

## 7. Animation Development Roadmap

This is the animation-specific build order, cutting across the phases above, for reference when working specifically on motion/interaction code:

1. **GSAP configuration** — `lib/gsap/registerPlugins.ts`, registered once at the app's entry point (Phase 4). Nothing else in this list can be built before this exists.
2. **Lenis smooth scrolling** — `LenisProvider` + `useLenis` (Phase 4), synced to GSAP's ticker. Must exist before any ScrollTrigger-based section, since ScrollTrigger needs to read accurate scroll position from Lenis rather than native scroll.
3. **Hero text animation** — `KineticHeadline`/`InlineImageWord` (Phase 6). First real-world test of the GSAP setup, but it's a load-triggered timeline, not scroll-triggered — validates GSAP basics before introducing ScrollTrigger complexity.
4. **ScrollTrigger utilities** — `useGsapContext` (Phase 4, used starting Phase 7 onward). The shared cleanup pattern must be proven correct before it's relied upon repeatedly.
5. **Marquee animations** — `TechMarquee` (Phase 8) and the text marquee divider. Simple, low-risk looping animations; a good next step after load-triggered animations, before tackling ScrollTrigger-driven reveals.
6. **Timeline (reveal) animations** — `ExperienceCard` scroll-triggered reveal (Phase 9). First real ScrollTrigger-per-element pattern; establishes the template reused by the pinned sequence next.
7. **Image reveal system** — clip-path-based reveal-on-scroll, applied to Works/Case Study images (Phase 12–13) and reusable anywhere else images need a reveal treatment.
8. **Sticky capabilities section** — `CapabilitiesShowcase` pinned/scrubbed sequence (Phase 10). Built last among animation work because it's the highest-complexity, highest-risk sequence and depends on every simpler pattern above already being proven stable.

**Dependency summary:** each numbered item depends on all previous items in this list existing and being verified — do not attempt the pinned Capabilities sequence (8) before the simpler per-card reveal pattern (6) is proven working and leak-free.

---

## 8. Database Development Order

1. **MongoDB connection** (`lib/db/connect.ts`) — must exist before any model file, since every model file will eventually be used through this connection.
2. **User model** — created first among the actual content models because Authentication (Phase 16) and the entire Admin Dashboard depend on it, even though it's populated later in the timeline; defining its shape early avoids rework.
3. **Project model** — the most-referenced model in the system (linked to by CaseStudy and indirectly by Testimonial); built early so dependent models can reference it correctly.
4. **Case Study model** — depends on Project existing first, since it holds a required unique reference to a Project document.
5. **Experience, Skill, Technology models** — independent of each other and of Project; grouped together since they're all seed-managed, low-complexity models needed for the early homepage sections (Phases 8–9).
6. **BlogPost model** — independent, built alongside the other content models even though it isn't consumed until Phase 14, to keep all schema definition work consolidated in Phase 2 rather than spread across the timeline.
7. **ContactMessage model** — independent; needed by Phase 15.
8. **Testimonial model** — optionally references Project; built last among content models since testimonials aren't surfaced in any phase's task list as a dedicated homepage section in the current roadmap (available for future use).
9. **SiteSettings model** — a singleton, built last since it's purely supporting configuration data rather than content with multiple instances.

**Why this order:** models with the most incoming references (Project) or the most downstream dependents (User) are defined first, so that models depending on them (CaseStudy → Project, Auth → User) never have to be built against an incomplete or assumed shape.

---

## 9. Deployment Checklist

### Frontend
- [ ] Production build (`next build`) completes with zero errors or type errors
- [ ] All required environment variables are set in the hosting platform's environment configuration (matching `.env.example` exactly)
- [ ] Custom domain is connected and SSL is provisioned
- [ ] `NEXT_PUBLIC_SITE_URL` matches the actual production domain exactly (affects metadata, sitemap, OG image absolute URLs)

### Database
- [ ] MongoDB Atlas cluster is provisioned (or equivalent managed MongoDB host)
- [ ] Production `DATABASE_URL` is set and network access rules (IP allow-list or VPC peering) permit the deployed app to connect
- [ ] Seed data (Experience, Technology, Skill, SiteSettings) has been run against the production database, not just local/dev

### Storage
- [ ] Cloudinary account/production credentials are set
- [ ] `next.config.ts` `images.remotePatterns` includes the production Cloudinary domain

### SEO
- [ ] `sitemap.xml` is reachable at the production domain and includes all published content
- [ ] `robots.txt` is reachable and correctly disallows `/admin`
- [ ] Site is submitted to Google Search Console (and Bing Webmaster Tools, if desired) with the sitemap URL registered
- [ ] Structured data validates against Google's Rich Results Test on production URLs (not just localhost)

### Performance
- [ ] Lighthouse run against the live production URL (not localhost) meets the agreed target
- [ ] Manually re-test the animation-leak checks from Phase 22 against production (production builds can behave differently from dev mode for GSAP/ScrollTrigger timing)
- [ ] Confirm the admin route group's bundle is still correctly split from the public bundle in the production build output

---

## 10. AI Coding Agent Instructions

Strict operating rules for the AI coding agent (Antigravity) implementing this project:

1. **Read `portfolio-project-spec.md` before coding.** The specification defines the binding architecture, schemas, and design system. This implementation plan defines execution order — it does not override the specification.
2. **Follow this document's phase and file order exactly.** Do not reorder phases, skip ahead, or combine phases without explicit approval from the project owner.
3. **Create one file at a time.** Never generate multiple files in a single unexplained batch, even within the same phase.
4. **Explain every file before generating it.** For each file: state its purpose, what it connects to/depends on, and why it's being created at this point in the sequence — then provide the complete code.
5. **Never skip validation steps.** Each phase's Validation Checklist must be explicitly confirmed (not assumed) before moving to the next phase.
6. **Never refactor architecture without approval.** If implementation reveals a genuine problem with the specification or this plan, stop and flag it to the project owner rather than silently deviating.
7. **Ask before moving between phases.** After a phase's Phase Completion Criteria are met, stop and wait for explicit confirmation before starting the next phase.
8. **Keep code production quality.** No placeholder logic left in place beyond its intended temporary role (e.g., Phase 12's manually-inserted test projects must be clearly identified as test data, not left masquerading as production content), no unhandled error paths on database or external API calls, and no skipped TypeScript types.
