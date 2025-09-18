import React from 'react';

type Props = {
  onFiles: (files: File[]) => void;
};

export default function FileDropZone({ onFiles }: Props) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type === 'application/pdf');
    if (files.length) onFiles(files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-black bg-gray-50' : 'border-gray-300'}`}
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
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}
