"use client";

import { lazy, Suspense, ComponentType } from "react";

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export function LazyLoad({ 
  component, 
  fallback = <div className="w-full h-64 bg-muted/50 animate-pulse rounded-lg" />,
  ...props 
}: LazyLoadProps & any) {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// HOC for creating lazy-loaded components
export function withLazyLoad<T extends ComponentType<any>>(
  componentLoader: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: React.ComponentProps<T>) {
    return (
      <LazyLoad 
        component={componentLoader} 
        fallback={fallback}
        {...props}
      />
    );
  };
}
