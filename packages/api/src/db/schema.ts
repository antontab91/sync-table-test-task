import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pool } from './pool';

export async function migrateSchema(): Promise<void> {
    const sql = readFileSync(resolve(__dirname, 'sql/schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Schema migrated');
}
