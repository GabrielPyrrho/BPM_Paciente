import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        setor: {
          select: {
            nome: true
          }
        },
        ativo: true
      },
      where: {
        ativo: true
      },
      orderBy: {
        nome: 'asc'
      }
    })

    const usuariosFormatados = usuarios.map(usuario => ({
      id: usuario.id,
      nome: usuario.nome,
      setor: usuario.setor?.nome || 'Sem Setor',
      ativo: usuario.ativo
    }))

    return NextResponse.json(usuariosFormatados)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nome, setor } = await request.json()

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        setor,
        ativo: true
      }
    })

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}