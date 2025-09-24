import { Doc } from '@/types';
import { parseAI } from '@/lib/aiParser';

export default function DocCard({ doc, highlight }: { doc: Doc; highlight: string }) {
  const { summary, facts } = parseAI(highlight);

  return (
    <li className="mb-4 ml-4">
      <div className="absolute -left-1.5 mt-2 h-3 w-3 rounded-full border bg-gray-300"></div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>{doc.date_str || 'Unknown date'}</span>
          <span>{doc.doc_type}</span>
          <span>{doc.filename}</span>
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
            <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">
              {JSON.stringify(facts, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </li>
  );
}
