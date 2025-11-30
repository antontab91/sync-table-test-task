import React, { useEffect, useRef, useCallback } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { BaseRow, TableProps } from './types';
import './table.css';

const SCROLL_THRESHOLD = 400;

function TableInner<TData extends BaseRow>({
    columns,
    data,
    total,
    isLoading,
    loadMore,
}: TableProps<TData>) {
    const table = useReactTable<TData>({
        data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(row.id),
    });

    const parentRef = useRef<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
        overscan: 20,
    });

    const handleScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            if (isLoading || data.length >= total) return;

            const el = event.currentTarget;
            const distanceToBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight;

            if (
                distanceToBottom < SCROLL_THRESHOLD &&
                !isLoading &&
                data.length < total
            ) {
                loadMore();
            }
        },
        [isLoading, data.length, total, loadMore],
    );

    useEffect(() => {
        rowVirtualizer.measure();
    }, [data.length, rowVirtualizer]);

    const headerGroups = table.getHeaderGroups();
    const rows = table.getRowModel().rows;

    return (
        <div className="table-root">
            <div className="table-head">
                {headerGroups.map((headerGroup) => (
                    <div
                        key={headerGroup.id}
                        className="table-row table-row-head"
                    >
                        {headerGroup.headers.map((header) => (
                            <div
                                key={header.id}
                                className="table-col table-col-head"
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

            <div ref={parentRef} className="table-body" onScroll={handleScroll}>
                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        position: 'relative',
                        width: '100%',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        if (!row) return null;

                        return (
                            <div
                                key={row.id}
                                className="table-row"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`,
                                    willChange: 'transform',
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div
                                        key={cell.id}
                                        className="col"
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
}

export default TableInner;
