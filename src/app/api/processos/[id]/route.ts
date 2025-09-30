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