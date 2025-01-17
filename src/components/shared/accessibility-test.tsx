"use client";

import { useEffect } from "react";
import * as axe from "axe-core";

export function AccessibilityTest() {
  useEffect(() => {
    axe.run().then((results) => {
      if (results.violations.length === 0) {
        console.log("No accessibility violations found.");
      } else {
        console.error("Accessibility violations found:", results.violations);
      }
    });
  }, []);

  return null;
}
