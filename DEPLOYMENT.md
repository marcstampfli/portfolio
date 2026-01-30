# Deployment Guide

## Environment Variables

The following environment variables need to be set in your deployment platform (Vercel):

### Required Variables

```bash
# Database - Standard PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Application URL
NEXT_PUBLIC_APP_URL="https://marcstampfli.com"

# Email (for contact form)
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Prisma Accelerate (optional)
ACCELERATE_URL="prisma://..."

# Node environment
NODE_ENV="production"
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Build command: `npm run build`
4. Output directory: `.next`
5. Install command: `npm install`

### Database Setup

The project uses Prisma with PostgreSQL. Run migrations before first deployment:

```bash
npx prisma migrate deploy  # Apply migrations in production
npx prisma generate        # Generate Prisma client
```

### Build Process

```bash
npm run build     # Creates optimized production build
npm run start     # Starts production server
npm run lint      # Runs ESLint
npx tsc --noEmit  # Type check
```

### Key Features

- Server Actions for data fetching (no API routes)
- 3D tilt effect project cards
- Slide-out project modal
- GPU-accelerated animations with reduced motion support
- Responsive design
- Contact form with Resend email integration

### Bundle Size

- First Load JS: ~191 kB
- Main page: ~90.7 kB
