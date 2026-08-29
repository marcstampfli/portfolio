# Expert Repository Review (Pre-remediation baseline)

> Historical baseline: this report records the state reviewed on 2026-08-28/29 before the remediation pass. The current repository contains follow-up fixes; rerun the repository, browser, and live-deployment checks before treating any individual finding below as current.

## Scope and review date

Repository: Marc Stämpfli portfolio application

Review date: 2026-08-28/29

Scope:

- Source, content pipeline, configuration, package manifests, lockfile, and CI
- Local build, lint, type checking, formatting, content validation, dependency audit, and dead-code analysis
- Live HTTP behavior, security headers, crawl files, browser console, responsive behavior, modal behavior, and a Lighthouse run against https://www.marcstampfli.com

A finding marked confirmed means the code or deployed behavior is directly observable. A finding marked possible means the underlying weakness exists, but impact depends on deployment topology, future content changes, or another assumption that should be verified.

## Executive summary

The repository is well suited to a small personal portfolio and already contains several good controls: strict TypeScript, Zod validation, HTML escaping for contact emails, DOMPurify at the HTML sink, server-only intent for content loading, local-image allowlisting, restrictive frame and object policies, and safe noopener/noreferrer external links.

It is not yet production-ready. The most important issues are:

1. Draft and unpublished content is publicly readable because content is stored below public/. The live site returns 200 for the draft Parlog JSON, unpublished project JSON, templates, and Markdown files. This bypasses the application-level status filter and can disclose future work or client information.
2. The deployed Next.js version is in a range with multiple high-severity advisories, including a Proxy/Middleware bypass and Server Action denial of service. The dependency audit currently reports 7 high, 7 moderate, and 1 low vulnerability.
3. The strict CSP blocks the inline initialization script emitted by next-themes because the nonce is read in the root layout but not passed through Providers. This produces a live console error and can cause the initial theme to be wrong or flash before hydration.
4. The homepage is forced into dynamic, no-store rendering solely to create a per-request CSP nonce. That is an expensive default for a static portfolio and was observed live.
5. All 40 published project objects, including long case-study HTML, are serialized into the client response even though only a small subset is initially visible. The same architecture makes project detail content difficult for search engines to crawl.
6. The live homepage has a canonical URL on the apex domain while the apex redirects to the www domain. Robots and sitemap URLs use the same inconsistent apex origin.
7. The live mobile performance profile is weak: Lighthouse reported performance 59, LCP 3.6 s, total blocking time 2.9 s, main-thread work 6.2 s, and interaction readiness 5.8 s.
8. There are confirmed accessibility defects around duplicate project controls, a visible-name/ARIA-label mismatch on the brand button, and reduced-motion handling that covers CSS animations but not most Framer Motion and smooth-scroll behavior.

No Critical issue was confirmed. Several High and Medium issues should be resolved before treating the site as a hardened production deployment.

## Verification results

Passing local checks:

- npm run test — content validation passed
- npm run lint — passed
- npm run type-check — passed
- npm run format:check — passed
- npm run build — passed

Failing or concerning checks:

- npm audit --audit-level=low — fails with 15 reported vulnerabilities: 7 high, 7 moderate, and 1 low
- npm outdated — multiple direct dependencies have newer patch/minor releases; Next.js is currently locked at 16.2.9
- Build emitted a stale Browserslist/caniuse-lite warning
- Knip identified two unused dev dependencies, two unlisted dependencies, and several externally unused exports
- Lighthouse against the live site reported performance 0.59, accessibility 1.00, best practices 0.92, SEO 1.00. The accessibility category score does not make the specific failed label audit harmless.

The Lighthouse values are one throttled lab run, not a promise about every device. They are still useful evidence of the current client-side cost.

## Findings

### H-01 — Unpublished and draft content is directly exposed from public/

Severity: High

Confidence: Confirmed

Locations:

- public/projects/\*/project.json
- public/projects/\*/body.md
- public/experiences/\*/experience.json
- README.md:40-44
- src/lib/content.ts:11-12, 192-249, and 272-331
- src/app/robots.ts:7-10

Problem:

The loader filters projects by status in server code, but all JSON and Markdown files are under Next.js public/, which means they are static internet-facing files independent of that loader. The deployed site currently returns HTTP 200 for:

- /projects/parlog/project.json, even though the record is status draft
- /projects/amazon-clone/project.json, even though the record is status unpublished
- /projects/hulu-clone/project.json and /projects/tinder-clone/project.json, also unpublished
- /projects/\_template/project.json
- published project body.md files

The live robots policy allows the entire site, so there is no crawl-level exclusion either. The application filter is therefore presentation logic, not an access-control boundary.

Why it matters:

Draft project names, summaries, future product ideas, client references, old live links, and internal status values can be discovered without using the UI. A future contributor could also accidentally place a token or private note in one of these files and publish it immediately. The risk is amplified because the current /projects/:path\* cache rule gives these files a one-year immutable cache lifetime.

Recommended fix:

Move metadata and case-study content outside public/ into a server-only content directory or importable source modules. Keep only intentionally public image assets below public/. Generate public project pages from the server-only content, and add an explicit allowlist for published assets. As an interim defense, block direct requests for JSON, Markdown, and non-published project paths at the edge, but do not rely on that as the long-term content model. Purge any CDN/cache entries after removing exposed content.

Do not put secrets in any file below public/ even if status filtering is present.

### H-02 — Next.js is locked to a vulnerable release range

Severity: High

Confidence: Confirmed package vulnerability; exact exploitability is path-dependent

Locations:

- package.json:29
- package-lock.json
- src/proxy.ts:46-71
- src/lib/actions.ts:107-148

Problem:

The installed and locked version is Next.js 16.2.9. npm audit reports that the range below 16.2.11 is affected by multiple advisories, including:

- App Router Proxy/Middleware bypass
- denial of service in App Router Server Actions
- cache confusion involving request bodies
- Server Action payload and endpoint disclosure issues
- additional SSRF and image-optimization advisories, some of which apply only to custom servers, rewrites, Edge runtime, or other configurations

This application actively uses the affected surfaces: a Next.js Proxy, a public Server Action for contact submissions, and the Next image optimizer.

Why it matters:

