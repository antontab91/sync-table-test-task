export interface CreativeRow {
    id: number;
    name: string;
    status: string;
    owner: string;
    channel: string;
    campaign: string;
    budget: string;
    impressions: number;
    clicks: number;
    ctr: string;
    conversions: number;
    created_at: string;
    updated_at: string;
}

export interface CreativeUpdatePayload {
    [key: string]: string | number | undefined;
}

export interface ListRawParams {
    limit?: unknown;
    offset?: unknown;
    search?: unknown;
    status?: unknown;
    owner?: unknown;
    orderBy?: unknown;
    orderDir?: unknown;
}

export interface ListParamsNormalized {
    limit: number;
    offset: number;
    search: string;
    status: string;
    owner: string;
    orderBy: string;
    orderDir: 'ASC' | 'DESC';
}

export interface ListResult {
    rows: CreativeRow[];
    total: number;
}
