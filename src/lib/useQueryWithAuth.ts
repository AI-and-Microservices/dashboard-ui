import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, QueryKey } from '@tanstack/react-query';
import apiClient from './api';

export function useQueryWithAuth<TData = unknown, TError = unknown>(
  key: QueryKey,
  url: string,
  options?: UseQueryOptions<TData, TError>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: async () => {
      const {data}: {data: any} = await apiClient.get<TData>(url);
      return data;
    },
    ...options,
  });
}

export function useMutationWithAuth<
  TData = unknown,
  TVariables = void,
  TError = unknown
>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const resolvedUrl = typeof url === 'function' ? url(variables) : url;
      const config = {
        method,
        url: resolvedUrl,
        ...(method !== 'delete' ? { data: variables } : {})
      };
      const response = await apiClient.request<TData>(config);
      return response.data;
    },
    ...options,
  });
}
