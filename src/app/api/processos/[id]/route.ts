import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const processo = await prisma.processoWorkflow.findUnique({
      where: { id: params.id },
      include: {
        entidade: true,
        tipoWorkflow: {
          include: {
            atividades: {
              include: {
                atividade: {
                  include: {
                    etapa: true
                  }
                }
              }
            }
          }
        },
        atividades: {
          include: {
            atividade: {
              include: {
                etapa: true
              }
            },
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
    await prisma.processoWorkflow.delete({
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
    const { tipoWorkflowId } = await request.json()

    const processo = await prisma.processoWorkflow.update({
      where: { id: params.id },
      data: { tipoWorkflowId },
      include: {
        entidade: true,
        tipoWorkflow: true
      }
    })

    return NextResponse.json(processo)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar processo' }, { status: 500 })
  }
}