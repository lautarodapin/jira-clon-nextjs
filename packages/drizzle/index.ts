import { text, integer, sqliteTableCreator } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
// import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
// import { migrate } from 'drizzle-orm-sqlite/better-sqlite3/migrator';

const sqliteTable = sqliteTableCreator((name) => `drizzle_${name}`);

export const kanbanColumns = sqliteTable('kanban_columns', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    order: integer('order').notNull().default(0),
})

export const kanbanTickets = sqliteTable('kanban_tickets', {
    id: integer('id').primaryKey(),
    title: text('name').notNull(),
    order: integer('order').notNull().default(0),
    columnId: integer('column_id').references(() => kanbanColumns.id)
})

const sqlite = new Database('./drizzle-db.sqlite3');
export const db = drizzle(sqlite);


migrate(db, { migrationsFolder: "/migrations" });