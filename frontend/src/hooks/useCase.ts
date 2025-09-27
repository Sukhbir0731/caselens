import { useQuery, useMutation } from '@tanstack/react-query';
import { getCaseView } from '@/lib/api';
import api from '@/lib/api';

export function useCase(caseId: number) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCaseView(caseId),
    staleTime: 1000 * 30,
  });
}

type UploadParams = {
  name: string;
  files: File[];
  caseId?: number;
};

export function useUploadCase() {
  return useMutation<number, Error, UploadParams>({
    mutationFn: async ({ name, files, caseId }: UploadParams) => {
      const form = new FormData();
      form.append('case_name', name);
      files.forEach((f: File) => form.append('files', f));
      if (caseId !== undefined) {
        form.append('case_id', String(caseId));
      }

      const res = await api.post('/upload', form, {
        maxBodyLength: Infinity,
      });
      return res.data?.case_id as number;
    },
  });
}
