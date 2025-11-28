import type { Express, Request, Response } from 'express';
import type { CreativeUpdatePayload } from '../modules/creativeRecords';

import creativeRecords from '../modules/creativeRecords';

const {
    actions: { listCreativeRecordsWithFilters, patchCreativeRecordById },
} = creativeRecords;

export function registerCreativeRecordsRoutes(app: Express): void {
    app.get('/creatives', async (req: Request, res: Response) => {
        try {
            const rawParams = {
                limit: req.query.limit,
                offset: req.query.offset,
                search: req.query.search,
                status: req.query.status,
                owner: req.query.owner,
                orderBy: req.query.orderBy,
                orderDir: req.query.orderDir,
            };

            const result = await listCreativeRecordsWithFilters(rawParams);

            res.json({
                rows: result.rows,
                total: result.total,
            });
        } catch (err) {
            console.error('GET /creatives failed', err);
            res.status(500).json({ error: 'internal error' });
        }
    });

    app.patch(
        '/creatives/:id',
        async (
            req: Request<{ id: string }, unknown, CreativeUpdatePayload>,
            res: Response,
        ) => {
            try {
                const { id } = req.params;

                const parsedId = Number(id);
                if (!Number.isFinite(parsedId) || parsedId <= 0) {
                    res.status(400).json({ error: 'invalid id' });
                    return;
                }

                const body = req.body ?? {};

                const { notFound, noFields, row } =
                    await patchCreativeRecordById(parsedId, body);

                if (noFields) {
                    res.status(400).json({ error: 'no fields to update' });
                    return;
                }

                if (notFound || !row) {
                    res.status(404).json({ error: 'creative not found' });
                    return;
                }

                res.json({ row });
            } catch (err) {
                console.error('PATCH /creatives/:id failed', err);
                res.status(500).json({ error: 'internal error' });
            }
        },
    );
}
