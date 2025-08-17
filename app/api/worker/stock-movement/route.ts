import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { productId, quantity, reason, userProductId } = await request.json()

    if (!productId || !quantity || !userProductId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const productLine = await prisma.productLine.findUnique({ where: { id: productId } })
    if (!productLine) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const newStock = Math.max(0, (productLine.currentStock || 0) - Math.abs(Number(quantity)))

    const updated = await prisma.productLine.update({
      where: { id: productId },
      data: { currentStock: newStock },
    })

    // Optionally record movement
    await prisma.stockMovement.create({
      data: {
        productLineId: productId,
        movementType: 'OUT',
        quantity: Math.abs(Number(quantity)),
        previousStock: productLine.currentStock,
        newStock,
        reason: reason || '',
        userId: (await prisma.user.findFirst())?.id || updated.userProductId,
        userProductId: userProductId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/worker/stock-movement error:', error)
    return NextResponse.json({ error: 'Failed to save stock movement' }, { status: 500 })
  }
}