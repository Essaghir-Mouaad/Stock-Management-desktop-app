import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // In a real app, decode auth. For now, return a demo name.
    return NextResponse.json({ name: 'Worker User' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}