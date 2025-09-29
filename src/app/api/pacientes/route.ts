import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const pacientes = await prisma.paciente.findMany()
  return NextResponse.json(pacientes)
}

export async function POST(request: NextRequest) {
  const { nome } = await request.json()
  const paciente = await prisma.paciente.create({
    data: { nome }
  })
  return NextResponse.json(paciente)
}