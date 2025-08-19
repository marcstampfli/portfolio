"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function Dialog({
  open,
  onOpenChange,
  children,
  className,
}: DialogProps) {
  // Lock body scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--removed-body-scroll-bar-size, 0px)';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange?.(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4",
        className
      )}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div className="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

const DialogContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative flex flex-col gap-4", className)} {...props}>
    {children}
  </div>
);

const DialogHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5", className)} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
