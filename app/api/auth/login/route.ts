import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const formData = await request.formData();
    const result = await login(formData);

    if (result.success) {
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(
      JSON.stringify({ success: false, error: result.error || 'Giriş başarısız' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Login route error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Bir hata oluştu' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}