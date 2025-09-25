import { Doc } from '@/types';
import { parseAI } from '@/lib/aiParser';

export default function DocCard({ doc, highlight }: { doc: Doc; highlight: string }) {
  const { summary, facts } = parseAI(highlight);

  return (
    <div className="rounded-lg border bg-gray-50 p-4 shadow-sm">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span className="font-medium">{doc.doc_type || 'Unknown type'}</span>
        <span>{doc.provider || 'Unknown provider'}</span>
        <span className="italic text-gray-500">{doc.filename}</span>
      </div>

      {summary.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {summary.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}

      {facts.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-gray-500">Show facts</summary>
          <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(facts, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
