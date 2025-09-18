import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileDropZone from '@/components/FileDropZone';
import { useUploadCase } from '@/hooks/useCase';

export default function Home() {
  const [name, setName] = React.useState('Demo Case');
  const [files, setFiles] = React.useState<File[]>([]);
  const nav = useNavigate();
  const upload = useUploadCase();

  async function onUpload() {
    if (!name || files.length === 0) return;
    const loc = await upload.mutateAsync({ name, files });
    // FastAPI redirects to /case/{id}. Parse id and navigate to our SPA route.
    if (loc) {
      nav(`/case/${loc}`);
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
          <FileDropZone onFiles={setFiles} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">{files.length} files selected</div>
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
