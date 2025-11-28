import { API_URL } from '../config';
import type { FetchRowsParams, FetchRowsResponse } from '../types';

export async function fetchRows(
    params: FetchRowsParams,
): Promise<FetchRowsResponse> {
    const url = new URL('/creatives', API_URL);

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = (await response.json()) as FetchRowsResponse;

    return data;
}
