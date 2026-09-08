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
  console.log('--- Starting Data Sync from Local to Supabase ---');
  
  const localClient = new pg.Client({ connectionString: localUrl });
  const supabaseClient = new pg.Client({
    connectionString: supabaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await localClient.connect();
  console.log('[OK] Connected to Local Postgres');
  await supabaseClient.connect();
  console.log('[OK] Connected to Supabase');

  try {
    await supabaseClient.query('BEGIN');

    // If there's any existing data, clean up in reverse dependency order
    console.log('Cleaning up existing Supabase data (if any)...');
    const REVERSE_ORDER = [...TABLE_ORDER].reverse();
    for (const table of REVERSE_ORDER) {
      await supabaseClient.query(`DELETE FROM "${table}";`);
    }

    for (const table of TABLE_ORDER) {
      console.log(`\nSyncing table: "${table}"...`);

      // 1. Fetch from local
      const localDataRes = await localClient.query(`SELECT * FROM "${table}";`);
      const rows = localDataRes.rows;
      console.log(`  Local has ${rows.length} rows.`);

      if (rows.length === 0) {
        console.log(`  Skipping empty table "${table}".`);
        continue;
      }

      // 2. Fetch columns
      const colsRes = await localClient.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [table]);
      const columns = colsRes.rows.map(r => r.column_name);

      // 3. Batch insert
      const batchSize = 100;
      let insertedCount = 0;

      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const valuePlaceholders = [];
        const values = [];

        batch.forEach((row, rowIdx) => {
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

        await supabaseClient.query(query, values);
        insertedCount += batch.length;
      }

      console.log(`  Successfully synced ${insertedCount} rows into "${table}".`);
    }

    await supabaseClient.query('COMMIT');
    console.log('\n[SUCCESS] Transaction committed successfully!');

    // Verify row counts
    console.log('\n--- Final Verification ---');
    for (const table of TABLE_ORDER) {
      const localCnt = (await localClient.query(`SELECT COUNT(*)::int AS cnt FROM "${table}";`)).rows[0].cnt;
      const supabaseCnt = (await supabaseClient.query(`SELECT COUNT(*)::int AS cnt FROM "${table}";`)).rows[0].cnt;
      const status = localCnt === supabaseCnt ? '[MATCH]' : '[MISMATCH]';
      console.log(`  ${status} ${table.padEnd(25)} -> Local: ${localCnt}, Supabase: ${supabaseCnt}`);
    }
  } catch (err) {
    await supabaseClient.query('ROLLBACK');
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
