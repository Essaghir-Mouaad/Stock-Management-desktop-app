import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const invoices = await prisma.userProduct.findMany({
      include: { productLines: true },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = invoices.map((inv) => ({
      id: inv.id,
      name: inv.name,
      date: inv.createdAt ? new Date(inv.createdAt as unknown as string).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
      products: inv.productLines.map((pl) => ({
        id: pl.id,
        name: pl.name,
        category: pl.category,
        unit: pl.unite,
        currentStock: pl.currentStock,
        initialStock: pl.initialStock,
        quality: pl.quality,
      })),
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('GET /api/worker error:', error)
    return NextResponse.json({ error: 'Failed to fetch worker invoices' }, { status: 500 })
  }
}