The Proxy is being used to attach the CSP and the Server Action is a public unauthenticated endpoint. A framework vulnerability can defeat assumptions made by otherwise careful application code. Some audit entries are not reachable in the present Vercel configuration, but the version is still below the patched range.

Recommended fix:

Upgrade Next.js to a patched version, regenerate package-lock.json, run the full build and live smoke tests, and verify the deployed version. Review advisory-specific applicability after upgrading. Keep Next pinned to a known patched release rather than relying on a broad caret range.

### H-03 — The CI security gate is currently red

Severity: High

Confidence: Confirmed

Locations:

- .github/workflows/ci.yml:37-38
- package.json:18-58

Problem:

CI runs npm audit --audit-level=low. The same command currently exits non-zero locally because of the vulnerabilities listed in this report. Pull requests and pushes therefore fail the security step even though linting, type checking, formatting, content validation, and the build pass.

Why it matters:

The repository has a security gate, but it is not presently actionable. Teams often respond to a permanently red audit step by suppressing it or ignoring its output. That would remove a valuable control.

Recommended fix:

Patch the vulnerable dependency tree first, then retain the audit gate. Add a documented exception process for advisories that are explicitly unreachable, with an owner, rationale, expiry date, and compensating control. Do not lower the audit threshold merely to make CI green.

### M-01 — Direct and transitive dependency vulnerabilities remain beyond Next.js

Severity: Medium

Confidence: Confirmed package advisories; current exploitability varies

Locations:

- package.json:22, 26, 31, 39, and 53
- package-lock.json
- src/components/shared/project-modal.tsx:3 and 103-107
- src/lib/actions.ts:4 and 150-180

Problem:

The current tree also contains:

- DOMPurify 3.4.5, with several moderate advisories. The current code calls the default string sanitizer and does not use the most directly affected IN_PLACE/custom-hook modes, so reachability is reduced but the package is still below the fixed version.
- Nodemailer 8.0.7, with moderate and high advisories. The current call does not expose raw/json transport options and strips CRLF from the subject, which reduces reachability; the package still needs to be patched.
- PostCSS 8.5.14, with high and moderate source-map/path-disclosure advisories, plus a vulnerable nanoid path.
- Sharp 0.34.5 transitively through Next.js, with a high inherited libvips advisory.
- Development-tree brace-expansion and js-yaml denial-of-service advisories.

Why it matters:

Dependency vulnerabilities are part of the deployed and build-time attack surface. The DOMPurify sink is client-side HTML rendering, Nodemailer is reachable through a public form action, and Next/Sharp/PostCSS are used in the request or build pipeline.

Recommended fix:

Update direct packages and regenerate the lockfile. At minimum, test the fixed DOMPurify, Nodemailer, PostCSS, and Next.js releases suggested by npm audit. Use npm ls --omit=dev to distinguish runtime exposure from tooling exposure, but do not ignore development vulnerabilities when CI parses attacker-controlled configuration or runs untrusted contributions. Add automated update monitoring such as Dependabot or Renovate.

### M-02 — Server Action accesses fields before validating the untrusted input shape

Severity: Medium

Confidence: Confirmed code path; malicious reachability is possible through direct Server Action invocation

Locations:

- src/lib/actions.ts:107-123
- src/types/index.ts:59-67

Problem:

submitContactMessage is typed as accepting ContactFormData, but types do not enforce the runtime shape at the Server Action boundary. It calls data.website.trim(), stripTags(data.name), and stripTags(data.message) before safeParse. A crafted action payload containing null, an object, or another non-string value can throw a TypeError and produce a 500 rather than the intended validation response.

Why it matters:

The browser form is not the trust boundary. Anyone can invoke the action endpoint directly. Repeated malformed requests can create noisy errors and consume function execution, and the failure path is less predictable than a normal validation rejection.

Recommended fix:

Accept unknown at the action boundary. First verify that the value is a non-null object, then run contactFormSchema.safeParse on the raw values. Only inspect the honeypot and normalize strings after the shape/type validation succeeds. Keep a conservative maximum request body size at the platform or route layer as well.

### M-03 — Contact rate limiting uses a spoofable composite key in some deployments

Severity: Medium

Confidence: Confirmed code weakness; impact depends on proxy header trust

Locations:

- src/lib/actions.ts:80-85

Problem:

The limiter keys on the first value of x-forwarded-for plus the first 80 characters of User-Agent. User-Agent is trivially changeable, and x-forwarded-for is only trustworthy if the front proxy overwrites or sanitizes it. In a self-hosted or differently configured deployment, a caller can spoof both values. If the headers are absent, all users can collapse onto the shared unknown key.

Why it matters:

An attacker can rotate User-Agent values and possibly IP header values to bypass the five-per-hour limit, causing SMTP abuse. Conversely, an absent or incorrectly configured proxy can cause one client to exhaust the shared bucket for everyone.

Recommended fix:

Use the hosting provider's documented trusted client-IP signal or an edge rate limiter. Key primarily on a trusted IP, with an additional global and/or destination-email budget. Treat forwarded headers as untrusted unless the application is behind a known sanitizing proxy. Verify the behavior in the actual Vercel deployment and in any future self-hosted deployment.

### M-04 — The fallback in-memory limiter can grow without a global bound

Severity: Medium

Confidence: Confirmed code behavior; exploitation depends on a long-lived process

Locations:

- src/lib/actions.ts:11-29

Problem:

The Map stores an array for each distinct key. Expired timestamps are pruned only when that same key is used again. There is no eviction of inactive keys and no maximum number of keys. Because the key includes a changeable User-Agent, an attacker can create many entries.

Why it matters:

On a long-lived Node server this is an unbounded memory-growth path. On serverless Vercel instances the lifetime is shorter, but it is still not a reliable abuse-control design and behaves differently across instances.

Recommended fix:

Prefer a shared/edge limiter. If an in-memory fallback is retained, use a bounded LRU/TTL structure, periodically remove expired keys, cap total keys and per-key timestamps, and record eviction/limit metrics.

### M-05 — Contact availability depends on an unbounded external wait and fails closed

Severity: Medium

Confidence: Possible runtime impact; confirmed missing timeout and fail-closed behavior

