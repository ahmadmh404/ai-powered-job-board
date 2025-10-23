import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // For Local
    DB_NAME: z.string().min(1),
    DB_PORT: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_HOST: z.string().min(1),

    // For Production
    DATABASE_URL: z.string().min(1),
    DATABASE_URL_UNPOOLED: z.string().min(1),
    PGHOST: z.string().min(1),

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
      const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, ...rest } = val;

      return {
        ...rest,
        // in local
        LOCAL_DATABASE_URL: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      };
    });
  },
});
