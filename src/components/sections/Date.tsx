import { SectionPayloads } from "~/db/schema/sections";

export default function Date({
  section,
}: {
  section: { type: "Date" } & SectionPayloads["Date"];
}) {
  return (
    <div class="mb-6">
      <input
        type="date"
        class="w-full border p-2 rounded shadow-sm"
      />
      {section.includeTime && (
        <input
          type="time"
          class="w-full border p-2 rounded shadow-sm mt-2"
        />
      )}
    </div>
  );
}
