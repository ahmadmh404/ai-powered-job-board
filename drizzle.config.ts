import { defineConfig } from "drizzle-kit";
import "@/lib/config";

export default defineConfig({
  schema: "./drizzle/schemas.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
