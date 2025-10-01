import { useParams } from 'react-router-dom';
import { useCase } from '@/hooks/useCase';
import SummaryPanel from '@/components/SummaryPanel';
import Timeline from '@/components/Timeline';
import { Printer } from 'lucide-react';

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
        <div className="flex items-center gap-2">
          <a
            className="rounded-xl border px-3 py-2"
            href={`${import.meta.env.VITE_API_URL}/export/${meta.id}.json`}
          >
            Export JSON
          </a>
          <div className="space-x-2">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1 rounded-xl border px-3 py-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print Timeline</span>
            </button>
          </div>
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
