// src/server/api/routers/forms.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/utils'
import { forms } from '~/db/schema/sections'
import { db } from '~/db/index'
import { eq } from 'drizzle-orm'

export const formsRouter = createTRPCRouter({
    /**
     * Mutation to create a new form
     * @input title: string, description: string
     * @returns the newly created form record
     */
    createForm: publicProcedure
        .input(
            z.object({
                title: z.string().min(1, "Title is required"),
                description: z.string().min(1, "Description is required"),
            })
        )
        .mutation(async ({ input }) => {
            // Insert a new form and return the created record
            const [newForm] = await db.insert(forms)
                .values({
                    title: input.title,
                    description: input.description,
                })
                .returning()

            if (!newForm) {
                throw new Error("Failed to create form in the database.")
            }

            return newForm
        }),

    /**
     * Query to fetch a form by ID
     */
    getForm: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const form = await db.select()
                .from(forms)
                .where(eq(forms.id, input.id))
                .limit(1)
                .then(rows => rows[0] || null)

            return form
        }),
})

export type FormsRouter = typeof formsRouter;
