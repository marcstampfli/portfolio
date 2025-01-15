# ✨ Marc Stampfli Portfolio

Modern portfolio website with interactive elements and dynamic content management. Built with Next.js 15 and PostgreSQL.

## 🎯 Key Features

- 🌟 Interactive particle system with mouse tracking
- ⚡ Real-time content updates with React Query
- 📱 Responsive design with dark mode
- 🎨 Beautiful animations and transitions
- 💼 Dynamic project showcase with modals
- 📊 Interactive experience timeline
- 📬 Contact form with email notifications

## 🛠️ Tech Stack

- ⚛️ Next.js 15 App Router + Server Components
- 🎭 Framer Motion + tsParticles
- 🎨 TailwindCSS + Radix UI
- 🔄 TanStack Query + React Hook Form
- 📝 Markdown processing with syntax highlighting

## 🗃️ Database Schema

PostgreSQL with Prisma ORM managing:

\`\`\`prisma
model Project {
id String @id
title String
description String
content String
category String
tags String[]
tech_stack String[]
image_url String
github_url String?
live_url String?
figma_url String?
}

model Experience {
id String @id
title String
company String
description String
tech_stack String[]
achievements String[]
start_date DateTime
end_date DateTime?
}
\`\`\`

## 👨‍💻 Author

**Marc Stämpfli** • [marcstampfli.com](https://marcstampfli.com)

_Building digital experiences with passion for design and performance_ ✨
