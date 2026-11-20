import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SERVER_URL: z.string().min(1),
    POSTGRES_URL: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),

    GROQ_API_KEY: z.string().min(1),

    RESEND_API_KEY: z.string().min(1),
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
