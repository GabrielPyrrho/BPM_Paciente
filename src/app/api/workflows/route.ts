import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const processos = await prisma.processo.findMany({
      include: {
        entidade: true,
        tipoWorkflow: true,
        atividades: {
          include: {
            atividade: true,
            responsavel: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const workflows = processos.map(processo => ({
      id: processo.id,
      entidade: processo.entidade,
      tipoWorkflow: processo.tipoWorkflow,
      status: processo.atividades.length > 0 ? 
        (processo.atividades.every(a => a.status === 'OK') ? 'Concluído' : 
         processo.atividades.some(a => a.status === 'NOK') ? 'Pendente' : 'Em Andamento') : 'Em Andamento',
      createdAt: processo.createdAt,
      updatedAt: processo.updatedAt
    }))

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Erro ao buscar workflows:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}