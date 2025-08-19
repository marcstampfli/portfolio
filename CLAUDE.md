# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Database Commands
- `npm run seed` or `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database and reseed with fresh data
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management

### Docker Database
- `docker compose up -d` - Start PostgreSQL database container
- `docker compose down` - Stop database container

## Architecture Overview

This is a Next.js 15 portfolio application built with the App Router architecture. The application uses modern web development patterns including:

### Tech Stack
- **Framework**: Next.js 15 with App Router and Server Components
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS with custom design system using CSS variables
- **State Management**: TanStack Query for server state, React hooks for client state
- **Animations**: Framer Motion for animations and transitions
- **UI Components**: Custom components built on Radix UI primitives
- **Theming**: next-themes for dark/light mode support
- **Type Safety**: TypeScript with strict configuration

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for projects, experiences, contact
│   ├── actions/           # Server actions for data fetching
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage with all sections
│   └── providers.tsx      # Query client and theme providers
├── components/
│   ├── sections/          # Main page sections (hero, about, projects, etc.)
│   ├── shared/            # Reusable components (modals, images, navigation)
│   ├── ui/                # Base UI components (buttons, cards, etc.)
│   ├── background/        # Background effects and animations
│   ├── timeline/          # Experience timeline components
│   ├── form/              # Contact form components
│   └── projects/          # Project-specific components
├── data/                  # Static data files (JSON)
├── lib/                   # Utilities (Prisma client, utils, validation)
└── types/                 # TypeScript type definitions
```

### Database Schema
The application uses 5 main models:
- **Project**: Portfolio projects with tech stack, images, and metadata
- **Experience**: Work experience with achievements and tech stack
- **TechStack**: Technologies used across projects and experiences
- **Achievement**: Individual achievements linked to experiences
- **ContactMessage**: Messages from the contact form

### Data Management
- **Static Data**: Projects and experiences are stored in `/data/*.json` files
- **Database**: Uses Prisma with PostgreSQL for production data
- **Images**: Project images stored in `/public/projects/` directory
- **API Routes**: RESTful endpoints at `/api/projects` and `/api/experiences`

### Key Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Dark/Light Mode**: Complete theming system with CSS variables
- **Interactive Elements**: Parallax backgrounds, hover effects, animations
- **Performance Optimized**: Next.js Image optimization, lazy loading
- **SEO Ready**: Proper metadata and semantic HTML structure

### Environment Setup
1. Copy `.env.example` to `.env` and configure:
   - `DATABASE_URL` for database connection
   - `NEXT_PUBLIC_APP_URL` for the application URL
   - Optional `GITHUB_TOKEN` for GitHub integrations

2. Database setup options:
   - **Local PostgreSQL**: Use Docker Compose for local development
   - **SQLite**: Use `DATABASE_URL="file:./dev.db"` for simple local development

### Component Patterns
- **Server Components**: Used by default for data fetching and static content
- **Client Components**: Marked with `"use client"` for interactivity
- **Custom Hooks**: Located in `/src/hooks/` for reusable logic
- **Compound Components**: UI components composed of multiple smaller parts
- **Provider Pattern**: Used for theme and query client management

### Styling Conventions
- **CSS Variables**: Defined in `globals.css` for consistent theming
- **Utility Classes**: TailwindCSS utilities for rapid development
- **Component Classes**: Custom classes for complex styling needs
- **Animation Classes**: Framer Motion for complex animations, CSS for simple ones

### Development Notes
- Always run database migrations after schema changes
- Use TypeScript strict mode - fix all type errors before committing
- Follow the existing component structure when adding new features
- Test both light and dark themes when styling components
- Ensure mobile responsiveness for all new components