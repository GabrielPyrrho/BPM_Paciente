import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const etapas = await prisma.etapa.findMany({
      orderBy: { ordem: 'asc' }
    })
    return NextResponse.json(etapas)
  } catch (error) {
    console.error('Erro ao buscar etapas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao, cor, ordem } = await request.json()

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    // Calcular próxima ordem se não fornecida
    let novaOrdem = ordem
    if (!novaOrdem) {
      const ultimaEtapa = await prisma.etapa.findFirst({
        orderBy: { ordem: 'desc' }
      })
      novaOrdem = (ultimaEtapa?.ordem || 0) + 1
    }

    const etapa = await prisma.etapa.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        cor: cor || '#3b82f6',
        ordem: novaOrdem
      }
    })

    return NextResponse.json(etapa, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar etapa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}