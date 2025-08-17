import { NextResponse } from 'next/server'
import { getProductPerformance } from '@/app/actions/analyticsActions'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const limit = Number(searchParams.get('limit') || '10')

    if (!startDateStr || !endDateStr) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 })
    }

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    const data = await getProductPerformance(startDate, endDate, undefined, limit)
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/analytics/product-performance error:', error)
    return NextResponse.json({ error: 'Failed to fetch product performance' }, { status: 500 })
  }
}