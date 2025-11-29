import { waitForDbReady } from './waitForDbReady';
import { migrateSchema } from './schema';
import { seedInitialData } from './seed';

export async function initDb(): Promise<void> {
    await waitForDbReady();
    await migrateSchema();
    await seedInitialData();
}
