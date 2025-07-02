import { createEffect, createSignal } from "solid-js";

export const EditableText = (props: { value: string; onChange: (v: string) => void }) => {
  const [editing, setEditing] = createSignal(false);
  const [text, setText] = createSignal(props.value);

  // when props.value changes externally, update local text
  createEffect(() => setText(props.value));

  return (
    <>
      {editing() ? (
        <input
          type="text"
          class="border rounded px-2 py-1"
          value={text()}
          onInput={(e) => setText(e.currentTarget.value)}
          onBlur={() => {
            setEditing(false);
            props.onChange(text());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          autofocus
        />
      ) : (
        <h2
          class="text-xl font-medium text-gray-900 cursor-pointer"
          onDblClick={() => setEditing(true)}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setEditing(true)}
        >
          {text()}
        </h2>
      )}
    </>
  );
};
