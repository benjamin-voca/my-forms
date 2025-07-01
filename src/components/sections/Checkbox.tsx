import { For } from "solid-js";
import { SectionPayloads } from "~/db/schema/sections";

export default function Checkbox({
  section,
}: {
  section: { type: "Checkbox" } & SectionPayloads["Checkbox"];
}) {
  const options = section.options ?? [];
  return (
    <div class="mb-6">
      <For each={options}>
        {(opt) => (
          <label class="block mb-1">
            <input type="checkbox" class="mr-2" />
            {opt}
          </label>
        )}
      </For>
    </div>
  );
}
