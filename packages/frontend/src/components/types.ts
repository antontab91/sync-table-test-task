// packages/frontend/src/components/types.ts
import type { ColumnDef } from '@tanstack/react-table';

export interface BaseRow {
    id: number;
}

export interface TableProps<TData extends BaseRow> {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
    total: number;
    isLoading: boolean;
    loadMore: () => void;
    // onScrollEndThreshold?: number;
}