Locations:

- src/lib/actions.ts:32-78
- src/lib/actions.ts:92-102
- src/lib/actions.ts:135-180

Problem:

The optional Redis request has no AbortSignal or explicit timeout. Nodemailer's transporter has no explicit connection, greeting, socket, or message timeout. If Redis is configured and unavailable, rateLimit returns false for every submission. If an external request hangs, the Server Action occupies a function invocation until the platform timeout.

The fixed-window Redis pipeline also uses INCR followed by EXPIRE rather than an atomic limiter primitive, and fixed windows permit a burst around the hour boundary.

Why it matters:

A Redis outage or slow SMTP connection can make the main business conversion path unusable. Public callers can also hold execution resources with repeated requests. Fail-closed is defensible for abuse prevention, but it must be an intentional availability trade-off with monitoring and a bounded fallback.

Recommended fix:

Add short, explicit timeouts using AbortController and Nodemailer transport timeout options. Use an atomic/sliding-window or vendor-provided rate limiter. Decide whether Redis is mandatory: if it is optional, use a bounded local fallback and alert rather than silently taking the whole form down; if it is required, fail fast with a clear operational alert. Add structured server-side metrics for rate-limit, Redis, and SMTP failures.

### M-06 — The root layout forces the homepage into dynamic no-store rendering

Severity: Medium

Confidence: Confirmed

Locations:

- src/app/layout.tsx:2, 119-120
- src/proxy.ts:51-61
- src/app/page.tsx:23-24

Problem:

The root layout calls headers() solely to retrieve the per-request CSP nonce. This makes the root route dynamic. The local build lists / as dynamic, and the live response returns private, no-cache, no-store with x-vercel-cache: MISS.

Why it matters:

This is a static portfolio backed by files in the repository, but every homepage request requires server rendering and cannot be reused by the CDN. It increases TTFB, origin work, and cost. The Lighthouse run measured about 543 ms before the page could proceed to the main content.

Recommended fix:

Choose deliberately between a strict per-request nonce and static caching. If strict nonces are required, document the dynamic-rendering cost and add appropriate caching/observability. If the page is intended to be static, use a CSP strategy compatible with static output, such as stable hashes for controlled inline content and externalized scripts where practical, then verify Next-generated scripts and the theme bootstrap. Do not cache a response containing a nonce unless the nonce lifecycle is designed correctly.

### M-07 — The entire project dataset, including case-study bodies, is serialized to the client

Severity: Medium

Confidence: Confirmed

Locations:

- src/app/page.tsx:23-24, 40-42
- src/lib/content.ts:211-233 and 236-269
- src/components/sections/projects-section.tsx:21-23 and 183-234
- src/components/shared/project-modal.tsx:26-27

Problem:

Home loads all published projects and passes the full ProjectWithTechStack objects to a client component. Each object contains content and all image paths, even when the archive is hidden and the modal is closed. The live HTML/RSC response was approximately 180 KB and contained body content for projects that were not visible. There are currently 40 published projects and only four featured projects.

Why it matters:

The browser downloads, parses, retains, and hydrates content that users may never open. Payload size and memory grow linearly with the archive. It also makes the status/content model harder to secure because the client receives more data than the UI needs.

Recommended fix:

Pass a small server-rendered card DTO without content. Load case-study details only after an explicit selection through a route or a server endpoint, or create static project detail routes and let the modal link to them. Consider paginating or virtualizing a large archive. Keep unpublished content entirely out of the client response.

### M-08 — Excessive client-side animation and broad client boundaries create measurable main-thread cost

Severity: Medium

Confidence: Confirmed performance symptom; exact contribution of each component needs profiling

Locations:

- src/app/page.tsx:1-20 and 27-71
- src/components/sections/projects-section.tsx:1-4 and 35-39
- src/components/shared/floating-nav.tsx:1-4 and 68-246
- src/components/shared/page-transition.tsx:1-23
- src/components/shared/scroll-progress-bar.tsx:1-18
- src/components/shared/scroll-to-top.tsx:1-36

Problem:

The page is composed of many client components and Framer Motion instances, including below-the-fold sections, card animations, navigation animation, page transition, scroll progress, and theme animation. Lighthouse attributed approximately 6.2 seconds to main-thread work and approximately 2.9 seconds of total blocking time on its throttled mobile run. The largest script was attributed roughly 2.8 seconds of boot-up/evaluation, with estimated unused JavaScript as well.

Why it matters:

The page can look complete before it is responsive to input. This is especially relevant for a portfolio whose primary conversion action is navigating to projects or contacting the owner.

Recommended fix:

Keep content and structural sections server-rendered where possible. Use CSS transitions for simple entrance/hover effects, load the project modal and contact enhancement only when needed, avoid page-wide motion wrappers when they do not provide business value, and profile production bundles with a real mobile device. Measure field LCP, INP, and long tasks after each change.

### M-09 — Below-the-fold images are all marked priority

Severity: Medium

Confidence: Confirmed

Locations:

- src/components/sections/projects-section.tsx:43-52
- src/components/sections/about-section.tsx:72-78

Problem:

Every featured project card uses priority, and the profile image in the About section also uses priority. The live document emitted five image preloads: the profile image plus all four featured project images. Several are below the initial viewport.

Why it matters:

Priority images compete with the hero text, fonts, and other critical resources. This increases network contention without improving the actual LCP element; Lighthouse identified the hero heading, not a project image, as LCP.

Recommended fix:

Prioritize only the actual above-the-fold LCP asset, if there is one. Let below-the-fold cards and the profile image lazy-load. Recheck preload count and LCP on mobile after the change.

### M-10 — Mutable public project paths are cached as immutable for one year

Severity: Medium

Confidence: Confirmed

Locations:

- next.config.mjs:3-8 and 16-25

Problem:

The /projects/:path\* rule applies public, max-age=31536000, immutable to every project path, not just content-hashed image files. The live response confirmed the same header for project JSON, Markdown, and raw JPEG assets.

Why it matters:

Changing a project image, correcting metadata, or removing a draft file can leave stale content in browser and CDN caches for up to a year. This is particularly harmful for the H-01 public draft-content exposure.

Recommended fix:

