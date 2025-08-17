import { NextResponse } from 'next/server'
import { getMonthlySummary } from '@/app/actions/analyticsActions'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = Number(searchParams.get('year'))
    const month = Number(searchParams.get('month'))

    if (!year || !month) {
      return NextResponse.json({ error: 'year and month are required' }, { status: 400 })
    }

    const data = await getMonthlySummary(year, month)
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/analytics/monthly-summary error:', error)
    return NextResponse.json({ error: 'Failed to fetch monthly summary' }, { status: 500 })
  }
}