import { useQuery, useMutation } from '@tanstack/react-query';
import { getCaseView } from '@/lib/api';
import api from '@/lib/api';

type UploadParams = {
  name: string;
  files: File[];
  caseId?: number;
};

export function useCase(caseId: number) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCaseView(caseId),
    staleTime: 1000 * 30,
  });
}

export function useUploadCase() {
  return useMutation<number, Error, UploadParams>({
    mutationFn: async (params: UploadParams) => {
      const form = new FormData();
      form.append('name', params.name);
      if (params.caseId) form.append('caseId', params.caseId.toString());
      params.files.forEach((f: File) => form.append('files', f));

      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.id; // case id from backend
    },
  });
}
