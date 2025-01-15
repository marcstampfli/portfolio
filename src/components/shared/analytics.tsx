'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Here you can add your analytics service
    // Example: Google Analytics, Plausible, etc.
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    console.log(`Page view: ${url}`);
  }, [pathname, searchParams]);

  return null;
} 