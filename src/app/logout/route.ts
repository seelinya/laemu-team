import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  await logout()
  return NextResponse.redirect(new URL('/login', req.url))
}

export async function GET(req: Request) {
  await logout()
  return NextResponse.redirect(new URL('/login', req.url))
}
