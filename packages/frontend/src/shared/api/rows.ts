import type { CreativeRow } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export interface FetchRowsParams {
    limit: number;
    offset: number;
}

export interface FetchRowsResponse {
    rows: CreativeRow[];
}

export async function fetchRows(
    params: FetchRowsParams,
): Promise<FetchRowsResponse> {
    const url = new URL('/rows', API_URL);
    url.searchParams.set('limit', String(params.limit));
    url.searchParams.set('offset', String(params.offset));

    const res = await fetch(url);
    if (!res.ok) throw new Error('failed to load rows');

    return res.json();
}
