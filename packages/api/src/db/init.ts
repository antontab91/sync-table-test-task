import { pool } from './pool';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDbReady(): Promise<void> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await pool.query('SELECT 1');
            console.log('DB is ready');
            return;
        } catch (err: any) {
            console.log(
                `DB not ready (attempt ${attempt}/${MAX_RETRIES}), code=${err.code}`,
            );
            if (attempt < MAX_RETRIES) {
                await sleep(RETRY_DELAY_MS);
                continue;
            }
            throw err;
        }
    }
}

export async function initDb(): Promise<void> {
    await waitForDbReady();

    await pool.query(`
        CREATE TABLE IF NOT EXISTS creatives (
            id              BIGSERIAL PRIMARY KEY,
            name            TEXT NOT NULL,
            status          TEXT NOT NULL,
            owner           TEXT NOT NULL,
            channel         TEXT NOT NULL,
            campaign        TEXT NOT NULL,
            budget          NUMERIC(12,2) NOT NULL,
            impressions     INTEGER NOT NULL,
            clicks          INTEGER NOT NULL,
            ctr             NUMERIC(5,2) NOT NULL,
            conversions     INTEGER NOT NULL,
            created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);

    const { rows } = await pool.query<{ count: string }>(
        'SELECT COUNT(*)::text AS count FROM creatives',
    );

    const count = Number(rows[0]?.count ?? '0');
    if (count > 0) {
        return;
    }

    await pool.query(`
        INSERT INTO creatives (
            name,
            status,
            owner,
            channel,
            campaign,
            budget,
            impressions,
            clicks,
            ctr,
            conversions,
            created_at,
            updated_at
        )
        SELECT
            'Creative #' || g.id                    AS name,
            (ARRAY['draft','active','paused','archived'])[(random()*3)::int + 1] AS status,
            'user_' || ((g.id % 50) + 1)           AS owner,
            (ARRAY['facebook','google','tiktok','instagram'])[(random()*3)::int + 1] AS channel,
            'Campaign ' || ((g.id % 200) + 1)      AS campaign,
            round((random()*1000 + 100)::numeric, 2) AS budget,
            (random()*100000)::int                 AS impressions,
            (random()*20000)::int                  AS clicks,
            round((random()*10)::numeric, 2)       AS ctr,
            (random()*5000)::int                   AS conversions,
            NOW() - (g.id || ' minutes')::interval AS created_at,
            NOW()                                  AS updated_at
        FROM generate_series(1, 50000) AS g(id);
    `);

    console.log('DB seeded with 50k creatives');
}
