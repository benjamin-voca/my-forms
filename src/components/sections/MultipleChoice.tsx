import { For } from "solid-js";
import { SectionPayloads } from "~/db/schema/sections";


export default function MultipleChoice({
  section,
}: {
  section: { type: "MultipleChoice" } & SectionPayloads["MultipleChoice"];
}) {
  const options = section.options ?? [];
  return (
    <div class="mb-6">
      <For each={options}>
        {(opt) => (
          <label class="block mb-1">
            <input type="radio" name={`mc-${section.type}`} class="mr-2" />
            {opt}
          </label>
        )}
      </For>
      {section.allowOther && (
        <label class="block mt-2">
          <input type="radio" name={`mc-${section.type}`} class="mr-2" />
          <input type="text" placeholder="Other..." class="border p-1 rounded" />
        </label>
      )}
    </div>
  );
}
