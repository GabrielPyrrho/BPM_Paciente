import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const setores = await prisma.setor.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    })
    return NextResponse.json(setores)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar setores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const setor = await prisma.setor.create({
      data: { nome: nome.trim(), descricao }
    })
    
    return NextResponse.json(setor)
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Setor já existe' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar setor' }, { status: 500 })
  }
}