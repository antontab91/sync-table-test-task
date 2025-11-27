import { pool } from './pool';

export async function initDb(): Promise<void> {
    // 1. Создаём таблицу, если её нет
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

    //  есть ли данные
    const { rows } = await pool.query<{ count: string }>(
        'SELECT COUNT(*)::text AS count FROM creatives',
    );

    const count = Number(rows[0]?.count ?? '0');
    if (count > 0) {
        return;
    }

    // Если пусто  генерим 50k строк
    // Генерация через generate_series — быстро и без TS-скриптов
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
