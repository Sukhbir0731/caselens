import type { Doc } from '@/types';
import DocCard from './DocCard';

export default function Timeline({
  docs,
  highlights,
}: {
  docs: Doc[];
  highlights: Record<number, string>;
}) {
  const grouped: Record<string, Doc[]> = {};
  docs.forEach((d) => {
    const key = d.date_str || 'Unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <ol className="relative border-s border-gray-300">
        {sortedDates.map((date) => (
          <li key={date} className="mb-6 ml-4">
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border bg-gray-300"></div>
            <h3 className="mb-2 font-semibold text-gray-800">{date}</h3>
            <div className="space-y-4">
              {grouped[date].map((d) => (
                <DocCard key={d.id} doc={d} highlight={highlights[d.id]} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
