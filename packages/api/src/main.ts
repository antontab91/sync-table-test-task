import http from 'http';
import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDb } from './db/init';
import { registerCreativeRecordsRoutes } from './routes/creatives.ts';
import { attachWsServer } from './services/ws/server';

dotenv.config();

const port = Number(process.env.API_PORT || 4000);

async function start(): Promise<void> {
    await initDb();

    const app: Express = express();

    app.use(cors());
    app.use(express.json());

    registerCreativeRecordsRoutes(app);

    const server = http.createServer(app);

    attachWsServer(server);

    server.listen(port, '0.0.0.0', () => {
        console.log(`API running on port ${port}`);
    });
}

start().catch((err) => {
    console.error('Failed to start API:', err);
    process.exit(1);
});
