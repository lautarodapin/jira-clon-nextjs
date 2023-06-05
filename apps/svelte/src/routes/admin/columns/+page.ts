import type { PageLoad } from "./$types"
import { db, kanbanColumns } from '$lib/drizzle'


export const load: PageLoad = async () => {
    const columns = await db.select().from(kanbanColumns).all()
    return { columns }
} 