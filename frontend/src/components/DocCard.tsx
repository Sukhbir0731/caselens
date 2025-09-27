import React, { useState } from 'react';
import type { Doc } from '@/types';

export default function DocCard({ doc, highlight }: { doc: Doc; highlight?: string }) {
  const [showRaw, setShowRaw] = useState(false);

  const summaryMatch = highlight?.match(/<CASE_SUMMARY>([\s\S]*?)<\/CASE_SUMMARY>/);
  const factsMatch = highlight?.match(/<FACTS_JSON>([\s\S]*?)<\/FACTS_JSON>/);

  const summary = summaryMatch ? summaryMatch[1].trim() : '';
  const facts = factsMatch ? factsMatch[1].trim() : '';

  return (
    <li className="mb-4 ml-4">
      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{doc.doc_type || 'Unknown'}</h3>
          <span className="text-xs text-gray-500">{doc.date_str || 'No date'}</span>
        </div>
        <p className="text-sm text-gray-600">{doc.provider}</p>
        <p className="text-xs text-gray-400">{doc.filename}</p>

        {summary && <div className="mt-2 whitespace-pre-line text-sm">{summary}</div>}

        {facts && (
          <button
            onClick={() => setShowRaw((s) => !s)}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            {showRaw ? 'Hide details' : 'Show details'}
          </button>
        )}

        {showRaw && (
          <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">{facts}</pre>
        )}
      </div>
    </li>
  );
}
