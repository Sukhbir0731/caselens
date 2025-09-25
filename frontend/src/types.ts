export type Doc = {
  id: number;
  filename: string;
  slug: string;
  page_count: number;
  text?: string;
  hash_sig?: string;
  doc_type?: string | null;
  provider?: string | null;
  date_str?: string | null;
};

export type CaseMeta = {
  id: number;
  name: string;
  created_at: string;
};

export type CaseExport = {
  case: CaseMeta;
  docs: Array<Pick<Doc, 'id' | 'filename' | 'date_str' | 'provider' | 'doc_type'>>;
};
