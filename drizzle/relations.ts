import { relations } from "drizzle-orm/relations";
import { users, forms, sections, formUsers } from "./schema";

export const formsRelations = relations(forms, ({one, many}) => ({
	user: one(users, {
		fields: [forms.userId],
		references: [users.id]
	}),
	sections: many(sections),
	formUsers: many(formUsers),
}));

export const usersRelations = relations(users, ({many}) => ({
	forms: many(forms),
	formUsers: many(formUsers),
}));

export const sectionsRelations = relations(sections, ({one}) => ({
	form: one(forms, {
		fields: [sections.formId],
		references: [forms.id]
	}),
}));

export const formUsersRelations = relations(formUsers, ({one}) => ({
	form: one(forms, {
		fields: [formUsers.formId],
		references: [forms.id]
	}),
	user: one(users, {
		fields: [formUsers.userId],
		references: [users.id]
	}),
}));