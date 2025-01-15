"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { Analytics } from "@/components/analytics";
import { BackgroundGradient } from "@/components/background/background-gradient";
import { motion as _motion } from "framer-motion";

export function RootLayoutClient({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <body className={className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <BackgroundGradient />
        <_motion.main
          className="relative min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </_motion.main>
        <Analytics />
      </ThemeProvider>
    </body>
  );
}
