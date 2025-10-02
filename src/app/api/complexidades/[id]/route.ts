import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, atividadeIds } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

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

    return NextResponse.json(complexidade)
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