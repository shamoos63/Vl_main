import { createClient } from '@libsql/client';

export async function ensurePropertyHomeDisplayColumn() {
  if (typeof window !== 'undefined') return; // server-only safeguard

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('Missing Turso database environment variables');
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Check existing columns
  const info = await client.execute('PRAGMA table_info(properties);');
  const rows: any[] = (info as any).rows || [];
  const hasHomeDisplay = rows.some((r: any) => {
    // libsql returns objects keyed by column name; guard for array-like too
    if (r && typeof r === 'object' && 'name' in r) return (r as any).name === 'home_display';
    if (Array.isArray(r) && r.length > 1) return r[1] === 'home_display';
    return false;
  });

  if (!hasHomeDisplay) {
    await client.execute('ALTER TABLE properties ADD COLUMN home_display integer DEFAULT 0 NOT NULL;');
  }
}

export async function ensurePropertyDldUrlColumn() {
  if (typeof window !== 'undefined') return; // server-only safeguard

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('Missing Turso database environment variables');
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const info = await client.execute('PRAGMA table_info(properties);');
  const rows: any[] = (info as any).rows || [];
  const hasDldUrl = rows.some((r: any) => {
    if (r && typeof r === 'object' && 'name' in r) return (r as any).name === 'dld_url';
    if (Array.isArray(r) && r.length > 1) return r[1] === 'dld_url';
    return false;
  });

  if (!hasDldUrl) {
    await client.execute('ALTER TABLE properties ADD COLUMN dld_url text;');
  }
}


