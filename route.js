// clarivex-next/app/api/me/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }
  // Return only the fields the frontend needs:
  return NextResponse.json({
    id: session.user.id,
    username: session.user.username,
    discriminator: session.user.discriminator,
    avatar: session.user.avatar
  });
}