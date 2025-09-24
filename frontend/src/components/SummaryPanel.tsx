import { parseAI } from '@/lib/aiParser';

export default function SummaryPanel({ summary }: { summary: string }) {
  const { summary: bullets, facts } = parseAI(summary);
  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Case Summary</h2>
      {bullets.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : (
        <pre className="whitespace-pre-wrap text-sm text-gray-500">{summary}</pre>
      )}

      {facts.length > 0 && (
        <div>
          <h3 className="text-md mb-2 font-medium">Facts</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(facts[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facts.map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  {Object.keys(facts[0]).map((key) => (
                    <td key={key} className="border px-2 py-1">
                      {String(row[key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
