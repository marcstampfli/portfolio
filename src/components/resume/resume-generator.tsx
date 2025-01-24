"use client";

import dynamic from "next/dynamic";

const Resume = dynamic(
  () => import("./resume-pdf").then((mod) => mod.default),
  { ssr: false },
);

export { Resume };
