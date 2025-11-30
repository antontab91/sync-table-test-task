// packages/frontend/src/modules/creatives/types.ts
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

export interface ListResponse {
    rows: CreativeRow[];
    total: number;
}
