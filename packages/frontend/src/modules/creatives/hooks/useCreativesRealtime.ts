import { useCallback } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { useWebSocket } from '../../../hooks/useWebSocket';
import type { CreativeRow, ListResponse } from '../types';

interface WsEvent<T = unknown> {
    type: string;
    payload: T;
}

export default function useCreativesRealtime(): void {
    const queryClient = useQueryClient();
    const queryKey = ['creatives'];

    const handleMessage = useCallback(
        (event: WsEvent) => {
            if (event.type !== 'creativeRecord.updated') return;

            const updated = event.payload as CreativeRow;

            queryClient.setQueryData<InfiniteData<ListResponse> | undefined>(
                queryKey,
                (old) => {
                    if (!old) return old;

                    const pages = old.pages.map((page) => ({
                        ...page,
                        rows: page.rows.map((row) =>
                            row.id === updated.id ? updated : row,
                        ),
                    }));

                    return { ...old, pages };
                },
            );
        },
        [queryClient, queryKey],
    );

    useWebSocket<WsEvent>({
        url: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
            window.location.hostname
        }:4000/creatives`,
        onMessage: handleMessage,
    });
}
