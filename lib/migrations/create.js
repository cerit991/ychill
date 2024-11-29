const fs = require('fs');
const path = require('path');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
const filename = `${timestamp}_${migrationName}.sql`;
const migrationsDir = path.join(__dirname, 'sql');

// migrations/sql dizinini oluştur
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const template = `-- Migration: ${migrationName}
-- Created at: ${new Date().toISOString()}

-- Up
`;

fs.writeFileSync(path.join(migrationsDir, filename), template);
console.log(`Created migration: ${filename}`);