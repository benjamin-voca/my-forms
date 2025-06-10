export default function LinearScale({ section }: { section: any }) {
  const { minValue, maxValue, step } = section.linearScale;
  return (
    <div class="mb-6">
      <p class="font-medium mb-2">{section.title}</p>
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
