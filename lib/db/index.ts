import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Lazy database connection to avoid build-time errors
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error('Database operations are not available in the browser');
  }

  // Check environment variables
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('Missing Turso database environment variables');
  }

  // Extract auth token from URL if included, otherwise use separate env var
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  const client = createClient({
    url: url,
    authToken: authToken,
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

// Export schema for type safety
export * from './schema';