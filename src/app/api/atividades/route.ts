import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const atividades = await prisma.atividadeTemplate.findMany({
      orderBy: { ordem: 'asc' }
    })
    return NextResponse.json(atividades)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar atividades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, setor, ordem } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const atividade = await prisma.atividadeTemplate.create({
      data: { 
        nome: nome.trim(),
        setor: setor?.trim() || null,
        ordem: ordem || 1
      }
    })
    return NextResponse.json(atividade)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar atividade' }, { status: 500 })
  }
}