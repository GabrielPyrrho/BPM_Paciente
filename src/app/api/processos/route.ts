import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { pacienteId, complexidadeId } = await request.json()
  
  const processo = await prisma.processoPaciente.create({
    data: { pacienteId, complexidadeId }
  })

  // Buscar atividades da complexidade
  const atividades = await prisma.complexidadeAtividade.findMany({
    where: { complexidadeId },
    include: { atividade: true },
    orderBy: { atividade: { ordem: 'asc' } }
  })

  // Criar movimentações do workflow
  for (const item of atividades) {
    await prisma.movimentacaoWorkflow.create({
      data: {
        processoId: processo.id,
        atividadeId: item.atividadeId,
        status: 'PENDENTE'
      }
    })
  }

  return NextResponse.json(processo)
}