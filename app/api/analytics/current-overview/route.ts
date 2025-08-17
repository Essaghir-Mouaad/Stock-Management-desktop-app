import { NextResponse } from 'next/server'
import { getCurrentStockOverview } from '@/app/actions/analyticsActions'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')

    if (!startDateStr || !endDateStr) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 })
    }

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    const data = await getCurrentStockOverview(startDate, endDate)
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/analytics/current-overview error:', error)
    return NextResponse.json({ error: 'Failed to fetch current overview' }, { status: 500 })
  }
}