import { useQuery, useMutation } from '@tanstack/react-query';
import { getCaseView, uploadCase } from '@/lib/api';

export function useCase(caseId: number) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCaseView(caseId),
    staleTime: 1000 * 30,
  });
}

export function useUploadCase() {
  return useMutation({
    mutationFn: ({ name, files }: { name: string; files: File[] }) => uploadCase(name, files),
  });
}
