# ✨ Marc Stampfli Portfolio

Modern portfolio website with interactive elements and dynamic content management. Built with Next.js 15 and PostgreSQL.

## 🎯 Key Features

- 🌟 Interactive particle system with mouse tracking
- ⚡ Optimized data fetching with React Query
- 📱 Responsive design with dark mode
- 🎨 Beautiful animations and transitions
- 💼 Dynamic project showcase with modals
- 📊 Professional experience timeline
- 📬 Contact form with email notifications

## 🛠️ Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-000000?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io)

- ⚛️ Next.js 15 App Router + Server Components
- 🎭 Framer Motion + tsParticles
- 🎨 TailwindCSS + Radix UI
- 🔄 TanStack Query for data fetching
- 📝 Markdown processing with syntax highlighting
- 🗃️ Prisma ORM for database management

## 👨‍💻 About Me

**Marc Stämpfli**  
[![Website](https://img.shields.io/badge/Website-marcstampfli.com-2ea44f?style=flat)](https://marcstampfli.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Marc_Stämpfli-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/marcstampfli)
[![GitHub](https://img.shields.io/badge/GitHub-marcstampfli-181717?style=flat&logo=github)](https://github.com/marcstampfli)

I'm a full-stack developer with a passion for creating beautiful, performant web applications. With over 15 years of experience in web development, I specialize in:

- 🖥️ Modern web development (Next.js, React, TypeScript, WordPress)
- 🎨 UI/UX design and implementation
- 🛠️ Full-stack application development
- 🚀 Performance optimization
- 🔒 Secure application architecture

## 📬 Let's Connect

I'm always open to interesting projects and collaborations. Feel free to reach out:

- 📧 Email: [hello@marcstampfli.com](mailto:hello@marcstampfli.com)
- 💼 LinkedIn: [Marc Stämpfli](https://www.linkedin.com/in/marc-st%C3%A4mpfli/)
- 📸 Instagram: [@marcstampfli](https://instagram.com/marcstampfli)
- 🌐 Website: [marcstampfli.com](https://marcstampfli.com)

## 🚀 Getting Started

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/marcstampfli/portfolio.git
   cd portfolio
   pnpm install
   ```

2. Set up environment:
   ```bash
   cp .env.example .env
   ```

3. Start the database:
   ```bash
   docker compose up -d
   ```

4. Initialize database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run development server:
   ```bash
   pnpm dev
   ```

## 🗃️ Database

PostgreSQL database runs in Docker and is configured to:
- Run on port 5433 (avoiding conflicts)
- Use persistent volume storage
- Have isolated credentials

## 📝 License

This project is licensed under the MIT License.
