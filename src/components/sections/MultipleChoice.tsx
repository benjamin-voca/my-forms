export default function MultipleChoice({ section }: { section: any }) {
  const options = section.multipleChoice?.options ?? [];
  return (
    <div class="mb-6">
      <p class="font-medium mb-2">{section.title}</p>
      {options.map((opt: string, i: number) => (
        <label class="block mb-1" key={i}>
          <input type="radio" name={`mc-${section.id}`} class="mr-2" />
          {opt}
        </label>
      ))}
      {section.multipleChoice?.allowOther && (
        <label class="block mt-2">
          <input type="radio" name={`mc-${section.id}`} class="mr-2" />
          <input type="text" placeholder="Other..." class="border p-1 rounded" />
        </label>
      )}
    </div>
  );
}
