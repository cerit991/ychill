import { createClient } from '@libsql/client';
import { Product, Inquiry } from './types';

export const db = createClient({
  url: 'file:company.db',
});

// Product functions
export async function getProducts(): Promise<Product[]> {
  try {
    const result = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: Number(row.id),
      name: String(row.name),
      description: String(row.description),
      image_url: String(row.image_url),
      price: Number(row.price),
      created_at: String(row.created_at)
    }));
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  image_url: string;
  price: number;
}): Promise<Product> {
  try {
    const result = await db.execute({
      sql: `INSERT INTO products (name, description, image_url, price) 
            VALUES (?, ?, ?, ?) 
            RETURNING id, name, description, image_url, price, created_at`,
      args: [data.name, data.description, data.image_url, data.price]
    });
    
    const row = result.rows[0];
    return {
      id: Number(row.id),
      name: String(row.name),
      description: String(row.description),
      image_url: String(row.image_url),
      price: Number(row.price),
      created_at: String(row.created_at)
    };
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

// Inquiry functions
export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const result = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: Number(row.id),
      customer_name: String(row.customer_name),
      email: String(row.email),
      phone: row.phone ? String(row.phone) : undefined,
      message: String(row.message),
      product_ids: String(row.product_ids),
      status: String(row.status) as Inquiry['status'],
      created_at: String(row.created_at)
    }));
  } catch (error) {
    console.error('Failed to get inquiries:', error);
    throw error;
  }
}

export async function createInquiry(data: {
  customer_name: string;
  email: string;
  phone?: string;
  message: string;
  product_ids: string;
}): Promise<Inquiry> {
  try {
    const result = await db.execute({
      sql: `INSERT INTO inquiries (customer_name, email, phone, message, product_ids, status) 
            VALUES (?, ?, ?, ?, ?, 'pending') 
            RETURNING id, customer_name, email, phone, message, product_ids, status, created_at`,
      args: [data.customer_name, data.email, data.phone || null, data.message, data.product_ids]
    });
    
    const row = result.rows[0];
    return {
      id: Number(row.id),
      customer_name: String(row.customer_name),
      email: String(row.email),
      phone: row.phone ? String(row.phone) : undefined,
      message: String(row.message),
      product_ids: String(row.product_ids),
      status: String(row.status) as Inquiry['status'],
      created_at: String(row.created_at)
    };
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    throw error;
  }
}

export async function updateInquiryStatus(id: number, status: Inquiry['status']): Promise<Inquiry> {
  try {
    if (!['pending', 'reviewed', 'contacted'].includes(status)) {
      throw new Error('Invalid status');
    }

    const result = await db.execute({
      sql: `UPDATE inquiries 
            SET status = ? 
            WHERE id = ? 
            RETURNING id, customer_name, email, phone, message, product_ids, status, created_at`,
      args: [status, id]
    });

    if (result.rows.length === 0) {
      throw new Error('Inquiry not found');
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      customer_name: String(row.customer_name),
      email: String(row.email),
      phone: row.phone ? String(row.phone) : undefined,
      message: String(row.message),
      product_ids: String(row.product_ids),
      status: String(row.status) as Inquiry['status'],
      created_at: String(row.created_at)
    };
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    throw error;
  }
}

export async function getInquiryById(id: number): Promise<Inquiry> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM inquiries WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      throw new Error('Inquiry not found');
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      customer_name: String(row.customer_name),
      email: String(row.email),
      phone: row.phone ? String(row.phone) : undefined,
      message: String(row.message),
      product_ids: String(row.product_ids),
      status: String(row.status) as Inquiry['status'],
      created_at: String(row.created_at)
    };
  } catch (error) {
    console.error('Failed to get inquiry:', error);
    throw error;
  }
}