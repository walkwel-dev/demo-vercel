// src/app/api/fact/route.ts
import { loggerMiddleware } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest) {
  loggerMiddleware(req)
  const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
  const data = await res.json();
  return NextResponse.json({ fact: data.text });
}
