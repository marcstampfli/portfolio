"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          console.log('LCP:', lcp);
          
          // Send to analytics if available
          if ('gtag' in window && typeof window.gtag === 'function') {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'LCP',
              value: Math.round(lcp),
              custom_map: { metric_name: 'largest_contentful_paint' }
            } as any);
          }
        }
      });
      
      if (PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          console.log('FID:', fid);
          
          if ('gtag' in window && typeof window.gtag === 'function') {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'FID',
              value: Math.round(fid),
              custom_map: { metric_name: 'first_input_delay' }
            } as any);
          }
        });
      });
      
      if (PerformanceObserver.supportedEntryTypes?.includes('first-input')) {
        fidObserver.observe({ entryTypes: ['first-input'] });
      }

      // Cumulative Layout Shift
      let cumulativeLayoutShift = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
          }
        });
        
        console.log('CLS:', cumulativeLayoutShift);
        
        if ('gtag' in window && typeof window.gtag === 'function') {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'CLS',
            value: Math.round(cumulativeLayoutShift * 1000),
            custom_map: { metric_name: 'cumulative_layout_shift' }
          } as any);
        }
      });
      
      if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn('Long task detected:', entry.duration + 'ms');
        });
      });
      
      if (PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      }

      return () => {
        observer.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        longTaskObserver.disconnect();
      };
    }
  }, []);

  return null;
}
