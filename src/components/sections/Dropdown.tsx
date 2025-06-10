export default function Dropdown({ section }: { section: any }) {
  const options = section.dropdown?.options ?? [];
  return (
    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">{section.title}</label>
      <select class="w-full border p-2 rounded shadow-sm">
        {options.map((opt: string, i: number) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