Use content-hashed filenames for immutable assets and short/revalidation caching for metadata and Markdown. Narrow the header rule to the actual versioned asset paths, or set cache policy per resource type. Purge existing immutable entries when removing exposed content.

### M-11 — The CSP blocks next-themes initialization because its nonce is not propagated

Severity: Medium

Confidence: Confirmed live runtime defect

Locations:

- src/proxy.ts:51-61
- src/app/layout.tsx:119-140
- src/app/providers.tsx:6-17

Problem:

Proxy generates a nonce and places it in x-nonce. The layout reads it and passes it to the JSON-LD and custom Analytics scripts, but Providers does not receive it and NextThemesProvider is rendered without a nonce. The live browser reported an inline-script CSP violation for the next-themes bootstrap script. The script had an empty nonce while the response policy required a generated nonce.

Why it matters:

The bootstrap is intended to set the theme before React paints. Blocking it can produce a flash or incorrect initial theme, and the live page emits a console error on every load. The toggle can still work after hydration, which makes the defect easy to miss in manual testing.

Recommended fix:

Pass the nonce from RootLayout through Providers and set the next-themes nonce prop. The installed next-themes type definitions support a nonce property. Add a production browser smoke test that asserts no CSP console errors and verifies dark/light initialization before and after hydration.

### M-12 — Canonical, redirect, robots, and sitemap origins disagree

Severity: Medium

Confidence: Confirmed live SEO/configuration defect

Locations:

- src/lib/site.ts:1-21 and 25-31
- src/app/layout.tsx:46-49 and 71-84
- src/app/robots.ts:10-12
- src/app/sitemap.ts:4-12
- deployment environment value for NEXT_PUBLIC_APP_URL

Problem:

The apex URL redirects to https://www.marcstampfli.com/, but the live page canonical and Open Graph URL are https://marcstampfli.com/. Live robots.txt and sitemap.xml also advertise the apex origin.

Why it matters:

Search engines can consolidate a redirecting canonical, but inconsistent origins waste crawl and social-preview signals and make operational debugging harder. A future preview or alternate host can inherit the wrong origin as well.

Recommended fix:

Choose one canonical origin. Configure the Vercel/domain redirect, NEXT_PUBLIC_APP_URL, metadataBase, canonical, Open Graph URL, robots sitemap, and sitemap URLs to the same origin. Verify both apex and www with curl and a crawler after deployment.

### M-13 — Project case studies have no crawlable detail URLs

Severity: Medium

Confidence: Confirmed

Locations:

- src/app/sitemap.ts:4-12
- src/components/sections/projects-section.tsx:57-62 and 105-146
- src/components/shared/project-modal.tsx:26-30 and 101-107
- absence of src/app/projects/[slug]/page.tsx

Problem:

The only sitemap entry is the homepage. Project details are revealed through client-side modal state, and the modal is dynamically imported with SSR disabled. There are no individual project routes, metadata, canonical URLs, or structured data for the 40 published projects.

Why it matters:

Case-study body content is not independently shareable, bookmarkable, indexable, or attributable to a specific URL. Search engines can see some card text, but the most valuable project narrative is hidden behind a client interaction. This reduces long-tail SEO and makes campaign/social links less useful.

Recommended fix:

Create /projects/[slug] pages with generateStaticParams, server-rendered content, per-project metadata, canonical URLs, Open Graph images, and appropriate JSON-LD. Link cards to those pages and optionally enhance the link into a modal on the same page. Include only published projects in the sitemap.

### M-14 — Each featured card exposes two duplicate case-study buttons

Severity: Medium

Confidence: Confirmed

Locations:

- src/components/sections/projects-section.tsx:57-62
- src/components/sections/projects-section.tsx:105-146

Problem:

The image area contains a full overlay button, and the card body contains another full-width button that opens the same project modal. The live DOM exposes both controls for every featured project.

Why it matters:

Keyboard and screen-reader users encounter duplicate actions with different accessible names. It adds unnecessary tab stops and makes the card interaction model ambiguous. It can also make future nested-link changes invalid.

Recommended fix:

Use one semantic control for the case-study action. Make the card body a single link/button, or use one card-level action with the image as presentation. Keep external live/source links as separate, clearly labeled controls outside the primary control's interactive region.

### M-15 — Reduced-motion support is inconsistent and misses Framer Motion

Severity: Medium

Confidence: Confirmed code behavior

Locations:

- src/components/sections/projects-section.tsx:35-39 and 240-244
- src/components/sections/experience-section.tsx:33-37
- src/components/shared/floating-nav.tsx:68-72 and 146-239
- src/components/shared/page-transition.tsx:11-18
- src/components/shared/scroll-progress-bar.tsx:6-16
- src/components/shared/scroll-to-top.tsx:20-27
- src/components/shared/theme-toggle.tsx:26-36
- src/app/globals.css:268-308

Problem:

The CSS animation classes honor prefers-reduced-motion, and some sections call useReducedMotion, but many Framer Motion components still start from opacity/transform values and animate for users who request reduced motion. Scroll progress, page transition, nav, theme, project, and several section-heading animations are not consistently disabled.

Why it matters:

Users with vestibular or cognitive accessibility needs can still receive movement, opacity changes, and animated navigation. It also creates inconsistent behavior across sections.

Recommended fix:

Centralize a reduced-motion-aware motion configuration or use useReducedMotion in every animated component. Set initial and animate values to their final state when reduction is requested. Prefer no transform animation in that mode.

### M-16 — Smooth scrolling is unconditional and ignores reduced-motion preference

Severity: Medium

Confidence: Confirmed code behavior

Locations:

- src/app/globals.css:71-76
- src/components/shared/floating-nav.tsx:47-63
- src/components/shared/skip-to-content.tsx:10-18
- src/components/shared/scroll-to-top.tsx:16

Problem:

html always has scroll-behavior: smooth, and programmatic navigation always passes behavior: smooth. None of these paths check prefers-reduced-motion.

Why it matters:

A reduced-motion preference is not honored for one of the most noticeable motion effects on the page. It can make keyboard navigation and skip links feel slow or disorienting.

Recommended fix:

Override html scroll-behavior to auto in a reduced-motion media query and choose behavior conditionally in JavaScript. For the skip link, move focus and content without forcing a smooth animation.

