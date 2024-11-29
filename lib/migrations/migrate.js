const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(process.cwd(), 'restaurant.db'));
const migrationsDir = path.join(__dirname, 'sql');

async function migrate() {
  // migrations tablosunu oluştur
  await new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Çalıştırılmış migrationları al
  const executedMigrations = await new Promise((resolve, reject) => {
    db.all('SELECT name FROM migrations', (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => row.name));
    });
  });

  // SQL dosyalarını oku ve sırala
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  // Yeni migrationları çalıştır
  for (const file of files) {
    if (!executedMigrations.includes(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      await new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
          if (err) {
            console.error(`Error executing ${file}:`, err);
            reject(err);
          } else {
            db.run('INSERT INTO migrations (name) VALUES (?)', [file], (err) => {
              if (err) reject(err);
              else {
                console.log(`Executed migration: ${file}`);
                resolve();
              }
            });
          }
        });
      });
    }
  }

  console.log('All migrations completed successfully');
  db.close();
}

migrate().catch(console.error);