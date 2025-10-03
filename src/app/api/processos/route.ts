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

    // Criar movimentações do workflow com prazos
    const movimentacoes = atividades.map(item => {
      const horaInicio = new Date()
      const prazo = new Date(horaInicio)
      
      // Definir prazos por tipo de atividade
      const nomeAtividade = item.atividade.nome.toLowerCase()
      if (nomeAtividade.includes('captação') || nomeAtividade.includes('solicitação')) {
        prazo.setHours(prazo.getHours() + 48) // 48 horas
      } else if (nomeAtividade.includes('prescrição') || nomeAtividade.includes('médico')) {
        prazo.setHours(prazo.getHours() + 24) // 24 horas
      } else {
        prazo.setHours(prazo.getHours() + 12) // 12 horas padrão
      }
      
      return {
        processoId: processo.id,
        atividadeId: item.atividadeId,
        status: 'PENDENTE',
        horaInicio,
        prazo
      }
    })
    
    await prisma.movimentacaoWorkflow.createMany({
      data: movimentacoes
    })

    return NextResponse.json(processo)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar processo' }, { status: 500 })
  }
}