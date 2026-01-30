"use client";

import {
  lazy,
  Suspense,
  type ComponentType,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type LazyLoadProps<TComponent extends ComponentType<any>> = {
  component: () => Promise<{ default: TComponent }>;
  fallback?: ReactNode;
} & ComponentPropsWithoutRef<TComponent>;

export function LazyLoad<TComponent extends ComponentType<any>>({
  component,
  fallback = <div className="w-full h-64 bg-muted/50 animate-pulse rounded-lg" />,
  ...props
}: LazyLoadProps<TComponent>) {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...(props as ComponentPropsWithoutRef<TComponent>)} />
    </Suspense>
  );
}

// HOC for creating lazy-loaded components
export function withLazyLoad<TComponent extends ComponentType<any>>(
  componentLoader: () => Promise<{ default: TComponent }>,
  fallback?: ReactNode
) {
  return function LazyComponent(props: ComponentPropsWithoutRef<TComponent>) {
    return (
      <LazyLoad
        component={componentLoader}
        fallback={fallback}
        {...props}
      />
    );
  };
}
