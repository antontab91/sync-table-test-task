import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pool } from '../../db/pool';
import {
    SORTABLE_COLUMNS,
    EDITABLE_COLUMN_SET,
    DEFAULT_ORDER_BY,
} from './constants';

import type {
    CreativeRow,
    CreativeUpdatePayload,
    ListParamsNormalized,
    ListResult,
} from './types';

const getCreativesSql = readFileSync(
    resolve(__dirname, '../../db/sql/getCreatives.sql'),
    'utf8',
);

const updateCreativeSql = readFileSync(
    resolve(__dirname, '../../db/sql/updateCreative.sql'),
    'utf8',
);

export async function listCreativeRecords(
    params: ListParamsNormalized,
): Promise<ListResult> {
    const { limit, offset, search, status, owner, orderBy, orderDir } = params;

    const whereParts: string[] = [];
    const baseParams: any[] = [];
    let idx = 1;

    if (search) {
        const like = `%${search}%`;
        whereParts.push(
            `(name ILIKE $${idx} OR campaign ILIKE $${idx} OR owner ILIKE $${idx})`,
        );
        baseParams.push(like);
        idx++;
    }

    if (status) {
        whereParts.push(`status = $${idx}`);
        baseParams.push(status);
        idx++;
    }

    if (owner) {
        whereParts.push(`owner = $${idx}`);
        baseParams.push(owner);
        idx++;
    }

    const whereSql = whereParts.length
        ? `WHERE ${whereParts.join(' AND ')}`
        : '';

    const safeOrderBy = SORTABLE_COLUMNS.has(orderBy)
        ? orderBy
        : DEFAULT_ORDER_BY;
    const safeOrderDir = orderDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = getCreativesSql
        .replace('/*WHERE*/', whereSql)
        .replace('/*ORDERBY*/', safeOrderBy)
        .replace('/*ORDERDIR*/', safeOrderDir)
        .replace('/*LIMIT*/', `$${idx}`)
        .replace('/*OFFSET*/', `$${idx + 1}`);

    const queryParams = [...baseParams, limit, offset];

    const { rows } = await pool.query<CreativeRow>(sql, queryParams);

    const countSql = `SELECT COUNT(*)::text AS count FROM creatives ${whereSql}`;
    const { rows: countRows } = await pool.query(countSql, baseParams);

    return {
        rows,
        total: Number(countRows[0]?.count ?? '0'),
    };
}

export async function updateCreativeRecord(
    id: number,
    payload: CreativeUpdatePayload,
): Promise<CreativeRow | null> {
    const entries = Object.entries(payload).filter(([, v]) => v !== undefined);

    if (entries.length === 0) return null;

    const setParts: string[] = [];
    const params: any[] = [];
    let idx = 1;

    for (const [key, value] of entries) {
        if (!EDITABLE_COLUMN_SET.has(key)) continue;
        setParts.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
    }

    if (setParts.length === 0) return null;

    let sql = updateCreativeSql
        .replace('/*SET*/', setParts.join(', '))
        .replace('$ID', `$${idx}`);

    params.push(id);

    const { rows } = await pool.query<CreativeRow>(sql, params);

    return rows[0] ?? null;
}
