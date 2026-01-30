import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const encoder = new TextEncoder();

function getSecret() {
  const s = process.env.AGENT_GATE_JWT_SECRET;
  if (!s) throw new Error('Missing AGENT_GATE_JWT_SECRET');
  return encoder.encode(s);
}

async function verify(token) {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: 'agent-gate',
    audience: 'agent-gate'
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
