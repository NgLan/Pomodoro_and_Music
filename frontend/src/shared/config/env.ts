import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
});

const parsedEnvironment = publicEnvironmentSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV,
});

/** Validated browser-visible configuration. Never add secrets to this object. */
export const publicEnvironment = {
  apiBaseUrl: parsedEnvironment.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ""),
  appEnvironment: parsedEnvironment.NEXT_PUBLIC_APP_ENV,
} as const;
