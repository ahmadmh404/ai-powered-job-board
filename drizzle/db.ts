import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schemas";
import { env } from "@/data/env/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
