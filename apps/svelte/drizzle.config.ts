
import type { Config } from "drizzle-kit"

export default {
    schema: "./src/drizzle/index.ts",
    out: "./migrations",
} satisfies Config