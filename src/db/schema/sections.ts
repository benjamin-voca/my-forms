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
import { relations } from 'drizzle-orm';
import { users } from '~/db/schema/users';

// Forms table
export const forms = pgTable('forms', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
});

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
interface SectionPayloads {
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
    [K in SectionKind]: { kind: K } & SectionPayloads[K]
}[SectionKind];

// feed the *same* `sectionKinds` array into pgEnum:
export const SectionType = pgEnum('section_type', sectionKinds);

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
    (table) => ({
        form_idx: index('sections_form_id_idx').on(table.formId),
        // GIN‐index the JSONB for containment queries
        details_gin_idx: index('sections_details_gin_idx').on(table.details),
    })
);

export const formsRelations = relations(forms, ({ many }) => ({
    sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
    form: one(forms, { fields: [sections.formId], references: [forms.id] }),
}));
