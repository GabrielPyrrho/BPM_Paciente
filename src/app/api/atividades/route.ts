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
    const { nome, setor, ordem, etapa } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    // Buscar etapa
    const etapaEncontrada = await prisma.etapa.findFirst({
      where: { nome: etapa || 'CAPTACAO' }
    })
    
    if (!etapaEncontrada) {
      return NextResponse.json({ error: 'Etapa não encontrada' }, { status: 400 })
    }
    
    const atividade = await prisma.atividadeTemplate.create({
      data: { 
        nome: nome.trim(),
        setor: setor?.trim() || null,
        ordem: ordem || 1,
        etapaId: etapaEncontrada.id
      }
    })
    
    return NextResponse.json({
      ...atividade,
      etapa: etapa || 'CAPTACAO'
    })
  } catch (error) {
    console.error('Erro ao criar atividade:', error)
    return NextResponse.json({ error: `Erro ao criar atividade: ${error.message}` }, { status: 500 })
  }
}