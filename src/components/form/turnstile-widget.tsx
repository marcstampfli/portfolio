"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "auto";
  size: "flexible";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpired: () => void;
  onError: () => void;
  resetKey: number;
}

export function TurnstileWidget({ onToken, onExpired, onError, resetKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !scriptReady ||
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    ) {
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: turnstileSiteKey,
        action: "contact",
        theme: "auto",
        size: "flexible",
        callback: onToken,
        "expired-callback": onExpired,
        "error-callback": onError,
      });
    } catch {
      onError();
    }
  }, [onError, onExpired, onToken, scriptReady]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  useEffect(() => {
    if (resetKey === 0 || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
    onExpired();
  }, [onExpired, resetKey]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, []);

  if (!turnstileSiteKey) {
    return process.env.NODE_ENV === "production" ? (
      <p role="alert" className="text-sm text-destructive">
        Verification is unavailable right now. Please try again later.
      </p>
    ) : null;
  }

  return (
    <div className="space-y-2" aria-label="Spam protection">
      <Script
        id={TURNSTILE_SCRIPT_ID}
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => onError()}
      />
      <div ref={containerRef} className="min-h-[65px]" />
      <p className="text-xs leading-5 text-muted-foreground">
        This quick security check helps prevent spam submissions.
      </p>
    </div>
  );
}
