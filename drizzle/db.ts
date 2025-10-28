import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schemas";
import { env } from "@/data/env/server";
import { neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// for edge ens like vercel edge
neonConfig.poolQueryViaFetch = true;

const sql = neon(env.POSTGRES_URL);
export const db = drizzle({ client: sql, schema });
