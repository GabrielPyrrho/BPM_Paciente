import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalProcessos = await prisma.processoPaciente.count()
    
    const statusCounts = await prisma.movimentacaoWorkflow.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    const stats = {
      solicitados: totalProcessos,
      ganhos: statusCounts.find(s => s.status === 'OK')?._count.status || 0,
      perdas: 0,
      cancelados: 0,
      pendentes: statusCounts.find(s => s.status === 'PENDENTE')?._count.status || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}