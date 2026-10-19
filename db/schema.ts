import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
// Each authenticated owner has an isolated synthetic clinic. Atomic, versioned
// aggregate holds structured collections and ID-based relational references.
export const workspaces = sqliteTable('workspaces', {
  ownerId: text('owner_id').primaryKey(), state: text('state').notNull(),
  revision: integer('revision').notNull().default(0), createdAt: text('created_at').notNull()
});
export const memberships = sqliteTable('memberships', {
  userId: text('user_id').primaryKey(), workspaceId: text('workspace_id').notNull().references(()=>workspaces.ownerId),
  role: text('role').notNull().default('Admin')
});
