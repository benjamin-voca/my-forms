import { SectionPayloads } from "~/db/schema/sections";

export default function FileUpload({
  section,
}: {
  section: { type: "FileUpload" } & SectionPayloads["FileUpload"];
}) {
  return (
    <div class="mb-6">
      <input
        type="file"
        multiple={section.maxFiles > 1}
        class="w-full"
      />
      {section.maxFileSizeMB && (
        <p class="text-sm text-gray-500 mt-1">
          Max size: {section.maxFileSizeMB} MB
        </p>
      )}
    </div>
  );
}
