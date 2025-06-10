export default function FileUpload({ section }: { section: any }) {
  return (
    <div class="mb-6">
      <label class="block font-medium mb-1">{section.title}</label>
      <input
        type="file"
        multiple={section.fileUpload?.maxFiles > 1}
        class="w-full"
      />
      {section.fileUpload?.maxFileSize && (
        <p class="text-sm text-gray-500 mt-1">
          Max size: {section.fileUpload.maxFileSize} MB
        </p>
      )}
    </div>
  );
}
