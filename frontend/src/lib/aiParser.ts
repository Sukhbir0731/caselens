export type ParsedAI = {
  summary: string[];
  facts: Record<string, any>[];
};

export function parseAI(raw: string): ParsedAI {
  if (!raw) return { summary: [], facts: [] };

  // Extract summary block
  const summaryMatch = raw.match(/<CASE_SUMMARY>([\s\S]*?)<\/CASE_SUMMARY>/i);
  const summaryText = summaryMatch ? summaryMatch[1].trim() : '';
  const summary = summaryText
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  // Extract facts block
  const factsMatch = raw.match(/<FACTS_JSON>([\s\S]*?)<\/FACTS_JSON>/i);
  let facts: Record<string, any>[] = [];
  if (factsMatch) {
    try {
      const parsed = JSON.parse(factsMatch[1].trim());
      if (Array.isArray(parsed)) {
        facts = parsed;
      } else if (parsed && typeof parsed === 'object') {
        facts = [parsed];
      }
    } catch {
      facts = [];
    }
  }

  return { summary, facts };
}
