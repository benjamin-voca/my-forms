// src/server/api/routers/sections.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../utils'
import { sections } from '~/db/schema/sections'
import { db } from '~/db/index'
import { eq, InferInsertModel } from 'drizzle-orm'
import { forms } from '~/db/schema/forms'
import { createInsertSchema } from 'drizzle-zod';



type SectionInsert = InferInsertModel<typeof sections>
export const sectionsRouter = createTRPCRouter({
    // CREATE a new section in one go
    createSection: publicProcedure
        .input(createInsertSchema(sections))
        .mutation(async ({ input }) => {
            const {
                formId,
                title,
                description,
                required,
                type,
                ...variantFields
            } = input

            // 1) First, build the details payload and type‐assert it
            const detailsPayload = {
                type: type,
                ...variantFields,
            } as SectionInsert['details']  // <— this tells TS “this is exactly the JSONB shape you expect”

            // 2) Now assemble the full insert payload, casting the enum field correctly
            const payload: SectionInsert = {
                formId,
                title,
                description,
                required,
                type: type as SectionInsert['type'], // ensure this matches the pgEnum type
                details: detailsPayload,
            }

            const [newSection] = await db
                .insert(sections)
                .values(payload)
                .returning()

            if (!newSection) {
                throw new Error('Failed to insert section')
            }
            return newSection
        }),
    // READ a form with its sections (including their JSONB details)
    getForm: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const [formRow] = await db
                .select()
                .from(forms)
                .where(eq(forms.id, input.id))

            if (!formRow) return null

            const sectionRows = await db
                .select()
                .from(sections)
                .where(eq(sections.formId, input.id))

            return {
                ...formRow,
                sections: sectionRows,
            }
        }),
})


export type SectionsRouter = typeof sectionsRouter
