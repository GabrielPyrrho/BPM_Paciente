import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const processo = await prisma.processoPaciente.findUnique({
      where: { id: params.id },
      include: {
        paciente: true,
        complexidade: true,
        atividades: {
          include: {
            atividade: true,
            responsavel: true
          },
          orderBy: { atividade: { ordem: 'asc' } }
        }
      }
    })

    if (!processo) {
      return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 })
    }

    return NextResponse.json(processo)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar processo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Primeiro excluir as movimentações relacionadas
    await prisma.movimentacaoWorkflow.deleteMany({
      where: { processoId: params.id }
    })
    
    // Depois excluir o processo
    await prisma.processoPaciente.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Processo excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir processo:', error)
    return NextResponse.json({ error: 'Erro ao excluir processo' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { complexidadeId } = await request.json()

    const processo = await prisma.processoPaciente.update({
      where: { id: params.id },
      data: { complexidadeId },
      include: {
        paciente: true,
        complexidade: true
      }
    })

    return NextResponse.json(processo)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar processo' }, { status: 500 })
  }
}