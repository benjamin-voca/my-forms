import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Logger } from 'drizzle-orm/logger';

export const db = drizzle(process.env.DATABASE_URL!, { logger: true });
