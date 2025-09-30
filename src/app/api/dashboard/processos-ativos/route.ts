import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const processosAtivos = await prisma.processoPaciente.findMany({
      where: {
        atividades: {
          some: { status: 'PENDENTE' }
        }
      },
      include: {
        paciente: { select: { nome: true } },
        complexidade: { select: { nome: true } },
        atividades: {
          where: { status: 'PENDENTE' },
          orderBy: { prazo: 'asc' },
          take: 1,
          include: {
            atividade: { select: { nome: true, setor: true } },
            responsavel: { select: { nome: true } }
          }
        }
      },
      take: 10
    })

    const processosFormatados = processosAtivos.map(processo => ({
      id: processo.id,
      paciente: processo.paciente.nome,
      complexidade: processo.complexidade.nome,
      proximaAtividade: processo.atividades[0]?.atividade.nome || 'N/A',
      setor: processo.atividades[0]?.atividade.setor || 'N/A',
      responsavel: processo.atividades[0]?.responsavel?.nome || 'Não atribuído',
      prazo: processo.atividades[0]?.prazo || null,
      atrasado: processo.atividades[0]?.prazo ? new Date(processo.atividades[0].prazo) < new Date() : false
    }))

    return NextResponse.json(processosFormatados)
  } catch (error) {
    console.error('Erro ao buscar processos ativos:', error)
    return NextResponse.json({ error: 'Erro ao buscar processos ativos' }, { status: 500 })
  }
}