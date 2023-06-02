import type {Config} from "drizzle-kit"

export default {
    schema: "./src/server/drizzle-db.ts",
    out: "./drizzle-migrations",
} satisfies Config