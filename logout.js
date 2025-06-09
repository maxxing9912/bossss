import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST() {
  // Serializziamo un cookie con nome “clarivex_session” a valore vuoto e scadenza passata, per cancellarlo
  const cookieSerialized = cookie.serialize('clarivex_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookieSerialized);
  return response;
}