import type {
    CreativeUpdatePayload,
    ListParamsNormalized,
    ListRawParams,
    ListResult,
} from './types';
import { listCreativeRecords, updateCreativeRecord } from './queries';
import { broadcast } from '../../services/ws/client';

const MAX_LIMIT = 1000;

export function normalizeListParams(raw: ListRawParams): ListParamsNormalized {
    const rawLimit = Number(raw.limit ?? 100);
    const rawOffset = Number(raw.offset ?? 0);

    const limit = Number.isFinite(rawLimit)
        ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
        : 100;

    const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0;

    const search = (raw.search ?? '').toString().trim();
    const status = (raw.status ?? '').toString().trim();
    const owner = (raw.owner ?? '').toString().trim();
    const orderBy = (raw.orderBy ?? 'id').toString().trim();
    const orderDirRaw = (raw.orderDir ?? 'asc').toString().trim().toLowerCase();

    const orderDir: ListParamsNormalized['orderDir'] =
        orderDirRaw === 'desc' ? 'DESC' : 'ASC';

    return {
        limit,
        offset,
        search,
        status,
        owner,
        orderBy,
        orderDir,
    };
}

export async function listCreativeRecordsWithFilters(
    rawParams: ListRawParams,
): Promise<ListResult> {
    const params = normalizeListParams(rawParams);
    return listCreativeRecords(params);
}

export async function patchCreativeRecordById(
    id: number,
    payload: CreativeUpdatePayload,
) {
    const updated = await updateCreativeRecord(id, payload);

    if (updated === null) {
        const hasFields = Object.values(payload).some((v) => v !== undefined);

        return {
            notFound: hasFields,
            noFields: !hasFields,
            row: null,
        };
    }

    broadcast({
        type: 'creativeRecord.updated',
        payload: updated,
    });

    return {
        notFound: false,
        noFields: false,
        row: updated,
    };
}
