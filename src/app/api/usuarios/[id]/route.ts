import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nome, email, funcao, setorId } = await request.json()

    const usuario = await prisma.usuario.update({
      where: { id: params.id },
      data: {
        nome,
        email,
        funcao,
        setorId: setorId || null
      },
      include: {
        setor: true
      }
    })

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.usuario.update({
      where: { id: params.id },
      data: { ativo: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 })
  }
}