import {
    pgTable,
    serial,
    varchar,
    text,
    integer,
    boolean,
    pgEnum,
    index, // Import 'index'
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '~/db/schema/users'
// Define a Postgres enum for section types
export const SectionType = pgEnum('section_type', [
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
]);

// Forms table
export const forms = pgTable('forms', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
});

// Base sections table with enum discriminator
export const sections = pgTable('sections', {
    id: serial('id').primaryKey(),
    formId: integer('form_id')
        .notNull()
        .references(() => forms.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    required: boolean('required').notNull(),
    type: SectionType('type').notNull(), // uses pgEnum
}, (table) => {
    return {
        // FIX: Added an index on formId for faster lookups
        formIdIdx: index('form_id_idx').on(table.formId),
    };
});

// Short answer
export const shortAnswerSections = pgTable('short_answer_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    placeholder: varchar('placeholder', { length: 255 }),
});

// Paragraph
export const paragraphSections = pgTable('paragraph_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    placeholder: text('placeholder'),
});

// Multiple choice
export const multipleChoiceSections = pgTable('multiple_choice_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    options: text('options').array().notNull(),
    allowOther: boolean('allow_other').notNull().default(false),
});

// Checkboxes
export const checkboxSections = pgTable('checkbox_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    options: text('options').array().notNull(),
    minSelections: integer('min_selections'),
    maxSelections: integer('max_selections'),
});

// Dropdown
export const dropdownSections = pgTable('dropdown_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    options: text('options').array().notNull(),
});

// File upload
export const fileUploadSections = pgTable('file_upload_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    maxFiles: integer('max_files').notNull().default(1),
    maxFileSize: integer('max_file_size'), // in MB
});

// Linear scale
export const linearScaleSections = pgTable('linear_scale_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    minValue: integer('min_value').notNull(),
    maxValue: integer('max_value').notNull(),
    step: integer('step').notNull().default(1),
});

// Multiple choice grid
export const multipleChoiceGridSections = pgTable('mc_grid_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    rowLabels: text('row_labels').array().notNull(),
    columnLabels: text('column_labels').array().notNull(),
});

// Checkbox grid
export const checkboxGridSections = pgTable('checkbox_grid_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    rowLabels: text('row_labels').array().notNull(),
    columnLabels: text('column_labels').array().notNull(),
});

// Date
export const dateSections = pgTable('date_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
    includeTime: boolean('include_time').notNull().default(false),
});

// Time
export const timeSections = pgTable('time_sections', {
    id: integer('id')
        .primaryKey()
        .references(() => sections.id, { onDelete: 'cascade' }),
});

// Relations
export const formsRelations = relations(forms, ({ many }) => ({
    sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
    // FIX: Added a back-relation to the parent form
    form: one(forms, {
        fields: [sections.formId],
        references: [forms.id],
    }),
    shortAnswer: one(shortAnswerSections, {
        fields: [sections.id],
        references: [shortAnswerSections.id],
    }),
    paragraph: one(paragraphSections, {
        fields: [sections.id],
        references: [paragraphSections.id],
    }),
    multipleChoice: one(multipleChoiceSections, {
        fields: [sections.id],
        references: [multipleChoiceSections.id],
    }),
    checkbox: one(checkboxSections, {
        fields: [sections.id],
        references: [checkboxSections.id],
    }),
    dropdown: one(dropdownSections, {
        fields: [sections.id],
        references: [dropdownSections.id],
    }),
    fileUpload: one(fileUploadSections, {
        fields: [sections.id],
        references: [fileUploadSections.id],
    }),
    linearScale: one(linearScaleSections, {
        fields: [sections.id],
        references: [linearScaleSections.id],
    }),
    mcGrid: one(multipleChoiceGridSections, {
        fields: [sections.id],
        references: [multipleChoiceGridSections.id],
    }),
    checkboxGrid: one(checkboxGridSections, {
        fields: [sections.id],
        references: [checkboxGridSections.id],
    }),
    date: one(dateSections, {
        fields: [sections.id],
        references: [dateSections.id],
    }),
    time: one(timeSections, {
        fields: [sections.id],
        references: [timeSections.id],
    }),
}));
