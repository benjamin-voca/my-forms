import { SectionPayloads } from "~/db/schema/sections";

export default function LinearScale({
  section,
}: {
  section: { type: "LinearScale" } & SectionPayloads["LinearScale"];
}) {
  const { minValue, maxValue, step } = section;
  return (
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>{minValue}</span>
        <span>{maxValue}</span>
      </div>
      <input
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        class="w-full"
      />
    </div>
  );
}
