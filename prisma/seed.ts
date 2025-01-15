import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();

  const projects = [
    // Original projects
    {
      title: "Marc Stämpfli UI Design",
      slug: "marc-stampfli-ui-design",
      description: "UI/UX design for personal portfolio website",
      content:
        "A modern and intuitive UI design for my personal portfolio website, focusing on user experience and visual appeal.",
      category: "UI Designs",
      tags: ["UI/UX", "Web Design"],
      tech_stack: ["Figma"],
      images: ["project-marcstampfli-ui.jpg"],
      client: "Marc Stämpfli",
      status: "published",
      order: 0,
      created_at: new Date("2021-04-05"),
      updated_at: new Date("2021-04-05"),
    },
    {
      title: "Craigslist Redesign",
      slug: "craigslist-redesign",
      description: "Modern UI redesign concept for Craigslist",
      content:
        "A modern redesign concept for Craigslist, focusing on improving usability while maintaining familiarity.",
      category: "UI Designs",
      tags: ["UI/UX", "Web Design"],
      tech_stack: ["Figma"],
      images: ["project-craigslist-ui.jpg", "project-craigslist-ui2.jpg"],
      client: "Craigslist",
      status: "published",
      order: 1,
      created_at: new Date("2021-04-05"),
      updated_at: new Date("2021-04-05"),
    },
    {
      title: "Breezy Brands UI Design",
      slug: "breezy-brands-ui-design",
      description: "UI/UX design for Breezy Brands website",
      content:
        "A comprehensive UI/UX design project for Breezy Brands' digital platform, focusing on brand consistency and modern design principles.",
      category: "UI Designs",
      tags: ["UI/UX", "Web Design"],
      tech_stack: ["Adobe XD"],
      images: ["project-breezybrands.jpg"],
      client: "Breezy Brands",
      status: "published",
      order: 2,
      created_at: new Date("2021-07-09"),
      updated_at: new Date("2021-07-09"),
    },
    {
      title: "Roma UI Design",
      slug: "roma-ui-design",
      description: "UI/UX design for ROMA website",
      content:
        "A modern and professional UI design for ROMA's corporate website, emphasizing brand identity and user experience.",
      category: "UI Designs",
      tags: ["UI/UX", "Web Design"],
      tech_stack: ["Figma"],
      images: ["project-roma-ui.jpg", "project-roma-ui2.jpg"],
      client: "ROMA",
      status: "published",
      order: 4,
      created_at: new Date("2021-04-05"),
      updated_at: new Date("2021-04-05"),
    },
    {
      title: "Covid Tracker",
      slug: "covid-tracker",
      description: "Real-time COVID-19 statistics tracking application",
      content:
        "Interactive web application providing up-to-date COVID-19 statistics using external APIs and data visualization.",
      category: "Web Apps",
      tags: ["Web Development", "Data Visualization"],
      tech_stack: ["React", "API"],
      images: [
        "project-covidtracker-website4.jpg",
        "project-covidtracker-website.jpg",
        "project-covidtracker-website2.jpg",
        "project-covidtracker-website3.jpg",
      ],
      live_url: "https://covid-19-tracker-27c81.web.app/",
      client: "Personal Project",
      status: "published",
      order: 5,
      created_at: new Date("2021-04-03"),
      updated_at: new Date("2021-04-03"),
    },
    {
      title: "Tinder Clone",
      slug: "tinder-clone",
      description: "Tinder clone built with React and Firebase",
      content:
        "A full-featured Tinder clone showcasing real-time functionality and modern web development practices.",
      category: "Web Apps",
      tags: ["Web Development", "Clone"],
      tech_stack: ["React", "Firebase"],
      images: ["project-tinder-clone.jpg", "project-tinder-clone2.jpg"],
      live_url: "https://tinder-clone-8baa7.web.app/",
      client: "Personal Project",
      status: "published",
      order: 6,
      created_at: new Date("2021-04-03"),
      updated_at: new Date("2021-04-03"),
    },
    {
      title: "Hulu Clone",
      slug: "hulu-clone",
      description: "Hulu streaming platform clone",
      content:
        "A clone of the Hulu streaming platform featuring a modern UI and responsive design.",
      category: "Web Apps",
      tags: ["Web Development", "Clone"],
      tech_stack: ["React", "Firebase"],
      images: ["project-hulu-clone.jpg"],
      live_url: "https://hulu-clone-d0922.web.app/",
      client: "Personal Project",
      status: "published",
      order: 7,
      created_at: new Date("2021-04-03"),
      updated_at: new Date("2021-04-03"),
    },
    {
      title: "Amazon Clone",
      slug: "amazon-clone",
      description: "Amazon e-commerce platform clone with Stripe integration",
      content:
        "A comprehensive clone of Amazon's e-commerce platform featuring user authentication, product catalog, and Stripe payments.",
      category: "Web Apps",
      tags: ["Web Development", "E-commerce", "Clone"],
      tech_stack: ["React", "Firebase", "Stripe"],
      images: [
        "project-amazon-clone.jpg",
        "project-amazon-clone2.jpg",
        "project-amazon-clone3.jpg",
      ],
      live_url: "https://clone-666e1.web.app/",
      client: "Personal Project",
      status: "published",
      order: 8,
      created_at: new Date("2021-04-03"),
      updated_at: new Date("2021-04-03"),
    },
    {
      title: "Breezy Brands Website",
      slug: "breezy-brands-website",
      description: "Custom WordPress website for Breezy Brands",
      content:
        "A custom WordPress website featuring modern design, optimized performance, and responsive layout.",
      category: "Websites",
      tags: ["Web Development", "WordPress"],
      tech_stack: ["WordPress", "Custom Theme"],
      images: [
        "project-breezybrands.jpg",
        "project-breezybrands2.jpg",
        "project-breezybrands3.jpg",
      ],
      live_url: "https://breezybrands.com",
      client: "Breezy Brands",
      status: "published",
      order: 9,
      created_at: new Date("2021-07-09"),
      updated_at: new Date("2021-07-09"),
    },
    {
      title: "Softbox Studios Website",
      slug: "softbox-studios-website",
      description: "Website development for Softbox Studios",
      content:
        "A professional website showcasing Softbox Studios' portfolio and services.",
      category: "Websites",
      tags: ["Web Development"],
      tech_stack: ["Web Development"],
      images: [
        "project-softbox-website.jpg",
        "project-softbox-website2.jpg",
        "project-softbox-website3.jpg",
        "project-softbox-website4.jpg",
        "project-softbox-website5.jpg",
      ],
      client: "Softbox Studios",
      status: "published",
      order: 10,
      created_at: new Date("2021-04-02"),
      updated_at: new Date("2021-04-02"),
    },
    {
      title: "IOCL Website",
      slug: "iocl-website",
      description: "Website development for IOCL",
      content:
        "A corporate website development project for IOCL featuring modern design and functionality.",
      category: "Websites",
      tags: ["Web Development"],
      tech_stack: ["Web Development"],
      images: [
        "project-iocl-website.jpg",
        "project-iocl-website2.jpg",
        "project-iocl-website3.jpg",
      ],
      live_url: "http://www.iocltt.com/",
      client: "IOCL",
      status: "published",
      order: 11,
      created_at: new Date("2021-04-02"),
      updated_at: new Date("2021-04-02"),
    },
    {
      title: "TriniStars Website",
      slug: "trinistars-website",
      description: "WordPress website for TriniStars",
      content:
        "A WordPress website development project featuring custom modifications and responsive design.",
      category: "Websites",
      tags: ["WordPress", "Modified Theme"],
      tech_stack: ["WordPress"],
      images: [
        "project-trinistars-website.jpg",
        "project-trinistars-website2.jpg",
        "project-trinistars-website3.jpg",
      ],
      live_url: "http://trinistars.com/",
      client: "TriniStars",
      status: "published",
      order: 12,
      created_at: new Date("2021-04-05"),
      updated_at: new Date("2021-04-05"),
    },
    {
      title: "RL Photography Website",
      slug: "rl-photography-website",
      description: "Photography portfolio website",
      content:
        "A photography portfolio website showcasing professional work and services.",
      category: "Websites",
      tags: ["WordPress", "Modified Theme"],
      tech_stack: ["WordPress"],
      images: [
        "project-rlphoto-website.jpg",
        "project-rl-photo.jpg",
        "project-rlphoto-website2.jpg",
        "project-rlphoto-website3.jpg",
      ],
      live_url: "http://rainierlangephotography.com/",
      client: "RL Photography",
      status: "published",
      order: 13,
      created_at: new Date("2021-04-05"),
      updated_at: new Date("2021-04-05"),
    },
    {
      title: "Gypsea Soul Jewelry Website",
      slug: "gypsea-soul-jewelry-website",
      description: "E-commerce website for jewelry brand",
      content:
        "An e-commerce website for a jewelry brand featuring product catalog and secure payments.",
      category: "Websites",
      tags: ["WordPress", "E-commerce", "PayPal"],
      tech_stack: ["WordPress", "Modified Theme", "PayPal"],
      images: [
        "project-gypsea-website.jpg",
        "project-gypsea-website2.jpg",
        "project-gypsea-website3.jpg",
        "project-gypsea-website4.jpg",
        "project-gypsea-website5.jpg",
      ],
      live_url: "https://gypseasouljewelry.co/",
      client: "Gypsea Soul Jewelry",
      status: "published",
      order: 14,
      created_at: new Date("2021-04-02"),
      updated_at: new Date("2021-04-02"),
    },
    {
      title: "Lagoona Villa Website",
      slug: "lagoona-villa-website",
      description: "Website for luxury villa rental",
      content:
        "A luxury villa rental website showcasing property features and booking functionality.",
      category: "Websites",
      tags: ["WordPress"],
      tech_stack: ["WordPress"],
      images: [
        "project-lagoona-website.jpg",
        "project-lagoona-website2.jpg",
        "project-lagoona-website3.jpg",
        "project-lagoona-website4.jpg",
      ],
      live_url: "https://www.lagoonavilla.com/",
      client: "Lagoona Villa",
      status: "published",
      order: 15,
      created_at: new Date("2021-04-02"),
      updated_at: new Date("2021-04-02"),
    },
    {
      title: "GameKas Logo",
      slug: "gamekas-logo",
      description: "Logo design for gaming brand",
      content:
        "A modern logo design for a gaming brand focusing on brand identity.",
      category: "Logos",
      tags: ["Logo Design"],
      tech_stack: ["Photoshop"],
      images: ["project-gamekas-logo.jpg"],
      client: "GameKas",
      status: "published",
      order: 16,
      created_at: new Date("2021-04-03"),
      updated_at: new Date("2021-04-03"),
    },
    {
      title: "Gimmick Tees Logo",
      slug: "gimmick-tees-logo",
      description: "Logo design for t-shirt brand",
      content:
        "A creative logo design for a t-shirt brand emphasizing brand personality.",
      category: "Logos",
      tags: ["Logo Design"],
      tech_stack: ["Photoshop"],
      images: ["project-gt.jpg"],
      client: "Gimmick Tees",
      status: "published",
      order: 17,
      created_at: new Date("2021-04-02"),
      updated_at: new Date("2021-04-02"),
    },
    {
      title: "Irie Bites Digital Signage",
      slug: "irie-bites-digital-signage",
      description: "Digital menu board design",
      content:
        "A digital menu board design for a restaurant focusing on clarity and visual appeal.",
      category: "Digital Signage",
      tags: ["Digital Signage"],
      tech_stack: ["Photoshop"],
      images: ["project-iriebites-digitalsignage.jpg"],
      client: "Irie Bites",
      status: "published",
      order: 18,
      created_at: new Date("2021-04-03"),
      updated_at: new Date("2021-04-03"),
    },
    {
      title: "PAID Carwash Banner",
      slug: "paid-carwash-banner",
      description: "Banner design for car wash service",
      content: "An eye-catching banner design for a car wash service.",
      category: "Banners",
      tags: ["Banner Design"],
      tech_stack: ["Illustrator"],
      images: ["project-paidcarwash.jpg"],
      client: "PAID Carwash",
      status: "published",
      order: 19,
      created_at: new Date("2021-04-02"),
      updated_at: new Date("2021-04-02"),
    },
    // New projects from CSV
    {
      title: "Vinci's View Website",
      slug: "vincis-view-website",
      description: "Website for Vinci's View",
      content: "Lorem ipsum dolor",
      category: "Websites",
      tags: ["Custom Theme", "E-Commerce", "WordPress"],
      tech_stack: ["WordPress"],
      images: [
        "project-vincisview-website.jpg",
        "project-vincisview-website2.jpg",
        "project-vincisview-website3.jpg",
        "project-vincisview-website4.jpg",
        "project-vincisview-website5.jpg",
      ],
      live_url: "https://www.vincisviewtt.com",
      client: "Vinci's View",
      status: "published",
      order: 20,
      created_at: new Date("2021-04-01"),
      updated_at: new Date("2021-04-01"),
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  const experiences = [
    {
      title: "Web Developer / Designer",
      company: "WordHerd®",
      period: "Aug 2021 - Present · 3 yrs 6 mos",
      description:
        "Web Developer/Designer at a leading web design and development agency. Expertise in WordPress & React development, and UI/UX design. Remote work.",
      start_date: new Date("2021-08-01"),
      end_date: null,
      tech_stack: ["WordPress", "React", "UI/UX Design"],
      achievements: [
        "Developed and maintained client websites using WordPress and React",
        "Created custom UI/UX designs for web applications",
        "Collaborated with remote teams on large-scale projects",
      ],
    },
    {
      title: "UI Designer",
      company: "Webfx",
      period: "Apr 2021 - Nov 2021 · 8 mos",
      description:
        "Freelance UI Designer specializing in user interface design for a local digital agency. Remote work.",
      start_date: new Date("2021-04-01"),
      end_date: new Date("2021-11-30"),
      tech_stack: ["Figma", "Adobe XD", "UI Design"],
      achievements: [
        "Designed user interfaces for web and mobile applications",
        "Created design systems and style guides",
        "Collaborated with developers to implement designs",
      ],
    },
    {
      title: "Web Developer / Designer",
      company: "Marc Stampfli",
      period: "Apr 2013 - Oct 2021 · 8 yrs 7 mos",
      description:
        "Freelance Web & Graphic Designer/Developer providing design and development services to clients locally and internationally.",
      start_date: new Date("2013-04-01"),
      end_date: new Date("2021-10-31"),
      tech_stack: ["WordPress", "HTML/CSS", "JavaScript", "Graphic Design"],
      achievements: [
        "Developed custom websites for various clients",
        "Created branding and graphic design materials",
        "Managed full project lifecycle from concept to deployment",
      ],
    },
    {
      title: "Webmaster",
      company: "CCN TV6",
      period: "Oct 2018 - Mar 2019 · 6 mos",
      description:
        "Managed content creation, ePaper production, social media strategy, and minor video editing for the 'Beyond the Tape' segment at Trinidad Express Newspaper and CCN TV6. Semi-remote work.",
      start_date: new Date("2018-10-01"),
      end_date: new Date("2019-03-31"),
      tech_stack: ["Content Management", "Social Media", "Video Editing"],
      achievements: [
        "Managed website content and updates",
        "Developed social media strategies",
        "Produced digital publications and video content",
      ],
    },
    {
      title: "Web Developer",
      company: "MACO Magazines",
      period: "Feb 2017 - Mar 2018 · 1 yr 2 mos",
      description:
        "Managed website development, social media strategy, and the digitization of magazines into flip books as the In-house Web Developer for all MACO Magazines. Semi-remote work.",
      start_date: new Date("2017-02-01"),
      end_date: new Date("2018-03-31"),
      tech_stack: ["Web Development", "Social Media", "Digital Publishing"],
      achievements: [
        "Developed and maintained magazine websites",
        "Implemented digital publishing solutions",
        "Managed social media presence and strategy",
      ],
    },
    {
      title: "Web Developer",
      company: "Simply Intense - Si.media - Si.digital - Si.loyalty",
      period: "Oct 2008 - Mar 2013 · 4 yrs 6 mos",
      description:
        "In-house Web Developer with expertise in web development, design, server administration, and database management. Worked in both semi-remote and fully-remote environments.",
      start_date: new Date("2008-10-01"),
      end_date: new Date("2013-03-31"),
      tech_stack: [
        "Web Development",
        "Server Administration",
        "Database Management",
      ],
      achievements: [
        "Developed and maintained company websites",
        "Managed server infrastructure and databases",
        "Implemented digital solutions for various business units",
      ],
    },
  ];

  // Seed experiences
  for (const experience of experiences) {
    await prisma.experience.create({
      data: experience,
    });
  }

  console.log("Database has been seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
