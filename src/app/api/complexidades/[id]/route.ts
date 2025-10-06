import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, atividadeIds } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    // Buscar atividades antigas antes da atualização
    const tipoWorkflowAntigo = await prisma.tipoWorkflow.findUnique({
      where: { id: params.id },
      include: {
        atividades: true
      }
    })

    const atividadesAntigas = tipoWorkflowAntigo?.atividades.map(a => a.atividadeId) || []

    // Atualizar o tipo de workflow
    const complexidade = await prisma.tipoWorkflow.update({
      where: { id: params.id },
      data: {
        nome: nome.trim(),
        atividades: {
          deleteMany: {},
          create: atividadeIds?.map((atividadeId: string) => ({
            atividadeId
          })) || []
        }
      },
      include: {
        atividades: {
          include: {
            atividade: true
          }
        }
      }
    })

    // Sincronizar processos existentes
    const processosExistentes = await prisma.processoWorkflow.findMany({
      where: { tipoWorkflowId: params.id },
      include: {
        atividades: true
      }
    })

    let totalAtividadesAdicionadas = 0

    // Para cada processo, adicionar as novas atividades
    for (const processo of processosExistentes) {
      const atividadesExistentes = processo.atividades.map(a => a.atividadeId)
      const novasAtividades = (atividadeIds || []).filter(
        (atividadeId: string) => !atividadesExistentes.includes(atividadeId)
      )

      if (novasAtividades.length > 0) {
        const novasMovimentacoes = novasAtividades.map((atividadeId: string) => {
          const horaInicio = new Date()
          const prazo = new Date(horaInicio)
          prazo.setHours(prazo.getHours() + 12) // 12 horas padrão
          
          return {
            processoId: processo.id,
            atividadeId,
            status: 'PENDENTE',
            horaInicio,
            prazo
          }
        })
        
        await prisma.movimentacaoWorkflow.createMany({
          data: novasMovimentacoes
        })
        
        totalAtividadesAdicionadas += novasAtividades.length
      }
    }

    return NextResponse.json({
      ...complexidade,
      processosAtualizados: processosExistentes.length,
      atividadesAdicionadas: totalAtividadesAdicionadas
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar complexidade' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const processosUsando = await prisma.processoWorkflow.count({
      where: { tipoWorkflowId: params.id }
    })

    if (processosUsando > 0) {
      return NextResponse.json({ 
        error: `Não é possível excluir. Existem ${processosUsando} processo(s) usando esta complexidade.` 
      }, { status: 400 })
    }

    await prisma.tipoWorkflowAtividade.deleteMany({
      where: { tipoWorkflowId: params.id }
    })

    await prisma.tipoWorkflow.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Complexidade excluída com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir complexidade' }, { status: 500 })
  }
}