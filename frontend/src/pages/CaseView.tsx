import { useParams } from 'react-router-dom';
import { useCase } from '@/hooks/useCase';
import SummaryPanel from '@/components/SummaryPanel';
import Timeline from '@/components/Timeline';

export default function CaseView() {
  const { id } = useParams();
  const caseId = Number(id);
  const { data, isLoading, error } = useCase(caseId);

  if (isLoading) return <div className="p-4">Loading…</div>;
  if (error || !data) return <div className="p-4 text-red-600">Failed to load case.</div>;

  const { meta, docs, caseSummaryRaw, highlightsRaw } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{meta.name}</h1>
        <div className="space-x-2">
          <a
            className="rounded border px-3 py-2"
            href={`${import.meta.env.VITE_API_URL}/export/${meta.id}.json`}
          >
            Export JSON
          </a>
          <button className="rounded border px-3 py-2" onClick={() => window.print()}>
            Print Timeline
          </button>
        </div>
      </header>
      <SummaryPanel summary={caseSummaryRaw || 'Summarization in progress…'} />
      <section>
        <h2 className="text-lg font-semibold">Timeline</h2>
        <Timeline docs={docs} highlights={highlightsRaw} />
      </section>
    </div>
  );
}
