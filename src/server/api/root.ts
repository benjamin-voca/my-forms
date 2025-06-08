import { formsRouter } from "~/db/schema/forms";
import { exampleRouter } from "./routers/example";
import { sectionsRouter } from "./routers/forms";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
    example: exampleRouter,
    forms: formsRouter,
    sections: sectionsRouter
});

export type AppRouter = typeof appRouter;
