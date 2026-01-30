import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getKeyPair } from './src/server/keys.js';

async function verify(token) {
  const { publicKey } = await getKeyPair();
  const { payload } = await jwtVerify(token, publicKey, {
    issuer: 'agent-gate'
    // audience is checked per-route if needed
  });
  return payload;
}

export async function middleware(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 401 });
  }

  try {
    await verify(token);
  } catch {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  return NextResponse.next();
}

// Protect only the routes you want behind the gate.
// v0 defaults to protecting /api/protected and anything under /api/private.
export const config = {
  matcher: ['/api/protected', '/api/private/:path*']
};