### M-17 — The brand button fails the visible-label/ARIA-label consistency audit

Severity: Medium

Confidence: Confirmed Lighthouse audit

Locations:

- src/components/shared/floating-nav.tsx:75-91

Problem:

The button visibly contains “MS” and “Marc Stämpfli” but declares aria-label="Scroll to home". Lighthouse flagged label-content-name-mismatch. Voice control users may try to activate the visible label and fail because the accessible name does not contain it.

Why it matters:

This is a WCAG 2.5.3-style speech-input and labeling problem on a prominent control.

Recommended fix:

Remove the aria-label and let the visible text name the button, or use a label that contains the visible text, for example “Marc Stämpfli — scroll to home”.

### M-18 — The contact form has no safe progressive-enhancement path

Severity: Medium

Confidence: Possible edge-case privacy defect; confirmed form structure

Locations:

- src/components/form/contact-form.tsx:145-155
- src/components/form/contact-form.tsx:50-73
- src/lib/actions.ts:107-148

Problem:

The form uses only a client-side onSubmit handler, has no action or method, and explicitly sets noValidate. If JavaScript fails, is disabled, or hydration is interrupted, a browser can fall back to a default GET submission to the current page, potentially placing name, email, message, and honeypot values in the URL/history. Native browser validation is also disabled in that state.

Why it matters:

The contact form is the primary conversion path. A CSP/runtime regression or blocked JavaScript can turn a failed submission into a privacy leak or a non-functional form.

Recommended fix:

Use a real POST/server-action form boundary with a FormData-compatible action and use client enhancement for pending/success state. Keep server validation authoritative. If a no-JavaScript path is intentionally unsupported, prevent a default GET explicitly and provide a clear fallback mailto or server-rendered error rather than silently submitting fields.

### M-19 — There is no automated application test suite

Severity: Medium

Confidence: Confirmed

Locations:

- package.json:6-16
- .github/workflows/ci.yml:25-40
- no unit, integration, or end-to-end test files in the repository

Problem:

npm test is only an alias for validate:content. CI checks formatting, lint, types, audit, and build, but does not test the contact action, rate-limit behavior, CSP/theme initialization, keyboard navigation, modal focus, responsive navigation, metadata, or published/draft URL isolation.

Why it matters:

The current live CSP defect, duplicate control defect, and raw public draft exposure would not be caught by the existing suite. Content validation passing is not application behavior coverage.

Recommended fix:

Add unit tests for schemas, date formatting, content status filtering, safe HTML serialization, and rate limiting. Add Playwright tests for no console errors, theme initialization, form validation, mobile nav, skip link, modal focus/close, canonical metadata, and direct unpublished-content denial. Add accessibility checks with axe and a small performance budget for LCP/INP/JS transfer.

### M-20 — Content validation is not part of the production build command

Severity: Medium

Confidence: Confirmed process gap

Locations:

- package.json:8-16
- README.md:57-63
- .github/workflows/ci.yml:25-40

Problem:

CI runs validate:content before the build, but the configured production build is only npm run build, and Vercel is documented to use that command. A direct deployment or local production build can therefore skip the validator. Runtime content loading has its own Zod checks, but public asset exposure and other content invariants remain outside the build contract.

Why it matters:

The deployment pipeline can accept content that the repository's own test command would reject. The status filtering problem also shows why content validation needs to include publication-safety rules, not only shape checks.

Recommended fix:

Make the production build command run content validation first, or configure Vercel to run a single CI-equivalent command. Add duplicate-slug, directory/slug, date-order, published-asset, field-length, and publication-safety checks. Keep CI as a separate gate.

### M-21 — Date and content invariants are incomplete

Severity: Improvement / possible business-logic defect

Confidence: Confirmed validation gap; current checked data is valid

Locations:

- src/lib/content.ts:44-46 and 81-100
- src/lib/date-utils.ts:7-79
- scripts/validate-content.mjs:70-81 and 102-238

Problem:

Dates are checked only for parseability. Experience endDate is not required to be after startDate. calculateDuration approximates every month as 30.44 days and can produce misleading values for boundary dates or an end date before the start date. formatDateRange uses the server's locale/time-zone conversion for date-only strings. The validator also does not detect duplicate slugs or validate all array element types and content length constraints.

Why it matters:

A future content edit can silently produce a negative or inaccurate career period, duplicate React IDs, incorrect asset paths, or unexpected sorting without failing CI.

Recommended fix:

Use a calendar-date representation for year/month employment data, validate endDate >= startDate, and test boundary cases. Add duplicate slug detection, strict array element schemas, maximum content lengths, and all cross-field constraints to the shared schema used by both the runtime and validator.

### M-22 — Experience logo paths allow traversal-like and arbitrary absolute public paths

Severity: Medium

Confidence: Possible future content-security issue; current repository content is trusted

Locations:

- src/lib/content.ts:18-20 and 176-189
- scripts/validate-content.mjs:9-11 and 83-100

Problem:

experienceLogoSchema permits slash characters, .. segments, and a leading slash. resolveExperienceLogo returns leading-slash values without existence or root checks, and joins other values against the experience directory. The validator has the same permissive pattern.

Why it matters:

Today this is repository-controlled content and the files are already public, so it is not a demonstrated remote exploit. If content is later edited by a CMS, form, or less-trusted contributor, the path can reference unintended public assets or route-like paths and bypass the intended experience asset boundary.

Recommended fix:

Use a filename-only schema for local logos, or resolve with path.resolve/realpath and verify the result remains below experiencesRootDir. Validate existence for every form, including absolute-looking inputs. Keep remote images out unless explicit remote patterns and URL validation are added.

### M-23 — Synchronous content discovery runs on every dynamic request

Severity: Medium

Confidence: Confirmed architecture; current impact is small but scales linearly

Locations:

- src/lib/content.ts:3-5 and 11-12
- src/lib/content.ts:192-249
- src/lib/content.ts:272-331
- src/app/page.tsx:23-24

Problem:

The page reads directories, parses every project JSON file, checks asset existence, reads Markdown, and performs the same work using synchronous filesystem calls. React cache() provides request memoization; it is not a persistent cache across the no-store server requests caused by the dynamic root layout.

