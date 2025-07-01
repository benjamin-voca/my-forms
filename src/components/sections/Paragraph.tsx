import { SectionPayloads } from "~/db/schema/sections";

export default function Paragraph({
  section,
}: {
  section: { type: "Paragraph" } & SectionPayloads["Paragraph"];
}) {
  return (
    <div class="mb-6">
      <textarea
        placeholder={section.placeholder ?? ""}
        class="w-full p-2 border border-gray-300 rounded shadow-sm h-28 resize-vertical"
      />
    </div>
  );
}
