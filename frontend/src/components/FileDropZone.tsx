import React from 'react';

type Props = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function FileDropZone({ files, setFiles }: Props) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function addFiles(newFiles: File[]) {
    const map = new Map(files.map((f) => [f.name + f.size, f]));
    newFiles.forEach((f) => map.set(f.name + f.size, f));
    setFiles(Array.from(map.values()));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === 'application/pdf');
    if (dropped.length) addFiles(dropped);
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = ''; // reset input so re-selecting same file works
    }
  }

  function removeFile(name: string, size: number) {
    setFiles(files.filter((f) => !(f.name === name && f.size === size)));
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
        drag ? 'border-black bg-gray-50' : 'border-gray-300'
      }`}
    >
      <p className="mb-2 text-sm text-gray-700">Drag & drop PDFs here</p>
      <p className="text-xs text-gray-500">or</p>
      <button
        className="mt-2 rounded-xl border px-4 py-2"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        Choose Files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={onFileInput}
      />

      {files.length > 0 && (
        <ul className="mt-4 space-y-1 text-left text-sm">
          {files.map((f) => (
            <li
              key={f.name + f.size}
              className="flex items-center justify-between rounded border px-2 py-1"
            >
              <span>{f.name}</span>
              <button
                type="button"
                className="text-red-600 hover:underline"
                onClick={() => removeFile(f.name, f.size)}
              >
                ✕ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
