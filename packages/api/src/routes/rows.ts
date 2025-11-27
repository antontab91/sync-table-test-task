import type { FastifyInstance } from 'fastify';
import { pool } from '../db/pool';

// дубль , есть типы , нужно вынести в отдельный файл
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

export async function registerRowsRoutes(app: FastifyInstance): Promise<void> {
    app.get('/rows', async (request) => {
        const { searchParams } = new URL(request.url, 'http://localhost');
        const limit = Number(searchParams.get('limit') ?? '100');
        const offset = Number(searchParams.get('offset') ?? '0');

        const { rows } = await pool.query<CreativeRow>(
            `
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
            ORDER BY id
            LIMIT $1 OFFSET $2
            `,
            [limit, offset],
        );

        return { rows };
    });
}
