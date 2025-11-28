import { pool } from '../../db/pool';
import type {
    CreativeRow,
    ListParamsNormalized,
    ListResult,
    CreativeUpdatePayload,
} from './types';

const SORTABLE_COLUMNS = new Set<string>([
    'id',
    'name',
    'status',
    'owner',
    'channel',
    'campaign',
    'budget',
    'impressions',
    'clicks',
    'ctr',
    'conversions',
    'created_at',
    'updated_at',
]);

export async function listCreativeRecords(
    params: ListParamsNormalized,
): Promise<ListResult> {
    const { limit, offset, search, status, owner, orderBy, orderDir } = params;

    const whereParts: string[] = [];
    const baseParams: unknown[] = [];
    let idx = 1;

    if (search) {
        const text = String(search);
        const numeric = Number(text);
        if (Number.isFinite(numeric)) {
            whereParts.push(
                `(name ILIKE $${idx} OR campaign ILIKE $${idx} OR owner ILIKE $${idx} OR id = $${
                    idx + 1
                })`,
            );
            baseParams.push(`%${text}%`, numeric);
            idx += 2;
        } else {
            whereParts.push(
                `(name ILIKE $${idx} OR campaign ILIKE $${idx} OR owner ILIKE $${idx})`,
            );
            baseParams.push(`%${text}%`);
            idx += 1;
        }
    }

    if (status) {
        whereParts.push(`status = $${idx}`);
        baseParams.push(status);
        idx += 1;
    }

    if (owner) {
        whereParts.push(`owner = $${idx}`);
        baseParams.push(owner);
        idx += 1;
    }

    const whereSql =
        whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    const safeOrderBy = SORTABLE_COLUMNS.has(String(orderBy))
        ? String(orderBy)
        : 'id';
    const safeOrderDir =
        String(orderDir).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const rowsSql = `
        SELECT
            id,
            name,
            status,
            owner,
            channel,
            campaign,
            budget::text,
            impressions,
            clicks,
            ctr::text,
            conversions,
            created_at::text,
            updated_at::text
        FROM creatives
        ${whereSql}
        ORDER BY ${safeOrderBy} ${safeOrderDir}
        LIMIT $${idx} OFFSET $${idx + 1}
    `;

    const queryParams = [...baseParams, limit, offset];

    const { rows } = await pool.query<CreativeRow>(rowsSql, queryParams);

    const countSql = `
        SELECT COUNT(*)::text AS count
        FROM creatives
        ${whereSql}
    `;

    const { rows: countRows } = await pool.query<{ count: string }>(
        countSql,
        baseParams,
    );

    const total = Number(countRows[0]?.count ?? '0');

    return { rows, total };
}

export async function updateCreativeRecord(
    id: number,
    payload: CreativeUpdatePayload,
): Promise<CreativeRow | null> {
    const entries = Object.entries(payload).filter(([, v]) => v !== undefined);

    if (entries.length === 0) return null;

    const ALLOWED = new Set([
        'name',
        'status',
        'owner',
        'channel',
        'campaign',
        'budget',
        'impressions',
        'clicks',
        'ctr',
        'conversions',
    ]);

    const setParts: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    for (const [key, value] of entries) {
        if (!ALLOWED.has(key)) continue;
        setParts.push(`${key} = $${idx}`);
        params.push(value);
        idx += 1;
    }

    if (setParts.length === 0) return null;

    setParts.push(`updated_at = NOW()`);

    params.push(id);

    const sql = `
        UPDATE creatives
        SET ${setParts.join(', ')}
        WHERE id = $${idx}
        RETURNING
            id,
            name,
            status,
            owner,
            channel,
            campaign,
            budget::text,
            impressions,
            clicks,
            ctr::text,
            conversions,
            created_at::text,
            updated_at::text
    `;

    const { rows } = await pool.query<CreativeRow>(sql, params);

    return rows[0] ?? null;
}
