import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

// Menü öğesi güncelle
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;
    
    return new Promise((resolve) => {
      const query = `
        UPDATE menu_items 
        SET name = COALESCE(?, name),
            description = COALESCE(?, description),
            image_url = COALESCE(?, image_url),
            is_active = COALESCE(?, is_active)
        WHERE id = ?
      `;
      
      db.run(
        query, 
        [
          data.name,
          data.description,
          data.imageUrl,
          data.isActive !== undefined ? Number(data.isActive) : undefined,
          id
        ],
        function(err) {
          if (err) {
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            return;
          }
          
          resolve(NextResponse.json({
            message: 'Menü öğesi güncellendi'
          }));
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Menü öğesi sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  return new Promise((resolve) => {
    db.run('DELETE FROM menu_items WHERE id = ?', [id], function(err) {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }
      
      resolve(NextResponse.json({
        message: 'Menü öğesi silindi'
      }));
    });
  });
}