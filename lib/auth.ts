import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import db from './db';

// Session oluştur
export async function createSession(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const sessionId = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 saat geçerli

    const query = `
      INSERT INTO sessions (session_id, user_id, expires)
      VALUES (?, ?, ?)
    `;

    db.run(query, [sessionId, userId, expires.toISOString()], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(sessionId);
    });
  });
}

// Session kontrolü
export async function verifySession(sessionId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const query = `
      SELECT * FROM sessions 
      WHERE session_id = ? AND expires > datetime('now')
    `;

    db.get(query, [sessionId], (err, row) => {
      resolve(!!row);
    });
  });
}

// Login işlemi
export async function login(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const username = formData.get('username');
    const password = formData.get('password');

    // Admin bilgilerini kontrol et
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const sessionId = await createSession(username as string);
      
      // Cookie ayarla
      cookies().set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24 saat
      });

      return { success: true };
    }

    return { 
      success: false, 
      error: 'Geçersiz kullanıcı adı veya şifre' 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Giriş işlemi sırasında bir hata oluştu' 
    };
  }
}

// Logout işlemi
export async function logout(): Promise<void> {
  const sessionId = cookies().get('sessionId')?.value;
  
  if (sessionId) {
    await new Promise<void>((resolve) => {
      db.run('DELETE FROM sessions WHERE session_id = ?', [sessionId], () => {
        cookies().delete('sessionId');
        resolve();
      });
    });
  }
}

// Session kontrolü
export async function getSession() {
  const sessionId = cookies().get('sessionId')?.value;
  
  if (!sessionId) {
    return null;
  }

  const isValid = await verifySession(sessionId);
  return isValid ? { isAuthenticated: true } : null;
}