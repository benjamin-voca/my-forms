import { For } from "solid-js";
import { SectionPayloads } from "~/db/schema/sections";


export default function Dropdown({
  section,
}: {
  section: { type: "Dropdown" } & SectionPayloads["Dropdown"];
}) {
  const options = section.options ?? [];
  return (
    <div class="mb-6">
      <select class="w-full border p-2 rounded shadow-sm">
        <For each={options}>
          {(opt) => <option value={opt}>{opt}</option>}
        </For>
      </select>
    </div>
  );
}
