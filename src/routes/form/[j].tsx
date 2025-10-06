import { createEffect, createSignal, For, Show, Suspense } from "solid-js";
import { api } from "~/lib/api";
import { useParams } from "@solidjs/router";
import z from "zod";
import SectionRenderer, { NarrowSection } from "~/components/sections";

import { useDragDropContext } from "@thisbeyond/solid-dnd";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { useQuery } from "@tanstack/solid-query";

const Sortable = (props: { item: number; children: any }) => {
  const sortable = createSortable(props.item);
  const state = useDragDropContext();
  return (
    <div
      use:sortable={sortable}
      class="sortable w-full max-w-4xl mx-auto px-4"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "transition-transform": !!state?.[0].active,
      }}
    >
      {props.children}
    </div>
  );
};

const ParamsSchema = z.object({
  j: z.string().regex(/^\d+$/),
});

// Fetch the form data
const useForm = (formId: number) => {
  // Pass a single options object to useQuery
  return useQuery(() => ({
    queryKey: ['form', formId],
    queryFn: () => api.sections.getForm.query({ id: formId }),
    enabled: !!formId, // This ensures formId is present before the query runs
  }));
};
export default function Home() {
  const rawParams = useParams();
  const parsed = ParamsSchema.safeParse(rawParams);

  if (!parsed.success) throw new Error("invalid url param")

  const [formId,] = createSignal(+parsed.data.j);
  const { data: form, isLoading, isError } = useForm(formId());

  createEffect(() => {
    if (form?.sections) {
      setItems(form.sections);
    }
  });
  const [items, setItems] = createSignal(form?.sections);
  const ids = () => items();
  const [activeItem, setActiveItem] = createSignal(null);

  const onDragStart = ({ draggable }: any) => setActiveItem(draggable.id);

  const onDragEnd = ({ draggable, droppable }: any) => {
    if (draggable && droppable && ids()) {
      const currentItems = ids()!;
      const fromIndex = currentItems.indexOf(draggable.id);
      const toIndex = currentItems.indexOf(droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setItems(updatedItems);
      }
    }
  };
  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <main class="w-full p-12 flex flex-col items-center space-around">
        <Suspense fallback="Loading title...">
          <Show when={form} fallback={<h1>unable to find form</h1>}>
            <h1 class="text-4xl font-semibold">{form?.title}</h1>
          </Show>
        </Suspense>
        <Suspense fallback="Loading description...">
          <Show when={form} fallback={<></>}>
            <h1>{form?.description}</h1>
          </Show>
        </Suspense>
        <Suspense fallback="Loading description...">
          <Show when={form} fallback={<></>}>
            <SortableProvider ids={items()?.map(s => s.id) ?? []}>
              <For each={items()}>
                {(section) => (
                  <Sortable item={section.id}>
                    <SectionRenderer section={section as NarrowSection} />
                  </Sortable>
                )}
              </For>
            </SortableProvider>
          </Show>
        </Suspense>
      <DragOverlay>
        <Show when={activeItem()} fallback={<></>}>
          {(id) => {
            const section = items()?.find((s) => s.id === id());
            return section ? (
              <div class="sortable">
                <SectionRenderer section={section as NarrowSection} />
              </div>
            ) : null;
          }}
        </Show>
      </DragOverlay>
      </main>
    </DragDropProvider>
  )
}
