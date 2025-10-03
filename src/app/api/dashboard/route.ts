import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Iniciando consulta dashboard...')
    const totalProcessos = await prisma.processoWorkflow.count()
    console.log('Total processos:', totalProcessos)
    const totalEntidades = await prisma.entidade.count()
    console.log('Total entidades:', totalEntidades)
    
    const concluidas = await prisma.movimentacaoWorkflow.count({
      where: { status: 'OK' }
    })
    
    const pendentes = await prisma.movimentacaoWorkflow.count({
      where: { status: 'PENDENTE' }
    })
    
    const rejeitadas = await prisma.movimentacaoWorkflow.count({
      where: { status: 'NOK' }
    })
    
    const atrasadas = await prisma.movimentacaoWorkflow.count({
      where: {
        status: 'PENDENTE',
        prazo: { lt: new Date() }
      }
    })
    
    const tiposWorkflow = await prisma.tipoWorkflow.findMany({
      include: {
        processos: true
      }
    })
    
    const ultimosProcessos = await prisma.processoWorkflow.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      include: {
        entidade: true,
        tipoWorkflow: true
      }
    })

    return NextResponse.json({
      solicitados: totalProcessos,
      concluidas: concluidas,
      pendentes: pendentes,
      rejeitadas: rejeitadas,
      atrasadas: atrasadas,
      totalEntidades: totalEntidades,
      complexidades: tiposWorkflow.map(tipo => ({
        nome: tipo.nome,
        total: tipo.processos.length
      })),
      ultimosProcessos: ultimosProcessos.map(processo => ({
        id: processo.id,
        paciente: processo.entidade.nome,
        complexidade: processo.tipoWorkflow.nome,
        proximaAtividade: 'Aguardando execução'
      }))
    })
  } catch (error) {
    console.error('Erro dashboard:', error)
    return NextResponse.json({
      error: 'Erro ao conectar com banco de dados',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      solicitados: 0,
      concluidas: 0,
      pendentes: 0,
      rejeitadas: 0,
      atrasadas: 0,
      totalEntidades: 0,
      complexidades: [],
      ultimosProcessos: []
    }, { status: 500 })
  }
}