Why it matters:

Each request blocks the Node event loop while work grows with the number of projects and assets. It is acceptable at the current size but becomes a direct latency and concurrency bottleneck if the archive grows or the app is self-hosted on a long-lived process.

Recommended fix:

Build a content manifest at build time, import validated metadata, or use a persistent Next/Vercel cache with an explicit revalidation policy. Generate static pages for repository-backed content where possible. If runtime filesystem reads must remain, use asynchronous APIs and avoid repeated directory scans.

## Lower-severity maintainability and hardening findings

### I-01 — Unused dependencies, assets, and exports add maintenance noise

Severity: Low / Improvement

Confidence: Confirmed by Knip/source scan

Locations:

- package.json:43 and 52
- public/images/placeholder.svg
- public/images/particle.svg
- src/components/sections/projects-section.tsx:183 and 354
- src/components/ui/badge.tsx:7 and 32
- src/components/ui/button.tsx:8 and 54
- src/components/ui/dialog.tsx:117-120
- src/lib/date-utils.ts:7 and 49
- src/types/index.ts:75

Problem:

Knip identified unused dev dependencies @types/dompurify and eslint-plugin-prettier, plus externally unused exports such as buttonVariants, badgeVariants, the named ProjectsSection export, and several re-exported helpers. The two SVG assets were not referenced by source. Some dialog exports may be intentional public primitives, so those should be confirmed before removal.

Why it matters:

Dead dependencies increase install size and audit noise. Dead exports and assets make it harder to know which APIs are supported and which files can safely be changed.

Recommended fix:

Remove demonstrably unused packages and assets, or document intentional public exports. Run Knip in CI after establishing a small allowlist for deliberate exports.

### I-02 — Build-time dependencies are not cleanly separated from application dependencies

Severity: Improvement

Confidence: Confirmed

Locations:

- package.json:22
- tailwind.config.ts:3 and 95
- postcss.config.mjs:1
- src/lib/content.ts:1

Problem:

@tailwindcss/typography is listed under dependencies even though it is consumed only by the Tailwind build configuration. Knip also reports postcss-load-config in a type-only JSDoc reference and server-only as unlisted. The current build succeeds because Next provides bundler behavior, but the dependency contract is unclear.

Why it matters:

Production installs carry build-only packages, and a different package-manager layout or tool can fail to resolve an undeclared type-only or marker dependency.

Recommended fix:

Move Tailwind plugins to devDependencies. Add server-only explicitly if it is an intentional package boundary, and either declare postcss-load-config for the JSDoc type or remove the type reference. Re-run npm ci, build, and the production dependency tree after cleanup.

### I-03 — The fallback image is a transparent 1x1 pixel

Severity: Low

Confidence: Confirmed

Locations:

- src/components/shared/optimized-image.tsx:22-49
- public/images/particle.png

Problem:

On image error, OptimizedImage swaps to /images/particle.png, a 1x1 transparent PNG. The component does not render a visible error state or the existing PlaceholderImage.

Why it matters:

Broken portfolio images become blank spaces, making content loss hard to notice and less understandable to users. Operators also receive no production signal unless an onError callback is supplied.

Recommended fix:

Render the placeholder/error state after a failed load, preserve layout dimensions, and report the source URL in controlled client telemetry or a development-only warning.

### I-04 — A global GPU transform is applied to every image

Severity: Improvement

Confidence: Possible performance cost

Locations:

- src/app/globals.css:146-151

Problem:

Every img receives backface-visibility hidden and transform: translateZ(0), regardless of whether it animates.

Why it matters:

Unnecessary transforms can create compositor layers and increase memory or compositing work on image-heavy pages. It is not a demonstrated dominant Lighthouse issue, but it is a poor global default.

Recommended fix:

Remove the global transform and add a narrowly scoped will-change/transform class only to elements that actually animate.

### I-05 — Tailwind preflight is disabled without a documented reset strategy

Severity: Improvement

Confidence: Confirmed configuration choice

Locations:

- tailwind.config.ts:7-10
- src/app/globals.css:62-177

Problem:

Preflight is disabled. The stylesheet recreates some resets but not the full normalization and form/accessibility defaults supplied by Tailwind.

Why it matters:

New content or components can inherit browser-specific margins, button appearance, field sizing, and typography behavior. This increases maintenance cost and cross-browser drift.

Recommended fix:

Either re-enable preflight and explicitly override the few desired defaults, or document and test a complete intentional reset. Add visual checks for forms, headings, lists, and focus states.

### I-06 — Parallax hooks are created before the reduced/mobile early returns

Severity: Improvement

Confidence: Possible small performance cost

Locations:

- src/components/background/parallax-background.tsx:17-34 and 36-63

Problem:

useScroll, useTransform, and useSpring are initialized even when reduced motion or mobile mode immediately returns the non-parallax branch.

Why it matters:

The component can still allocate motion values and attach work that is not used on devices where the feature is disabled.

Recommended fix:

Split the component into a static branch and a desktop parallax branch, or gate the parallax hook tree behind a child component rendered only when enabled.

### I-07 — Scroll handlers and delayed scrolling are not optimized or canceled

Severity: Low / Improvement

Confidence: Possible

Locations:

- src/components/shared/floating-nav.tsx:16-21 and 47-63
- src/components/shared/scroll-to-top.tsx:10-14

Problem:

Scroll events call React state setters directly, and the mobile navigation schedules a 260 ms timeout without retaining or canceling it on unmount.

Why it matters:

This is minor with the current page, but scroll-driven work can become noisy on slower devices and a delayed callback can target stale DOM/state during route or component teardown.

Recommended fix:

Use requestAnimationFrame/throttling for scroll state, avoid updating when the value is unchanged, and clear the timeout in the effect lifecycle. Prefer an IntersectionObserver or CSS where suitable.

### I-08 — Fragment navigation uses aria-current="page"

Severity: Low / Improvement

Confidence: Confirmed semantics issue

Locations:

- src/components/shared/floating-nav.tsx:98-110 and 201-213

Problem:

The navigation points to sections on one document, but the active link uses aria-current="page". The appropriate token for a location within a page is generally location.

Why it matters:

