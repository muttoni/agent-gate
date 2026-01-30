import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const body = `User-agent: *
Allow: /
`;
  return new NextResponse(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
}
