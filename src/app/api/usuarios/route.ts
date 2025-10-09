import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        setor: true
      },
      where: {
        ativo: true
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha, funcao, setorId } = await request.json()

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        funcao,
        setorId: setorId || null,
        ativo: true
      },
      include: {
        setor: true
      }
    })

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}