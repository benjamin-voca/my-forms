import { createSignal } from "solid-js";
import { api } from "~/lib/api";
// Import createQuery and createMutation from @tanstack/solid-query
import { createQuery, createMutation } from "@tanstack/solid-query";
import { useParams } from "@solidjs/router";
import z from "zod";


const ParamsSchema = z.object({
  i: z.string().regex(/^\d+$/), // example: only digits
});

export default function Home() {
  const rawParams = useParams();
  const parsed = ParamsSchema.safeParse(rawParams);

  if (!parsed.success) throw new Error("invalid url param")

  const [formId, setFormId] = createSignal(+parsed.data.i);

  const getForm = createQuery(() => ({
    queryKey: ["form", formId()],
    queryFn: () => api.sections.getForm.query({ id: formId() }),
    enabled: false,
  }));

  // --- Create Section Mutation ---
  const createSectionMutation = createMutation(() => ({
    mutationFn: () =>
      api.sections.createSection.mutate({
        formId: formId(),
        title: "New Demo Question",
        description: "This was created with a mutation.",
        required: false,
        type: "ShortAnswer",
      }),
    onSuccess: () => {
      getForm.refetch();
    },
  }));

  // --- Create Form Mutation ---
  const [newTitle, setNewTitle] = createSignal("");
  const [newDescription, setNewDescription] = createSignal("");
  const createFormMutation = createMutation(() => ({
    mutationFn: () =>
      api.forms.createForm.mutate({
        title: newTitle(),
        description: newDescription(),
        userId: 1,
      }),
    onSuccess: () => {
      // Clear inputs
      setNewTitle("");
      setNewDescription("");
      // Optionally set the formId to newly created
      if (createFormMutation.isSuccess) {
        setFormId(createFormMutation.data.id);
        getForm.refetch();
      } else { console.error("didnt set formID") }
    },
  }));

  const handleLoad = () => getForm.refetch();
  const handleCreateSection = () => createSectionMutation.mutate();
  const handleCreateForm = () => createFormMutation.mutate();

  return (
    <main class="p-4 font-sans">
      <h1 class="text-2xl font-bold mb-4">tRPC and SolidQuery Demo</h1>

      {/* --- Create Form Controls --- */}
      <div class="p-4 border rounded-lg shadow-sm bg-white mb-6">
        <h2 class="text-lg font-semibold mb-2">Create a New Form</h2>
        <input
          type="text"
          placeholder="Form Title"
          value={newTitle()}
          onInput={(e) => setNewTitle(e.currentTarget.value)}
          class="border rounded p-2 w-full mb-2"
        />
        <textarea
          placeholder="Form Description"
          value={newDescription()}
          onInput={(e) => setNewDescription(e.currentTarget.value)}
          class="border rounded p-2 w-full mb-2"
        />
        <button
          onClick={handleCreateForm}
          disabled={createFormMutation.isPending}
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {createFormMutation.isPending ? "Creating Form..." : "Create Form"}
        </button>

        {createFormMutation.isSuccess && (
          <div class="mt-2 bg-green-100 text-green-800 p-3 rounded">
            <p class="font-semibold">Form Created!</p>
            <pre class="mt-1 text-sm bg-green-50 p-2 rounded">
              <code>{JSON.stringify(createFormMutation.data, null, 2)}</code>
              {setFormId(createFormMutation.data.id)}
            </pre>
          </div>
        )}
        {createFormMutation.isError && (
          <div class="mt-2 bg-red-100 text-red-700 p-3 rounded">
            <p class="font-semibold">Error Creating Form</p>
            <pre class="mt-1 text-sm bg-red-50 p-2 rounded">
              <code>{createFormMutation.error?.message}</code>
            </pre>
          </div>
        )}
      </div>

      {/* --- Create Section Controls --- */}
      <div class="p-4 border rounded-lg shadow-sm bg-white mb-6">
        <h2 class="text-lg font-semibold mb-2">Create a New Section</h2>
        <button
          onClick={handleCreateSection}
          disabled={createSectionMutation.isPending}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {createSectionMutation.isPending ? "Creating Section..." : "Create Section"}
        </button>

        {createSectionMutation.isSuccess && (
          <div class="mt-2 bg-green-100 text-green-800 p-3 rounded">
            <p class="font-semibold">Section Created!</p>
            <pre class="mt-1 text-sm bg-green-50 p-2 rounded">
              <code>{JSON.stringify(createSectionMutation.data, null, 2)}</code>
            </pre>
          </div>
        )}
        {createSectionMutation.isError && (
          <div class="mt-2 bg-red-100 text-red-700 p-3 rounded">
            <p class="font-semibold">Error Creating Section</p>
            <pre class="mt-1 text-sm bg-red-50 p-2 rounded">
              <code>{createSectionMutation.error?.message}</code>
            </pre>
          </div>
        )}
      </div>

      {/* --- Load Form Controls --- */}
      <div class="p-4 border rounded-lg shadow-sm bg-white">
        <h2 class="text-lg font-semibold mb-2">Load a Form</h2>
        <input
          type="number"
          min="1"
          value={formId()}
          onInput={(e) => setFormId(parseInt(e.currentTarget.value) || 1)}
          class="border rounded p-2 w-24"
        />
        <button
          onClick={handleLoad}
          disabled={getForm.isFetching}
          class="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {getForm.isFetching ? "Loading…" : `Load Form #${formId()}`}
        </button>

        {getForm.isSuccess && (
          <div class="mt-4">
            <h3 class="font-semibold">Form Data:</h3>
            <pre class="mt-2 bg-gray-100 p-3 rounded text-sm">
              <code>{JSON.stringify(getForm.data, null, 2)}</code>
            </pre>
          </div>
        )}
        {getForm.isError && (
          <pre class="mt-2 bg-red-100 text-red-700 p-3 rounded text-sm">
            <code>Error: {getForm.error?.message}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
