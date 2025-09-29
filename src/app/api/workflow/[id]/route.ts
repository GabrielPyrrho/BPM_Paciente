import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status, observacao, responsavelId } = await request.json()
  
  const movimentacao = await prisma.movimentacaoWorkflow.update({
    where: { id: params.id },
    data: {
      status,
      observacao,
      responsavelId,
      horaInicio: status === 'OK' ? new Date() : undefined,
      horaFim: status === 'OK' ? new Date() : undefined
    }
  })

  return NextResponse.json(movimentacao)
}