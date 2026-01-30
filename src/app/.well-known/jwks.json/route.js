import { NextResponse } from 'next/server';
import { getPublicJwk } from '../../../server/keys.js';

export const runtime = 'nodejs';

export async function GET() {
  const publicJwk = await getPublicJwk();

  return NextResponse.json({
    keys: [publicJwk]
  }, {
    headers: {
      'cache-control': 'public, max-age=3600'
    }
  });
}
