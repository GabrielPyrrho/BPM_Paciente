import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, descricao } = await request.json()
    
    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'O nome do setor é obrigatório. Por favor, preencha este campo.' }, { status: 400 })
    }
    
    const setor = await prisma.setor.update({
      where: { id: params.id },
      data: { 
        nome: nome.trim(), 
        descricao: descricao?.trim() || null
      }
    })
    
    return NextResponse.json(setor)
  } catch (error: any) {
    console.error('Erro ao atualizar setor:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um setor com este nome. Por favor, escolha um nome diferente.' }, { status: 400 })
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Setor não encontrado. Ele pode ter sido excluído por outro usuário.' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      error: 'Erro ao atualizar setor', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se o setor está sendo usado por usuários
    const usuariosComSetor = await prisma.usuario.count({
      where: { 
        setorId: params.id,
        ativo: true 
      }
    })
    
    if (usuariosComSetor > 0) {
      return NextResponse.json({ 
        error: `Não é possível excluir este setor. Existem ${usuariosComSetor} usuário(s) vinculado(s) a ele. Remova os usuários do setor antes de excluí-lo.` 
      }, { status: 400 })
    }
    
    await prisma.setor.update({
      where: { id: params.id },
      data: { ativo: false }
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir setor:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Setor não encontrado. Ele pode ter sido excluído por outro usuário.' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      error: 'Erro ao excluir setor', 
      details: error.message 
    }, { status: 500 })
  }
}