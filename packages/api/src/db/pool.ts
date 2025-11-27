import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'db',
    port: Number(process.env.POSTGRES_PORT || 5432),
    user: process.env.POSTGRES_USER || 'app',
    password: process.env.POSTGRES_PASSWORD || 'app',
    database: process.env.POSTGRES_DB || 'app',
});
