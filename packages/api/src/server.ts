import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import { initDb } from './db/init';
import { registerRowsRoutes } from './routes/rows';

dotenv.config();

const app = fastify({ logger: true });

const port = Number(process.env.API_PORT || 4000);

async function start() {
    try {
        await app.register(cors, {
            origin: true,
        });

        await initDb();

        await registerRowsRoutes(app);

        await app.listen({ port, host: '0.0.0.0' });
        console.log(`API listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
