import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getPublishedProjectBySlug, getPublishedProjectSlugs } from "@/lib/content";
import { getProjectTypeDisplayName } from "@/types";
import { isValidLocalImage } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { serializeJsonLd } from "@/lib/json-ld";

export const dynamicParams = false;
// The root layout and the page JSON-LD use a request-specific CSP nonce.
// Keep these pages dynamic so the nonce is present on every inline script.
export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const pageUrl = siteConfig.url + "/projects/" + project.slug;
  const imageUrl = project.images[0] || siteConfig.ogImage;

  return {
    title: project.title,
    description: project.description || siteConfig.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: project.title,
      description: project.description || siteConfig.description,
      images: [{ url: imageUrl, alt: project.title }],
    },
    twitter: {
      card: "summary",
      title: project.title,
      description: project.description || siteConfig.description,
      images: [imageUrl],
    },
  };
}

function ExternalProjectLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-theme inline-flex items-center gap-2 rounded-sm border border-borderStrong bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const coverImage = project.images.find(isValidLocalImage);
  const galleryImages = project.images.filter((image) => image !== coverImage);
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const pageUrl = siteConfig.url + "/projects/" + project.slug;
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description || siteConfig.description,
    url: pageUrl,
    image: coverImage ? siteConfig.url + coverImage : siteConfig.ogImage,
    creator: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: project.tech_stack.join(", "),
  };

  return (
    <main id="main-content" className="relative min-h-screen pt-24 sm:pt-28">
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectJsonLd) }}
      />
      <Container size="narrow">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/#projects"
            className="flex w-fit shrink-0 items-center gap-2 whitespace-nowrap text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to projects
          </Link>
        </nav>

        <article>
          <header className="border-b border-border/70 pb-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{getProjectTypeDisplayName(project.project_type)}</Badge>
              {project.featured ? <Badge>Featured</Badge> : null}
              {project.year_start || project.year ? (
                <span className="text-sm text-muted-foreground">
                  {project.year_start && project.year && project.year_start !== project.year
                    ? project.year_start + "–" + project.year
                    : project.year || project.year_start}
                </span>
              ) : null}
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {project.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {project.live_url ? (
                <ExternalProjectLink href={project.live_url} label="Visit live project">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </ExternalProjectLink>
              ) : null}
              {project.github_url ? (
                <ExternalProjectLink href={project.github_url} label="View source code">
                  <Github className="h-4 w-4" aria-hidden="true" />
                </ExternalProjectLink>
              ) : null}
              {project.figma_url ? (
                <ExternalProjectLink href={project.figma_url} label="View design file">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                </ExternalProjectLink>
              ) : null}
            </div>
          </header>

          {coverImage ? (
            <figure className="relative mt-10 aspect-[16/10] overflow-hidden rounded-sm border border-border/70 bg-secondary/60">
              <Image
                src={coverImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover object-top"
              />
            </figure>
          ) : null}

          <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
            {project.content ? (
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            ) : (
              <p>Project details are available on request.</p>
            )}
          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {galleryImages.map((image) => (
                <figure
                  key={image}
                  className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border/70 bg-secondary/60"
                >
                  <Image
                    src={image}
                    alt={project.title + " project detail"}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-cover object-top"
                  />
                </figure>
              ))}
            </div>
          ) : null}
        </article>
      </Container>
    </main>
  );
}
