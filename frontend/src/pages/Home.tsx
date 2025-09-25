import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileDropZone from '@/components/FileDropZone';
import { useUploadCase } from '@/hooks/useCase';

export default function Home() {
  const [name, setName] = React.useState('Demo Case');
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<Record<string, string>>({});
  const nav = useNavigate();
  const upload = useUploadCase();

  async function onUpload() {
    if (!name || files.length === 0) return;

    setStatus(Object.fromEntries(files.map((f) => [f.name, '⏳ Processing...'])));
    try {
      const loc = await upload.mutateAsync({ name, files });
      if (loc) {
        setStatus((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, '✅ Processed'])));
        nav(`/case/${loc}`);
      }
    } catch {
      setStatus((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, '❌ Failed'])));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow">
        <label className="block text-sm font-medium">Case Name</label>
        <input
          className="mt-1 w-full rounded border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Doe v. ACME"
        />
        <div className="mt-4">
          <FileDropZone files={files} setFiles={setFiles} />
        </div>
        {files.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm">
            {files.map((f) => (
              <li key={f.name}>
                {f.name} — <span>{status[f.name] || 'Ready'}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onUpload}
            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={files.length === 0 || upload.isPending}
          >
            {upload.isPending ? 'Uploading…' : 'Upload & Process'}
          </button>
        </div>
      </div>
    </div>
  );
}
