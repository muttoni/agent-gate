import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const encoder = new TextEncoder();

function getSecret() {
  const s = process.env.AGENT_GATE_SECRET;
  if (!s) throw new Error('Missing AGENT_GATE_SECRET env var');
  return encoder.encode(s);
}

export async function middleware(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: 'agent-gate' });
    if (payload.typ !== 'agent') throw new Error('wrong token type');
  } catch {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  return NextResponse.next();
}

// Edit this to protect your routes
export const config = {
  matcher: ['/api/protected/:path*']
};
