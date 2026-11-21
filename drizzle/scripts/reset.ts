import { sql } from "drizzle-orm";
import { db } from "../db";

async function reset() {
  console.log("⏳ Resetting database...");

  // 1. Fetch all table names in the 'public' schema
  const query = sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
  `;

  const result = await db.execute(query);

  // Extract table names (handles both node-postgres and postgres.js return formats)
  const rows = Array.isArray(result) ? result : result.rows;
  const tables = rows
    .map((row: Record<string, unknown>) => row.table_name as string)
    // Optional: Keep Drizzle's migration history table intact
    .filter((name) => name !== "__drizzle_migrations");

  if (tables.length === 0) {
    console.log("⚠️ No tables found to truncate.");
    process.exit(0);
  }

  // 2. Truncate all tables, reset serial/identity sequences, and handle foreign keys
  const tableList = tables.map((t) => `"public"."${t}"`).join(", ");
  await db.execute(
    sql.raw(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`),
  );

  console.log(`✅ Cleared data from ${tables.length} tables.`);
  process.exit(0);
}

reset().catch((err) => {
  console.error("❌ Error resetting database:", err);
  process.exit(1);
});
