"use server";

import { type Experience } from "@/types/experience";
import { getExperiences as getExperiencesDb } from "@/data/experiences";

export async function getExperiences(): Promise<Experience[]> {
  try {
    console.log("Server Action: Starting getExperiences");
    const experiences = await getExperiencesDb();
    console.log("Server Action: Retrieved experiences from DB:", experiences);

    if (!experiences || !Array.isArray(experiences)) {
      console.error("Server Action: Invalid experiences data:", experiences);
      throw new Error("Invalid experiences data format");
    }

    if (experiences.length === 0) {
      console.log("Server Action: No experiences found in database");
    }

    return experiences;
  } catch (error) {
    console.error("Server Action: Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}
