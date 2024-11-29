import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

interface MenuRow {
  category_id: number;
  category_name: string;
  id: number | null;
  name: string | null;
  description: string | null;
  image_url: string | null;
  is_active: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  categoryId: number;
}

interface MenuCategory {
  id: number;
  name: string;
  items: MenuItem[];
}

export async function GET() {
  return new Promise((resolve) => {
    const query = `
      SELECT 
        c.id as category_id,
        c.name as category_name,
        m.id,
        m.name,
        m.description,
        m.image_url,
        m.is_active
      FROM menu_categories c
      LEFT JOIN menu_items m ON c.id = m.category_id
      ORDER BY c.order_index, m.order_index
    `;

    db.all(query, [], (err, rows: MenuRow[]) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      // Kategorilere göre grupla
      const menuByCategory = rows.reduce<MenuCategory[]>((acc, row) => {
        const existingCategory = acc.find(c => c.id === row.category_id);
        
        if (existingCategory) {
          if (row.id && row.name && row.description && row.image_url) {
            existingCategory.items.push({
              id: row.id,
              name: row.name,
              description: row.description,
              imageUrl: row.image_url,
              isActive: Boolean(row.is_active),
              categoryId: row.category_id
            });
          }
        } else {
          acc.push({
            id: row.category_id,
            name: row.category_name,
            items: row.id && row.name && row.description && row.image_url ? [{
              id: row.id,
              name: row.name,
              description: row.description,
              imageUrl: row.image_url,
              isActive: Boolean(row.is_active),
              categoryId: row.category_id
            }] : []
          });
        }
        return acc;
      }, []);

      resolve(NextResponse.json(menuByCategory));
    });
  });
}

interface CreateMenuItemData {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
}

export async function POST(request: Request) {
  try {
    const data: CreateMenuItemData = await request.json();
    
    return new Promise((resolve) => {
      const query = `
        INSERT INTO menu_items (category_id, name, description, image_url, is_active)
        VALUES (?, ?, ?, ?, 1)
      `;
      
      db.run(
        query,
        [parseInt(data.categoryId), data.name, data.description, data.imageUrl],
        function(err) {
          if (err) {
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            return;
          }
          
          resolve(NextResponse.json({
            id: this.lastID,
            message: 'Menü öğesi başarıyla eklendi'
          }));
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}