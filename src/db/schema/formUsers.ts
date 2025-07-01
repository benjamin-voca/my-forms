import { integer, pgEnum, pgTable, serial, unique } from "drizzle-orm/pg-core";
import { forms } from "~/db/schema/forms";
import { users } from "~/db/schema/users";

export const formUserRole = ['owner', 'admin', 'participant'] as const;
export type FormUserRole = typeof formUserRole[number];
export const FormUserRole = pgEnum('form_user_role', formUserRole);

export const formUsers = pgTable('form_users', {
    id: serial('id').primaryKey(), // add a surrogate PK
    formId: integer('form_id').notNull()
        .references(() => forms.id, { onDelete: 'cascade' }),
    userId: integer('user_id').notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    role: FormUserRole('role').notNull(),
}, (table) => [
    unique().on(table.formId, table.userId, table.role),
]);
