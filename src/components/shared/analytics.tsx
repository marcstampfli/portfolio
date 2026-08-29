"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const hasValidGaMeasurementId = /^G-[A-Z0-9]+$/i.test(gaMeasurementId);

declare global {
  interface Window {
    gtag: (_command: string, _targetId: string, _config?: Record<string, unknown>) => void;
  }
}

interface AnalyticsProps {
  nonce?: string;
}

export function Analytics({ nonce }: AnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "undefined" && hasValidGaMeasurementId) {
      const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      window.gtag("config", gaMeasurementId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Only render in production with a valid GA ID
  if (process.env.NODE_ENV !== "production" || !hasValidGaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        nonce={nonce}
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" nonce={nonce} strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `}
      </Script>
    </>
  );
}
