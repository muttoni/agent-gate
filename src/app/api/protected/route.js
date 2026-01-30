import { NextResponse } from 'next/server';
import { verifyToken } from '../../../server/jwt.js';

export const runtime = 'nodejs';

export async function GET(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: 'missing_token' }, { status: 401 });

  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, message: 'agent access granted' });
}
