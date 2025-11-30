import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type InfiniteData,
} from '@tanstack/react-query';

import { apiClient } from '../../../services/apiClient';
import type {
    CreativeRow,
    CreativeUpdatePayload,
    ListResponse,
} from '../types';

const PAGE_SIZE = 100;
export const CREATIVES_QUERY_KEY = ['creatives'] as const;

type EditVariables = {
    id: number;
    payload: CreativeUpdatePayload;
};

type EditContext = {
    previousData?: InfiniteData<ListResponse>;
};

function fetchCreatives(page: number): Promise<ListResponse> {
    return apiClient
        .get<ListResponse>('/creatives', {
            params: {
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            },
        })
        .then((res) => res.data);
}

export default function useCreativesQuery() {
    const queryClient = useQueryClient();

    const listQuery = useInfiniteQuery({
        queryKey: CREATIVES_QUERY_KEY,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => fetchCreatives((pageParam as number) ?? 0),
        getNextPageParam: (lastPage, allPages) => {
            const loadedRows = allPages.reduce(
                (sum, page) => sum + page.rows.length,
                0,
            );

            return loadedRows < lastPage.total ? allPages.length : undefined;
        },
    });

    const mutation = useMutation<
        CreativeRow,
        Error,
        EditVariables,
        EditContext
    >({
        mutationFn: ({ id, payload }) =>
            apiClient
                .patch<{ row: CreativeRow }>(`/creatives/${id}`, payload)
                .then((res) => res.data.row),

        onMutate: async (variables) => {
            await queryClient.cancelQueries({
                queryKey: CREATIVES_QUERY_KEY,
            });

            const previousData =
                queryClient.getQueryData<InfiniteData<ListResponse>>(
                    CREATIVES_QUERY_KEY,
                );

            queryClient.setQueryData<InfiniteData<ListResponse> | undefined>(
                CREATIVES_QUERY_KEY,
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            rows: page.rows.map((row) =>
                                row.id === variables.id
                                    ? { ...row, ...variables.payload }
                                    : row,
                            ),
                        })),
                    };
                },
            );

            return { previousData };
        },

        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    CREATIVES_QUERY_KEY,
                    context.previousData,
                );
            }
        },
    });

    return { listQuery, mutation };
}
