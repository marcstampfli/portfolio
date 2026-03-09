# Marc Stämpfli — Portfolio

Personal portfolio site built with Next.js. Flat-file content, no database.

Live at [marcstampfli.com](https://marcstampfli.com)

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + Framer Motion
- Nodemailer + Gmail SMTP (contact form)

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values before running.

## Environment Variables

| Variable                        | Required | Description                                            |
| ------------------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`           | Yes      | Full URL of the site (e.g. `https://marcstampfli.com`) |
| `GMAIL_USER`                    | Yes      | Gmail address used to send contact form emails         |
| `GMAIL_APP_PASSWORD`            | Yes      | Gmail App Password (not your account password)         |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No       | Google Analytics measurement ID                        |

Set these in Vercel under Project → Settings → Environment Variables.

## Content

### Projects

Each project lives in its own folder under `public/projects/<slug>/`:

- `project.json` — required, all project metadata
- `body.md` — optional, longer case-study content shown in the modal
- Images — referenced by filename in `project.json`

Copy `public/projects/_template` to get started.

### Experience

Each role lives in `public/experiences/<slug>/`:

- `experience.json` — required
- Logo image — optional, referenced in the JSON

Copy `public/experiences/_template` to get started.

## Deployment

Deploys automatically to Vercel on push to `main`.

Build command: `npm run build`
Output: `.next`
Node: `>=20`
