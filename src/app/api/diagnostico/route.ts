import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const atividades = await prisma.atividadeTemplate.findMany({
      orderBy: { nome: 'asc' }
    })
    
    const duplicadas = []
    const nomes = new Map()
    
    for (const atividade of atividades) {
      if (nomes.has(atividade.nome)) {
        duplicadas.push({
          id: atividade.id,
          nome: atividade.nome,
          original: nomes.get(atividade.nome)
        })
      } else {
        nomes.set(atividade.nome, atividade.id)
      }
    }

    const semEtapa = await prisma.atividadeTemplate.findMany({
      where: { etapa: null }
    })

    return NextResponse.json({
      duplicadas,
      semEtapa,
      totalAtividades: atividades.length
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro no diagnóstico' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { acao } = await request.json()
    
    if (acao === 'limpar_duplicadas') {
      const atividades = await prisma.atividadeTemplate.findMany({
        orderBy: { nome: 'asc' }
      })
      
      const nomes = new Map()
      const paraExcluir = []
      
      for (const atividade of atividades) {
        if (nomes.has(atividade.nome)) {
          paraExcluir.push(atividade.id)
        } else {
          nomes.set(atividade.nome, atividade.id)
        }
      }
      
      if (paraExcluir.length > 0) {
        // Excluir movimentações primeiro
        await prisma.movimentacaoWorkflow.deleteMany({
          where: { atividadeId: { in: paraExcluir } }
        })
        
        // Excluir relações com complexidades
        await prisma.complexidadeAtividade.deleteMany({
          where: { atividadeId: { in: paraExcluir } }
        })
        
        // Excluir atividades
        await prisma.atividadeTemplate.deleteMany({
          where: { id: { in: paraExcluir } }
        })
      }
      
      return NextResponse.json({ 
        message: `${paraExcluir.length} atividades duplicadas removidas` 
      })
    }
    
    if (acao === 'corrigir_etapas') {
      await prisma.atividadeTemplate.updateMany({
        where: {
          OR: [
            { nome: { contains: 'Captação' } },
            { nome: { contains: 'Convênio' } },
            { nome: { contains: 'Solicitação' } }
          ]
        },
        data: { etapa: 'CAPTACAO' }
      })
      
      await prisma.atividadeTemplate.updateMany({
        where: {
          OR: [
            { nome: { contains: 'Pré' } },
            { nome: { contains: 'Preparação' } },
            { nome: { contains: 'Exame' } }
          ]
        },
        data: { etapa: 'PRE_INTERNAMENTO' }
      })
      
      await prisma.atividadeTemplate.updateMany({
        where: {
          OR: [
            { nome: { contains: 'Internado' } },
            { nome: { contains: 'Alta' } },
            { nome: { contains: 'Medicação' } }
          ]
        },
        data: { etapa: 'INTERNADO' }
      })
      
      await prisma.atividadeTemplate.updateMany({
        where: { etapa: null },
        data: { etapa: 'CAPTACAO' }
      })
      
      return NextResponse.json({ 
        message: 'Etapas corrigidas com sucesso' 
      })
    }
    
    return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
  } catch (error) {
    console.error('Erro na correção:', error)
    return NextResponse.json({ error: 'Erro na correção' }, { status: 500 })
  }
}