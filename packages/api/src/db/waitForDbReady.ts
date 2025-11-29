import { pool } from './pool';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForDbReady(): Promise<void> {
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
