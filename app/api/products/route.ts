import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET() {
  try {
    const products = await prisma.userProduct.findMany({
      include: { productLines: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const name = (body?.name || '').toString().trim()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Ensure there is at least one user to associate the invoice with
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@demo.local',
          passwordHash: 'demo',
          name: 'Demo Admin',
          role: Role.ADMIN,
        },
      })
    }

    const newInvoice = await prisma.userProduct.create({
      data: {
        name,
        createdAt: new Date(),
        createdById: user.id,
      },
      include: { productLines: true },
    })

    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Failed to create product invoice' }, { status: 500 })
  }
}