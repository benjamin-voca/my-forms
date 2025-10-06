import { SectionPayloads } from "~/db/schema/sections";

export default function ShortAnswer({
  section,
}: {
  section: { type: "ShortAnswer" } & SectionPayloads["ShortAnswer"];
}) {
  return (
    <div class="mb-6">
      <input
        type="text"
        placeholder={section.placeholder ?? ""}
        class="w-full p-2 border border-gray-300 rounded shadow-sm"
      />
    </div>
  );
}
