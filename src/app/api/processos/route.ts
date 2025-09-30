import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const processos = await prisma.processoPaciente.findMany({
      include: {
        paciente: true,
        complexidade: true,
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
    const { pacienteId, complexidadeId } = await request.json()
    
    if (!pacienteId || !complexidadeId) {
      return NextResponse.json({ error: 'pacienteId e complexidadeId são obrigatórios' }, { status: 400 })
    }
    
    const processo = await prisma.processoPaciente.create({
      data: { pacienteId, complexidadeId }
    })

    // Buscar atividades da complexidade
    const atividades = await prisma.complexidadeAtividade.findMany({
      where: { complexidadeId },
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