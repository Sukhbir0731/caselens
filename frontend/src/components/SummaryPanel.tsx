import React from 'react';

function parseFacts(raw: string) {
  // Extract JSON inside <FACTS_JSON> ... </FACTS_JSON>
  const match = raw.match(/<FACTS_JSON>([\s\S]*?)<\/FACTS_JSON>/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1].trim());
    return Array.isArray(parsed) ? parsed : [parsed]; // normalize
  } catch (err) {
    console.error('Failed to parse FACTS_JSON:', err);
    return null;
  }
}

export default function SummaryPanel({ summary }: { summary: string }) {
  const facts = parseFacts(summary);

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Case Summary</h2>

      {/* Render case summary raw text if no facts */}
      {!facts && (
        <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
          {summary || 'Summarizing… please wait'}
        </pre>
      )}

      {/* Render facts as a clean table */}
      {facts && (
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Provider</th>
              <th className="p-2 text-left">Doc Type</th>
              <th className="p-2 text-left">Diagnoses</th>
              <th className="p-2 text-left">Treatments</th>
            </tr>
          </thead>
          <tbody>
            {facts.map((f, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{f.date_of_visit || f.date || '—'}</td>
                <td className="p-2">{f.provider || '—'}</td>
                <td className="p-2">{f.doc_type || '—'}</td>
                <td className="p-2">
                  {f.diagnoses && f.diagnoses.length > 0 ? f.diagnoses.join(', ') : '—'}
                </td>
                <td className="p-2">
                  {f.treatments && f.treatments.length > 0 ? f.treatments.join(', ') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
