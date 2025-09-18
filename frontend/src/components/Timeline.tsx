import type { Doc } from '@/types';
import DocCard from './DocCard';

export default function Timeline({
  docs,
  highlights,
}: {
  docs: Doc[];
  highlights: Record<number, string>;
}) {
  return (
    <ol className="relative mt-2 rounded-2xl border-s border-gray-300 bg-white p-4 shadow">
      {docs.map((d) => (
        <DocCard key={d.id} doc={d} highlight={highlights[d.id]} />
      ))}
    </ol>
  );
}
