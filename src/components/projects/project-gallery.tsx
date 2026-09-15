"use client";

import Image from "next/image";
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  children: ReactNode;
}

export function ProjectGallery({ images, title, children }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = activeIndex !== null;
  const activeImage = activeIndex === null ? null : images[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || images.length < 2) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => (current === null ? current : (current + 1) % images.length));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + images.length) % images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, isOpen]);

  const openAt = (index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  };

  const closeGallery = () => setActiveIndex(null);

  const renderThumbnail = (src: string, index: number, cover = false) => (
    <button
      key={src}
      type="button"
      className="group relative block aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/70 bg-secondary/60 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Open ${title} image ${index + 1} of ${images.length}`}
      onClick={(event: MouseEvent<HTMLButtonElement>) => openAt(index, event.currentTarget)}
    >
      <Image
        src={src}
        alt={`${title} screenshot ${index + 1} of ${images.length}`}
        fill
        priority={cover}
        loading={cover ? undefined : "lazy"}
        sizes={cover ? "(max-width: 896px) 100vw, 896px" : "(max-width: 640px) 100vw, 448px"}
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-75 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 text-[0.68rem] font-medium text-white shadow-sm backdrop-blur-sm sm:bottom-4 sm:right-4 sm:px-3 sm:text-xs">
        <Expand className="h-3.5 w-3.5" aria-hidden="true" />
        <span>
          {images.length > 1 ? `View gallery · ${index + 1}/${images.length}` : "Expand image"}
        </span>
      </span>
    </button>
  );

  return (
    <>
      {images.length > 0 ? (
        <>
          <div className="mt-10">{renderThumbnail(images[0], 0, true)}</div>
          {children}
          {images.length > 1 ? (
            <section className="mt-12" aria-label={`${title} project gallery`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-border/70 pb-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-foreground">
                    Gallery
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {images.length} screenshots · Select an image to view it full size.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                {images.slice(1).map((image, index) => renderThumbnail(image, index + 1))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        children
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${title} image gallery`}
        onCancel={(event) => {
          event.preventDefault();
          closeGallery();
        }}
        onClose={() => {
          setActiveIndex(null);
          window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-sm"
      >
        <div
          className="flex h-full w-full flex-col bg-black/95"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                Project gallery
              </p>
              <p className="mt-1 truncate font-display text-sm font-medium text-white sm:text-base">
                {title}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close gallery"
              onClick={closeGallery}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/15 bg-white/5 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-3 pb-5 sm:px-12 sm:pb-7"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeGallery();
              }
            }}
          >
            {images.length > 1 ? (
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? current : (current - 1 + images.length) % images.length
                  )
                }
                className="absolute left-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:left-5 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
            ) : null}

            {activeImage && activeIndex !== null ? (
              <figure
                className="relative w-full max-w-7xl overflow-hidden rounded-sm"
                style={{ height: "min(74vh, calc(100dvh - 9rem))" }}
              >
                <Image
                  key={activeImage}
                  src={activeImage}
                  alt={`${title} screenshot ${activeIndex + 1} of ${images.length}`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </figure>
            ) : null}

            {images.length > 1 ? (
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? current : (current + 1) % images.length
                  )
                }
                className="absolute right-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-5 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-4 px-4 pb-4 text-xs text-white/60 sm:pb-6">
            <span aria-live="polite" aria-atomic="true">
              {activeIndex === null ? "" : `${activeIndex + 1} of ${images.length}`}
            </span>
            {images.length > 1 ? <span>Use ← and → to browse</span> : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
