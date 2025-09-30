import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany()
    return NextResponse.json(usuarios)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, funcao } = await request.json()
    
    if (!nome || typeof nome !== 'string') {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const usuario = await prisma.usuario.create({
      data: { nome: nome.trim(), funcao }
    })
    
    return NextResponse.json(usuario)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}