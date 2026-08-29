"use server";

import { processContactMessage } from "@/lib/contact-service";

export async function submitContactMessage(data: unknown) {
  return processContactMessage(data);
}
