"use server";

import { type Experience } from "../../types/portfolio-types";
import { experiences } from "@/data/experiences";

export async function getExperiences(): Promise<Experience[]> {
  try {
    return experiences;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}
