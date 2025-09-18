import type { Doc } from '@/types';

export default function DocCard({ doc, highlight }: { doc: Doc; highlight?: string }) {
  return (
    <li className="ms-6 py-3">
      <span className="absolute -start-3.5 mt-1 h-3 w-3 rounded-full bg-gray-800"></span>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-mono">{doc.date_str ?? '—'}</span>
        <span>•</span>
        <span>{doc.doc_type ?? 'document'}</span>
        <span>•</span>
        <span className="max-w-[40ch] truncate">{doc.filename}</span>
      </div>
      {highlight ? (
        <details className="mt-1">
          <summary className="cursor-pointer text-blue-700">AI Highlights</summary>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{highlight}</pre>
        </details>
      ) : null}
    </li>
  );
}
