import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .regex(/^pk_(test|live)_[A-Za-z0-9_-]+$/)
    .optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().startsWith("/").default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z
    .string()
    .startsWith("/")
    .default("/"),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z
    .string()
    .startsWith("/")
    .default("/"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL: z.string().startsWith("/").default("/"),
});

const serverEnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  CLERK_SECRET_KEY: z
    .string()
    .regex(/^sk_(test|live)_[A-Za-z0-9_-]+$/)
    .optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

function requireProductionClerkKeys(environment: {
  readonly NODE_ENV: "development" | "test" | "production";
  readonly CLERK_SECRET_KEY?: string | undefined;
  readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string | undefined;
}) {
  if (environment.NODE_ENV !== "production") {
    return;
  }

  if (!environment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required in production.",
    );
  }

  if (!environment.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is required in production.");
  }
}

function requireProductionSupabaseConfig(environment: {
  readonly NODE_ENV: "development" | "test" | "production";
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string | undefined;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string | undefined;
}) {
  if (environment.NODE_ENV !== "production") {
    return;
  }

  if (!environment.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required in production.");
  }

  if (!environment.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required in production.");
  }
}

export const publicEnvironment = publicEnvironmentSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL,
});

export const serverEnvironment = serverEnvironmentSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

requireProductionClerkKeys({
  CLERK_SECRET_KEY: serverEnvironment.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    publicEnvironment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NODE_ENV: serverEnvironment.NODE_ENV,
});

requireProductionSupabaseConfig({
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    publicEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL: publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
  NODE_ENV: serverEnvironment.NODE_ENV,
});
