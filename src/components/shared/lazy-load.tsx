"use client";

import { lazy, Suspense, ComponentType } from "react";

type LazyLoadProps<TProps extends object> = {
  component: () => Promise<{ default: ComponentType<TProps> }>;
  fallback?: React.ReactNode;
} & TProps;

export function LazyLoad<TProps extends object>({
  component,
  fallback = <div className="w-full h-64 bg-muted/50 animate-pulse rounded-lg" />,
  ...props
}: LazyLoadProps<TProps>) {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...(props as TProps)} />
    </Suspense>
  );
}

// HOC for creating lazy-loaded components
export function withLazyLoad<TProps extends object>(
  componentLoader: () => Promise<{ default: ComponentType<TProps> }>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: TProps) {
    return (
      <LazyLoad 
        component={componentLoader} 
        fallback={fallback}
        {...props}
      />
    );
  };
}
