import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionId = cookies().get('sessionId')?.value;

    if (!sessionId) {
      return new NextResponse(null, { status: 401 });
    }

    const isValid = await verifySession(sessionId);

    if (!isValid) {
      return new NextResponse(null, { status: 401 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Session verification error:', error);
    return new NextResponse(null, { status: 500 });
  }
}