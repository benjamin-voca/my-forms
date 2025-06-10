export default function CheckboxGrid({ section }: { section: any }) {
  const rows = section.checkboxGrid?.rowLabels ?? [];
  const cols = section.checkboxGrid?.columnLabels ?? [];

  return (
    <div class="mb-6 overflow-x-auto">
      <p class="font-medium mb-2">{section.title}</p>
      <table class="w-full border text-sm">
        <thead>
          <tr>
            <th></th>
            {cols.map((col: string, i: number) => (
              <th key={i} class="p-2 border text-center">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string, i: number) => (
            <tr key={i}>
              <td class="p-2 border">{row}</td>
              {cols.map((_, j: number) => (
                <td class="p-2 border text-center" key={j}>
                  <input type="checkbox" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
