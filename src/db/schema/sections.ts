import {
    pgTable,
    serial,
    varchar,
    text,
    integer,
    boolean,
    pgEnum,
    jsonb,
    index,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, relations } from 'drizzle-orm';
import { users } from '~/db/schema/users';
import { forms } from '~/db/schema/forms';
import { formUsers } from '~/db/schema/formUsers';


// 1) Declare your kinds once, as a `const` tuple:
export const sectionKinds = [
    'ShortAnswer',
    'Paragraph',
    'MultipleChoice',
    'Checkbox',
    'Dropdown',
    'FileUpload',
    'LinearScale',
    'MCGrid',
    'CheckboxGrid',
    'Date',
    'Time',
] as const;


// 2) Derive a TS union type from that tuple:
export type SectionKind = typeof sectionKinds[number];

// 3) Define the payload for each kind in one place:
export interface SectionPayloads {
    ShortAnswer: { placeholder?: string };
    Paragraph: { placeholder?: string };
    MultipleChoice: { options: string[]; allowOther: boolean };
    Checkbox: { options: string[]; minSelections?: number; maxSelections?: number };
    Dropdown: { options: string[] };
    FileUpload: { maxFiles: number; maxFileSizeMB?: number };
    LinearScale: { minValue: number; maxValue: number; step: number };
    MCGrid: { rowLabels: string[]; columnLabels: string[] };
    CheckboxGrid: { rowLabels: string[]; columnLabels: string[] };
    Date: { includeTime: boolean };
    Time: {};  // no extra fields
}

// 4) Build the discriminated‐union type by mapping over the keys:
export type SectionDetails = {
    [K in SectionKind]: { type: K } & SectionPayloads[K]
}[SectionKind];

// feed the *same* `sectionKinds` array into pgEnum:
export const SectionType = pgEnum('section_type', sectionKinds);
/**  Form Section  **/
export const sections = pgTable(
    'sections',
    {
        id: serial('id').primaryKey(),
        formId: integer('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
        title: varchar('title', { length: 255 }).notNull(),
        description: text('description').notNull(),
        required: boolean('required').notNull(),
        // use `SectionType` (enum) *and* JSONB for the payload
        type: SectionType('type').notNull(),
        details: jsonb('details').$type<SectionDetails>().notNull(),
    },
    (table) => [
        index('sections_form_id_idx').on(table.formId),
        index('sections_details_gin_idx').on(table.details),
    ]
);
export type Section = InferInsertModel<typeof sections>;
export const formsRelations = relations(forms, ({ many }) => ({
    sections: many(sections),
    users: many(formUsers),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
    form: one(forms, { fields: [sections.formId], references: [forms.id] }),
}));

/**  Form User Section  **/


export const usersRelations = relations(users, ({ many }) => ({
    forms: many(formUsers),
}));

export const formUsersRelations = relations(formUsers, ({ one }) => ({
    form: one(forms, { fields: [formUsers.formId], references: [forms.id] }),
    user: one(users, { fields: [formUsers.userId], references: [users.id] }),
}));

