import { useMemo } from 'react';

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import { useQuery } from '@tanstack/react-query';

import { fetchRows } from './shared/api/rows';
import type { CreativeRow } from './shared/types';
const PAGE_SIZE = 300;

function App() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['rows', PAGE_SIZE, 0],
        queryFn: () => fetchRows({ limit: PAGE_SIZE, offset: 0 }),
    });

    const rows = data?.rows ?? [];

    const columns = useMemo<ColumnDef<CreativeRow>[]>(
        () => [
            { header: 'ID', accessorKey: 'id' },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Status', accessorKey: 'status' },
            { header: 'Owner', accessorKey: 'owner' },
            { header: 'Channel', accessorKey: 'channel' },
            { header: 'Campaign', accessorKey: 'campaign' },
            { header: 'Budget', accessorKey: 'budget' },
            { header: 'Impressions', accessorKey: 'impressions' },
            { header: 'Clicks', accessorKey: 'clicks' },
            { header: 'CTR', accessorKey: 'ctr' },
            { header: 'Conversions', accessorKey: 'conversions' },
        ],
        [],
    );

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <div>Loading…</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;

    return (
        <div style={{ padding: 16 }}>
            <h1>sync-table-test-task</h1>
            <p>Rows loaded: {rows.length}</p>

            <div
                style={{
                    maxHeight: 600,
                    overflow: 'auto',
                    border: '1px solid #ccc',
                }}
            >
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                11111111111
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{
                                            position: 'sticky',
                                            top: 0,
                                            background: '#f5f5f5',
                                            borderBottom: '1px solid #ddd',
                                            padding: '4px 8px',
                                            textAlign: 'left',
                                            fontWeight: 600,
                                            fontSize: 12,
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        style={{
                                            borderBottom: '1px solid #eee',
                                            padding: '4px 8px',
                                            fontSize: 12,
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
