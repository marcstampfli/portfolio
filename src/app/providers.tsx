"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div style={{ position: "relative" }} className="relative">
          {children}
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
