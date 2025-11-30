import React, { useCallback, useMemo } from 'react';

import Table from '../../../components/Tabale';
import { useCreativesQuery } from '../hooks/useCreativesQuery';
import { useCreativesRealtime } from '../hooks/useCreativesRealtime';
import { useCreativesTable } from '../hooks/useCreativesTable';
import type { CreativeUpdatePayload } from '../types';

const CreativesTable: React.FC = () => {
    const { listQuery, mutation } = useCreativesQuery();

    useCreativesRealtime();

    const pages = useMemo(() => listQuery.data?.pages || [], [listQuery.data]);
    const rows = useMemo(() => pages.flatMap((page) => page.rows), [pages]);

    const total = pages[0]?.total || 0;

    const handleEdit = useCallback(
        (id: number, patch: CreativeUpdatePayload) => {
            mutation.mutate({ id, payload: patch });
        },
        [mutation],
    );

    const { columns } = useCreativesTable({ onEdit: handleEdit });

    return (
        <Table
            columns={columns}
            data={rows}
            total={total}
            isLoading={listQuery.isLoading || listQuery.isFetchingNextPage}
            loadMore={() => listQuery.fetchNextPage()}
        />
    );
};

export default React.memo(CreativesTable);
