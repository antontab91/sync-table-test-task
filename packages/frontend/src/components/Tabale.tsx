import React, { useEffect, useRef, useCallback } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { CreativeRow } from '../modules/creatives/types';

import './table.css';

const SCROLL_THRESHOLD = 400;
const ROW_HEIGHT = 40;

interface Props {
    columns: ColumnDef<CreativeRow, unknown>[];
    data: CreativeRow[];
    total: number;
    isLoading: boolean;
    loadMore: () => void;
}

const Table: React.FC<Props> = ({
    columns,
    data,
    total,
    isLoading,
    loadMore,
}) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const table = useReactTable<CreativeRow>({
        data,
        columns: columns as ColumnDef<CreativeRow, unknown>[],
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(row.id),
    });

    const rows = table.getRowModel().rows;

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 30,
    });

    const virtualRows = virtualizer.getVirtualItems();
    const totalHeight = virtualizer.getTotalSize();

    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
    const paddingBottom =
        virtualRows.length > 0
            ? totalHeight - virtualRows[virtualRows.length - 1].end
            : 0;

    const handleScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            if (isLoading || data.length >= total) return;

            const el = event.currentTarget;
            const distanceToBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight;

            if (distanceToBottom < SCROLL_THRESHOLD) {
                loadMore();
            }
        },
        [isLoading, data.length, total, loadMore],
    );

    useEffect(() => {
        virtualizer.measure();
    }, [data.length, virtualizer]);

    return (
        <div className="table">
            <div className="table__head">
                {table.getHeaderGroups().map((headerGroup) => (
                    <div
                        key={headerGroup.id}
                        className="table__row table__row--head"
                    >
                        {headerGroup.headers.map((header) => (
                            <div
                                key={header.id}
                                className="table__cell table__cell--head"
                                style={{ width: header.getSize() }}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                      )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div
                ref={scrollRef}
                className="table__body"
                onScroll={handleScroll}
            >
                <div style={{ paddingTop, paddingBottom }}>
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        if (!row) return null;

                        return (
                            <div key={row.id} className="table__row">
                                {row.getVisibleCells().map((cell) => (
                                    <div
                                        key={cell.id}
                                        className="table__cell"
                                        style={{ width: cell.column.getSize() }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Table;
