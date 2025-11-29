import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pool } from './pool';

export async function seedInitialData(): Promise<void> {
    const { rows } = await pool.query<{ count: string }>(
        'SELECT COUNT(*)::text AS count FROM creatives',
    );

    if (Number(rows[0]?.count ?? '0') > 0) {
        console.log('Seed skipped — data already exists');
        return;
    }

    const sql = readFileSync(resolve(__dirname, 'sql/seed.sql'), 'utf8');

    await pool.query(sql);
    console.log('Seed inserted with 50k rows');
}
