import {drizzle, BetterSQLite3Database, } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core"

const sqlite = new Database('db.sqlite')
const db: BetterSQLite3Database = drizzle(sqlite)


export const kanbanColumns = sqliteTable('kanbanColumns', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    order: integer('order', {mode: 'number'})
})

export const kanbanTickets = sqliteTable('kanbanTickets', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    order: integer('order', {mode: 'number'}),
    columnId: integer('columnId').references(() => kanbanColumns.id),
})