import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const complexidades = await prisma.complexidade.findMany()
    return NextResponse.json(complexidades)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar complexidades' }, { status: 500 })
  }
}