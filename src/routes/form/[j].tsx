import { createSignal, For, Show, Suspense } from "solid-js";
import { api } from "~/lib/api";
import { createAsync, useParams } from "@solidjs/router";
import z from "zod";
import SectionRenderer, { NarrowSection } from "~/components/sections";
import { Form } from "~/db/types";

const ParamsSchema = z.object({
  j: z.string().regex(/^\d+$/),
});

export default function Home() {
  const rawParams = useParams();
  const parsed = ParamsSchema.safeParse(rawParams);

  if (!parsed.success) throw new Error("invalid url param")

  const [formId, ] = createSignal(+parsed.data.j);
  const form = createAsync(() => api.sections.getForm.query({ id: formId() }))

  return (
    <main class="w-full p-12 flex flex-col items-center space-around">
      <Suspense fallback="Loading title...">
        <Show when={form()} fallback={<h1>unable to find form</h1>}>
          <h1 class="font-xl">{form()?.title}</h1>
        </Show>
      </Suspense>
    <Suspense fallback="Loading description...">
        <Show when={form()} fallback={<></>}>
          <h1>{form()?.description}</h1>
        </Show>
      </Suspense>
    <Suspense fallback="Loading description...">
      <Show when={form()} fallback={<></>}>
        <For each={form()?.sections}>
          {(section) => <SectionRenderer section={section as NarrowSection} />}
        </For>
      </Show>
    </Suspense>
    </main>
  )
}
