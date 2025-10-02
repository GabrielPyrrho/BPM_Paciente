import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const processos = await prisma.processoWorkflow.findMany({
      include: {
        entidade: true,
        tipoWorkflow: true,
        atividades: {
          include: { atividade: true },
          orderBy: { atividade: { ordem: 'asc' } }
        }
      }
    })
    return NextResponse.json(processos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar processos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { entidadeId, tipoWorkflowId } = await request.json()
    
    if (!entidadeId || !tipoWorkflowId) {
      return NextResponse.json({ error: 'entidadeId e tipoWorkflowId são obrigatórios' }, { status: 400 })
    }
    
    const processo = await prisma.processoWorkflow.create({
      data: { entidadeId, tipoWorkflowId }
    })

    // Buscar atividades da complexidade
    const atividades = await prisma.tipoWorkflowAtividade.findMany({
      where: { tipoWorkflowId },
      include: { atividade: true },
      orderBy: { atividade: { ordem: 'asc' } }
    })

    // Criar movimentações do workflow em lote
    const movimentacoes = atividades.map(item => ({
      processoId: processo.id,
      atividadeId: item.atividadeId,
      status: 'PENDENTE'
    }))
    
    await prisma.movimentacaoWorkflow.createMany({
      data: movimentacoes
    })

    return NextResponse.json(processo)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar processo' }, { status: 500 })
  }
}