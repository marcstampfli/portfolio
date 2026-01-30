# Marc Stampfli Portfolio

My personal portfolio website built with Next.js, showcasing my work and experience as a full-stack developer.

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- TailwindCSS + Framer Motion
- Prisma + PostgreSQL
- React Query

## Development

```bash
# Install dependencies
npm install

# Start database
docker compose up -d

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit [marcstampfli.com](https://marcstampfli.com)
