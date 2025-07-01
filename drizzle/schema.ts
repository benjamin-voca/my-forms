import { pgTable, unique, integer, varchar, foreignKey, serial, text, index, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core"

export const formUserRole = pgEnum("form_user_role", ['admin', 'participant'])
export const sectionType = pgEnum("section_type", ['ShortAnswer', 'Paragraph', 'MultipleChoice', 'Checkbox', 'Dropdown', 'FileUpload', 'LinearScale', 'MCGrid', 'CheckboxGrid', 'Date', 'Time'])


export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const forms = pgTable("forms", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "forms_user_id_users_id_fk"
	}).onDelete("cascade"),
]);

export const sections = pgTable("sections", {
	id: serial().primaryKey().notNull(),
	formId: integer("form_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	required: boolean().notNull(),
	type: sectionType().notNull(),
	details: jsonb().notNull(),
}, (table) => [
	index("sections_details_gin_idx").using("btree", table.details.asc().nullsLast().op("jsonb_ops")),
	index("sections_form_id_idx").using("btree", table.formId.asc().nullsLast().op("int4_ops")),
	foreignKey({
		columns: [table.formId],
		foreignColumns: [forms.id],
		name: "sections_form_id_forms_id_fk"
	}).onDelete("cascade"),
]);

export const formUsers = pgTable("form_users", {
	id: serial().primaryKey().notNull(),
	formId: integer("form_id").notNull(),
	userId: integer("user_id").notNull(),
	role: formUserRole().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.formId],
		foreignColumns: [forms.id],
		name: "form_users_form_id_forms_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "form_users_user_id_users_id_fk"
	}).onDelete("cascade"),
	unique("form_users_form_id_user_id_role_unique").on(table.formId, table.userId, table.role),
]);
