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

export function useCreativesQuery() {
    const queryClient = useQueryClient();
    const queryKey = ['creatives'] as const;

    const listQuery = useInfiniteQuery<ListResponse, Error>({
        queryKey,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => fetchCreatives((pageParam as number) ?? 0),
        getNextPageParam: (lastPage: ListResponse, pages: ListResponse[]) => {
            const loaded = pages.reduce(
                (sum: number, page: ListResponse) => sum + page.rows.length,
                0,
            );

            return loaded < lastPage.total ? pages.length : undefined;
        },
    });

    const mutation = useMutation<
        CreativeRow,
        Error,
        { id: number; payload: CreativeUpdatePayload },
        { prev?: InfiniteData<ListResponse> }
    >({
        mutationFn: ({ id, payload }) =>
            apiClient
                .patch<{ row: CreativeRow }>(`/creatives/${id}`, payload)
                .then((res) => res.data.row),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey });

            const prev =
                queryClient.getQueryData<InfiniteData<ListResponse>>(queryKey);

            queryClient.setQueryData<InfiniteData<ListResponse> | undefined>(
                queryKey,
                (old) => {
                    if (!old) return old;

                    const pages = old.pages.map((page) => ({
                        ...page,
                        rows: page.rows.map((row) =>
                            row.id === variables.id
                                ? { ...row, ...variables.payload }
                                : row,
                        ),
                    }));

                    return { ...old, pages };
                },
            );

            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) {
                queryClient.setQueryData(queryKey, ctx.prev);
            }
        },
    });

    return { listQuery, mutation, queryKey };
}
