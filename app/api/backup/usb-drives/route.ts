import { NextResponse } from 'next/server'

export async function GET() {
  // Return a couple of mock drives
  return NextResponse.json([
    { path: '/mnt/usb1', name: 'USB_DRIVE_01', freeSpace: '15.2 GB', isWritable: true },
    { path: '/mnt/usb2', name: 'BACKUP_DRIVE', freeSpace: '45.8 GB', isWritable: true },
  ])
}

export async function POST(request: Request) {
  // Echo success for testing
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ success: true, tested: body?.path || body })
}