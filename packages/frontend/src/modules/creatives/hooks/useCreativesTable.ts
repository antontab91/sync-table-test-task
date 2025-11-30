import React, { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import {
    EditableTextCell,
    EditableNumberCell,
    EditableSelectCell,
} from '../../../components';

import type { CreativeRow, CreativeUpdatePayload } from '../types';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
];

interface Params {
    onEdit: (id: number, patch: CreativeUpdatePayload) => void;
}

export default function useCreativesTable({ onEdit }: Params) {
    const columns = useMemo<ColumnDef<CreativeRow, unknown>[]>(() => {
        return [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 80,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 240,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableTextCell, {
                        value: String(getValue() ?? ''),
                        onChange: (value: string) =>
                            onEdit(row.original.id, { name: value }),
                    }),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 140,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableSelectCell, {
                        value: String(getValue() ?? ''),
                        options: STATUS_OPTIONS,
                        onChange: (value: string) =>
                            onEdit(row.original.id, { status: value }),
                    }),
            },
            {
                accessorKey: 'owner',
                header: 'Owner',
                size: 180,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableTextCell, {
                        value: String(getValue() ?? ''),
                        onChange: (value: string) =>
                            onEdit(row.original.id, { owner: value }),
                    }),
            },
            {
                accessorKey: 'channel',
                header: 'Channel',
                size: 160,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableTextCell, {
                        value: String(getValue() ?? ''),
                        onChange: (value: string) =>
                            onEdit(row.original.id, { channel: value }),
                    }),
            },
            {
                accessorKey: 'campaign',
                header: 'Campaign',
                size: 220,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableTextCell, {
                        value: String(getValue() ?? ''),
                        onChange: (value: string) =>
                            onEdit(row.original.id, { campaign: value }),
                    }),
            },
            {
                accessorKey: 'budget',
                header: 'Budget',
                size: 120,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableNumberCell, {
                        value: Number(getValue() ?? 0),
                        onChange: (value: number) =>
                            onEdit(row.original.id, { budget: String(value) }),
                    }),
            },
            {
                accessorKey: 'impressions',
                header: 'Impressions',
                size: 120,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableNumberCell, {
                        value: Number(getValue() ?? 0),
                        onChange: (value: number) =>
                            onEdit(row.original.id, { impressions: value }),
                    }),
            },
            {
                accessorKey: 'clicks',
                header: 'Clicks',
                size: 100,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableNumberCell, {
                        value: Number(getValue() ?? 0),
                        onChange: (value: number) =>
                            onEdit(row.original.id, { clicks: value }),
                    }),
            },
            {
                accessorKey: 'ctr',
                header: 'CTR %',
                size: 100,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableNumberCell, {
                        value: Number(
                            String(getValue() ?? '0').replace('%', ''),
                        ),
                        onChange: (value: number) =>
                            onEdit(row.original.id, { ctr: String(value) }),
                    }),
            },
            {
                accessorKey: 'conversions',
                header: 'Conversions',
                size: 130,
                cell: ({ row, getValue }) =>
                    React.createElement(EditableNumberCell, {
                        value: Number(getValue() ?? 0),
                        onChange: (value: number) =>
                            onEdit(row.original.id, { conversions: value }),
                    }),
            },
            {
                accessorKey: 'created_at',
                header: 'Created',
                size: 190,
            },
            {
                accessorKey: 'updated_at',
                header: 'Updated',
                size: 190,
            },
        ];
    }, [onEdit]);

    return { columns };
}
