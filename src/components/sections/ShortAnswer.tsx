export default function ShortAnswer({ section }: { section: any }) {
  return (
    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">
        {section.title}
        {section.required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        placeholder={section.shortAnswer?.placeholder ?? ""}
        class="w-full p-2 border border-gray-300 rounded shadow-sm"
      />
    </div>
  );
}
