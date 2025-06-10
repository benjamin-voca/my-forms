export default function Time({ section }: { section: any }) {
  return (
    <div class="mb-6">
      <label class="block font-medium mb-1">{section.title}</label>
      <input type="time" class="w-full border p-2 rounded shadow-sm" />
    </div>
  );
}
