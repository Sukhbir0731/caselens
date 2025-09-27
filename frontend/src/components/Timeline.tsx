import type { Doc } from '@/types';
import DocCard from './DocCard';

export default function Timeline({
  docs,
  highlights,
}: {
  docs: Doc[];
  highlights: Record<number, string>;
}) {
  const groups: Record<string, Doc[]> = {};
  for (const d of docs) {
    const key = d.date_str || 'Undated';
    if (!groups[key]) groups[key] = [];
    groups[key].push(d);
  }

  const sortedDates = Object.keys(groups).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-md font-semibold text-gray-700">{date}</h3>
          <ol className="relative mt-2 border-s border-gray-300">
            {groups[date].map((d) => (
              <DocCard key={d.id} doc={d} highlight={highlights[d.id]} />
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
