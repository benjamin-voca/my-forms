import { SectionPayloads } from "~/db/schema/sections";

export default function Time({
  section,
}: {
  section: { type: "Time" } & SectionPayloads["Time"];
}) {
  return (
    <div class="mb-6">
      <input type="time" class="w-full border p-2 rounded shadow-sm" />
    </div>
  );
}
