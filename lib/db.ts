import sqlite3 from 'sqlite3';
import { join } from 'path';

// Global veritabanı bağlantısı
let db: sqlite3.Database;

// Veritabanı bağlantısını başlat
function initDB() {
  if (!db) {
    db = new sqlite3.Database(join(process.cwd(), 'restaurant.db'), (err) => {
      if (err) {
        console.error('Database bağlantı hatası:', err);
      } else {
        console.log('Database bağlantısı başarılı');
        createTables();
      }
    });
  }
  return db;
}

// Tabloları oluştur
function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS menu_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES menu_categories (id)
    )`
  ];

  db.serialize(() => {
    queries.forEach(query => {
      db.run(query);
    });
  });
}

// Veritabanı bağlantısını başlat ve export et
const database = initDB();
export default database;