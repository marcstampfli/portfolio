"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { type SubmitButtonProps } from "@/types";

export function SubmitButton({ isSubmitting, isSubmitted }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      className="group relative w-full overflow-hidden rounded-lg bg-primary px-8 py-3 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)] disabled:pointer-events-none disabled:opacity-50"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.div
              key="submitting"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </motion.div>
          ) : isSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Message Sent!
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Message
            </motion.div>
          )}
        </AnimatePresence>
      </span>
      <div
        className="absolute inset-0 -z-10 bg-no-repeat duration-500 group-hover:bg-[position:200%_0,0_0]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.3) 50%, transparent 75%)",
          backgroundSize: "250% 250%, 100% 100%",
          backgroundPosition: "-100% 0, 0 0",
          transitionProperty: "background-position",
          transitionDuration: "500ms",
          transitionTimingFunction: "ease",
        }}
      />
    </motion.button>
  );
}
