import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';

export async function POST(request: Request) {
  const { token, secret } = await request.json();

  if (!token || !secret) {
    return NextResponse.json({ error: 'Token and secret are required' }, { status: 400 });
  }

  const isValid = authenticator.verify({ token, secret });

  return NextResponse.json({ valid: isValid });
}