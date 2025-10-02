import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, descricao, cor, ordem } = await request.json()
    const { id } = params

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const etapa = await prisma.etapa.update({
      where: { id },
      data: {
        nome,
        descricao,
        cor,
        ordem
      }
    })

    return NextResponse.json(etapa)
  } catch (error) {
    console.error('Erro ao atualizar etapa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Verificar se a etapa tem atividades associadas
    const atividadesCount = await prisma.atividadeTemplate.count({
      where: { etapaId: id }
    })

    if (atividadesCount > 0) {
      return NextResponse.json({ 
        error: 'Não é possível excluir etapa que possui atividades associadas' 
      }, { status: 400 })
    }

    await prisma.etapa.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Etapa excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir etapa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}