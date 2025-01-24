"use client";

import dynamic from "next/dynamic";
import { type Experience } from "@/types/experience";

const Resume = dynamic(() => import("./resume-document"), { ssr: false });

interface ResumeProps {
  experiences: Experience[];
}

export default function ResumePDF({ experiences }: ResumeProps) {
  return <Resume experiences={experiences} />;
}
