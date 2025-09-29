import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const complexidades = await prisma.complexidade.findMany()
  return NextResponse.json(complexidades)
}