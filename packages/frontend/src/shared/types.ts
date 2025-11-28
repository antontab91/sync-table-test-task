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

export interface FetchRowsParams {
    limit: number;
    offset: number;
    search?: string;
    status?: string;
    owner?: string;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
}

export interface FetchRowsResponse {
    rows: CreativeRow[];
    total: number;
}
