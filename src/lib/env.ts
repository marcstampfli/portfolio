import { z } from "zod";

/**
 * Environment variable validation using Zod
 * This ensures all required environment variables are present at build/runtime
 */

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Email (required in production for contact form delivery)
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().min(1).optional(),

  // Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema
    .superRefine((value, ctx) => {
      if (value.NODE_ENV !== "production") {
        return;
      }

      if (!value.GMAIL_USER) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["GMAIL_USER"],
          message: "GMAIL_USER is required in production",
        });
      }

      if (!value.GMAIL_APP_PASSWORD) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["GMAIL_APP_PASSWORD"],
          message: "GMAIL_APP_PASSWORD is required in production",
        });
      }
    })
    .safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

// Validate environment variables at module load time
export const env = validateEnv();

// Type-safe access to environment variables
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
