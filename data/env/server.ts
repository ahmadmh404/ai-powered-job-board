import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // For Production
    POSTGRES_URL: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    DATABASE_URL_UNPOOLED: z.string().min(1),

    NEON_PROJECT_ID: z.string().min(1),
    PGDATABASE: z.string().min(1),
    PGHOST: z.string().min(1),
    PGHOST_UNPOOLED: z.string().min(1),
    PGPASSWORD: z.string().min(1),
    PGUSER: z.string().min(1),
    POSTGRES_DATABASE: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_PRISMA_URL: z.string().min(1),
    POSTGRES_URL_NON_POOLING: z.string().min(1),
    POSTGRES_URL_NO_SSL: z.string().min(1),
    POSTGRES_USER: z.string().min(1),
    VERCEL_OIDC_TOKEN: z.string().min(1),

    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SERVER_URL: z.string().min(1),
  },
  // this prop takes all our process env variables and validate them over these zod validate rules
  experimental__runtimeEnv: process.env,

  emptyStringAsUndefined: true,
  createFinalSchema: (env) => {
    return z.object(env).transform((val) => {
      return {
        ...val,
      };
    });
  },
});
