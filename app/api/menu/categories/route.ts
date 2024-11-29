import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// Kategorileri getir
export async function GET() {
  return new Promise((resolve) => {
    db.all('SELECT * FROM menu_categories', [], (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }
      resolve(NextResponse.json(rows));
    });
  });
}

// Yeni kategori ekle
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    return new Promise((resolve) => {
      db.run('INSERT INTO menu_categories (name) VALUES (?)', [name], function(err) {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }

        resolve(NextResponse.json({
          id: this.lastID,
          name,
          message: 'Kategori başarıyla eklendi'
        }));
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}