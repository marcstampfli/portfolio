import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  size?: "default" | "narrow" | "wide";
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10",
  narrow: "mx-auto w-full max-w-4xl px-5 sm:px-8",
  wide: "mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12",
};

export function Container({
  asChild = false,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  const Comp = asChild ? Slot : "div";

  return <Comp className={cn(sizeClasses[size], className)} {...props} />;
}
