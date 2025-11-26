import fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify({ logger: true });

app.get('/health', async () => {
    return { status: 'ok' };
});

const port = Number(process.env.API_PORT || 4000);

async function start() {
    try {
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`API listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
