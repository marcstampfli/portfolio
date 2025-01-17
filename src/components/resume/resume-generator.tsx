"use client";

import dynamic from "next/dynamic";
import { type Experience } from "@/types/prisma";

const Resume = dynamic(() => import("./resume-pdf").then(mod => mod.default), { ssr: false });

export { Resume };
