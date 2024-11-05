import { cookies } from 'next/headers';
import { headers } from 'next/headers';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // In production, use environment variables
const AUTH_COOKIE = 'admin_session';

export async function login(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return true;
  }
  return false;
}

export async function logout() {
  'use server';
  cookies().delete(AUTH_COOKIE);
}

export async function checkAuth(): Promise<boolean> {
  'use server';
  const cookieStore = cookies();
  const session = cookieStore.get(AUTH_COOKIE);
  return session?.value === 'authenticated';
}

export async function setAuthCookie() {
  'use server';
  cookies().set({
    name: AUTH_COOKIE,
    value: 'authenticated',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}