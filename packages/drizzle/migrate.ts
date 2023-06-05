import { migrate } from "drizzle-orm/bun-sqlite/migrator";
// import { migrate } from 'drizzle-orm/sqlite-proxy/migrator'
import { db } from ".";

migrate(db, { migrationsFolder: "./migrations" });