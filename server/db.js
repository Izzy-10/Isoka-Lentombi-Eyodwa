import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { profiles } from "./schema.js";
import { ApiError } from "./http.js";

let database;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new ApiError(503, "Database access is not configured for this deployment.");

  if (!database) {
    database = drizzle(neon(connectionString), { schema: { profiles } });
  }
  return database;
}
