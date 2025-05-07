import { getExplorers } from '@/lib/explorerApi';
import { useQuery } from '@tanstack/react-query';

export const useGetExplorer = (offset:number, pageLimit: number, country: string) => {
  return useQuery({
    queryKey: ['explorer', offset, pageLimit, country],
    queryFn: async () => getExplorers(offset, pageLimit, country)
  });
};