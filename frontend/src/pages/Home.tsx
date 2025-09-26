import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileDropZone from '@/components/FileDropZone';
import { useUploadCase } from '@/hooks/useCase';
import { listCases, deleteCase, uploadCase } from '@/lib/api';

export default function Home() {
  const [name, setName] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<Record<string, string>>({});
  const [cases, setCases] = React.useState<{ id: number; name: string }[]>([]);
  const [selectedCaseId, setSelectedCaseId] = React.useState<number | null>(null);
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  const nav = useNavigate();
  const upload = useUploadCase();

  React.useEffect(() => {
    refreshCases();
  }, []);

  async function refreshCases() {
    const all = await listCases();
    setCases(all);
  }

  async function onUpload() {
    if (files.length === 0) return;

    setStatus(Object.fromEntries(files.map((f) => [f.name, '⏳ Processing...'])));

    try {
      // If selectedCaseId is set, append docs to that case
      const loc = await upload.mutateAsync({
        name,
        files,
        caseId: selectedCaseId ?? undefined,
      });

      if (loc) {
        setStatus((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, '✅ Processed'])));
        setFiles([]);
        setSelectedCaseId(null);
        refreshCases();
        nav(`/case/${loc}`);
      }
    } catch {
      setStatus((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, '❌ Failed'])));
    }
  }

  async function onDelete(caseId: number) {
    if (!window.confirm('Are you sure you want to delete this case?')) return;

    try {
      await deleteCase(caseId); // call backend
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      if (selectedCaseId === caseId) {
        setSelectedCaseId(null);
        setName('');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Existing cases */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-2 text-lg font-semibold">Existing Cases</h2>
        {cases.length === 0 ? (
          <p className="text-sm text-gray-500">No cases yet.</p>
        ) : (
          <ul className="space-y-2">
            {cases.map((c) => (
              <li
                key={c.id}
                className={`flex items-center justify-between rounded border p-2 ${
                  selectedCaseId === c.id ? 'bg-gray-100' : ''
                }`}
              >
                <button
                  onClick={() => nav(`/case/${c.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  {c.name}
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedCaseId(selectedCaseId === c.id ? null : c.id)}
                    className="text-sm text-gray-700 hover:underline"
                  >
                    {selectedCaseId === c.id ? '✓ Selected' : 'Add Docs'}
                  </button>
                  <button className="text-red-500 hover:underline" onClick={() => onDelete(c.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload new docs */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <label className="block text-sm font-medium">Case Name</label>
        <input
          className="mt-1 w-full rounded border p-2"
          value={selectedCaseId ? selectedCase?.name || '' : name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Doe v. ACME"
          disabled={!!selectedCaseId}
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
            {upload.isPending
              ? 'Uploading…'
              : selectedCaseId
                ? 'Add to Selected Case'
                : 'Upload & Create Case'}
          </button>
        </div>
      </div>
    </div>
  );
}
