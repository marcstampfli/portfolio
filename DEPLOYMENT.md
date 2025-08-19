# Deployment Guide

## Environment Variables

The following environment variables need to be set in your deployment platform (Vercel):

### Required Variables

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
NEXT_PUBLIC_APP_URL="https://marcstampfli.com"
NODE_ENV="production"
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Ensure build command is set to: `npm run build`
4. Ensure output directory is set to: `.next`

### Database Setup

The project uses Prisma with Prisma Postgres (GA). The database schema is automatically pushed when deploying.

### Performance Optimizations

This build includes:
- GPU-accelerated animations
- Lazy loading of components
- Optimized images with AVIF support
- Reduced motion support
- 3D tilt effects for project cards
- Performance monitoring in development

### Build Process

```bash
npm run build     # Creates optimized production build
npm run start     # Starts production server
npm run lint      # Runs ESLint
```

### Key Features

- 3D tilt effect project cards
- Slide-out project modal
- Performance-optimized animations
- Responsive design
- Accessibility compliance
- SEO optimized
