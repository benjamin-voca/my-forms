export default function Checkbox({ section }: { section: any }) {
  const options = section.checkbox?.options ?? [];
  return (
    <div class="mb-6">
      <p class="font-medium mb-2">{section.title}</p>
      {options.map((opt: string, i: number) => (
        <label class="block mb-1" key={i}>
          <input type="checkbox" class="mr-2" />
          {opt}
        </label>
      ))}
    </div>
  );
}
