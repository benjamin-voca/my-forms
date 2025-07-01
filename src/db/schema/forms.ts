import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { users } from "~/db/schema/users"

// Forms table
export const forms = pgTable('forms', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
});
