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
      const response = await apiClient.get<TData>(url);
      return response.data;
    },
    ...options,
  });
}

export function useMutationWithAuth<TData = unknown, TVariables = void, TError = unknown>(
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    options?: UseMutationOptions<TData, TError, TVariables>
  ) {
    return useMutation<TData, TError, TVariables>({
      mutationFn: async (variables: TVariables) => {
        const response = await apiClient.request<TData>({
          method,
          url,
          data: variables,
        });
        return response.data;
      },
      ...options,
    });
  }
  