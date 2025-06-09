// src/server/api/routers/sections.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../utils'
import {
    sections,
    shortAnswerSections,
    paragraphSections,
    multipleChoiceSections,
    checkboxSections,
    dropdownSections,
    fileUploadSections,
    linearScaleSections,
    multipleChoiceGridSections,
    checkboxGridSections,
    dateSections,
    timeSections,
    forms,
} from '~/db/schema/sections'
import { db } from '~/db/index'
import { eq } from 'drizzle-orm'

// Raw string literals for Zod discriminated union
const SectionTypeValues = [
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
] as const

type SectionTypeString = typeof SectionTypeValues[number]

export const sectionsRouter = createTRPCRouter({
    // 1. createSection mutation
    createSection: publicProcedure
        .input(
            z.discriminatedUnion('type', [
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('ShortAnswer'), placeholder: z.string().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('Paragraph'), placeholder: z.string().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('MultipleChoice'), options: z.array(z.string()), allowOther: z.boolean().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('Checkbox'), options: z.array(z.string()), minSelections: z.number().optional(), maxSelections: z.number().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('Dropdown'), options: z.array(z.string()) }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('FileUpload'), maxFiles: z.number().optional(), maxFileSize: z.number().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('LinearScale'), minValue: z.number(), maxValue: z.number(), step: z.number().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('MCGrid'), rowLabels: z.array(z.string()), columnLabels: z.array(z.string()) }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('CheckboxGrid'), rowLabels: z.array(z.string()), columnLabels: z.array(z.string()) }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('Date'), includeTime: z.boolean().optional() }),
                z.object({ formId: z.number(), title: z.string(), description: z.string(), required: z.boolean(), type: z.literal('Time') }),
            ])
        )
        .mutation(async ({ input }) => {
            console.log('Received input:', input); // Add this
            return db.transaction(async (tx) => {
                const [sec] = await tx.insert(sections).values({
                    formId: input.formId,
                    title: input.title,
                    description: input.description,
                    required: input.required,
                    type: input.type as SectionTypeString,
                }).returning()

                if (!sec) {
                    throw new Error("Failed to create the section in the database.");
                }
                console.log('ineserting:', input); // Add this
                switch (input.type) {
                    case 'ShortAnswer': await tx.insert(shortAnswerSections).values({ id: sec.id, placeholder: input.placeholder ?? null }); break
                    case 'Paragraph': await tx.insert(paragraphSections).values({ id: sec.id, placeholder: input.placeholder ?? null }); break
                    case 'MultipleChoice': await tx.insert(multipleChoiceSections).values({ id: sec.id, options: input.options, allowOther: input.allowOther ?? false }); break
                    case 'Checkbox': await tx.insert(checkboxSections).values({ id: sec.id, options: input.options, minSelections: input.minSelections ?? null, maxSelections: input.maxSelections ?? null }); break
                    case 'Dropdown': await tx.insert(dropdownSections).values({ id: sec.id, options: input.options }); break
                    case 'FileUpload': await tx.insert(fileUploadSections).values({ id: sec.id, maxFiles: input.maxFiles ?? 1, maxFileSize: input.maxFileSize ?? null }); break
                    case 'LinearScale': await tx.insert(linearScaleSections).values({ id: sec.id, minValue: input.minValue, maxValue: input.maxValue, step: input.step ?? 1 }); break
                    case 'MCGrid': await tx.insert(multipleChoiceGridSections).values({ id: sec.id, rowLabels: input.rowLabels, columnLabels: input.columnLabels }); break
                    case 'CheckboxGrid': await tx.insert(checkboxGridSections).values({ id: sec.id, rowLabels: input.rowLabels, columnLabels: input.columnLabels }); break
                    case 'Date': await tx.insert(dateSections).values({ id: sec.id, includeTime: input.includeTime ?? false }); break
                    case 'Time': await tx.insert(timeSections).values({ id: sec.id }); break
                }
                console.log('inserted:', input); // Add this

                return sec
            })
        }),

    // 2. getForm query
    getForm: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            // Fetch form and all its sections (no subtype fields for brevity)
            const formRows = await db.select().from(forms).where(eq(forms.id, input.id))
            const secs = await db.select().from(sections).where(eq(sections.formId, input.id))
            const form = formRows[0] || null
            return form ? { ...form, sections: secs } : null
        }),
})

export type SectionsRouter = typeof sectionsRouter
