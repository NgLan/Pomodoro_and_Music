import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.DATABASE_URL;
const localUrl = process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:ngoclan4716@localhost:5432/pomodoro_music';

// Table sync order to respect foreign key constraints:
const TABLE_ORDER = [
  'users',
  'playlists',
  'media_items',
  'pomodoro',
  'user_settings',
  'playlist_items',
  'playlist_source_history',
  'pomodoro_history',
  'refresh_tokens',
];

async function sync() {
  const isToSupabase = process.argv.includes('--to-supabase');
  const sourceName = isToSupabase ? 'Local Postgres' : 'Supabase';
  const targetName = isToSupabase ? 'Supabase' : 'Local Postgres';

  console.log(`--- Starting Data Sync: [${sourceName}] ➔ [${targetName}] ---`);

  const localClient = new pg.Client({ connectionString: localUrl });
  const supabaseClient = new pg.Client({
    connectionString: supabaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await localClient.connect();
  console.log('[OK] Connected to Local Postgres');
  await supabaseClient.connect();
  console.log('[OK] Connected to Supabase');

  const sourceClient = isToSupabase ? localClient : supabaseClient;
  const targetClient = isToSupabase ? supabaseClient : localClient;

  try {
    await targetClient.query('BEGIN');

    // If there's any existing data, clean up in reverse dependency order
    console.log(`\nCleaning up existing data in ${targetName}...`);
    const REVERSE_ORDER = [...TABLE_ORDER].reverse();
    for (const table of REVERSE_ORDER) {
      await targetClient.query(`DELETE FROM "${table}";`);
    }

    for (const table of TABLE_ORDER) {
      console.log(`\nSyncing table: "${table}"...`);

      // 1. Fetch from source
      const sourceDataRes = await sourceClient.query(`SELECT * FROM "${table}";`);
      const rows = sourceDataRes.rows;
      console.log(`  ${sourceName} has ${rows.length} rows.`);

      if (rows.length === 0) {
        console.log(`  Skipping empty table "${table}".`);
        continue;
      }

      // 2. Fetch columns that exist in target table
      const colsRes = await targetClient.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [table]);
      const targetColumns = colsRes.rows.map(r => r.column_name);

      // Only take columns that exist in both source row and target schema
      const sampleRow = rows[0];
      const columns = targetColumns.filter(c => c in sampleRow);

      // 3. Batch insert
      const batchSize = 100;
      let insertedCount = 0;

      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const valuePlaceholders = [];
        const values = [];

        batch.forEach((row) => {
          const rowPlaceholders = [];
          columns.forEach((col) => {
            values.push(row[col]);
            rowPlaceholders.push(`$${values.length}`);
          });
          valuePlaceholders.push(`(${rowPlaceholders.join(', ')})`);
        });

        const query = `
          INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')})
          VALUES ${valuePlaceholders.join(', ')}
          ON CONFLICT DO NOTHING;
        `;

        await targetClient.query(query, values);
        insertedCount += batch.length;
      }

      console.log(`  Successfully synced ${insertedCount} rows into "${table}" on ${targetName}.`);
    }

    await targetClient.query('COMMIT');
    console.log(`\n[SUCCESS] Transaction committed successfully to ${targetName}!`);

    // Verify row counts
    console.log('\n--- Final Verification ---');
    for (const table of TABLE_ORDER) {
      const sourceCnt = (await sourceClient.query(`SELECT COUNT(*)::int AS cnt FROM "${table}";`)).rows[0].cnt;
      const targetCnt = (await targetClient.query(`SELECT COUNT(*)::int AS cnt FROM "${table}";`)).rows[0].cnt;
      const status = sourceCnt === targetCnt ? '[MATCH]' : '[MISMATCH]';
      console.log(`  ${status} ${table.padEnd(25)} -> ${sourceName}: ${sourceCnt}, ${targetName}: ${targetCnt}`);
    }
  } catch (err) {
    await targetClient.query('ROLLBACK');
    console.error('\n[ERROR] Sync failed, rolled back:', err);
    throw err;
  } finally {
    await localClient.end();
    await supabaseClient.end();
  }
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
