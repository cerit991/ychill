import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  const db = createClient({
    url: 'file:company.db',
  });

  try {
    // Create migrations table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of executed migrations
    const result = await db.execute('SELECT name FROM migrations');
    const executedMigrations = new Set(result.rows.map(row => row.name));

    // Read and execute new migrations
    const migrations = ['001_initial.sql'];

    for (const migration of migrations) {
      if (!executedMigrations.has(migration)) {
        console.log(`Running migration: ${migration}`);
        
        const sql = readFileSync(
          join(process.cwd(), 'lib', 'db', 'migrations', migration),
          'utf-8'
        );

        // Split the SQL file into individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        // Execute each statement separately
        for (const statement of statements) {
          await db.execute(statement);
        }
        
        await db.execute({
          sql: 'INSERT INTO migrations (name) VALUES (?)',
          args: [migration]
        });

        console.log(`Completed migration: ${migration}`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations().catch(console.error);