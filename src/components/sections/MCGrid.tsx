import { For } from "solid-js";
import { SectionPayloads } from "~/db/schema/sections";

export default function MCGrid({
  section,
}: {
  section: { type: "MCGrid" } & SectionPayloads["MCGrid"];
}) {
  const rows = section.rowLabels ?? [];
  const cols = section.columnLabels ?? [];

  return (
    <div class="mb-6 overflow-x-auto">
      <table class="w-full border text-sm">
        <thead>
          <tr>
            <th></th>
            <For each={cols}>
              {(col) => <th class="p-2 border text-center">{col}</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={rows}>
            {(row, i) => (
              <tr>
                <td class="p-2 border">{row}</td>
                <For each={cols}>
                  {() => (
                    <td class="p-2 border text-center">
                      <input type="radio" name={`grid-${i()}`} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