Assistive technologies can announce the active item as a page rather than the current section/location, reducing semantic accuracy.

Recommended fix:

Use aria-current="location" for section navigation and add a regression check for both desktop and mobile nav.

### I-09 — Theme toggle does not expose state

Severity: Low / Improvement

Confidence: Confirmed markup gap

Locations:

- src/components/shared/theme-toggle.tsx:16-25

Problem:

The control says Toggle theme but does not expose whether it is currently pressed or which theme will be selected.

Why it matters:

Screen-reader users receive a generic action without state feedback. The icon is decorative and the label is not updated.

Recommended fix:

Use aria-pressed or a state-specific accessible name such as Switch to light theme / Switch to dark theme. Keep the current visual icon synchronized.

### I-10 — The error boundary logs only to the browser console

Severity: Low / Improvement

Confidence: Confirmed

Locations:

- src/app/error.tsx:14-17

Problem:

The comment says the error is logged to an error reporting service, but the implementation only calls console.error. Production errors are not centrally correlated or alerted.

Why it matters:

The owner may not know when a content parse, client hydration, or interaction failure affects visitors. Console logs disappear with the user's session.

Recommended fix:

Integrate an error-monitoring service or a privacy-conscious server-side reporting endpoint. Include the Next digest and route context, but never send contact form contents or secrets.

### I-11 — CSP is broader than necessary in image, font, and style sources

Severity: Improvement

Confidence: Possible defense-in-depth concern

Locations:

- src/proxy.ts:25-43

Problem:

img-src and font-src allow any HTTPS origin, and style-src allows unsafe-inline. The application currently uses local images/fonts plus known analytics endpoints, and no remote image patterns are configured.

Why it matters:

A broad CSP provides weaker containment if a future injection or third-party dependency compromise appears. unsafe-inline is not needed for scripts, but broad style/image policies still increase allowed behavior.

Recommended fix:

Inventory actual origins and narrow each directive. Keep the strict script nonce. Remove unsafe-inline only after verifying Next, theme, and animation styles; if inline styles are required, use hashes or a deliberate documented exception.

### I-12 — HSTS preload assumes every current and future subdomain is HTTPS

Severity: Improvement

Confidence: Possible operational concern

Locations:

- next.config.mjs:35-36

Problem:

The response sends includeSubDomains; preload. This is safe only if every relevant subdomain is permanently HTTPS and the domain is intentionally committed to preload behavior.

Why it matters:

An HTTP-only future subdomain or third-party service on a subdomain can become unreachable for users after preload processing. This is an operational commitment rather than an application bug.

Recommended fix:

Verify all subdomains and DNS ownership before submitting or retaining preload. Keep the policy if that commitment is intentional; otherwise remove preload or use a staged max-age rollout.

### I-13 — Social metadata uses a square profile photo for a large-image card

Severity: Improvement

Confidence: Possible social-preview quality issue

Locations:

- src/app/layout.tsx:71-90
- src/lib/site.ts:31
- public/profile.jpg (800x800)

Problem:

The Twitter metadata requests summary_large_image, but the configured Open Graph image is an 800x800 square profile photo. Platforms may crop it unpredictably or render it with unused space.

Why it matters:

Shared project/profile links can have weak or inconsistent previews, reducing click-through quality.

Recommended fix:

Create a dedicated 1200x630 or platform-appropriate social image, set width/height/type metadata, and use a clear alt description. Keep the profile photo for the Person image if desired.

### I-14 — Open Graph locale and robots Host are questionable defaults

Severity: Improvement

Confidence: Possible

Locations:

- src/app/layout.tsx:71-74
- src/app/robots.ts:4-12

Problem:

Open Graph locale is hard-coded to en_US while the site identifies Trinidad and Tobago. robots() emits a Host directive with a full scheme URL, which is not a broadly supported robots standard and may be ignored.

Why it matters:

These are small metadata quality issues, but incorrect locale/context and non-standard directives make crawler behavior less predictable.

Recommended fix:

Use the actual audience locale if en_TT is intended, or omit the locale if the audience is intentionally global. Omit Host unless a specific crawler requires it; keep a correct Sitemap URL.

### I-15 — Analytics is enabled without a visible consent/privacy strategy

Severity: Improvement / possible compliance concern

Confidence: Possible; jurisdiction and intended audience need verification

Locations:

- src/app/layout.tsx:137-140
- src/components/shared/analytics.tsx:21-49
- src/lib/site.ts:25-39

Problem:

When a GA measurement ID is configured, Google Analytics loads automatically. The repository contains no consent mechanism, privacy policy link, or documented retention/configuration policy. The ID is also interpolated into an inline JavaScript string.

Why it matters:

Analytics can create privacy, cookie, and consent obligations depending on the operator's jurisdiction and audience. Environment-controlled interpolation is not user-controlled in the current deployment, but malformed configuration can break the script.

Recommended fix:

Confirm the legal/privacy requirements for the intended audience, add a privacy notice and consent flow if required, and configure GA for minimal collection. Validate the measurement ID format before rendering and avoid interpolating arbitrary values into JavaScript where an API can accept a value safely.

### I-16 — Local environment file permissions are too broad for secrets

Severity: Low / possible local security issue

Confidence: Confirmed file mode; no password value was present during review

Locations:

- .env.local (ignored by Git), mode 0644
- .gitignore:19-24

Problem:

The local environment file is world-readable on the filesystem. It currently did not contain a populated Gmail app password, but the file is intended to hold one.

Why it matters:

Any other local account or process with filesystem access could read the credential if it is later populated. Git ignore rules prevent accidental commits but do not protect local file permissions.

Recommended fix:

Set the file to mode 0600, use the platform secret store for deployment, and keep actual credentials out of logs, screenshots, shell history, and public content. Continue verifying with git diff and git ls-files before commits.

### I-17 — Node and browser-data versions are not pinned tightly enough

Severity: Improvement

Confidence: Confirmed configuration gap

Locations:

- package.json:60-63
- .github/workflows/ci.yml:16-20
- build output Browserslist warning

Problem:

CI runs Node 20 while the local environment used Node 26.3.0. The package only declares Node >=20, and no .nvmrc or .node-version is present. Build also reports caniuse-lite data that is several months old.

