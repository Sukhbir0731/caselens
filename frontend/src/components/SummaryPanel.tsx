export default function SummaryPanel({ summary }: { summary: string }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Case Summary</h2>
      <pre className="mt-2 whitespace-pre-wrap text-sm">{summary}</pre>
    </section>
  );
}
