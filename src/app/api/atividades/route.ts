import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const atividades = await prisma.atividadeTemplate.findMany({
      include: { etapa: true },
      orderBy: { ordem: 'asc' }
    })
    
    const atividadesCompativeis = atividades.map(ativ => ({
      ...ativ,
      etapa: ativ.etapa?.nome || 'CAPTACAO'
    }))
    
    return NextResponse.json(atividadesCompativeis)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar atividades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, setor, ordem, etapa, etapaId } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    let etapaEncontrada
    
    // Buscar etapa por ID primeiro, depois por nome
    if (etapaId) {
      etapaEncontrada = await prisma.etapa.findUnique({
        where: { id: etapaId }
      })
    } else if (etapa) {
      etapaEncontrada = await prisma.etapa.findFirst({
        where: { nome: etapa }
      })
    } else {
      // Buscar etapa padrão CAPTACAO
      etapaEncontrada = await prisma.etapa.findFirst({
        where: { nome: 'CAPTACAO' }
      })
    }
    
    if (!etapaEncontrada) {
      return NextResponse.json({ error: 'Etapa não encontrada' }, { status: 400 })
    }
    
    // Calcular próxima ordem se não fornecida
    let novaOrdem = ordem
    if (!novaOrdem) {
      const ultimaAtividade = await prisma.atividadeTemplate.findFirst({
        where: { etapaId: etapaEncontrada.id },
        orderBy: { ordem: 'desc' }
      })
      novaOrdem = (ultimaAtividade?.ordem || 0) + 1
    }
    
    const atividade = await prisma.atividadeTemplate.create({
      data: { 
        nome: nome.trim(),
        setor: setor?.trim() || null,
        ordem: novaOrdem,
        etapaId: etapaEncontrada.id
      },
      include: { etapa: true }
    })
    
    return NextResponse.json({
      ...atividade,
      etapa: etapaEncontrada.nome
    })
  } catch (error) {
    console.error('Erro ao criar atividade:', error)
    return NextResponse.json({ error: `Erro ao criar atividade: ${error.message}` }, { status: 500 })
  }
}