Why it matters:

Different Node majors can expose framework, dependency, or build differences. Stale browser data can produce less accurate compatibility/transpilation decisions.

Recommended fix:

Choose a supported Node major, pin it in CI, Vercel, and a repository version file, and update the lockfile/browser database intentionally. Test the selected version rather than relying on a broad lower bound.

### I-18 — The installable manifest implies a standalone app without offline support

Severity: Improvement

Confidence: Possible product expectation issue

Locations:

- src/app/manifest.ts:3-35
- absence of a service worker

Problem:

The manifest sets display to standalone, but the repository has no service worker, offline fallback, or installability strategy.

Why it matters:

Users who install the site may reasonably expect app-like behavior, while the current result is only a browser shell around an online page. This is not a security defect.

Recommended fix:

Either treat the manifest as a simple metadata convenience and ensure the UX is acceptable, or implement and test a real PWA strategy with clear cache invalidation and offline behavior.

### I-19 — Server-compatible primitives are marked client unnecessarily

Severity: Improvement

Confidence: Possible bundle/architecture cost

Locations:

- src/components/ui/button.tsx:1
- src/components/ui/badge.tsx:1
- src/components/timeline/background-effect.tsx:1

Problem:

Button, Badge, and BackgroundEffect do not themselves need browser hooks, but are marked use client. This pushes otherwise presentational modules into client boundaries and reduces server-component composability.

Why it matters:

Small boundaries can increase client graph size and make it harder to keep static routes, errors, and metadata server-rendered.

Recommended fix:

Remove use client from components that do not require it, provided their imports remain server-compatible. Keep interactive composition in explicitly client-marked parents and measure the resulting bundles.

### I-20 — The custom Markdown renderer is intentionally limited but undocumented as such

Severity: Improvement

Confidence: Possible content-maintenance issue

Locations:

- src/lib/content.ts:126-160
- README.md:42-44

Problem:

renderSimpleMarkdown supports paragraphs, h2/h3, unordered lists, and bold text only. It silently collapses unsupported Markdown constructs such as links, ordered lists, code blocks, blockquotes, and nested structure into plain paragraph text.

Why it matters:

Future content authors may reasonably assume body.md is normal Markdown and publish content that renders incorrectly. The browser-side sanitizer does not restore lost structure.

Recommended fix:

Either document the supported subset in the template or use a well-tested Markdown parser with an explicit safe HTML policy. Add fixture tests for headings, lists, links, malformed input, and script-like content.

### I-21 — Sitemap last-modified metadata is build-time noise

Severity: Improvement

Confidence: Confirmed implementation; SEO impact is possible

Locations:

- src/app/sitemap.ts:4-10

Problem:

The only sitemap entry uses new Date() for lastModified. That value represents when the sitemap was generated, not when the homepage content actually changed. The live sitemap can therefore advertise a fresh change after every build, or remain stale until the next build.

Why it matters:

Search engines may spend crawl budget rechecking an unchanged page, while a content change does not get an accurate last-modified signal. This is separate from the missing project URLs described in M-13.

Recommended fix:

Use a content-derived or commit-derived timestamp, update it when published content changes, or omit lastModified when there is no reliable source. Add project route entries once detail pages exist.

### I-22 — Invalid or local site URLs silently fall back to the production origin

Severity: Low / Improvement

Confidence: Possible preview and staging SEO/configuration issue

Locations:

- src/lib/site.ts:1-21
- README.md:25-34
- .env.example:1-4

Problem:

normalizeSiteUrl maps localhost and 127.0.0.1 to the production URL and silently falls back to the production URL for any invalid or missing value. This is convenient for local development but makes misconfigured preview/staging deployments emit production canonical, Open Graph, robots, and sitemap URLs without failing fast.

Why it matters:

A preview host can accidentally claim the production URL or be indexed with production metadata. Configuration errors become hard to diagnose because the application continues with a plausible value.

Recommended fix:

Use an explicit development fallback only in development, require a valid production URL at build/deploy time, and fail CI or deployment on an invalid value. Ensure previews are noindex or use a deliberate preview origin.

## Recommended remediation order

### P0 — Address before the next production release

1. Remove draft/unpublished JSON and Markdown from public/ and purge existing immutable cache entries.
2. Upgrade Next.js and the dependency tree to patched versions; restore a green CI audit.
3. Propagate the CSP nonce to next-themes and add a live browser assertion for zero CSP console errors.
4. Align the canonical origin, redirect, robots, sitemap, metadataBase, and deployment environment.
5. Validate raw Server Action input before field access and add bounded contact timeouts/rate limiting.

### P1 — Address immediately after the security fixes

1. Split card metadata from case-study content and create crawlable project detail routes.
2. Reduce client-side Framer Motion work and remove unnecessary image priorities.
3. Fix duplicate card controls, visible-label mismatch, and all reduced-motion/smooth-scroll paths.
4. Add Playwright/axe coverage for the live failure modes identified here.
5. Make content validation part of the production build and extend cross-field validation.

### P2 — Cleanup and hardening

1. Remove dead dependencies/assets/exports and clarify server/build dependency boundaries.
2. Pin Node/browser-data versions and add dependency update automation.
3. Improve error monitoring, analytics privacy documentation, social metadata, and PWA intent.
4. Document the content schema and supported Markdown subset.

## Positive controls observed

The review also confirmed the following good practices:

- Strict TypeScript settings and no unused local/parameter errors
- Zod validation on content and contact data
- CRLF stripping for the contact subject and HTML escaping before email HTML insertion
- DOMPurify at the only direct HTML rendering sink found
- Local image validation that rejects remote URLs in the project image path
- No dangerous remote image patterns or dangerouslyAllowSVG configuration
- X-Frame-Options DENY, frame-ancestors none, nosniff, restrictive referrer policy, and Permissions-Policy
- External links use noopener noreferrer
- Radix Dialog provides focus management and the live modal had a valid title, description, and close control
- Live page has a single H1, meaningful section headings, form labels, non-empty image alt text, and zero observed layout shift in the Lighthouse run

These controls reduce risk but do not resolve the findings above, especially the public content boundary, framework version, CSP nonce propagation, or client/data architecture.
