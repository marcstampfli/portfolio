"use client";

import dynamic from "next/dynamic";
import { type Experience } from "@/types/prisma";

const Resume = dynamic(() => import("./resume-document.js"), { ssr: false });

interface ResumeProps {
  experiences: Experience[];
  fontBuffer: ArrayBuffer | null;
}

export default function ResumePDF({ experiences, fontBuffer }: ResumeProps) {
  return <Resume experiences={experiences} fontBuffer={fontBuffer} />;
} 