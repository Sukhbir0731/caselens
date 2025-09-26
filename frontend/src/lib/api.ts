import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export async function listCases(): Promise<{ id: number; name: string }[]> {
  const res = await api.get('/api/cases');
  return res.data;
}

export async function deleteCase(caseId: number) {
  const res = await api.delete(`/api/case/${caseId}`);
  return res.data;
}

export async function uploadCase(caseName: string, files: File[]) {
  const form = new FormData();
  form.append('case_name', caseName);
  files.forEach((f) => form.append('files', f));
  const res = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    maxBodyLength: Infinity,
  });
  // backend responds with { case_id }
  return (res.data?.case_id as number) ?? undefined;
}

export async function getCaseJSON(caseId: number) {
  const res = await api.get(`/export/${caseId}.json`);
  return res.data as import('@/types').CaseExport;
}

export async function getCaseView(caseId: number) {
  // We'll expose a backend JSON later: /api/case/{id} containing
  // { meta, docs, highlightsRaw, caseSummaryRaw }
  const res = await api.get(`/api/case/${caseId}`);
  return res.data as {
    meta: import('@/types').CaseMeta;
    docs: import('@/types').Doc[];
    highlightsRaw: Record<number, string>;
    caseSummaryRaw: string;
  };
}

export async function listCasesJSON() {
  const res = await api.get('/api/cases');
  return res.data as {
    id: number;
    name: string;
    created_at: string;
    doc_count: number;
  }[];
}

export async function getCase(id: number) {
  return {
    meta: { id, name: 'Demo Case', created_at: '2025-09-04' },
    docs: [
      {
        id: 1,
        filename: 'note.pdf',
        slug: 'note',
        page_count: 2,
        doc_type: 'progress_note',
        provider: 'Dr. Smith',
        date_str: '2023-01-01',
      },
      {
        id: 2,
        filename: 'xray.pdf',
        slug: 'xray',
        page_count: 1,
        doc_type: 'radiology',
        provider: 'Radiology Dept',
        date_str: '2023-02-10',
      },
    ],
    highlightsRaw: { 1: 'Patient stable, follow-up required.', 2: 'Imaging shows fracture.' },
    caseSummaryRaw: 'Case summary goes here.',
  };
}

export default api;
