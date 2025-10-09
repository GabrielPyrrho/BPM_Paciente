import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const setores = await prisma.setor.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    })
    return NextResponse.json(setores)
  } catch (error: any) {
    console.error('Erro ao buscar setores:', error)
    return NextResponse.json({ 
      error: 'Erro ao buscar setores',
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao } = await request.json()
    
    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'O nome do setor é obrigatório. Por favor, preencha este campo.' }, { status: 400 })
    }
    
    const setor = await prisma.setor.create({
      data: { 
        nome: nome.trim(), 
        descricao: descricao?.trim() || null,
        ativo: true
      }
    })
    
    return NextResponse.json(setor)
  } catch (error: any) {
    console.error('Erro ao criar setor:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um setor com este nome. Por favor, escolha um nome diferente.' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Erro ao criar setor', 
      details: error.message 
    }, { status: 500 })
  }
}