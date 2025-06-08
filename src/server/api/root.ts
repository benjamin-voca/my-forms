import { formsRouter } from "~/server/api/routers/forms";
import { exampleRouter } from "~/server/api/routers/example";
import { sectionsRouter } from "~/server/api/routers/sections";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
    example: exampleRouter,
    forms: formsRouter,
    sections: sectionsRouter
});

export type AppRouter = typeof appRouter;
