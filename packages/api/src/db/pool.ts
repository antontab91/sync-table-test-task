import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
    process.env.DATABASE_URL ??
    `postgres://${process.env.POSTGRES_USER ?? 'app'}:${
        process.env.POSTGRES_PASSWORD ?? 'app'
    }@${process.env.POSTGRES_HOST ?? 'db'}:${
        process.env.POSTGRES_PORT ?? '5432'
    }/${process.env.POSTGRES_DB ?? 'app'}`;

export const pool = new Pool({
    connectionString,
});
