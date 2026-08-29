# Marc Stämpfli — Portfolio

Personal portfolio site built with Next.js. Flat-file content, no database.

Live at [www.marcstampfli.com](https://www.marcstampfli.com)

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Nodemailer + Gmail SMTP (contact form)

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values before running.

## Environment Variables

| Variable                        | Required   | Description                                              |
| ------------------------------- | ---------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`           | Yes        | Full canonical URL (e.g. `https://www.marcstampfli.com`) |
| `GMAIL_USER`                    | Yes        | Gmail address used to send contact form emails           |
| `GMAIL_APP_PASSWORD`            | Yes        | Gmail App Password (not your account password)           |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No         | Google Analytics measurement ID                          |
| `UPSTASH_REDIS_REST_URL`        | Production | Shared Redis REST URL for contact rate limiting          |
| `UPSTASH_REDIS_REST_TOKEN`      | Production | Shared Redis REST token for contact rate limiting        |

Set these in Vercel under Project → Settings → Environment Variables.
The shared Upstash variables are required for the contact form in production; local development
uses a bounded in-memory fallback.

## Content

### Projects

Each project lives in its own folder under `src/content/projects/<slug>/`:

- `project.json` — required, all project metadata
- `body.md` — optional, longer case-study content shown on the project page
- Image assets — kept under `public/projects/<slug>/` and referenced by filename in `project.json`

Copy `src/content/projects/_template` to get started. Content metadata is intentionally kept out of
`public` so drafts and case-study copy are not directly downloadable.
Set `status` explicitly; only `published` projects are rendered or included in the sitemap.
Images for unpublished projects can be kept under `src/private-project-assets/<slug>/`; move
them to the matching `public/projects/<slug>/` directory when the project is published.

Case-study `body.md` files intentionally support a small Markdown subset: paragraphs, `##`/`###`
headings, unordered lists, and `**bold**` text. Other Markdown syntax is rendered as plain text.

### Experience

Each role lives in `src/content/experiences/<slug>/`:

- `experience.json` — required
- Logo assets — kept under `public/experiences/<slug>/` and referenced by filename

Copy `src/content/experiences/_template` to get started.

## Deployment

Deploys automatically to Vercel on push to `main`.

Build command: `npm run build`
Output: `.next`
Node: `22.x` (see `.nvmrc`)

Production HTML uses a request-specific CSP nonce, so the homepage and project detail pages are
intentionally server-rendered. Project metadata and case-study content are cached separately for
one hour; do not add a public HTML cache rule to these routes.
Vercel preview deployments are marked `noindex` and disallowed in `robots.txt`; set the canonical
URL separately for each environment when sharing previews.

## Checks

```bash
npm test
npm run format:check
npm run lint
npm run type-check
npm run knip
npm audit --audit-level=low
npm run build

# Run after npm run build; requires a Chromium browser.
npx playwright install chromium
npm run test:e2e
```
