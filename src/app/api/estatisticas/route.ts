import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const mesPassado = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)

    // Buscar todas as movimentações com dados relacionados
    const movimentacoes = await prisma.movimentacaoWorkflow.findMany({
      include: {
        atividade: true,
        responsavel: true,
        processo: {
          include: {
            tipoWorkflow: true,
            entidade: true
          }
        }
      }
    })

    // 1. Tempo Médio de Conclusão por tipo
    const tempoMedioPorTipo = movimentacoes
      .filter(m => m.status === 'OK' && m.horaInicio && m.horaFim)
      .reduce((acc: any, mov) => {
        const tipo = mov.processo.tipoWorkflow.nome
        const tempo = new Date(mov.horaFim!).getTime() - new Date(mov.horaInicio!).getTime()
        const horas = tempo / (1000 * 60 * 60)
        
        if (!acc[tipo]) acc[tipo] = { total: 0, count: 0 }
        acc[tipo].total += horas
        acc[tipo].count += 1
        return acc
      }, {})

    const tempoMedio = Object.entries(tempoMedioPorTipo).map(([tipo, data]: [string, any]) => ({
      tipo,
      tempoMedio: Math.round(data.total / data.count)
    }))

    // 2. Taxa de Cumprimento de Prazos
    const atividadesComPrazo = movimentacoes.filter(m => m.prazo && m.horaFim)
    const noPrazo = atividadesComPrazo.filter(m => 
      new Date(m.horaFim!) <= new Date(m.prazo!)
    ).length
    const taxaCumprimento = atividadesComPrazo.length > 0 
      ? Math.round((noPrazo / atividadesComPrazo.length) * 100)
      : 0

    // 3. Atividades por Hora/Dia
    const hoje = new Date().toDateString()
    const atividadesHoje = movimentacoes.filter(m => 
      m.horaFim && new Date(m.horaFim).toDateString() === hoje
    ).length

    // 4. Taxa de Rejeição
    const totalFinalizadas = movimentacoes.filter(m => m.status !== 'PENDENTE').length
    const rejeitadas = movimentacoes.filter(m => m.status === 'NOK').length
    const taxaRejeicao = totalFinalizadas > 0 
      ? Math.round((rejeitadas / totalFinalizadas) * 100)
      : 0

    // 5. Gargalos (atividades que mais atrasam)
    const gargalos = movimentacoes
      .filter(m => m.prazo && m.horaFim && new Date(m.horaFim) > new Date(m.prazo))
      .reduce((acc: any, mov) => {
        const nome = mov.atividade.nome
        if (!acc[nome]) acc[nome] = 0
        acc[nome] += 1
        return acc
      }, {})

    const topGargalos = Object.entries(gargalos)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, atrasos: count }))

    // 6. Usuários Mais Ativos
    const usuariosAtivos = movimentacoes
      .filter(m => m.responsavel)
      .reduce((acc: any, mov) => {
        const nome = mov.responsavel!.nome
        if (!acc[nome]) acc[nome] = 0
        acc[nome] += 1
        return acc
      }, {})

    const topUsuarios = Object.entries(usuariosAtivos)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([nome, atividades]) => ({ nome, atividades }))

    // 7. Setores com Maior Carga
    const setores = movimentacoes
      .filter(m => m.atividade.setor)
      .reduce((acc: any, mov) => {
        const setor = mov.atividade.setor!
        if (!acc[setor]) acc[setor] = 0
        acc[setor] += 1
        return acc
      }, {})

    const topSetores = Object.entries(setores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([setor, carga]) => ({ setor, carga }))

    // 8. Crescimento Mensal
    const processosMesAtual = await prisma.processoWorkflow.count({
      where: { atividades: { some: { horaInicio: { gte: inicioMes } } } }
    })
    
    const processosMesPassado = await prisma.processoWorkflow.count({
      where: { atividades: { some: { horaInicio: { gte: mesPassado, lt: inicioMes } } } }
    })

    const crescimento = processosMesPassado > 0 
      ? Math.round(((processosMesAtual - processosMesPassado) / processosMesPassado) * 100)
      : 0

    // 9. Picos de Demanda (por hora do dia)
    const picosDemanda = movimentacoes
      .filter(m => m.horaInicio)
      .reduce((acc: any, mov) => {
        const hora = new Date(mov.horaInicio!).getHours()
        if (!acc[hora]) acc[hora] = 0
        acc[hora] += 1
        return acc
      }, {})

    const horariosMovimentados = Object.entries(picosDemanda)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([hora, atividades]) => ({ hora: `${hora}h`, atividades }))

    return NextResponse.json({
      performance: {
        tempoMedio,
        taxaCumprimento,
        atividadesPorDia: atividadesHoje
      },
      qualidade: {
        taxaRejeicao,
        topGargalos,
        retrabalho: 0
      },
      recursos: {
        topUsuarios,
        topSetores,
        horariosMovimentados
      },
      tendencias: {
        crescimentoMensal: crescimento,
        processosMesAtual,
        processosMesPassado
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}